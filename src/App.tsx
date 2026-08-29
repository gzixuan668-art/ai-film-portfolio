import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

type Project = {
  id: string
  title: string
  cnTitle: string
  category: string
  year: string
  duration: string
  image: string
  video?: string
  layout: 'wide' | 'portrait' | 'standard'
}

const projects: Project[] = [
  { id: '01', title: 'NEW STORY', cnTitle: '新', category: 'NARRATIVE FILM', year: '2026', duration: '06:01', image: '/posters/narrative/new-film.jpg', video: '/media/narrative/new-film.mp4', layout: 'wide' },
  { id: '02', title: 'MISUNDERSTANDING', cnTitle: '误会', category: 'SHORT VIDEO', year: '2026', duration: '02:06', image: '/posters/short-video/misunderstanding.jpg', video: '/media/short-video/misunderstanding.mp4', layout: 'standard' },
  { id: '03', title: 'SHORT DRAMA', cnTitle: '短剧', category: 'SHORT DRAMA', year: '2026', duration: '01:55', image: '/posters/short-drama/short-drama.jpg', video: '/media/short-drama/short-drama.mp4', layout: 'standard' },
  { id: '04', title: 'EMOTION', cnTitle: '感情', category: 'MUSIC VIDEO', year: '2026', duration: '01:52', image: '/posters/music-video/emotion.jpg', video: '/media/music-video/emotion.mp4', layout: 'standard' },
  { id: '05', title: 'THE ARGUMENT', cnTitle: '吵架', category: 'SHORT VIDEO', year: '2026', duration: '01:50', image: '/posters/short-video/argument.jpg', video: '/media/short-video/argument.mp4', layout: 'standard' },
  { id: '06', title: 'THE ASSESSMENT', cnTitle: '考核', category: 'SHORT VIDEO', year: '2026', duration: '01:46', image: '/posters/short-video/assessment.jpg', video: '/media/short-video/assessment.mp4', layout: 'standard' },
  { id: '07', title: 'ICE CREAM', cnTitle: '雪糕', category: 'SHORT VIDEO', year: '2026', duration: '01:42', image: '/posters/short-video/ice-cream.jpg', video: '/media/short-video/ice-cream.mp4', layout: 'standard' },
  { id: '08', title: 'EPISODE TWO', cnTitle: '第二集', category: 'SHORT VIDEO', year: '2026', duration: '01:27', image: '/posters/short-video/episode-02.jpg', video: '/media/short-video/episode-02.mp4', layout: 'standard' },
  { id: '09', title: 'WAR', cnTitle: '战争', category: 'MUSIC VIDEO', year: '2026', duration: '01:26', image: '/posters/music-video/war.jpg', video: '/media/music-video/war.mp4', layout: 'standard' },
  { id: '10', title: "IN MOTHER'S EYES", cnTitle: '妈妈眼中的我', category: 'SHORT VIDEO', year: '2026', duration: '01:25', image: '/posters/short-video/in-mothers-eyes.jpg', video: '/media/short-video/in-mothers-eyes.mp4', layout: 'standard' },
  { id: '11', title: 'RICE FIELD', cnTitle: '稻谷', category: 'SHORT VIDEO', year: '2026', duration: '01:19', image: '/posters/short-video/rice-field.jpg', video: '/media/short-video/rice-field.mp4', layout: 'standard' },
  { id: '12', title: 'CAR CHECK', cnTitle: '查车', category: 'SHORT VIDEO', year: '2026', duration: '01:10', image: '/posters/short-video/car-check.jpg', video: '/media/short-video/car-check.mp4', layout: 'standard' },
  { id: '13', title: 'EPISODE ONE', cnTitle: '第一集', category: 'SHORT VIDEO', year: '2026', duration: '01:07', image: '/posters/short-video/episode-01.jpg', video: '/media/short-video/episode-01.mp4', layout: 'standard' },
  { id: '14', title: 'STUDY HARD', cnTitle: '好好学习', category: 'SHORT VIDEO', year: '2026', duration: '01:05', image: '/posters/short-video/study-hard.jpg', video: '/media/short-video/study-hard.mp4', layout: 'standard' },
  { id: '15', title: 'ENGLISH', cnTitle: '英语', category: 'SHORT VIDEO', year: '2026', duration: '01:03', image: '/posters/short-video/english.jpg', video: '/media/short-video/english.mp4', layout: 'standard' },
  { id: '16', title: 'A LITTLE COLD', cnTitle: '感冒', category: 'SHORT VIDEO', year: '2026', duration: '01:01', image: '/posters/short-video/cold.jpg', video: '/media/short-video/cold.mp4', layout: 'standard' },
  { id: '17', title: 'THE SWORDSMAN', cnTitle: '侠客', category: 'MUSIC VIDEO', year: '2026', duration: '00:56', image: '/posters/music-video/swordsman.jpg', video: '/media/music-video/swordsman.mp4', layout: 'standard' },
  { id: '18', title: 'SUMMER', cnTitle: '夏天', category: 'PORTRAIT MV', year: '2026', duration: '00:44', image: '/posters/portrait-mv/summer.jpg', video: '/media/portrait-mv/summer.mp4', layout: 'standard' },
  { id: '19', title: 'PORTRAIT STUDY', cnTitle: '写真', category: 'PORTRAIT MV', year: '2026', duration: '00:30', image: '/posters/portrait-mv/portrait-01.jpg', video: '/media/portrait-mv/portrait-01.mp4', layout: 'standard' },
  { id: '20', title: 'BY THE SEA', cnTitle: '海边', category: 'PORTRAIT MV', year: '2026', duration: '00:29', image: '/posters/portrait-mv/seaside.jpg', video: '/media/portrait-mv/seaside.mp4', layout: 'standard' },
]

const categories = ['ALL', 'NARRATIVE FILM', 'SHORT DRAMA', 'MUSIC VIDEO', 'SHORT VIDEO', 'PORTRAIT MV']
const categoryLabels: Record<string, string> = {
  ALL: '全部作品',
  'NARRATIVE FILM': '剧情长片',
  'SHORT DRAMA': '短剧',
  'SHORT VIDEO': '短视频',
  'MUSIC VIDEO': '歌曲 MV',
  'PORTRAIT MV': '写真 MV',
}

const capabilities = [
  ['01', '创意与视觉导演', 'CREATIVE DIRECTION'],
  ['02', 'AI 视觉开发', 'AI VISUAL DEVELOPMENT'],
  ['03', '电影分镜设计', 'CINEMATIC STORYBOARD'],
  ['04', 'AI 视频制作', 'AI VIDEO PRODUCTION'],
  ['05', '剪辑与后期', 'POST PRODUCTION'],
]

const workflow = ['创意概念', '视觉开发', '电影分镜', 'AI 生成', '剪辑后期']

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true" className={diagonal ? 'arrow diagonal' : 'arrow'}>→</span>
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [time, setTime] = useState('')
  const [loading, setLoading] = useState(true)
  const [cursor, setCursor] = useState({ x: -100, y: -100 })
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [playingProject, setPlayingProject] = useState<Project | null>(null)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  const filteredProjects = activeCategory === 'ALL' ? projects : projects.filter(project => project.category === activeCategory)

  useEffect(() => {
    const tick = () => setTime(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Hong_Kong' }).format(new Date()))
    tick()
    const timer = window.setInterval(tick, 30_000)
    const intro = window.setTimeout(() => setLoading(false), 950)
    const move = (event: MouseEvent) => setCursor({ x: event.clientX, y: event.clientY })
    window.addEventListener('mousemove', move)
    return () => {
      window.clearInterval(timer)
      window.clearTimeout(intro)
      window.removeEventListener('mousemove', move)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = playingProject ? 'hidden' : ''
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPlayingProject(null)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [playingProject])

  return (
    <div className="site-shell">
      <AnimatePresence>
        {loading && (
          <motion.div className="preloader" initial={{ y: 0 }} exit={{ y: '-100%' }} transition={{ duration: .75, ease: [0.76, 0, 0.24, 1] }}>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Z.</motion.span>
            <p>正在载入影像 <i>01—20</i></p>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div className="cursor" animate={{ x: cursor.x - 7, y: cursor.y - 7 }} transition={{ type: 'spring', stiffness: 800, damping: 45 }} />
      <motion.div className="progress" style={{ scaleX }} />
      <div className="side-index"><span>AI 影像 / 作品集</span><strong>2026</strong></div>
      <nav className="navbar">
        <a className="brand" href="#top" aria-label="返回首页">Z<span className="brand-dot">.</span></a>
        <div className="nav-meta"><span>AI 影像导演</span><span>广州</span></div>
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <a href="#works" onClick={() => setMenuOpen(false)}>作品</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>关于我</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>联系</a>
        </div>
        <button className="menu-button" onClick={() => setMenuOpen(v => !v)} aria-label="切换菜单">{menuOpen ? '关闭' : '菜单'}</button>
      </nav>

      <main>
        <section className="hero sweet-hero" id="top">
          <div className="sweet-shape shape-one" />
          <div className="sweet-shape shape-two" />
          <div className="hero-noise" />
          <motion.div className="sweet-portrait" initial={{ clipPath: 'inset(0 100% 0 0)' }} animate={{ clipPath: 'inset(0 0% 0 0)' }} transition={{ duration: 1.15, delay: .7, ease: [0.76, 0, 0.24, 1] }}>
            <img src="/assets/japanese-sweet-girl.png" alt="日系甜美短发女孩角色设计" />
            <span>角色设计 / 001</span>
          </motion.div>

          <motion.div className="sweet-copy" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: 1 }}>
            <p className="sweet-kicker">AI 影像导演 / 视觉设计</p>
            <h1><span>一帧</span><span>一场<em>梦。</em></span></h1>
            <p className="sweet-date">— 29/08/2026</p>
          </motion.div>

          <div className="sweet-manifesto">
            <span>如果每一帧</span>
            <span>都像一段记忆？</span>
            <i>私の小さな映画世界</i>
          </div>

          <div className="sweet-badge">
            <span>把想象</span>
            <strong>拍成<br />电影</strong>
            <i>✦</i>
          </div>

          <div className="sweet-thumbs">
            {['12%', '42%', '72%'].map((position, index) => (
              <div className="sweet-thumb" key={position}>
                <img src="/assets/japanese-sweet-girl.png" alt="" style={{ objectPosition: position }} />
                <span>0{index + 1}</span>
              </div>
            ))}
            <p>01&nbsp;&nbsp;02&nbsp;&nbsp;03&nbsp;&nbsp;04&nbsp;&nbsp;05</p>
          </div>

          <div className="sweet-note-cards">
            <div><span>与什么一起工作</span><strong>故事与光</strong><i>✦</i></div>
            <div><span>AI 影像导演</span><strong>郭梓轩</strong><i>↗</i></div>
          </div>

          <div className="sweet-footer">
            <p>让画面先产生感受<br />再给出解释</p>
            <a className="sweet-enter" href="#works"><span>进入作品</span><Arrow diagonal /></a>
            <p>广州 / {time}</p>
          </div>
          <div className="scroll-cue dark">向下浏览 <span>↓</span></div>
        </section>

        <div className="marquee" aria-hidden="true">
          <div><span>AI 影像导演</span><i>✦</i><span>视觉开发</span><i>✦</i><span>电影化叙事</span><i>✦</i><span>AI 影像导演</span><i>✦</i><span>视觉开发</span><i>✦</i><span>电影化叙事</span><i>✦</i></div>
        </div>

        <section className="works section" id="works">
          <div className="section-head">
            <p className="kicker">01 / 影像作品</p>
            <h2>先看长片，<br /><em>再看片刻。</em></h2>
            <p className="section-intro">20 部作品按时长由长到短排列。第一部以电影宽幅作为主视觉，其余作品按长片、中篇与短片形成清晰节奏，点击封面即可播放原始视频。</p>
          </div>
          <div className="category-filter" aria-label="作品分类">
            {categories.map(category => (
              <button className={activeCategory === category ? 'active' : ''} key={category} onClick={() => setActiveCategory(category)}>
                <span>{categoryLabels[category]}</span><i>{category === 'ALL' ? projects.length : projects.filter(project => project.category === category).length}</i>
              </button>
            ))}
          </div>
          <div className="project-grid">
            <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.article layout className={`project ${index === 0 ? 'feature' : index < 8 ? 'major' : 'compact-project'}`} key={project.video} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .96 }} transition={{ duration: .55, delay: Math.min(index, 5) * .04 }}>
                <button className="project-media" aria-label={`播放项目 ${project.cnTitle}`} onClick={() => setPlayingProject(project)}>
                  <img src={project.image} alt={project.cnTitle} loading="lazy" />
                  <span className="project-index">({project.id})</span>
                  <span className="project-hover-title">{project.cnTitle}</span>
                  <span className="play"><span>播放原片</span><i>▶</i></span>
                </button>
                <div className="project-caption">
                  <div><h3>{project.cnTitle}</h3><p>{project.title}</p></div>
                  <div className="project-details"><span>{categoryLabels[project.category]}</span><span>{project.year}</span><span>{project.duration}</span></div>
                </div>
              </motion.article>
            ))}
            </AnimatePresence>
          </div>
          <p className="archive-count">当前展示 / {String(filteredProjects.length).padStart(2, '0')} 部作品</p>
        </section>

        <section className="about section" id="about">
          <div className="about-title"><p className="kicker">02 / 关于我</p><h2>不只是生成。<br /><em>我在导演整个画面。</em></h2></div>
          <div className="about-grid">
            <div className="portrait-wrap">
              <img src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1300&q=85" alt="创作者肖像占位图" loading="lazy" />
              <span className="vertical-label">个人影像 / 占位图</span>
            </div>
            <div className="about-copy">
              <p className="lead">我是 AI 影像导演与视觉设计师，专注电影化叙事、情绪氛围与具有商业完成度的画面。</p>
              <p>从概念、角色与场景开发，到电影分镜、AI 生成、剪辑、调色与声音，我独立完成一条影像从想法到成片的完整工作流。</p>
              <p>我的视觉横跨东方叙事、日系情绪电影与高端品牌影像。AI 是制作方式，审美判断和导演思维才是作品的核心。</p>
              <div className="stats">
                <div><strong>20+</strong><span>影像作品与练习</span></div>
                <div><strong>05</strong><span>核心创作能力</span></div>
                <div><strong>01</strong><span>全流程独立创作者</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="capabilities section">
          <div className="section-head compact"><p className="kicker">03 / 专业能力</p><h2>从一个想法<br />到<em>最终一帧。</em></h2></div>
          <div className="cap-list">
            {capabilities.map(([id, name, cn]) => (
              <div className="cap-row" key={id}><span>{id}</span><h3>{name}</h3><p>{cn}</p><Arrow diagonal /></div>
            ))}
          </div>
        </section>

        <section className="workflow section">
          <div className="workflow-top"><p className="kicker">04 / 创作流程</p><p>一个方向。<br />贯穿每一步。</p></div>
          <div className="workflow-track">
            {workflow.map((step, i) => <div className="workflow-step" key={step}><span>0{i + 1}</span><strong>{step}</strong>{i < workflow.length - 1 && <i>→</i>}</div>)}
          </div>
          <p className="workflow-note">创意导演 · AI 辅助制作 · 人的审美判断</p>
        </section>

        <section className="contact section" id="contact">
          <p className="kicker">05 / 联系合作</p>
          <div className="contact-main">
            <h2>有一个故事<br />想让人<em>看见？</em></h2>
            <a className="contact-circle" href="mailto:hello@example.com"><span>聊聊合作</span><Arrow diagonal /></a>
          </div>
          <div className="contact-meta"><a href="mailto:hello@example.com">HELLO@EXAMPLE.COM</a><div><a href="#">XIAOHONGSHU</a><a href="#">INSTAGRAM</a><a href="#">BEHANCE</a></div></div>
        </section>
      </main>

      <footer><span>© 2026 Z. 影像工作室</span><span>AI 影像与视觉叙事</span><a href="#top">返回顶部 ↑</a></footer>

      <AnimatePresence>
        {playingProject && (
          <motion.div className="player-modal" role="dialog" aria-modal="true" aria-label={`正在播放 ${playingProject.cnTitle}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button className="player-backdrop" aria-label="关闭播放器" onClick={() => setPlayingProject(null)} />
            <motion.div className="player-panel" initial={{ y: 45, scale: .97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 30, scale: .98 }} transition={{ duration: .45, ease: [0.22, 1, 0.36, 1] }}>
              <div className="player-head">
                <div><span>{categoryLabels[playingProject.category]} / {playingProject.year}</span><h3>{playingProject.cnTitle}</h3><p>{playingProject.title}</p></div>
                <button onClick={() => setPlayingProject(null)}>关闭 ×</button>
              </div>
              <video key={playingProject.video} src={playingProject.video} poster={playingProject.image} controls autoPlay playsInline preload="metadata" />
              <div className="player-foot"><span>作品 {playingProject.id} / 20 · 原始 1080P</span><span>{playingProject.duration}</span></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
