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
  { id: '01', title: 'SHORT DRAMA', cnTitle: '短剧', category: 'SHORT DRAMA', year: '2026', duration: '01:55', image: '/posters/short-drama/short-drama.jpg', video: '/media/short-drama/short-drama.mp4', layout: 'wide' },
  { id: '02', title: 'CAR CHECK', cnTitle: '查车', category: 'SHORT VIDEO', year: '2026', duration: '01:10', image: '/posters/short-video/car-check.jpg', video: '/media/short-video/car-check.mp4', layout: 'standard' },
  { id: '03', title: 'THE ARGUMENT', cnTitle: '吵架', category: 'SHORT VIDEO', year: '2026', duration: '01:50', image: '/posters/short-video/argument.jpg', video: '/media/short-video/argument.mp4', layout: 'portrait' },
  { id: '04', title: 'RICE FIELD', cnTitle: '稻谷', category: 'SHORT VIDEO', year: '2026', duration: '01:19', image: '/posters/short-video/rice-field.jpg', video: '/media/short-video/rice-field.mp4', layout: 'wide' },
  { id: '05', title: 'EPISODE TWO', cnTitle: '第二集', category: 'SHORT VIDEO', year: '2026', duration: '01:27', image: '/posters/short-video/episode-02.jpg', video: '/media/short-video/episode-02.mp4', layout: 'portrait' },
  { id: '06', title: 'EPISODE ONE', cnTitle: '第一集', category: 'SHORT VIDEO', year: '2026', duration: '01:07', image: '/posters/short-video/episode-01.jpg', video: '/media/short-video/episode-01.mp4', layout: 'standard' },
  { id: '07', title: 'A LITTLE COLD', cnTitle: '感冒', category: 'SHORT VIDEO', year: '2026', duration: '01:01', image: '/posters/short-video/cold.jpg', video: '/media/short-video/cold.mp4', layout: 'wide' },
  { id: '08', title: 'STUDY HARD', cnTitle: '好好学习', category: 'SHORT VIDEO', year: '2026', duration: '01:05', image: '/posters/short-video/study-hard.jpg', video: '/media/short-video/study-hard.mp4', layout: 'standard' },
  { id: '09', title: 'THE ASSESSMENT', cnTitle: '考核', category: 'SHORT VIDEO', year: '2026', duration: '01:46', image: '/posters/short-video/assessment.jpg', video: '/media/short-video/assessment.mp4', layout: 'portrait' },
  { id: '10', title: "IN MOTHER'S EYES", cnTitle: '妈妈眼中的我', category: 'SHORT VIDEO', year: '2026', duration: '01:25', image: '/posters/short-video/in-mothers-eyes.jpg', video: '/media/short-video/in-mothers-eyes.mp4', layout: 'wide' },
  { id: '11', title: 'MISUNDERSTANDING', cnTitle: '误会', category: 'SHORT VIDEO', year: '2026', duration: '02:06', image: '/posters/short-video/misunderstanding.jpg', video: '/media/short-video/misunderstanding.mp4', layout: 'portrait' },
  { id: '12', title: 'ICE CREAM', cnTitle: '雪糕', category: 'SHORT VIDEO', year: '2026', duration: '01:42', image: '/posters/short-video/ice-cream.jpg', video: '/media/short-video/ice-cream.mp4', layout: 'standard' },
  { id: '13', title: 'ENGLISH', cnTitle: '英语', category: 'SHORT VIDEO', year: '2026', duration: '01:03', image: '/posters/short-video/english.jpg', video: '/media/short-video/english.mp4', layout: 'wide' },
  { id: '14', title: 'EMOTION', cnTitle: '感情', category: 'MUSIC VIDEO', year: '2026', duration: '01:52', image: '/posters/music-video/emotion.jpg', video: '/media/music-video/emotion.mp4', layout: 'standard' },
  { id: '15', title: 'THE SWORDSMAN', cnTitle: '侠客', category: 'MUSIC VIDEO', year: '2026', duration: '00:56', image: '/posters/music-video/swordsman.jpg', video: '/media/music-video/swordsman.mp4', layout: 'portrait' },
  { id: '16', title: 'WAR', cnTitle: '战争', category: 'MUSIC VIDEO', year: '2026', duration: '01:26', image: '/posters/music-video/war.jpg', video: '/media/music-video/war.mp4', layout: 'wide' },
  { id: '17', title: 'NEW STORY', cnTitle: '新', category: 'NARRATIVE FILM', year: '2026', duration: '06:01', image: '/posters/narrative/new-film.jpg', video: '/media/narrative/new-film.mp4', layout: 'wide' },
  { id: '18', title: 'PORTRAIT STUDY', cnTitle: '写真', category: 'PORTRAIT MV', year: '2026', duration: '00:30', image: '/posters/portrait-mv/portrait-01.jpg', video: '/media/portrait-mv/portrait-01.mp4', layout: 'portrait' },
  { id: '19', title: 'BY THE SEA', cnTitle: '海边', category: 'PORTRAIT MV', year: '2026', duration: '00:29', image: '/posters/portrait-mv/seaside.jpg', video: '/media/portrait-mv/seaside.mp4', layout: 'standard' },
  { id: '20', title: 'SUMMER', cnTitle: '夏天', category: 'PORTRAIT MV', year: '2026', duration: '00:44', image: '/posters/portrait-mv/summer.jpg', video: '/media/portrait-mv/summer.mp4', layout: 'wide' },
]

const categories = ['ALL', 'SHORT DRAMA', 'SHORT VIDEO', 'MUSIC VIDEO', 'NARRATIVE FILM', 'PORTRAIT MV']

const capabilities = [
  ['01', 'Creative Direction', '概念、创意与视觉方向'],
  ['02', 'AI Visual Development', '角色、场景与风格开发'],
  ['03', 'Cinematic Storyboard', '分镜、构图与镜头语言'],
  ['04', 'AI Video Production', '生图、视频与一致性控制'],
  ['05', 'Post Production', '剪辑、调色、声音与交付'],
]

const workflow = ['CONCEPT', 'VISUAL DEV', 'STORYBOARD', 'GENERATE', 'POST']

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
            <p>LOADING VISUALS <i>01—20</i></p>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div className="cursor" animate={{ x: cursor.x - 7, y: cursor.y - 7 }} transition={{ type: 'spring', stiffness: 800, damping: 45 }} />
      <motion.div className="progress" style={{ scaleX }} />
      <div className="side-index"><span>AI / FILM</span><strong>2026</strong></div>
      <nav className="navbar">
        <a className="brand" href="#top" aria-label="返回首页">Z<span className="brand-dot">.</span></a>
        <div className="nav-meta"><span>AI FILM DIRECTOR</span><span>BASED IN GUANGZHOU</span></div>
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <a href="#works" onClick={() => setMenuOpen(false)}>WORK</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>ABOUT</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>CONTACT</a>
        </div>
        <button className="menu-button" onClick={() => setMenuOpen(v => !v)} aria-label="切换菜单">{menuOpen ? 'CLOSE' : 'MENU'}</button>
      </nav>

      <main>
        <section className="hero sweet-hero" id="top">
          <div className="sweet-shape shape-one" />
          <div className="sweet-shape shape-two" />
          <div className="hero-noise" />
          <motion.div className="sweet-portrait" initial={{ clipPath: 'inset(0 100% 0 0)' }} animate={{ clipPath: 'inset(0 0% 0 0)' }} transition={{ duration: 1.15, delay: .7, ease: [0.76, 0, 0.24, 1] }}>
            <img src="/assets/japanese-sweet-girl.png" alt="日系甜美短发女孩角色设计" />
            <span>CHARACTER / 001</span>
          </motion.div>

          <motion.div className="sweet-copy" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: 1 }}>
            <p className="sweet-kicker">AI CHARACTER &amp; VISUAL DEVELOPMENT</p>
            <h1><span>SWEET</span><span>IN <em>MOTION!</em></span></h1>
            <p className="sweet-date">— 29/08/2026</p>
          </motion.div>

          <div className="sweet-manifesto">
            <span>WHAT IF EVERY FRAME</span>
            <span>FELT LIKE A MEMORY?</span>
            <i>私の小さな映画世界</i>
          </div>

          <div className="sweet-badge">
            <span>MAKE IT</span>
            <strong>FEEL<br />REAL</strong>
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
            <div><span>WORKING WITH</span><strong>STORY &amp; LIGHT</strong><i>✦</i></div>
            <div><span>AI FILM DIRECTOR</span><strong>GUO ZIXUAN</strong><i>↗</i></div>
          </div>

          <div className="sweet-footer">
            <p>I DIRECT IMAGES THAT FEEL<br />BEFORE THEY EXPLAIN.</p>
            <a className="sweet-enter" href="#works"><span>ENTER</span><Arrow diagonal /></a>
            <p>GUANGZHOU / {time}</p>
          </div>
          <div className="scroll-cue dark">SCROLL TO EXPLORE <span>↓</span></div>
        </section>

        <div className="marquee" aria-hidden="true">
          <div><span>AI FILM DIRECTION</span><i>✦</i><span>VISUAL DEVELOPMENT</span><i>✦</i><span>CINEMATIC STORYTELLING</span><i>✦</i><span>AI FILM DIRECTION</span><i>✦</i><span>VISUAL DEVELOPMENT</span><i>✦</i><span>CINEMATIC STORYTELLING</span><i>✦</i></div>
        </div>

        <section className="works section" id="works">
          <div className="section-head">
            <p className="kicker">01 / ALL FILMS</p>
            <h2>20 stories,<br /><em>one visual voice.</em></h2>
            <p className="section-intro">短剧、短视频、歌曲 MV、剧情与写真 MV。所有作品均可点击播放，完整呈现从创意到成片的 AI 影像实践。</p>
          </div>
          <div className="category-filter" aria-label="作品分类">
            {categories.map(category => (
              <button className={activeCategory === category ? 'active' : ''} key={category} onClick={() => setActiveCategory(category)}>
                <span>{category}</span><i>{category === 'ALL' ? projects.length : projects.filter(project => project.category === category).length}</i>
              </button>
            ))}
          </div>
          <div className="project-grid">
            <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.article layout className={`project ${project.layout}`} key={project.id} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .96 }} transition={{ duration: .55, delay: Math.min(index, 5) * .04 }}>
                <button className="project-media" aria-label={`播放项目 ${project.cnTitle}`} onClick={() => setPlayingProject(project)}>
                  <img src={project.image} alt={project.cnTitle} loading="lazy" />
                  <span className="project-index">({project.id})</span>
                  <span className="project-hover-title">{project.title}</span>
                  <span className="play"><span>PLAY</span><i>▶</i></span>
                </button>
                <div className="project-caption">
                  <div><h3>{project.title}</h3><p>{project.cnTitle}</p></div>
                  <div className="project-details"><span>{project.category}</span><span>{project.year}</span><span>{project.duration}</span></div>
                </div>
              </motion.article>
            ))}
            </AnimatePresence>
          </div>
          <p className="archive-count">ARCHIVE / {String(filteredProjects.length).padStart(2, '0')} FILMS</p>
        </section>

        <section className="about section" id="about">
          <div className="about-title"><p className="kicker">02 / ABOUT</p><h2>Not just prompting.<br /><em>Directing the whole frame.</em></h2></div>
          <div className="about-grid">
            <div className="portrait-wrap">
              <img src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1300&q=85" alt="创作者肖像占位图" loading="lazy" />
              <span className="vertical-label">PORTRAIT / PLACEHOLDER</span>
            </div>
            <div className="about-copy">
              <p className="lead">I’m an AI video director and visual designer focused on cinematic storytelling, emotional atmosphere and commercially precise images.</p>
              <p>从概念、角色与场景开发，到电影分镜、AI 生成、剪辑、调色与声音，我独立完成一条影像从想法到成片的完整工作流。</p>
              <p>我的视觉横跨东方叙事、日系情绪电影与高端品牌影像。AI 是制作方式，审美判断和导演思维才是作品的核心。</p>
              <div className="stats">
                <div><strong>20+</strong><span>FILMS &amp; STUDIES</span></div>
                <div><strong>05</strong><span>CORE DISCIPLINES</span></div>
                <div><strong>01</strong><span>END-TO-END CREATOR</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="capabilities section">
          <div className="section-head compact"><p className="kicker">03 / CAPABILITIES</p><h2>From first thought<br />to <em>final frame.</em></h2></div>
          <div className="cap-list">
            {capabilities.map(([id, name, cn]) => (
              <div className="cap-row" key={id}><span>{id}</span><h3>{name}</h3><p>{cn}</p><Arrow diagonal /></div>
            ))}
          </div>
        </section>

        <section className="workflow section">
          <div className="workflow-top"><p className="kicker">04 / WORKFLOW</p><p>ONE VISION.<br />EVERY STAGE.</p></div>
          <div className="workflow-track">
            {workflow.map((step, i) => <div className="workflow-step" key={step}><span>0{i + 1}</span><strong>{step}</strong>{i < workflow.length - 1 && <i>→</i>}</div>)}
          </div>
          <p className="workflow-note">CREATIVE DIRECTION · AI-ASSISTED PRODUCTION · HUMAN JUDGEMENT</p>
        </section>

        <section className="contact section" id="contact">
          <p className="kicker">05 / CONTACT</p>
          <div className="contact-main">
            <h2>Have a story<br />worth <em>seeing?</em></h2>
            <a className="contact-circle" href="mailto:hello@example.com"><span>LET’S TALK</span><Arrow diagonal /></a>
          </div>
          <div className="contact-meta"><a href="mailto:hello@example.com">HELLO@EXAMPLE.COM</a><div><a href="#">XIAOHONGSHU</a><a href="#">INSTAGRAM</a><a href="#">BEHANCE</a></div></div>
        </section>
      </main>

      <footer><span>© 2026 Z. STUDIO</span><span>AI FILM &amp; VISUAL STORYTELLING</span><a href="#top">BACK TO TOP ↑</a></footer>

      <AnimatePresence>
        {playingProject && (
          <motion.div className="player-modal" role="dialog" aria-modal="true" aria-label={`正在播放 ${playingProject.cnTitle}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button className="player-backdrop" aria-label="关闭播放器" onClick={() => setPlayingProject(null)} />
            <motion.div className="player-panel" initial={{ y: 45, scale: .97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 30, scale: .98 }} transition={{ duration: .45, ease: [0.22, 1, 0.36, 1] }}>
              <div className="player-head">
                <div><span>{playingProject.category} / {playingProject.year}</span><h3>{playingProject.title}</h3><p>{playingProject.cnTitle}</p></div>
                <button onClick={() => setPlayingProject(null)}>CLOSE ×</button>
              </div>
              <video key={playingProject.video} src={playingProject.video} poster={playingProject.image} controls autoPlay playsInline preload="metadata" />
              <div className="player-foot"><span>FILM {playingProject.id} / 20 · ORIGINAL 1080P</span><span>{playingProject.duration}</span></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
