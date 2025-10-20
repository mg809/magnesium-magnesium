from http.server import HTTPServer, BaseHTTPRequestHandler
import json
from datetime import datetime
import random

# 游戏基础数据
GAME_DATA = {
    "crops": {
        "rice": {"name": "水稻", "growth_time": 7, "price": 100, "water_need": 80},
        "corn": {"name": "玉米", "growth_time": 5, "price": 75, "water_need": 60},
        "vegetable": {"name": "蔬菜", "growth_time": 3, "price": 50, "water_need": 40},
        "fruit": {"name": "果树", "growth_time": 10, "price": 150, "water_need": 90},
        # 新增基础作物
        "cabbage": {"name": "白菜", "growth_time": 3, "price": 40, "water_need": 40, "yield": 2},
        "carrot": {"name": "胡萝卜", "growth_time": 4, "price": 60, "water_need": 50, "yield": 3}
    },
    
    "buildings": {
        "house": {"name": "农舍", "price": 1000, "villagers": 2},
        "well": {"name": "水井", "price": 500, "water_supply": 100},
        "warehouse": {"name": "仓库", "price": 800, "storage": 1000},
        "market": {"name": "市场", "price": 2000, "trade_bonus": 0.2}
    },
    
    "weather": ["sunny", "rainy", "cloudy", "stormy"]
}

# 村庄状态数据
VILLAGE_STATUS = {
    "resources": {
        "money": 1000,
        "water": 100,
        "seeds": {
            "rice": 10,
            "corn": 10,
            "vegetable": 10,
            "fruit": 5,
            # 新增作物种子
            "cabbage": 8,
            "carrot": 8
        }
    },
    "fields": [],  # 农田状态
    "buildings": [],  # 建筑状态
    "villagers": [],  # 村民状态
    # 新增村庄等级与粮食计数
    "village": {"level": 1, "grain": 0}
}

class Field:
    def __init__(self, crop_type, plant_time):
        self.crop_type = crop_type
        self.plant_time = plant_time
        self.watered = False
        self.growth = 0
        self.ready = False

    def to_dict(self):
        return {
            "crop_type": self.crop_type,
            "plant_time": self.plant_time,
            "watered": self.watered,
            "growth": self.growth,
            "ready": self.ready
        }

# 根据粮食总量更新村庄等级
def update_village_level():
    grain = VILLAGE_STATUS.get("village", {}).get("grain", 0)
    level = 1
    if grain >= 60:
        level = 4
    elif grain >= 30:
        level = 3
    elif grain >= 10:
        level = 2
    VILLAGE_STATUS["village"]["level"] = level

class GameHandler(BaseHTTPRequestHandler):
    def _set_common_headers(self, code=200, content_type="application/json; charset=utf-8"):
        self.send_response(code)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_common_headers(204)

    def do_GET(self):
        path = self.path
        if path == "/api/game/data":
            # 获取游戏基础数据
            self._set_common_headers()
            self.wfile.write(json.dumps(GAME_DATA).encode("utf-8"))
        elif path == "/api/village/status":
            # 获取村庄状态
            self._set_common_headers()
            self.wfile.write(json.dumps(VILLAGE_STATUS).encode("utf-8"))
        elif path == "/api/weather":
            # 获取当前天气
            weather = random.choice(GAME_DATA["weather"])
            self._set_common_headers()
            self.wfile.write(json.dumps({"weather": weather}).encode("utf-8"))
        else:
            self._set_common_headers(404)
            self.wfile.write(json.dumps({"error": "not_found"}).encode("utf-8"))

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = json.loads(self.rfile.read(content_length))
        path = self.path

        if path == "/api/field/plant":
            # 种植作物（检查并扣减种子，返回field_id）
            crop_type = post_data.get("crop_type")
            seeds = VILLAGE_STATUS["resources"]["seeds"]
            if crop_type in GAME_DATA["crops"] and seeds.get(crop_type, 0) > 0:
                seeds[crop_type] -= 1
                new_field = Field(crop_type, datetime.now().timestamp())
                VILLAGE_STATUS["fields"].append(new_field.to_dict())
                field_id = len(VILLAGE_STATUS["fields"]) - 1
                self._set_common_headers()
                self.wfile.write(json.dumps({"success": True, "field_id": field_id}).encode("utf-8"))
            else:
                self._set_common_headers(400)
                self.wfile.write(json.dumps({"error": "invalid_or_no_seeds"}).encode("utf-8"))
        elif path == "/api/field/water":
            # 浇水（增加生长进度）
            field_id = post_data.get("field_id")
            if isinstance(field_id, int) and 0 <= field_id < len(VILLAGE_STATUS["fields"]):
                field = VILLAGE_STATUS["fields"][field_id]
                field["watered"] = True
                field["growth"] = field.get("growth", 0) + 1
                # 简化：达到1次浇水即可成熟
                if field["growth"] >= 1:
                    field["ready"] = True
                self._set_common_headers()
                self.wfile.write(json.dumps({"success": True, "ready": field["ready"], "growth": field["growth"]}).encode("utf-8"))
            else:
                self._set_common_headers(400)
                self.wfile.write(json.dumps({"error": "invalid_field"}).encode("utf-8"))

        elif path == "/api/building/build":
            # 建造建筑
            building_type = post_data.get("building_type")
            if building_type in GAME_DATA["buildings"]:
                building_data = GAME_DATA["buildings"][building_type].copy()
                building_data["type"] = building_type
                VILLAGE_STATUS["buildings"].append(building_data)
                self._set_common_headers()
                self.wfile.write(json.dumps({"success": True}).encode("utf-8"))
            else:
                self._set_common_headers(400)
                self.wfile.write(json.dumps({"error": "invalid_building"}).encode("utf-8"))

        elif path == "/api/field/harvest":
            # 收获（根据作物yield增加粮食并清理地块）
            field_id = post_data.get("field_id")
            if isinstance(field_id, int) and 0 <= field_id < len(VILLAGE_STATUS["fields"]):
                field = VILLAGE_STATUS["fields"][field_id]
                if field.get("ready"):
                    crop_type = field.get("crop_type")
                    crop_yield = GAME_DATA["crops"].get(crop_type, {}).get("yield", 1)
                    VILLAGE_STATUS["village"]["grain"] += crop_yield
                    update_village_level()
                    # 清理该地块
                    VILLAGE_STATUS["fields"][field_id] = {"crop_type": None, "plant_time": None, "watered": False, "growth": 0, "ready": False}
                    self._set_common_headers()
                    self.wfile.write(json.dumps({"success": True, "grain": VILLAGE_STATUS["village"]["grain"], "level": VILLAGE_STATUS["village"]["level"]}).encode("utf-8"))
                else:
                    self._set_common_headers(400)
                    self.wfile.write(json.dumps({"error": "not_ready"}).encode("utf-8"))
            else:
                self._set_common_headers(400)
                self.wfile.write(json.dumps({"error": "invalid_field"}).encode("utf-8"))

def run(host="0.0.0.0", port=3000):
    server = HTTPServer((host, port), GameHandler)
    print(f"Game API listening on http://{host}:{port}")
    print("Available endpoints:")
    print("  GET  /api/game/data       - Get game basic data")
    print("  GET  /api/village/status  - Get village status")
    print("  GET  /api/weather         - Get current weather")
    print("  POST /api/field/plant     - Plant a crop")
    print("  POST /api/field/water     - Water a field")
    print("  POST /api/building/build  - Build a structure")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()

if __name__ == "__main__":
    run()