import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

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

const mediaBaseUrl = (import.meta.env.VITE_MEDIA_BASE_URL ?? '').trim().replace(/\/$/, '')
const mediaUrl = (path = '') => `${mediaBaseUrl}${path}`

const projects: Project[] = [
  { id: '01', title: 'NEW STORY', cnTitle: '新', category: 'NARRATIVE FILM', year: '2026', duration: '06:01', image: '/posters/narrative/new-film.jpg', video: '/media/narrative/new-film.mp4', layout: 'wide' },
  { id: '02', title: 'MISUNDERSTANDING', cnTitle: '误会', category: 'SHORT VIDEO', year: '2026', duration: '02:06', image: '/posters/short-video/misunderstanding.jpg', video: '/media/short-video/misunderstanding.mp4', layout: 'standard' },
  { id: '03', title: 'SHORT DRAMA', cnTitle: '短剧', category: 'SHORT DRAMA', year: '2026', duration: '01:55', image: '/posters/short-drama/short-drama.jpg', video: '/media/short-drama/short-drama.mp4', layout: 'standard' },
  { id: '04', title: 'EMOTION', cnTitle: '感情', category: 'MUSIC VIDEO', year: '2026', duration: '01:52', image: '/posters/music-video/emotion.jpg', video: '/media/music-video/emotion.mp4', layout: 'standard' },
  { id: '05', title: 'THE ASSESSMENT', cnTitle: '考核', category: 'SHORT VIDEO', year: '2026', duration: '01:46', image: '/posters/short-video/assessment.jpg', video: '/media/short-video/assessment.mp4', layout: 'standard' },
  { id: '06', title: 'ICE CREAM', cnTitle: '雪糕', category: 'SHORT VIDEO', year: '2026', duration: '01:42', image: '/posters/short-video/ice-cream.jpg', video: '/media/short-video/ice-cream.mp4', layout: 'standard' },
  { id: '07', title: 'THE ARGUMENT', cnTitle: '吵架', category: 'SHORT VIDEO', year: '2026', duration: '01:39', image: '/posters/short-video/argument.jpg?v=2', video: '/media/short-video/argument-v2.mp4', layout: 'standard' },
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
const uploadKeys = [
  'short-drama/short-drama.mp4',
  'short-video/car-check.mp4',
  'short-video/argument-v2.mp4',
  'short-video/rice-field.mp4',
  'short-video/episode-02.mp4',
  'short-video/episode-01.mp4',
  'short-video/cold.mp4',
  'short-video/study-hard.mp4',
  'short-video/assessment.mp4',
  'short-video/in-mothers-eyes.mp4',
  'short-video/misunderstanding.mp4',
  'short-video/ice-cream.mp4',
  'short-video/english.mp4',
  'music-video/emotion.mp4',
  'music-video/swordsman.mp4',
  'music-video/war.mp4',
  'narrative/new-film.mp4',
  'portrait-mv/portrait-01.mp4',
  'portrait-mv/seaside.mp4',
  'portrait-mv/summer.mp4',
] as const
const smoothEase = [0.76, 0, 0.24, 1] as const
const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: .12, delayChildren: .18 } },
}
const cardVariants = {
  hidden: { opacity: 0, y: 90, clipPath: 'inset(0 0 18% 0)' },
  visible: { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', transition: { duration: 1.05, ease: smoothEase } },
}

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true" className={diagonal ? 'arrow diagonal' : 'arrow'}>→</span>
}

function SectionDisplay({ children }: { children: string }) {
  return (
    <div className="section-display-mask" aria-hidden="true">
      <motion.p
        className="section-display"
        initial={{ y: '115%', scaleX: .58 }}
        whileInView={{ y: '0%', scaleX: 1 }}
        viewport={{ once: true, amount: .75 }}
        transition={{ duration: 1.15, ease: smoothEase }}
      >
        {children}
      </motion.p>
    </div>
  )
}

function ProjectCard({ project, index, onPlay }: { project: Project; index: number; onPlay: (project: Project) => void }) {
  const cardRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ['start end', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['-4%', '4%'])

  return (
    <motion.article ref={cardRef} variants={cardVariants} layout className={`project ${index === 0 ? 'feature' : index < 8 ? 'major' : 'compact-project'}`}>
      <button className="project-media" aria-label={`播放项目 ${project.cnTitle}`} onClick={() => onPlay(project)}>
        <motion.img src={project.image} alt={project.cnTitle} loading="lazy" style={{ y: imageY, scale: 1.08 }} />
        <span className="project-index">({project.id})</span>
        <span className="project-hover-title">{project.cnTitle}</span>
        <span className="play"><span>播放原片</span><i>▶</i></span>
      </button>
      <div className="project-caption">
        <div><h3>{project.cnTitle}</h3><p>{project.title}</p></div>
        <div className="project-details"><span>{categoryLabels[project.category]}</span><span>{project.year}</span><span>{project.duration}</span></div>
      </div>
    </motion.article>
  )
}

function UploadPage() {
  const [files, setFiles] = useState<File[]>([])
  const [token, setToken] = useState('')
  const [status, setStatus] = useState('请选择全部 20 个原始视频。')
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)

  async function checkedFetch(url: string, init?: RequestInit) {
    const response = await fetch(url, init)
    if (!response.ok) throw new Error(`${response.status} ${await response.text()}`)
    return response
  }

  async function uploadFile(file: File, key: string, index: number) {
    const publicUrl = mediaUrl(`/media/${key}`)
    const existing = await fetch(publicUrl, { method: 'HEAD' })
    if (existing.ok && Number(existing.headers.get('content-length')) === file.size) {
      setStatus(`[${index + 1}/20] 已存在：${file.name}`)
      return
    }

    const endpoint = `/api/media-upload/${key}`
    const headers = { authorization: `Bearer ${token}` }
    const created = await checkedFetch(`${endpoint}?action=create`, { method: 'POST', headers })
    const { uploadId } = await created.json() as { uploadId: string }
    const parts: unknown[] = []
    const partSize = 32 * 1024 * 1024

    try {
      for (let offset = 0, partNumber = 1; offset < file.size; offset += partSize, partNumber += 1) {
        const end = Math.min(offset + partSize, file.size)
        const uploaded = await checkedFetch(`${endpoint}?action=part&uploadId=${encodeURIComponent(uploadId)}&partNumber=${partNumber}`, {
          method: 'PUT',
          headers,
          body: file.slice(offset, end),
        })
        parts.push(await uploaded.json())
        const fileProgress = end / file.size
        setProgress(Math.round(((index + fileProgress) / files.length) * 100))
        setStatus(`[${index + 1}/20] 正在上传 ${file.name} · ${Math.round(fileProgress * 100)}%`)
      }

      await checkedFetch(`${endpoint}?action=complete&uploadId=${encodeURIComponent(uploadId)}`, {
        method: 'POST',
        headers: { ...headers, 'content-type': 'application/json' },
        body: JSON.stringify({ parts }),
      })
    } catch (error) {
      await fetch(`${endpoint}?action=abort&uploadId=${encodeURIComponent(uploadId)}`, { method: 'DELETE', headers }).catch(() => undefined)
      throw error
    }
  }

  async function startUpload() {
    if (files.length !== uploadKeys.length) {
      setStatus(`文件数量不正确：当前 ${files.length} 个，需要 20 个。`)
      return
    }
    if (!token.trim()) {
      setStatus('请输入本次上传密钥。')
      return
    }

    setUploading(true)
    setProgress(0)
    try {
      for (let index = 0; index < files.length; index += 1) {
        await uploadFile(files[index], uploadKeys[index], index)
      }
      setProgress(100)
      setStatus('全部 20 个原始视频已上传完成。')
    } catch (error) {
      setStatus(`上传中断：${error instanceof Error ? error.message : '未知错误'}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#eef2e8', color: '#1f2924', padding: '48px', fontFamily: 'system-ui, sans-serif' }}>
      <section style={{ maxWidth: 920, margin: '0 auto', background: '#fffdf7', border: '1px solid #cfd8ca', borderRadius: 24, padding: 40 }}>
        <p style={{ letterSpacing: '.15em', color: '#6e806f' }}>Z. PORTFOLIO / MEDIA UPLOADER</p>
        <h1 style={{ fontSize: 46, margin: '12px 0 8px' }}>原始视频上传</h1>
        <p>仅用于本站媒体维护。文件会按作品清单顺序上传，不进行压缩或转码。</p>
        <label style={{ display: 'block', marginTop: 28 }}>
          <span style={{ display: 'block', marginBottom: 8 }}>本次上传密钥</span>
          <input aria-label="本次上传密钥" type="password" value={token} onChange={(event) => setToken(event.target.value)} disabled={uploading} style={{ width: '100%', boxSizing: 'border-box', padding: 14, border: '1px solid #acbba8', borderRadius: 10 }} />
        </label>
        <label style={{ display: 'block', marginTop: 20 }}>
          <span style={{ display: 'block', marginBottom: 8 }}>按作品清单选择 20 个视频</span>
          <input aria-label="选择原始视频" type="file" accept="video/mp4" multiple disabled={uploading} onChange={(event) => setFiles(Array.from(event.target.files ?? []))} />
        </label>
        <button onClick={startUpload} disabled={uploading || files.length !== 20} style={{ marginTop: 28, border: 0, borderRadius: 999, padding: '14px 26px', background: '#496b55', color: 'white', cursor: 'pointer' }}>{uploading ? '上传中，请保持页面打开' : `开始上传（${files.length}/20）`}</button>
        <div style={{ height: 10, background: '#dfe7dc', borderRadius: 999, overflow: 'hidden', marginTop: 28 }}><div style={{ height: '100%', width: `${progress}%`, background: '#7fa183', transition: 'width .2s' }} /></div>
        <p role="status" style={{ marginTop: 12 }}>{status}</p>
      </section>
    </main>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [time, setTime] = useState('')
  const [loading, setLoading] = useState(true)
  const [cursor, setCursor] = useState({ x: -100, y: -100 })
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [playingProject, setPlayingProject] = useState<Project | null>(null)
  const [playerStatus, setPlayerStatus] = useState<'loading' | 'ready' | 'waiting' | 'error'>('loading')
  const [heroPlaybackBlocked, setHeroPlaybackBlocked] = useState(false)
  const [useMobileVideo] = useState(() => {
    if (typeof window === 'undefined') return false
    const mobileViewport = window.matchMedia('(max-width: 820px)').matches
    const mobileBrowser = /MicroMessenger|iPhone|iPad|iPod|Android|Mobile/i.test(window.navigator.userAgent)
    return mobileViewport || mobileBrowser
  })
  const heroVideoRef = useRef<HTMLVideoElement>(null)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  const filteredProjects = activeCategory === 'ALL' ? projects : projects.filter(project => project.category === activeCategory)
  const playingVideoPath = playingProject?.video
    ? useMobileVideo
      ? playingProject.video.replace('/media/', '/media-mobile/')
      : playingProject.video
    : ''

  useEffect(() => {
    const tick = () => setTime(new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Hong_Kong' }).format(new Date()))
    tick()
    const timer = window.setInterval(tick, 30_000)
    const intro = window.setTimeout(() => setLoading(false), 2050)
    const move = (event: MouseEvent) => setCursor({ x: event.clientX, y: event.clientY })
    window.addEventListener('mousemove', move)
    return () => {
      window.clearInterval(timer)
      window.clearTimeout(intro)
      window.removeEventListener('mousemove', move)
    }
  }, [])

  useEffect(() => {
    const tryHeroPlayback = () => {
      const hero = heroVideoRef.current
      if (!hero) return
      hero.muted = true
      hero.play()
        .then(() => setHeroPlaybackBlocked(false))
        .catch(() => setHeroPlaybackBlocked(true))
    }
    const retryTimer = window.setTimeout(tryHeroPlayback, 2300)
    document.addEventListener('WeixinJSBridgeReady', tryHeroPlayback)
    return () => {
      window.clearTimeout(retryTimer)
      document.removeEventListener('WeixinJSBridgeReady', tryHeroPlayback)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = playingProject ? 'hidden' : ''
    if (playingProject) {
      heroVideoRef.current?.pause()
      setPlayerStatus('loading')
    } else if (heroVideoRef.current) {
      heroVideoRef.current.play()
        .then(() => setHeroPlaybackBlocked(false))
        .catch(() => setHeroPlaybackBlocked(true))
    }
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
          <motion.div className="preloader" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .2, delay: 1.05 }}>
            <motion.div className="opening-panel opening-sage" exit={{ x: '-101%' }} transition={{ duration: 1.15, ease: smoothEase }} />
            <motion.div className="opening-panel opening-sky" exit={{ x: '101%' }} transition={{ duration: 1.15, ease: smoothEase }} />
            <motion.div className="opening-content" exit={{ y: '-120%', opacity: 0 }} transition={{ duration: .7, ease: smoothEase }}>
              <div className="opening-mask"><motion.span initial={{ y: '118%', scaleX: .42 }} animate={{ y: 0, scaleX: 1 }} transition={{ duration: 1.15, delay: .18, ease: smoothEase }}>Z.</motion.span></div>
              <div className="opening-copy-mask"><motion.strong initial={{ y: '130%' }} animate={{ y: 0 }} transition={{ duration: .9, delay: .5, ease: smoothEase }}>AI 影像导演 · 郭梓轩</motion.strong></div>
            </motion.div>
            <p>正在打开一段夏日影像 <i>01—20</i></p>
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
        <section className="hero video-hero" id="top">
          <video
            ref={heroVideoRef}
            className="video-hero-bg"
            src={mediaUrl('/media/hero/summer-background.mp4')}
            poster="/posters/portrait-mv/summer.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="《夏天》作品背景视频"
            onPlay={() => setHeroPlaybackBlocked(false)}
          />
          <div className="video-hero-overlay" />
          <div className="hero-noise" />
          {heroPlaybackBlocked && (
            <button
              className="hero-play-button"
              type="button"
              onClick={() => {
                const hero = heroVideoRef.current
                if (!hero) return
                hero.muted = true
                hero.play()
                  .then(() => setHeroPlaybackBlocked(false))
                  .catch(() => setHeroPlaybackBlocked(true))
              }}
            >
              <span aria-hidden="true">▶</span> 点击播放背景
            </button>
          )}

          <motion.div className="video-hero-copy">
            <motion.p className="video-hero-kicker" initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .8, delay: 2.35, ease: smoothEase }}>郭梓轩 · AI 影像作品集 / 2026</motion.p>
            <h1>
              <span className="hero-title-mask"><motion.b initial={{ y: '112%', scaleX: .62 }} animate={{ y: 0, scaleX: 1 }} transition={{ duration: 1.15, delay: 2.05, ease: smoothEase }}>让故事</motion.b></span>
              <span className="hero-title-mask"><motion.b initial={{ y: '112%', scaleX: .54 }} animate={{ y: 0, scaleX: 1 }} transition={{ duration: 1.2, delay: 2.18, ease: smoothEase }}>发生在<em>画面里。</em></motion.b></span>
            </h1>
          </motion.div>

          <div className="video-hero-aside">
            <span>正在播放</span>
            <strong>《夏天》</strong>
            <i>00:44 / 原始 1080P</i>
          </div>

          <div className="video-hero-footer">
            <p>AI 影像导演 / 视觉设计师<br />从创意到最终成片</p>
            <a className="video-hero-enter" href="#works"><span>浏览全部作品</span><Arrow diagonal /></a>
            <p>广州 / {time}</p>
          </div>
          <div className="scroll-cue">向下浏览 <span>↓</span></div>
        </section>

        <div className="marquee" aria-hidden="true">
          <div><span>AI 影像导演</span><i>✦</i><span>视觉开发</span><i>✦</i><span>电影化叙事</span><i>✦</i><span>AI 影像导演</span><i>✦</i><span>视觉开发</span><i>✦</i><span>电影化叙事</span><i>✦</i></div>
        </div>

        <section className="works section" id="works">
          <SectionDisplay>SELECTED WORKS</SectionDisplay>
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
          <AnimatePresence mode="wait">
            <motion.div
              className="project-grid"
              key={activeCategory}
              variants={gridVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: .35, ease: smoothEase }}
            >
              {filteredProjects.map((project, index) => (
                <ProjectCard project={project} index={index} onPlay={setPlayingProject} key={project.video} />
              ))}
            </motion.div>
          </AnimatePresence>
          <p className="archive-count">当前展示 / {String(filteredProjects.length).padStart(2, '0')} 部作品</p>
        </section>

        <section className="about section" id="about">
          <SectionDisplay>ABOUT THE DIRECTOR</SectionDisplay>
          <div className="about-title"><p className="kicker">02 / 关于我</p><h2>不只是生成。<br /><em>我在导演整个画面。</em></h2></div>
          <motion.div className="about-grid" initial="hidden" whileInView="visible" viewport={{ once: true, amount: .2 }} variants={gridVariants}>
            <motion.div className="portrait-wrap" variants={cardVariants}>
              <img src="/profile-guo-zixuan.png" alt="郭梓轩黑白肖像" loading="lazy" />
              <span className="vertical-label">郭梓轩 / AI 影像创作者</span>
            </motion.div>
            <motion.div className="about-copy" variants={cardVariants}>
              <p className="lead">我是郭梓轩，环境设计本科在读，专注 AIGC 视觉与 AI 影像。</p>
              <p>具备构图、色彩、空间与材质表达基础，能够完成创意构思、剧本拆解、电影分镜、人物与场景一致性控制、图生视频，以及剪辑、基础调色与声音设计。</p>
              <p>我的创作涵盖商业品牌视觉、东方武侠与情感微电影。AI 是制作方式，审美判断、视觉统一和导演思维是我持续打磨的核心。</p>
              <div className="about-meta">
                <div><span>教育</span><strong>广东技术师范大学 · 环境设计本科</strong><small>GPA 3.7 / 4.0 · 2023—2027</small></div>
                <div><span>经历</span><strong>湖美 AI 商学院 · AI 短视频运营助理</strong><small>2026.07—2026.08</small></div>
                <div><span>荣誉</span><strong>湖美未来 AI 商学院优秀学员</strong><small>2026.08</small></div>
              </div>
              <div className="stats">
                <div><strong>20</strong><span>站内完整影像作品</span></div>
                <div><strong>3.7</strong><span>本科 GPA / 4.0</span></div>
                <div><strong>05</strong><span>全流程创作环节</span></div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        <section className="capabilities section">
          <SectionDisplay>CAPABILITIES</SectionDisplay>
          <div className="section-head compact"><p className="kicker">03 / 专业能力</p><h2>从一个想法<br />到<em>最终一帧。</em></h2></div>
          <div className="cap-list">
            {capabilities.map(([id, name, cn], index) => (
              <motion.div className="cap-row" key={id} initial={{ opacity: 0, x: -80 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .7 }} transition={{ duration: .85, delay: index * .08, ease: smoothEase }}><span>{id}</span><h3>{name}</h3><p>{cn}</p><Arrow diagonal /></motion.div>
            ))}
          </div>
        </section>

        <section className="workflow section">
          <SectionDisplay>CREATIVE PROCESS</SectionDisplay>
          <div className="workflow-top"><p className="kicker">04 / 创作流程</p><p>一个方向。<br />贯穿每一步。</p></div>
          <div className="workflow-track">
            {workflow.map((step, i) => <motion.div className="workflow-step" key={step} initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .65 }} transition={{ duration: .8, delay: i * .12, ease: smoothEase }}><span>0{i + 1}</span><strong>{step}</strong>{i < workflow.length - 1 && <i>→</i>}</motion.div>)}
          </div>
          <p className="workflow-note">创意导演 · AI 辅助制作 · 人的审美判断</p>
        </section>

        <section className="contact section" id="contact">
          <SectionDisplay>LET'S CREATE</SectionDisplay>
          <p className="kicker">05 / 联系合作</p>
          <div className="contact-main">
            <h2>有一个故事<br />想让人<em>看见？</em></h2>
            <a className="contact-circle" href="mailto:3158423779@qq.com"><span>聊聊合作</span><Arrow diagonal /></a>
          </div>
          <div className="contact-meta"><a href="mailto:3158423779@qq.com">3158423779@QQ.COM</a><div><a href="tel:18038686754">180 3868 6754</a><span>广州</span></div></div>
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
              <div className="player-stage">
                <video
                  key={playingVideoPath}
                  src={mediaUrl(playingVideoPath)}
                  poster={playingProject.image}
                  controls
                  autoPlay
                  playsInline
                  preload="auto"
                  onLoadStart={() => setPlayerStatus('loading')}
                  onCanPlay={() => setPlayerStatus('ready')}
                  onPlaying={() => setPlayerStatus('ready')}
                  onWaiting={() => setPlayerStatus('waiting')}
                  onStalled={() => setPlayerStatus('waiting')}
                  onError={() => setPlayerStatus('error')}
                />
                {playerStatus !== 'ready' && (
                  <div className={`player-status ${playerStatus}`} role="status">
                    {playerStatus === 'error' ? (
                      <><strong>视频暂时加载失败</strong><span>请检查网络后关闭并重新打开</span></>
                    ) : (
                      <><i /><strong>{playerStatus === 'waiting' ? '正在缓冲视频' : '正在加载视频'}</strong><span>{useMobileVideo ? '正在使用手机流畅画质' : '正在使用电脑高清画质'}</span></>
                    )}
                  </div>
                )}
              </div>
              <div className="player-foot"><span>作品 {playingProject.id} / 20 · {useMobileVideo ? '移动流畅 720P' : '电脑高清 1080P'}</span><span>{playingProject.duration}</span></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Root() {
  return new URLSearchParams(window.location.search).get('upload') === '1' ? <UploadPage /> : <App />
}

export default Root
