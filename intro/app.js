// 使用 React UMD + 纯 JavaScript（无 JSX）渲染页面
(function(){
  'use strict';
  // React 加载检查与兜底
  if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
    console.error('React未加载！');
    const el = document.getElementById('app');
    if (el) {
      el.innerHTML = '<div style="padding:20px;text-align:center"><h2>页面加载失败</h2><p>请稍后重试或检查网络连接。</p><button onclick="location.reload()">重新加载</button></div>';
    }
    return;
  }

  const h = React.createElement;

  // 预加载页面（hover 提前请求文档）
  function preloadPage(url) {
    try {
      const prefetch = document.createElement('link');
      prefetch.rel = 'prefetch';
      prefetch.href = url;
      document.head.appendChild(prefetch);
      const preload = document.createElement('link');
      preload.rel = 'preload';
      preload.as = 'document';
      preload.href = url;
      document.head.appendChild(preload);
    } catch (_) {}
  }

  const resumeData = {
    name: { zh: '陈壮壮', en: 'Chen Zhuangzhuang' },
    profession: { zh: '学生', en: 'Student' },
    summary: {
      zh: '热爱编程与设计，正在学习前端开发。',
      en: 'Passionate about coding and design, learning frontend development.'
    },
    age: 18,
    skills: ['HTML', 'CSS', 'JavaScript'],
    timeline: [
      {
        date: '2025/09',
        icon: 'fas fa-university',
        title: { zh: '大学生涯开始', en: 'University Journey Begins' },
        subtitle: { zh: '西藏农牧大学', en: 'Tibet Agriculture & Animal Husbandry University' },
        description: {
          zh: '进入西藏农牧大学土木工程专业，开始系统学习专业课程，对编程产生浓厚兴趣。',
          en: 'Enrolled in Civil Engineering at TAHU, started learning professional courses.'
        },
        achievements: {
          zh: ['开始学习编程基础', '参与数学建模竞赛', '积极参与社团活动'],
          en: ['Started learning programming', 'Math Modeling Competition', 'Active in clubs']
        },
        tags: {
          zh: ['大学生活', '编程学习', '社团活动'],
          en: ['University Life', 'Programming', 'Club Activities']
        }
      },
      {
        date: '2025/11',
        icon: 'fas fa-calculator',
        title: { zh: '数学竞赛', en: 'Mathematics Competition' },
        subtitle: { zh: '中国大学生数学竞赛', en: 'Chinese Mathematics Competition' },
        description: {
          zh: '参加全国大学生数学竞赛，通过刻苦训练提升了数学思维和解题能力。',
          en: 'Participated in National Mathematics Competition, improved problem-solving skills.'
        },
        achievements: {
          zh: ['获得校级奖项', '掌握高等数学', '提升逻辑思维'],
          en: ['Won university award', 'Mastered Advanced Math', 'Enhanced logical thinking']
        },
        tags: {
          zh: ['数学竞赛', '思维训练', '团队合作'],
          en: ['Math Competition', 'Thinking Training', 'Teamwork']
        }
      },
      {
        date: '2025/12',
        icon: 'fas fa-laptop-code',
        title: { zh: '字节跳动青训营', en: 'ByteDance Youth Camp' },
        subtitle: { zh: '前端开发训练营', en: 'Frontend Development Bootcamp' },
        description: {
          zh: '参加字节跳动青训营，系统学习前端开发技术，完成多个实战项目。',
          en: 'Joined ByteDance training camp, learned frontend development systematically.'
        },
        achievements: {
          zh: ['掌握前端技术栈', '完成个人项目', '获得结业证书'],
          en: ['Mastered frontend stack', 'Completed projects', 'Earned certificate']
        },
        tags: {
          zh: ['前端开发', '实战项目', '技术提升'],
          en: ['Frontend Dev', 'Projects', 'Tech Growth']
        }
      },
      {
        date: '2026/09',
        icon: 'fas fa-exchange-alt',
        title: { zh: '交换学习项目', en: 'Exchange Program' },
        subtitle: { zh: '河海大学联合培养', en: 'Exchange Student at HHU' },
        description: {
          zh: '作为交换生前往河海大学学习，体验不同的学习环境和教学方式。',
          en: 'Studied as an exchange student at Hohai University.'
        },
        achievements: {
          zh: ['适应新环境', '扩展人际网络', '提升专业技能'],
          en: ['Adapted to new environment', 'Expanded network', 'Enhanced skills']
        },
        tags: {
          zh: ['交换学习', '文化交流', '成长突破'],
          en: ['Exchange Study', 'Cultural Exchange', 'Growth']
        }
      }
    ]
  };

  function Header({ currentLang, toggleLanguage }) {
    return h('header', { className: 'header' },
      h('div', { className: 'container' },
        h('h1', { className: 'logo' }, currentLang === 'zh' ? '我的个人网站' : 'My Website'),
        h('nav', { className: 'navbar' },
          h('ul', null,
            h('li', null, h('a', { href: '#hero', className: 'nav-link' }, currentLang === 'zh' ? '首页' : 'Home')),
            h('li', null, h('a', { href: '#timeline', className: 'nav-link' }, currentLang === 'zh' ? '成长历程' : 'Timeline')),
            h('li', null, h('a', { href: '#contact', className: 'nav-link' }, currentLang === 'zh' ? '联系我' : 'Contact')),
            h('li', null, h('a', { href: './games/中转.html', className: 'nav-link', target: '_blank', rel: 'noopener noreferrer' }, currentLang === 'zh' ? '游戏' : 'Game')),
            h('li', null, h('button', { className: 'nav-link language-toggle', onClick: toggleLanguage }, currentLang === 'zh' ? 'EN' : '中文'))
          )
        )
      )
    );
  }

  function Hero({ currentLang }) {
    return h('section', { className: 'hero', id: 'hero', style: { minHeight: '70vh', padding: '40px 0' } },
      h('div', { className: 'hero-content' },
        h('div', { className: 'hero-text' },
          h('h1', { className: 'hero-title' },
            (currentLang === 'zh' ? '你好，我是' : "Hi, I'm"),
            ' ',
            h('span', { className: 'highlight' }, resumeData.name[currentLang])
          ),
          h('p', { className: 'hero-subtitle' }, resumeData.profession[currentLang]),
          h('p', { className: 'hero-description' }, resumeData.summary[currentLang]),
          h('div', { className: 'hero-actions' },
            h('a', { href: './intro/skills/skills.html', className: 'btn btn-primary', style: { padding: '10px 18px' }, onMouseOver: () => preloadPage('./intro/skills/skills.html') }, currentLang === 'zh' ? '我的技能' : 'My Skills')
          ),
        ),
        h('div', { className: 'hero-image', style: { display: 'none' } },
          h('div', { className: 'profile-card' },
            h('div', { className: 'profile-avatar' },
              h('div', { className: 'avatar-placeholder' }, h('i', { className: 'fas fa-user' }))
            ),
            h('div', { className: 'profile-info' },
              h('h3', null, resumeData.name[currentLang]),
              h('p', null, resumeData.profession[currentLang]),
              h('div', { className: 'profile-stats' },
                h('div', { className: 'stat' },
                  h('span', { className: 'stat-number' }, String(resumeData.age)),
                  h('span', { className: 'stat-label' }, currentLang === 'zh' ? '岁' : 'Age')
                ),
                h('div', { className: 'stat' },
                  h('span', { className: 'stat-number' }, '1'),
                  h('span', { className: 'stat-label' }, currentLang === 'zh' ? '年级' : 'Year')
                ),
              )
            )
          )
        )
      ),
      h('div', { className: 'scroll-indicator' },
        h('div', { className: 'scroll-arrow' }, h('i', { className: 'fas fa-chevron-down' }))
      )
    );
  }

  function Timeline({ currentLang }) {
    return h('div', { className: 'timeline-container', id: 'timeline' },
      h('div', { className: 'timeline-header' },
        h('h2', null, currentLang === 'zh' ? '我的成长历程' : 'My Timeline'),
        h('p', null, currentLang === 'zh' ? '从学生时代到职场生涯，每一个重要时刻都值得铭记' : 'Every moment matters, from student life to career')
      ),
      h('div', { className: 'timeline' },
        resumeData.timeline.map((item, index) => (
          h('div', { className: 'timeline-item ' + (index % 2 === 0 ? 'left' : 'right'), key: index },
            h('div', { className: 'timeline-content' },
              h('div', { className: 'timeline-icon' }, h('i', { className: item.icon || 'fas fa-circle' })),
              h('div', { className: 'timeline-card' },
                h('div', { className: 'timeline-date' }, item.date),
                h('h3', { className: 'timeline-title' }, item.title[currentLang]),
                h('h4', { className: 'timeline-subtitle' }, item.subtitle[currentLang]),
                h('p', { className: 'timeline-description' }, item.description[currentLang]),
                item.achievements && h('ul', { className: 'timeline-achievements' },
                  item.achievements[currentLang].map((a, i) => h('li', { key: i }, a))
                ),
                item.tags && h('div', { className: 'timeline-tags' },
                  item.tags[currentLang].map((t, i) => h('span', { className: 'tag', key: i }, t))
                )
              )
            )
          )
        ))
      )
    );
  }

  function Contact({ currentLang }) {
    return h('section', { className: 'contact-section', id: 'contact' },
      h('div', { className: 'contact-container' },
        h('h2', null, currentLang === 'zh' ? '联系我' : 'Contact Me'),
        h('div', { className: 'contact-card' },
          h('div', { className: 'contact-icon' }, h('i', { className: 'fas fa-envelope' })),
          h('h3', null, currentLang === 'zh' ? '邮箱' : 'Email'),
          h('a', { href: 'mailto:magnesium037@outlook.com' }, 'magnesium037@outlook.com')
        )
      )
    );
  }

  function Skills({ currentLang }) {
    return h('section', { className: 'skills-section', id: 'skills' },
      h('div', { className: 'hero-content' },
        h('div', { className: 'hero-text' },
          h('h2', null, currentLang === 'zh' ? '我的技能' : 'My Skills'),
           h('p', null, currentLang === 'zh' ? '点击主页个人卡片中的“我的技能”进入技能总览页' : 'Use the “My Skills” button in the hero card to open the overview')
        )
      )
    );
  }

  function useScrollAnimations() {
    React.useEffect(() => {
      let observer;
      try {
        observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate');
              // 可选：observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        const items = document.querySelectorAll('.timeline-item');
        items.forEach((el) => observer.observe(el));
      } catch (error) {
        console.warn('IntersectionObserver not supported:', error);
        document.querySelectorAll('.timeline-item').forEach(el => el.classList.add('animate'));
      }
      return () => { if (observer) observer.disconnect(); };
    }, []);
  }

  // 根据滚动距离为 Header 切换阴影样式
  function useHeaderShadow() {
    React.useEffect(() => {
      const header = document.querySelector('.header');
      const onScroll = () => {
        if (!header) return;
        if (window.scrollY > 10) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }, []);
  }
  // 平滑滚动到锚点
  function useSmoothScrollNav() {
    React.useEffect(() => {
      const handleNavClick = (e) => {
        const target = e.target;
        if (target && target.classList && target.classList.contains('nav-link')) {
          const href = target.getAttribute('href') || '';
          if (href.startsWith('#')) {
            e.preventDefault();
            const id = href.slice(1);
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      };
      document.addEventListener('click', handleNavClick);
      return () => document.removeEventListener('click', handleNavClick);
    }, []);
  }
  // 简易错误边界
  function ErrorBoundary({ children }) {
    const [hasError, setHasError] = React.useState(false);
    React.useEffect(() => {
      const handler = () => setHasError(true);
      window.addEventListener('error', handler);
      return () => window.removeEventListener('error', handler);
    }, []);
    if (hasError) {
      return h('div', { className: 'error-boundary', style: { padding: '24px', textAlign: 'center' } },
        h('h2', null, '😅 出错了'),
        h('p', null, '页面渲染出现问题'),
        h('button', { className: 'btn btn-primary', onClick: () => window.location.reload() }, '重新加载')
      );
    }
    return children;
  }

  function App() {
    const [currentLang, setCurrentLang] = React.useState('zh');
    useScrollAnimations();
    useHeaderShadow();
    useSmoothScrollNav();
    const toggleLanguage = () => setCurrentLang((lang) => (lang === 'zh' ? 'en' : 'zh'));

    return h(ErrorBoundary, null,
      h(React.Fragment, null,
        h(Header, { currentLang, toggleLanguage }),
        h(Hero, { currentLang }),
        h(Timeline, { currentLang }),
        h(Contact, { currentLang })
      )
    );
  }

  const root = ReactDOM.createRoot(document.getElementById('app'));
  root.render(h(App));
})();