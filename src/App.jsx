import { Fragment, useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import { inView, pop, rise, stagger, useTilt } from './motion.js'
import './App.css'
import { STRINGS } from './i18n.js'

const FLAVOR_IMGS = {
  mango: '/products/flavor-mango.webp?v=22',
  muz: '/products/flavor-muz.webp?v=22',
  ananas: '/products/flavor-ananas.webp?v=22',
  karpuz: '/products/flavor-karpuz.webp?v=22',
  'mavi-ahududu': '/products/flavor-mavi-ahududu.webp?v=14',
}

const LIQUID_IMGS = {
  mango: '/products/liquid-card-mango.webp?v=8',
  muz: '/products/liquid-card-muz.webp?v=8',
  ananas: '/products/liquid-card-ananas.webp?v=8',
  karpuz: '/products/liquid-card-karpuz.webp?v=8',
  'mavi-ahududu': '/products/liquid-card-mavi-ahududu.webp?v=8',
}

// FormSubmit alias for info@jubbys.com (keeps the raw address out of scraped JS).
const FORMSUBMIT_ID = 'c644e149454ddaec2493f37625b39227'

const ABOUT_PATH = '/hakkimizda'
const FAQ_PATH = '/sss'
const CONTACT_PATH = '/iletisim'

function getRoute() {
  const path = window.location.pathname
  if (path.startsWith(ABOUT_PATH)) return 'about'
  if (path.startsWith(FAQ_PATH)) return 'faq'
  if (path.startsWith(CONTACT_PATH)) return 'contact'
  return 'home'
}

// Old links used hash routes (jubbys.com/#/iletisim); rewrite them to real paths.
{
  const legacy = window.location.hash.match(/^#\/(hakkimizda|sss|iletisim)/)
  if (legacy && window.location.pathname === '/') {
    window.history.replaceState(null, '', `/${legacy[1]}`)
  }
}

// SPA navigation: intercept plain left-clicks, push the URL, notify listeners.
function goTo(e, to) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
  e.preventDefault()
  window.history.pushState(null, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function WaveDivider({ flip = false, color = 'var(--cream-deep)' }) {
  return (
    <div className={`wave-divider${flip ? ' wave-divider--flip' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none">
        <path
          d="M0,48 C120,88 240,8 360,40 C480,72 600,16 720,40 C840,64 960,12 1080,36 C1200,60 1320,20 1440,52 L1440,90 L0,90 Z"
          fill={color}
        />
      </svg>
    </div>
  )
}

function Header({ lang, setLang, t }) {
  return (
    <header className="site-header">
      <a className="brand" href="/" onClick={(e) => goTo(e, '/')} aria-label={t.brandAria}>
        <img src="/logo.webp" alt="Jubbys" />
      </a>
      <nav className="site-nav" aria-label={t.navAria}>
        <a
          className="nav-brand nav-brand--liquid"
          href="/#liquid-gummies"
          onClick={(e) => goTo(e, '/#liquid-gummies')}
          aria-label={t.nav.liquid}
        >
          <img src="/logo-liquid.webp?v=3" alt={t.nav.liquid} />
        </a>
        <a
          className="nav-brand"
          href="/#lezzetler"
          onClick={(e) => goTo(e, '/#lezzetler')}
          aria-label={t.nav.peelies}
        >
          <img src="/logo-peelies.webp?v=3" alt={t.nav.peelies} />
        </a>
        <a href="/#neden-jubbys" onClick={(e) => goTo(e, '/#neden-jubbys')}>{t.nav.why}</a>
        {/* desktop only: the phone row is already full, and the footer keeps the link there */}
        <a className="nav-faq" href={FAQ_PATH} onClick={(e) => goTo(e, FAQ_PATH)}>{t.faq.kicker}</a>
        <a href={ABOUT_PATH} onClick={(e) => goTo(e, ABOUT_PATH)}>{t.nav.about}</a>
        <a href={CONTACT_PATH} onClick={(e) => goTo(e, CONTACT_PATH)}>{t.nav.contact}</a>
      </nav>
      <div className="header-actions">
        {lang === 'tr' && (
          <a
            className="buy-btn"
            href="https://www.trendyol.com/magaza/jubbys-m-436723?sst=0&channelId=1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              className="buy-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="9" cy="20" r="1.4" />
              <circle cx="18" cy="20" r="1.4" />
              <path d="M2.5 3.5h2.3l2.15 10.9a1.6 1.6 0 0 0 1.57 1.3h7.9a1.6 1.6 0 0 0 1.57-1.27L21 7.5H6" />
            </svg>
            {t.buyLabel}
          </a>
        )}
        <div className="lang-switch" role="group" aria-label={t.langAria}>
          <button
            type="button"
            className={lang === 'tr' ? 'active' : ''}
            aria-pressed={lang === 'tr'}
            onClick={() => setLang('tr')}
          >
            TR
          </button>
          <button
            type="button"
            className={lang === 'en' ? 'active' : ''}
            aria-pressed={lang === 'en'}
            onClick={() => setLang('en')}
          >
            EN
          </button>
        </div>
      </div>
    </header>
  )
}

/* Hero ribbon: one marquee track holding HERO_RIBBON_COPIES identical runs of
   the packs. The scroll keyframes shift it by exactly one run (100 / copies %),
   so the loop is seamless; the copy count keeps the track wider than the
   viewport even after that shift. */
const HERO_PACKS = [
  '/products/doypack-mango.webp?v=17',
  '/products/liquid-mango.webp?v=8',
  '/products/doypack-muz.webp?v=17',
  '/products/liquid-muz.webp?v=8',
  '/products/doypack-ananas.webp?v=17',
  '/products/liquid-ananas.webp?v=8',
  '/products/doypack-karpuz.webp?v=17',
  '/products/liquid-karpuz.webp?v=8',
  '/products/doypack-mavi-ahududu.webp?v=8',
  '/products/liquid-mavi-ahududu.webp?v=8',
]
const HERO_RIBBON_COPIES = [0, 1, 2]

/* The strip is driven from JS rather than a CSS keyframe so one offset can
   carry three things at once: the idle drift, a finger dragging it, and the
   momentum left over from a flick. Velocity always eases back to the idle
   speed, so a hard shove spins fast and settles, a gentle push barely stirs it.
   Press-and-hold (without dragging) still freezes the strip and pops the pack. */
const AUTO_RUN_SECONDS = 34
const FLICK_EASE_SECONDS = 1.1
const MAX_FLICK_SPEED = 4200
const DRAG_THRESHOLD = 6
const AXIS_LOCK = 8
// the back row moves this much slower than the front one - that is the depth
const BACK_PARALLAX = 0.45
// how far (px) from the pointer a pack still feels the push
const PUSH_RADIUS = 230

const wrap = (value, run) => (run > 0 ? ((value % run) - run) % run : 0)

function HeroRibbon() {
  const [pressed, setPressed] = useState(null)
  const [dragging, setDragging] = useState(false)
  const trackRef = useRef(null)
  const backRef = useRef(null)
  const motion = useRef({
    offset: 0,
    velocity: 0,
    runWidth: 0,
    backRun: 0,
    base: 0,
    drag: null,
    pointer: null,
    left: 0,
    packs: [],
  })

  useEffect(() => {
    const track = trackRef.current
    const back = backRef.current
    const m = motion.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')

    // one run of HERO_PACKS; the copies are identical, so wrapping by it is seamless
    const measure = () => {
      m.runWidth = track.scrollWidth / HERO_RIBBON_COPIES.length
      m.backRun = back.scrollWidth / HERO_RIBBON_COPIES.length
      m.base = reduced.matches ? 0 : -m.runWidth / AUTO_RUN_SECONDS
      m.left = track.parentElement.getBoundingClientRect().left
      m.packs = [...track.children].map((el) => ({
        el,
        centre: el.offsetLeft + el.offsetWidth / 2,
        k: 0,
      }))
    }
    measure()
    m.velocity = m.base

    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(track)
    reduced.addEventListener('change', measure)

    let frameId = 0
    let last = 0
    const frame = (now) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0
      last = now
      if (!m.drag) {
        m.velocity += (m.base - m.velocity) * (1 - Math.exp(-dt / FLICK_EASE_SECONDS))
        m.offset += m.velocity * dt
      }
      // the offset itself is never wrapped so the two rows stay in step; each
      // row wraps by its own run width when it is drawn
      const front = wrap(m.offset, m.runWidth)
      track.style.transform = `translate3d(${front}px, 0, 0)`
      back.style.transform = `translate3d(${wrap(m.offset * BACK_PARALLAX, m.backRun)}px, 0, 0)`

      // packs near the pointer lean away from it, as if a finger pushed them
      for (const pack of m.packs) {
        let k = 0
        let side = 1
        if (m.pointer !== null) {
          const dx = pack.centre + front - m.pointer
          const d = Math.abs(dx) / PUSH_RADIUS
          if (d < 1) {
            k = (1 - d) * (1 - d)
            side = dx < 0 ? -1 : 1
          }
        }
        if (k === 0 && pack.k === 0) continue
        pack.k = k
        pack.el.style.setProperty('--push-y', `${(-k * 42).toFixed(1)}px`)
        pack.el.style.setProperty('--push-r', `${(side * k * 14).toFixed(2)}deg`)
        pack.el.style.setProperty('--push-s', (1 + k * 0.1).toFixed(3))
      }
      frameId = requestAnimationFrame(frame)
    }
    frameId = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      reduced.removeEventListener('change', measure)
    }
  }, [])

  const handlePointerDown = (event) => {
    const m = motion.current
    try {
      // capture on the strip: the drag keeps feeding us moves off the packs
      event.currentTarget.setPointerCapture?.(event.pointerId)
    } catch {
      // no active pointer (synthetic event) - the drag still works from here
    }
    m.drag = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startOffset: m.offset,
      moved: false,
      // touch gestures start undecided: the first real movement decides whether
      // this is a sideways drag of the strip or the page scrolling past it
      axis: event.pointerType === 'touch' ? null : 'x',
      samples: [[event.timeStamp, event.clientX]],
    }
    m.velocity = 0
    setDragging(true)
    const key = event.target.dataset.packKey
    if (key) setPressed(key)
  }

  const handlePointerMove = (event) => {
    const m = motion.current
    m.pointer = event.clientX - m.left
    const drag = m.drag
    if (!drag || drag.id !== event.pointerId) return
    const dx = event.clientX - drag.startX
    const dy = event.clientY - drag.startY

    if (drag.axis === null) {
      if (Math.abs(dx) < AXIS_LOCK && Math.abs(dy) < AXIS_LOCK) return // still undecided
      if (Math.abs(dy) > Math.abs(dx)) {
        // the page is scrolling: hand the gesture back, strip keeps drifting
        m.drag = null
        m.velocity = m.base
        setPressed(null)
        setDragging(false)
        return
      }
      drag.axis = 'x'
      drag.startX = event.clientX // start from here so the strip does not jump
      drag.startOffset = m.offset
      drag.samples = [[event.timeStamp, event.clientX]]
    }

    if (!drag.moved && Math.abs(event.clientX - drag.startX) > DRAG_THRESHOLD) {
      drag.moved = true
      setPressed(null) // it is a drag, not a press - let the pack shrink back
    }
    m.offset = drag.startOffset + (event.clientX - drag.startX)
    drag.samples.push([event.timeStamp, event.clientX])
    if (drag.samples.length > 6) drag.samples.shift()
  }

  const endDrag = (event) => {
    const m = motion.current
    const drag = m.drag
    setPressed(null)
    setDragging(false)
    if (!drag || (event.pointerId !== undefined && drag.id !== event.pointerId)) return
    m.drag = null
    // speed of the last ~140ms of the gesture; a plain press has no samples in
    // that window and leaves the strip at rest, easing back to the idle drift
    const end = event.timeStamp
    const x = event.clientX ?? drag.samples[drag.samples.length - 1][1]
    const recent = drag.samples.filter(([t]) => end - t < 140)
    const [t0, x0] = recent[0] ?? drag.samples[drag.samples.length - 1]
    const elapsed = end - t0
    const flick = elapsed > 8 ? ((x - x0) / elapsed) * 1000 : 0
    m.velocity = Math.max(-MAX_FLICK_SPEED, Math.min(MAX_FLICK_SPEED, flick))
  }

  return (
    <div
      className={`hero-ribbon${dragging ? ' is-dragging' : ''}`}
      aria-hidden="true"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onLostPointerCapture={endDrag}
      onPointerLeave={() => {
        motion.current.pointer = null
      }}
    >
      <span className="sprinkle sprinkle--1"></span>
      <span className="sprinkle sprinkle--2"></span>
      <span className="sprinkle sprinkle--3"></span>
      <span className="sprinkle sprinkle--4"></span>
      <span className="sprinkle sprinkle--5"></span>
      {/* the back row: the same packs, smaller, slower and under the juice */}
      <div className="hero-ribbon-track hero-ribbon-track--back" ref={backRef} aria-hidden="true">
        {HERO_RIBBON_COPIES.map((copy) =>
          [...HERO_PACKS].reverse().map((src) => (
            <img key={`${copy}-${src}`} className="hero-ribbon-pack" src={src} alt="" draggable="false" />
          )),
        )}
      </div>
      <div className="hero-ribbon-track" ref={trackRef}>
        {HERO_RIBBON_COPIES.map((copy) =>
          HERO_PACKS.map((src) => {
            const key = `${copy}-${src}`
            return (
              <img
                key={key}
                data-pack-key={key}
                className={`hero-ribbon-pack${pressed === key ? ' is-pressed' : ''}`}
                src={src}
                alt=""
                draggable="false"
              />
            )
          }),
        )}
      </div>
    </div>
  )
}

// hand the flavour to the stage and let it settle before the next one
const SHELF_DWELL_MS = 5200

/* The name drips in letter by letter. Pure CSS: the letters mount with the
   scene and the compositor runs their keyframes, nothing ticks in JS. */
function DripText({ text }) {
  return (
    <span className="drip" aria-label={text}>
      {[...text].map((ch, i) => (
        <span key={`${ch}-${i}`} className="drip-letter" style={{ '--i': i }} aria-hidden="true">
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </span>
  )
}

// scenes crossfade: the old one dissolves while the new one fades in on top
const sceneVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

/* The shelf: every pack of a range standing in a row. One is always "up" on
   the stage above - bigger, with its candy doing its thing behind it and the
   name dripping in. Hover or tap another pack and the stage slides over to it
   in the direction you moved. Left alone, it walks the shelf by itself. */
function Shelf({ copy, images, range }) {
  const items = copy.items
  const [selected, setSelected] = useState(items[0].id)
  const [touched, setTouched] = useState(false)
  const [visible, setVisible] = useState(false)
  const still = useReducedMotion()
  const railRef = useRef(null)
  const current = items.find((f) => f.id === selected) ?? items[0]

  const go = (id) => setSelected(id)

  useEffect(() => {
    if (touched || !visible || still) return undefined
    const timer = setInterval(() => {
      setSelected((id) => {
        const i = items.findIndex((f) => f.id === id)
        return items[(i + 1) % items.length].id
      })
    }, SHELF_DWELL_MS)
    return () => clearInterval(timer)
  }, [touched, visible, still, items])

  const pick = (id) => {
    setTouched(true)
    go(id)
  }

  // a mouse sweeping along the row should not flip the stage five times:
  // a pack is only picked once the pointer has rested on it for a moment
  const hoverTimer = useRef(0)
  const hoverPick = (id) => {
    clearTimeout(hoverTimer.current)
    hoverTimer.current = setTimeout(() => pick(id), 180)
  }
  const hoverCancel = () => clearTimeout(hoverTimer.current)
  useEffect(() => () => clearTimeout(hoverTimer.current), [])

  // phones: one pack per tap on the arrows
  const nudge = (direction) => {
    const rail = railRef.current
    if (!rail) return
    const slot = rail.firstElementChild
    const step = slot ? slot.getBoundingClientRect().width : rail.clientWidth * 0.5
    rail.scrollBy({ left: direction * step, behavior: 'smooth' })
  }

  return (
    <motion.div
      className={`shelf shelf--${range}`}
      onViewportEnter={() => setVisible(true)}
      onViewportLeave={() => setVisible(false)}
      viewport={{ amount: 0.25 }}
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') setTouched(true) // the reader is looking: stop the auto-walk
      }}
    >
      <div className={`shelf-stage shelf-stage--${current.id}`}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={current.id}
            className="shelf-scene"
            variants={sceneVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <div className="shelf-visual">
              <img className="shelf-hero-pack" src={images[current.id]} alt={current.imgAlt} />
            </div>

            <div className="shelf-copy">
              <h3 className="shelf-title">
                <DripText text={current.title} />
              </h3>
              <p>{current.desc}</p>
              <div className="flavor-meta">
                <span className="chip">{current.weight}</span>
                <span className="chip">{copy.chipPack}</span>
                <span className="chip">{copy.chipHalal}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="shelf-rail">
        <button type="button" className="rail-arrow rail-arrow--prev" aria-label={copy.prevAria} onClick={() => nudge(-1)}>
          <span aria-hidden="true">‹</span>
        </button>
        <button type="button" className="rail-arrow rail-arrow--next" aria-label={copy.nextAria} onClick={() => nudge(1)}>
          <span aria-hidden="true">›</span>
        </button>
        <div className="shelf-board" aria-hidden="true" />
        <div className="shelf-row" ref={railRef} role="tablist">
          {items.map((f) => {
            const active = f.id === current.id
            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={f.title}
                className={`shelf-slot${active ? ' is-selected' : ''}`}
                onClick={() => pick(f.id)}
                onPointerEnter={(e) => {
                  if (e.pointerType === 'mouse') hoverPick(f.id)
                }}
                onPointerLeave={hoverCancel}
              >
                <img className="shelf-pack" src={images[f.id]} alt="" draggable="false" />
                <span className="shelf-slot-name">{f.title.replace(/^(Peelies|Liquid) /, '')}</span>
              </button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

/* Opening: three giant words framing one candy that never sits still. The
   ranges' packs are scattered behind it edge to edge, each side its own. */
const GHOSTS = {
  peelies: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12', 'p13', 'p14'],
  liquid: ['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7', 'l8', 'l9', 'l10', 'l11', 'l12', 'l13', 'l14'],
}
const OPENING_CLIPS = [
  'peel-muz',
  'flow-mango',
  'peel-karpuz',
  'flow-mavi-ahududu',
  'peel-ananas',
  'flow-karpuz',
  'peel-mavi-ahududu',
  'flow-ananas',
  'peel-ananas-2',
  'flow-muz',
]

/* iOS only autoplays a video that carries the muted attribute in the DOM
   (React sets the property, not the attribute) and, in Low Power Mode, only
   after the first touch. Every autoplaying clip goes through this primer. */
function primeVideo(el) {
  if (!el) return
  el.muted = true
  el.setAttribute('muted', '')
  el.setAttribute('playsinline', '')
  el.play?.().catch(() => {})
}

// phones and tablets: no hover, no scroll-scrubbing - clips just play
const useTouchScreen = () => {
  const [touch, setTouch] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(hover: none)')
    const update = () => setTouch(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return touch
}

/* A candy that never sits still: plays one clip, then crossfades into the next
   flavour's clip, round and round. With reduced motion on it shows a poster. */
function LivingGummy({ clips, tilt = 0 }) {
  const [index, setIndex] = useState(0)
  const still = useReducedMotion()
  const clip = clips[index]

  if (still) {
    return (
      <div className="hero-media" aria-hidden="true">
        <img className="hero-media-clip" src={`/motion/${clip}.webp`} alt="" />
      </div>
    )
  }

  return (
    <div className="hero-media" aria-hidden="true">
      <AnimatePresence mode="sync">
        <motion.video
          key={clip}
          ref={primeVideo}
          className="hero-media-clip"
          poster={`/motion/${clip}.webp`}
          autoPlay
          muted
          playsInline
          preload="auto"
          initial={{ opacity: 0, scale: 0.9, rotate: tilt * 2 }}
          animate={{ opacity: 1, scale: 1, rotate: tilt }}
          exit={{ opacity: 0, scale: 1.06 }}
          transition={{ duration: 0.7, ease: [0.22, 0.85, 0.24, 1] }}
          onEnded={() => setIndex((n) => (n + 1) % clips.length)}
        >
          <source src={`/motion/${clip}.mp4`} type="video/mp4" />
          <source src={`/motion/${clip}.webm`} type="video/webm" />
        </motion.video>
      </AnimatePresence>
    </div>
  )
}

// where each word flies as the reader scrolls out of the opening
const WORD_EXITS = [
  { x: -260, y: -90, rotate: -9 },
  { x: 240, y: -30, rotate: 7 },
  { x: -120, y: 170, rotate: -5 },
]

function OpeningWord({ word, index, progress }) {
  const exit = WORD_EXITS[index] ?? WORD_EXITS[0]
  const x = useTransform(progress, [0, 1], [0, exit.x])
  const y = useTransform(progress, [0, 1], [0, exit.y])
  const rotate = useTransform(progress, [0, 1], [0, exit.rotate])
  const opacity = useTransform(progress, [0.45, 0.95], [1, 0])
  return (
    <motion.span className={`opening-word opening-word--${index}`} style={{ x, y, rotate, opacity }}>
      <motion.span
        className="opening-word-inner"
        initial={{ y: '110%', rotate: 6 }}
        animate={{ y: 0, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 90, damping: 16, delay: 0.25 + index * 0.16 }}
      >
        {word}
      </motion.span>
    </motion.span>
  )
}

function Opening({ t }) {
  const ref = useRef(null)
  const tilt = useTilt(5)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 0.72])
  const mediaY = useTransform(scrollYProgress, [0, 1], [0, 240])
  const driftLeft = useTransform(scrollYProgress, [0, 1], [0, -90])
  const driftRight = useTransform(scrollYProgress, [0, 1], [0, 90])
  const ghostFade = useTransform(scrollYProgress, [0, 0.7], [1, 0.3])
  const tailFade = useTransform(scrollYProgress, [0, 0.35], [1, 0])

  return (
    <div className="opening" ref={ref}>
      {Object.entries(GHOSTS).map(([id, ghosts], i) => (
        <motion.span
          key={id}
          className={`hero-ghosts hero-ghosts--${id}`}
          aria-hidden="true"
          style={{ y: i === 0 ? driftLeft : driftRight, opacity: ghostFade }}
        >
          {ghosts.map((g) => (
            <i key={g} className={`hero-ghost hero-ghost--${g}`} />
          ))}
        </motion.span>
      ))}

      <motion.div className="opening-stage" initial="hidden" animate="show">
        <motion.div
          className="opening-media"
          style={{ scale: mediaScale, y: mediaY }}
          variants={{
            hidden: { opacity: 0, scale: 0.6 },
            show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 70, damping: 14, delay: 0.1 } },
          }}
        >
          <motion.div
            className="opening-media-tilt"
            style={tilt.style}
            onPointerMove={tilt.onPointerMove}
            onPointerLeave={tilt.onPointerLeave}
          >
            <LivingGummy clips={OPENING_CLIPS} />
          </motion.div>
        </motion.div>

        <h1 className="opening-words">
          {t.opening.words.map((word, i) => (
            <OpeningWord key={word} word={word} index={i} progress={scrollYProgress} />
          ))}
        </h1>
      </motion.div>

      <motion.div
        className="opening-tail"
        style={{ opacity: tailFade }}
        initial="hidden"
        animate="show"
        variants={stagger(0.1, 0.9)}
      >
        <motion.p className="opening-tag" variants={rise}>
          {t.opening.tagline}
        </motion.p>
        <motion.div className="opening-brands" variants={rise}>
          <motion.a
            href="/#lezzetler"
            onClick={(e) => goTo(e, '/#lezzetler')}
            aria-label={t.nav.peelies}
            whileHover={{ scale: 1.08, rotate: -3 }}
            whileTap={{ scale: 0.94 }}
          >
            <img src="/logo-peelies.webp?v=3" alt="" />
          </motion.a>
          <motion.a
            href="/#liquid-gummies"
            onClick={(e) => goTo(e, '/#liquid-gummies')}
            aria-label={t.nav.liquid}
            whileHover={{ scale: 1.08, rotate: 3 }}
            whileTap={{ scale: 0.94 }}
          >
            <img src="/logo-liquid.webp?v=3" alt="" />
          </motion.a>
        </motion.div>
        <motion.span className="opening-scroll" variants={rise} aria-hidden="true">
          {t.opening.scroll}
          <motion.i
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            ↓
          </motion.i>
        </motion.span>
      </motion.div>
    </div>
  )
}

/* Scroll story: two tall acts, each pins a panel while the reader scrolls
   through it and drives the clip's playhead from scroll position - the candy
   peels / pours exactly as fast as you scroll. The scrub encodes have a
   keyframe every 4 frames so seeking is instant. */
const STORY_ACTS = [
  { id: 'peelies', clip: 'peel-karpuz-scrub', logo: '/logo-peelies.webp?v=3', href: '/#lezzetler' },
  { id: 'liquid', clip: 'flow-mango-scrub', logo: '/logo-liquid.webp?v=3', href: '/#liquid-gummies' },
]

function StoryAct({ act, range, index }) {
  const { clip } = range
  const ref = useRef(null)
  const videoRef = useRef(null)
  const reduced = useReducedMotion()
  const touch = useTouchScreen()
  const loops = reduced
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  // iOS will not fetch a frame of a video until it has been asked to play, so
  // seeking does nothing. A muted play-then-pause on the first touch (and
  // again when the act scrolls in) loads it, and scrubbing works from there.
  useEffect(() => {
    if (!touch || loops) return undefined
    const kick = () => {
      const v = videoRef.current
      if (!v) return
      v.muted = true
      v.setAttribute('muted', '')
      v.play().then(() => v.pause()).catch(() => {})
    }
    window.addEventListener('touchstart', kick, { once: true, passive: true })
    return () => window.removeEventListener('touchstart', kick)
  }, [touch, loops])
  // the candy holds still while the panel slides in, then plays through the
  // middle of the act, then holds at the end while the panel leaves
  const playhead = useTransform(scrollYProgress, [0.2, 0.8], [0, 1], { clamp: true })
  const lift = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [40, 0, 0, -40])
  const scale = useTransform(scrollYProgress, [0.1, 0.35, 0.65, 0.9], [0.9, 1, 1, 0.92])

  useMotionValueEvent(playhead, 'change', (v) => {
    const video = videoRef.current
    if (!video || loops || !video.duration) return
    const time = v * (video.duration - 0.05)
    if (Math.abs(video.currentTime - time) > 0.02) video.currentTime = time
  })

  const flip = index % 2 === 1
  return (
    <div className={`story-act story-act--${range.id}${flip ? ' story-act--flip' : ''}`} ref={ref}>
      <div className="story-panel">
        <motion.div className="story-copy" style={{ y: lift }}>
          <motion.img
            className="story-logo"
            src={range.logo}
            alt={act.badge}
            variants={pop}
            initial="hidden"
            whileInView="show"
            viewport={inView}
          />
          <motion.h3 variants={rise} initial="hidden" whileInView="show" viewport={inView}>
            {act.h2}
          </motion.h3>
          <motion.p variants={rise} initial="hidden" whileInView="show" viewport={inView}>
            {act.p}
          </motion.p>
          <motion.a
            className="btn btn--primary story-cta"
            href={range.href}
            onClick={(e) => goTo(e, range.href)}
            variants={rise}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {act.cta} →
          </motion.a>
          <span className="story-hint" aria-hidden="true">
            <span className="story-hint-dot" />
            {act.hint}
          </span>
        </motion.div>
        <motion.div className="story-media" style={{ scale }}>
          <video
            key={loops ? 'loop' : 'scrub'}
            ref={(el) => {
              videoRef.current = el
              if (loops) primeVideo(el)
            }}
            className="story-clip"
            src={`/motion/${loops ? clip.replace('-scrub', '') : clip}.mp4`}
            poster={`/motion/${clip.replace('-scrub', '')}.webp`}
            muted
            playsInline
            preload="auto"
            autoPlay={loops || undefined}
            loop={loops || undefined}
          />
        </motion.div>
      </div>
    </div>
  )
}

function Story({ copy }) {
  return (
    <section className="story" aria-label={copy.kicker}>
      {copy.acts.map((act, i) => (
        <StoryAct act={act} range={STORY_ACTS[i]} index={i} key={act.badge} />
      ))}
    </section>
  )
}

/* A number that counts up the first time it scrolls into view */
function Counter({ value, prefix = '', suffix = '' }) {
  const still = useReducedMotion()
  const count = useMotionValue(still ? value : 0)
  const text = useTransform(count, (v) => `${prefix}${Math.round(v)}${suffix}`)
  const [done, setDone] = useState(false)
  return (
    <motion.span
      className="stat-value"
      onViewportEnter={() => {
        if (done || still) return
        setDone(true)
        animate(count, value, { duration: 1.6, ease: [0.16, 1, 0.3, 1] })
      }}
      viewport={{ once: true, amount: 0.6 }}
    >
      {text}
    </motion.span>
  )
}

/* Wholesale: each product's carton opens as it scrolls in and the pack rises
   out of it, with the carton figures under it. */
const CARTON_PACKS = ['/products/mix-kutu.webp?v=9', '/products/doypack-mango.webp?v=17', '/products/liquid-mango.webp?v=8']

function CartonCard({ row, pack, headers, index }) {
  const facts = [
    [headers.packaging, row.packaging],
    [headers.carton, row.carton],
    [headers.weight, row.weight],
    [headers.volume, row.volume],
  ]
  return (
    <motion.article
      className="carton"
      initial="closed"
      whileInView="open"
      viewport={{ once: true, amount: 0.4 }}
      variants={{
        closed: { opacity: 0, y: 40 },
        open: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 90, damping: 16, delay: index * 0.12 } },
      }}
    >
      <div className="carton-box" aria-hidden="true">
        <motion.img
          className="carton-pack"
          src={pack}
          alt=""
          variants={{
            closed: { y: 90, scale: 0.6, rotate: 0, opacity: 0 },
            open: {
              y: -34,
              scale: 1,
              rotate: index % 2 ? 3 : -3,
              opacity: 1,
              transition: { type: 'spring', stiffness: 80, damping: 12, delay: 0.35 + index * 0.12 },
            },
          }}
        />
        <motion.span
          className="carton-flap"
          variants={{
            closed: { rotateX: 0 },
            open: { rotateX: -160, transition: { type: 'spring', stiffness: 70, damping: 11, delay: 0.15 + index * 0.12 } },
          }}
        />
        <span className="carton-front">
          <img src="/logo.webp" alt="" />
        </span>
      </div>
      <h3>{row.name}</h3>
      <dl className="carton-facts">
        {facts.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </motion.article>
  )
}

function HomePage({ t }) {
  return (
    <main id="top">
      <section className="hero">
        <Opening t={t} />
        <HeroRibbon />
      </section>

      <Story copy={t.story} />

      <WaveDivider color="var(--peel-band)" />

      <section className="flavors flavors--peelies" id="lezzetler">
        <motion.div className="section-head" initial="hidden" whileInView="show" viewport={inView} variants={rise}>
          <span className="kicker kicker--logo">
            <img src="/logo-peelies.webp?v=3" alt={t.flavors.kicker} />
          </span>
          <h2>{t.flavors.h2}</h2>
          <p>{t.flavors.p}</p>
        </motion.div>
        <Shelf copy={t.flavors} images={FLAVOR_IMGS} range="peelies" />
      </section>

      <WaveDivider color="var(--liquid-band)" />

      <section className="flavors flavors--liquid" id="liquid-gummies">
        <motion.div className="section-head" initial="hidden" whileInView="show" viewport={inView} variants={rise}>
          <span className="kicker kicker--logo kicker--liquid">
            <img src="/logo-liquid.webp?v=3" alt={t.liquid.kicker} />
          </span>
          <h2>{t.liquid.h2}</h2>
          <p>{t.liquid.p}</p>
        </motion.div>
        <Shelf copy={t.liquid} images={LIQUID_IMGS} range="liquid" />
      </section>

      <WaveDivider flip color="var(--sun)" />

      <section className="mixbox" id="mix-kutu">
        <div className="mixbox-inner">
          <motion.div
            className="mixbox-art"
            initial="hidden"
            whileInView="show"
            viewport={inView}
            variants={pop}
          >
            <motion.img
              src="/products/mix-kutu.webp?v=9"
              alt={t.mixbox.imgAlt}
              whileHover={{ rotate: -2, scale: 1.03 }}
            />
          </motion.div>
          <motion.div className="mixbox-copy" initial="hidden" whileInView="show" viewport={inView} variants={rise}>
            <span className="kicker kicker--light">{t.mixbox.kicker}</span>
            <h2>{t.mixbox.h2}</h2>
            <p className="mixbox-lead">
              {t.mixbox.leadPre}
              <strong>{t.mixbox.leadStrong}</strong>
              {t.mixbox.leadPost}
            </p>
            <ul className="mixbox-list">
              {t.mixbox.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <motion.div
              className="sachet-row"
              aria-hidden="true"
              initial="hidden"
              whileInView="show"
              viewport={inView}
              variants={stagger(0.12, 0.2)}
            >
              {['mango', 'muz', 'ananas'].map((id, i) => (
                <motion.img
                  key={id}
                  src={`/products/poset-${id}.webp?v=6`}
                  alt=""
                  loading="lazy"
                  variants={{
                    hidden: { y: 70, rotate: (i - 1) * 18, scale: 0.6, opacity: 0 },
                    show: { y: 0, rotate: (i - 1) * 6, scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 120, damping: 12 } },
                  }}
                  whileHover={{ y: -8, rotate: 0, scale: 1.08 }}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <WaveDivider color="var(--sun)" />

      <section className="features" id="neden-jubbys">
        <motion.div className="section-head" initial="hidden" whileInView="show" viewport={inView} variants={rise}>
          <span className="kicker">{t.features.kicker}</span>
          <h2>{t.features.h2}</h2>
        </motion.div>
        <motion.ul
          className="stat-strip"
          initial="hidden"
          whileInView="show"
          viewport={inView}
          variants={stagger(0.1)}
        >
          {t.features.stats.map((stat) => (
            <motion.li key={stat.label} variants={pop}>
              <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              <span className="stat-label">{stat.label}</span>
            </motion.li>
          ))}
        </motion.ul>
        <motion.div
          className="feature-grid"
          initial="hidden"
          whileInView="show"
          viewport={inView}
          variants={stagger(0.07)}
        >
          {t.features.items.map((f) => (
            <motion.article
              className="feature-card"
              key={f.icon}
              variants={pop}
              whileHover={{ y: -8, rotate: -0.6 }}
            >
              <span className="feature-icon" aria-hidden="true">
                {f.icon}
              </span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section className="specs" id="toptan">
        <motion.div className="section-head" initial="hidden" whileInView="show" viewport={inView} variants={rise}>
          <span className="kicker">{t.specs.kicker}</span>
          <h2>{t.specs.h2}</h2>
          <p>{t.specs.p}</p>
        </motion.div>
        <div className="carton-grid">
          {t.specs.rows.map((row, i) => (
            <CartonCard key={row.name} row={row} pack={CARTON_PACKS[i]} headers={t.specs.headers} index={i} />
          ))}
        </div>
      </section>
    </main>
  )
}

function AboutPage({ t }) {
  const a = t.about
  return (
    <main className="about-page" id="top">
      <section className="about-hero">
        <a className="about-back" href="/" onClick={(e) => goTo(e, '/')}>
          ← {a.back}
        </a>
        <span className="kicker">{a.kicker}</span>
        <h1>{a.title}</h1>
        <p className="about-lead">{a.lead}</p>
      </section>
      <div className="about-body">
        {a.sections.map((s, i) => (
          <motion.section
            className="about-section"
            key={i}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            variants={rise}
          >
            <h2>{s.h}</h2>
            {s.p?.map((para, j) => (
              <p key={j}>{para}</p>
            ))}
            {s.list && (
              <ul className="about-list">
                {s.list.map((li, j) => (
                  <li key={j}>{li}</li>
                ))}
              </ul>
            )}
            {s.after && <p>{s.after}</p>}
          </motion.section>
        ))}
      </div>
    </main>
  )
}

function FaqPage({ t }) {
  const f = t.faq
  return (
    <main className="about-page faq-page" id="top">
      <section className="about-hero">
        <a className="about-back" href="/" onClick={(e) => goTo(e, '/')}>
          ← {t.about.back}
        </a>
        <span className="kicker">{f.kicker}</span>
        <h1>{f.h2}</h1>
        <p className="about-lead">{f.lead}</p>
      </section>
      <div className="faq-page-body">
        <div className="faq-list">
          {f.items.map((qa, i) => (
            <motion.details
              className="faq-item"
              key={i}
              initial="hidden"
              whileInView="show"
              viewport={inView}
              variants={rise}
              transition={{ delay: i * 0.05 }}
            >
              <summary>
                <span>{qa.q}</span>
                <span className="faq-mark" aria-hidden="true"></span>
              </summary>
              <p>
                {qa.link
                  ? qa.a.split('{link}').map((part, j, parts) => (
                      <Fragment key={j}>
                        {part}
                        {j < parts.length - 1 && (
                          <a href={CONTACT_PATH} onClick={(e) => goTo(e, CONTACT_PATH)}>
                            {qa.link}
                          </a>
                        )}
                      </Fragment>
                    ))
                  : qa.a}
              </p>
            </motion.details>
          ))}
        </div>
      </div>
    </main>
  )
}

function ContactPage({ t }) {
  const c = t.contact
  const mapQuery = encodeURIComponent('Osmangazi Mahallesi 3141. Sokak No 5 Esenyurt İstanbul')
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${FORMSUBMIT_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          _subject: `Jubbys, ${form.name || c.kicker}`,
          _template: 'table',
          _captcha: 'false',
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      // FormSubmit reports failures (e.g. unactivated form) as 200 + success:"false".
      const data = await res.json()
      if (String(data.success) !== 'true') throw new Error(data.message || 'FormSubmit error')
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <main className="about-page contact-page" id="top">
      <section className="about-hero">
        <a className="about-back" href="/" onClick={(e) => goTo(e, '/')}>
          ← {t.about.back}
        </a>
        <span className="kicker">{c.kicker}</span>
        <h1>{c.h2}</h1>
        <p className="about-lead">{c.lead}</p>
      </section>
      <div className="contact-body">
        <form className="contact-form" onSubmit={handleSubmit}>
          <label className="contact-field">
            <span>{c.formName}</span>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </label>
          <label className="contact-field">
            <span>{c.formEmail}</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
          </label>
          <label className="contact-field">
            <span>{c.formMessage}</span>
            <textarea
              rows="5"
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              required
            />
          </label>
          <button
            type="submit"
            className="btn btn--primary contact-submit"
            disabled={status === 'sending'}
          >
            {status === 'sending' ? c.formSending : c.formSend}
          </button>
          {status === 'success' && (
            <p className="contact-status contact-status--success" role="status">
              {c.formSuccess}
            </p>
          )}
          {status === 'error' && (
            <p className="contact-status contact-status--error" role="alert">
              {c.formError}
            </p>
          )}
        </form>
        <div className="contact-info">
          <div className="contact-address">
            <h2>{c.addressLabel}</h2>
            <p>{c.address}</p>
            <a
              className="contact-directions"
              href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {c.directions} →
            </a>
          </div>
          <div className="contact-address">
            <h2>{c.emailLabel}</h2>
            <p>{c.emailLead}</p>
            <a className="contact-directions" href={`mailto:${c.email}`}>
              {c.email}
            </a>
          </div>
          <div className="contact-map">
            <iframe
              title={c.mapAria}
              src={`https://www.google.com/maps?q=${mapQuery}&z=16&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </main>
  )
}

function App() {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('jubbys-lang')
    return saved === 'en' ? 'en' : 'tr'
  })
  const [route, setRoute] = useState(getRoute)
  const t = STRINGS[lang]

  useEffect(() => {
    const wake = () => document.querySelectorAll('video[autoplay]').forEach((v) => v.play().catch(() => {}))
    window.addEventListener('touchstart', wake, { once: true, passive: true })
    return () => window.removeEventListener('touchstart', wake)
  }, [])

  useEffect(() => {
    localStorage.setItem('jubbys-lang', lang)
    document.documentElement.lang = lang
    const title =
      route === 'about'
        ? `${t.about.kicker} | Jubbys`
        : route === 'faq'
          ? `${t.faq.kicker} | Jubbys`
          : route === 'contact'
            ? `${t.contact.kicker} | Jubbys`
            : t.title
    document.title = title
    const description =
      route === 'about'
        ? t.about.lead
        : route === 'faq'
          ? t.faq.lead
          : route === 'contact'
            ? t.contact.lead
            : t.metaDescription
    const path =
      route === 'about'
        ? ABOUT_PATH
        : route === 'faq'
          ? FAQ_PATH
          : route === 'contact'
            ? CONTACT_PATH
            : '/'
    const setMeta = (selector, content) => {
      const el = document.head.querySelector(selector)
      if (el) el.setAttribute('content', content)
    }
    setMeta('meta[name="description"]', description)
    setMeta('meta[property="og:title"]', title)
    setMeta('meta[property="og:description"]', description)
    setMeta('meta[name="twitter:title"]', title)
    setMeta('meta[name="twitter:description"]', description)
    setMeta('meta[property="og:locale"]', lang === 'tr' ? 'tr_TR' : 'en_US')
    setMeta('meta[property="og:url"]', `https://jubbys.com${path === '/' ? '/' : path}`)
    document.head
      .querySelector('link[rel="canonical"]')
      ?.setAttribute('href', `https://jubbys.com${path === '/' ? '/' : path}`)
  }, [lang, t, route])

  useEffect(() => {
    const onNav = () => {
      setRoute(getRoute())
      const id = window.location.hash.slice(1)
      if (id && id !== 'top') {
        requestAnimationFrame(() => {
          document.getElementById(id)?.scrollIntoView()
        })
      }
    }
    window.addEventListener('popstate', onNav)
    return () => window.removeEventListener('popstate', onNav)
  }, [])

  // On page switch: back to the top, or to the section a hash points at.
  useEffect(() => {
    if (route === 'about' || route === 'faq' || route === 'contact') {
      window.scrollTo(0, 0)
    } else {
      const id = window.location.hash.slice(1)
      if (id && id !== 'top') {
        requestAnimationFrame(() => {
          document.getElementById(id)?.scrollIntoView()
        })
      } else {
        window.scrollTo(0, 0)
      }
    }

  }, [route])

  return (
    <>
      <Header lang={lang} setLang={setLang} t={t} />
      <motion.div
        key={route}
        className="page"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        {route === 'about' ? (
          <AboutPage t={t} />
        ) : route === 'faq' ? (
          <FaqPage t={t} />
        ) : route === 'contact' ? (
          <ContactPage t={t} />
        ) : (
          <HomePage t={t} />
        )}
      </motion.div>
      <footer className="site-footer">
        <img className="footer-logo" src="/logo.webp" alt="Jubbys" />
        <p className="footer-tag">{t.footer.tag}</p>
        <nav className="footer-nav" aria-label={t.navAria}>
          <a href={FAQ_PATH} onClick={(e) => goTo(e, FAQ_PATH)}>{t.faq.kicker}</a>
          <a href={ABOUT_PATH} onClick={(e) => goTo(e, ABOUT_PATH)}>{t.nav.about}</a>
        </nav>
        <p className="footer-note">{t.footer.note}</p>
      </footer>
    </>
  )
}

export default App
