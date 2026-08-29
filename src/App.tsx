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
  {
    id: '01',
    title: 'THE LONE SWORD',
    cnTitle: '荒原孤侠',
    category: 'AI NARRATIVE FILM',
    year: '2026',
    duration: '01:42',
    image: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=2200&q=85',
    layout: 'wide',
  },
  {
    id: '02',
    title: 'AFTER THE RAIN',
    cnTitle: '雨停以后',
    category: 'EMOTIONAL SHORT',
    year: '2026',
    duration: '00:54',
    image: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=1600&q=85',
    layout: 'portrait',
  },
  {
    id: '03',
    title: 'BOTANICAL LIGHT',
    cnTitle: '植萃微光',
    category: 'BEAUTY CAMPAIGN',
    year: '2025',
    duration: '00:30',
    image: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=1800&q=85',
    layout: 'standard',
  },
  {
    id: '04',
    title: 'SYNTHETIC MEMORY',
    cnTitle: '合成记忆',
    category: 'VISUAL EXPERIMENT',
    year: '2025',
    duration: '00:48',
    image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=2200&q=85',
    layout: 'wide',
  },
]

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
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

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

  return (
    <div className="site-shell">
      <AnimatePresence>
        {loading && (
          <motion.div className="preloader" initial={{ y: 0 }} exit={{ y: '-100%' }} transition={{ duration: .75, ease: [0.76, 0, 0.24, 1] }}>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Z.</motion.span>
            <p>LOADING VISUALS <i>01—26</i></p>
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
        <section className="hero" id="top">
          <video className="hero-video" autoPlay muted loop playsInline poster="https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=2400&q=90">
            <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay" />
          <div className="hero-noise" />
          <motion.div className="hero-copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
            <p className="eyebrow"><span className="status-dot" /> AVAILABLE FOR SELECTED PROJECTS · 2026</p>
            <h1><span>AI FILM</span><span className="hero-line-two">&amp; VISUAL <em>STORYTELLING</em></span></h1>
            <div className="hero-bottom">
              <p>I DIRECT IMAGES THAT<br />FEEL BEFORE THEY EXPLAIN.</p>
              <a className="circle-link" href="#works" aria-label="查看精选作品"><Arrow diagonal /></a>
              <p className="time">HONG KONG / {time}</p>
            </div>
          </motion.div>
          <div className="scroll-cue">SCROLL TO EXPLORE <span>↓</span></div>
        </section>

        <div className="marquee" aria-hidden="true">
          <div><span>AI FILM DIRECTION</span><i>✦</i><span>VISUAL DEVELOPMENT</span><i>✦</i><span>CINEMATIC STORYTELLING</span><i>✦</i><span>AI FILM DIRECTION</span><i>✦</i><span>VISUAL DEVELOPMENT</span><i>✦</i><span>CINEMATIC STORYTELLING</span><i>✦</i></div>
        </div>

        <section className="works section" id="works">
          <div className="section-head">
            <p className="kicker">01 / SELECTED WORK</p>
            <h2>Moving images,<br /><em>made with intention.</em></h2>
            <p className="section-intro">A selection of AI films, visual experiments and commercial worlds — developed from first thought to final frame.</p>
          </div>
          <div className="project-grid">
            {projects.map((project, index) => (
              <motion.article className={`project ${project.layout}`} key={project.id} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: .8, delay: index % 2 * .08 }}>
                <a href="#contact" className="project-media" aria-label={`查看项目 ${project.title}`}>
                  <img src={project.image} alt={project.cnTitle} loading="lazy" />
                  <span className="project-index">({project.id})</span>
                  <span className="project-hover-title">{project.title}</span>
                  <span className="play"><span>PLAY</span><i>▶</i></span>
                </a>
                <div className="project-caption">
                  <div><h3>{project.title}</h3><p>{project.cnTitle}</p></div>
                  <div className="project-details"><span>{project.category}</span><span>{project.year}</span><span>{project.duration}</span></div>
                </div>
              </motion.article>
            ))}
          </div>
          <a className="text-link" href="#contact">VIEW ALL PROJECTS <Arrow /></a>
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
    </div>
  )
}

export default App
