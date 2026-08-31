import { Fragment, useEffect, useRef, useState } from 'react'
import './App.css'
import { STRINGS } from './i18n.js'

const FLAVOR_IMGS = {
  mango: '/products/flavor-mango.webp?v=17',
  muz: '/products/flavor-muz.webp?v=17',
  ananas: '/products/flavor-ananas.webp?v=17',
  karpuz: '/products/flavor-karpuz.webp?v=17',
  'mavi-ahududu': '/products/flavor-mavi-ahududu.webp?v=9',
}

const LIQUID_IMGS = {
  mango: '/products/liquid-card-mango.webp?v=7',
  muz: '/products/liquid-card-muz.webp?v=7',
  ananas: '/products/liquid-card-ananas.webp?v=7',
  karpuz: '/products/liquid-card-karpuz.webp?v=7',
  'mavi-ahududu': '/products/liquid-card-mavi-ahududu.webp?v=7',
}

// FormSubmit alias for info@jubbys.com (keeps the raw address out of scraped JS).
const FORMSUBMIT_ID = 'c644e149454ddaec2493f37625b39227'

const ABOUT_PATH = '/hakkimizda'
const FAQ_PATH = '/sss'
const CONTACT_PATH = '/iletisim'
const NEWS_PATH = '/haberler'

function getRoute() {
  const path = window.location.pathname
  if (path.startsWith(ABOUT_PATH)) return 'about'
  if (path.startsWith(FAQ_PATH)) return 'faq'
  if (path.startsWith(CONTACT_PATH)) return 'contact'
  if (path.startsWith(NEWS_PATH)) return 'news'
  return 'home'
}

// Old links used hash routes (jubbys.com/#/iletisim); rewrite them to real paths.
{
  const legacy = window.location.hash.match(/^#\/(hakkimizda|sss|iletisim|haberler)/)
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
        <a href={NEWS_PATH} onClick={(e) => goTo(e, NEWS_PATH)}>{t.nav.haberler}</a>
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

// the freshly launched flavours get a little badge on their card
const NEW_PEELIES = ['mavi-ahududu']
const NEW_LIQUID = ['mango', 'muz', 'ananas', 'karpuz', 'mavi-ahududu']

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

function HeroRibbon() {
  const [pressed, setPressed] = useState(null)
  const [dragging, setDragging] = useState(false)
  const trackRef = useRef(null)
  const motion = useRef({ offset: 0, velocity: 0, runWidth: 0, base: 0, drag: null })

  useEffect(() => {
    const track = trackRef.current
    const m = motion.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')

    // one run of HERO_PACKS; the copies are identical, so wrapping by it is seamless
    const measure = () => {
      m.runWidth = track.scrollWidth / HERO_RIBBON_COPIES.length
      m.base = reduced.matches ? 0 : -m.runWidth / AUTO_RUN_SECONDS
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
      if (m.runWidth > 0) m.offset = ((m.offset % m.runWidth) - m.runWidth) % m.runWidth
      track.style.transform = `translate3d(${m.offset}px, 0, 0)`
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
    >
      <span className="sprinkle sprinkle--1"></span>
      <span className="sprinkle sprinkle--2"></span>
      <span className="sprinkle sprinkle--3"></span>
      <span className="sprinkle sprinkle--4"></span>
      <span className="sprinkle sprinkle--5"></span>
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

function FlavorGrid({ copy, images, newIds = [] }) {
  const railRef = useRef(null)

  // one card per tap, whatever the current card width is
  const nudge = (direction) => {
    const rail = railRef.current
    if (!rail) return
    const card = rail.firstElementChild
    const gap = parseFloat(getComputedStyle(rail).columnGap) || 0
    const step = card ? card.getBoundingClientRect().width + gap : rail.clientWidth * 0.8
    rail.scrollBy({ left: direction * step, behavior: 'smooth' })
  }

  return (
    <div className="flavor-rail">
      <button
        type="button"
        className="rail-arrow rail-arrow--prev"
        aria-label={copy.prevAria}
        onClick={() => nudge(-1)}
      >
        <span aria-hidden="true">‹</span>
      </button>
      <button
        type="button"
        className="rail-arrow rail-arrow--next"
        aria-label={copy.nextAria}
        onClick={() => nudge(1)}
      >
        <span aria-hidden="true">›</span>
      </button>
      <div className="flavor-grid" ref={railRef}>
      {copy.items.map((flavor, i) => (
        <article
          className={`flavor-card flavor-card--${flavor.id} reveal`}
          style={{ transitionDelay: `${i * 90}ms` }}
          key={flavor.id}
        >
          {newIds.includes(flavor.id) && <span className="flavor-new">{copy.newBadge}</span>}
          <div className="flavor-art">
            <img src={images[flavor.id]} alt={flavor.imgAlt} loading="lazy" />
          </div>
          <h3>{flavor.title}</h3>
          <p>{flavor.desc}</p>
          <div className="flavor-meta">
            <span className="chip">{flavor.weight}</span>
            <span className="chip">{copy.chipPack}</span>
            <span className="chip">{copy.chipHalal}</span>
          </div>
        </article>
      ))}
      </div>
    </div>
  )
}

/* The hero alternates between the two ranges: only the copy changes, while
   both lockups stay put on the right and the one being talked about lights up
   as the other dims down. */
const HERO_BRANDS = [
  { id: 'liquid', logo: '/logo-liquid.webp?v=3' },
  { id: 'peelies', logo: '/logo-peelies.webp?v=3' },
]
const HERO_SLIDE_MS = 7000

function HeroShowcase({ t }) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  // `active` is a dependency so picking a lockup by hand restarts the clock and
  // that range gets a full turn before the hero moves on
  useEffect(() => {
    if (paused) return undefined
    const id = setTimeout(() => setActive((i) => (i + 1) % HERO_BRANDS.length), HERO_SLIDE_MS)
    return () => clearTimeout(id)
  }, [paused, active])

  return (
    <div
      className="hero-inner"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="hero-copy">
        {t.hero.slides.map((copy, i) => {
          const on = i === active
          // one h1 per page: the second act's headline is a styled h2
          const Heading = i === 0 ? 'h1' : 'h2'
          return (
            <div key={HERO_BRANDS[i].id} className={`hero-act${on ? ' is-active' : ''}`} aria-hidden={!on}>
              <span className="hero-badge">{copy.badge}</span>
              <Heading>
                {copy.h1a} <span className="squiggle">{copy.h1b}</span>
              </Heading>
              <p className="hero-sub">{copy.desc}</p>
            </div>
          )
        })}
      </div>

      <div className="hero-brands">
        {HERO_BRANDS.map((brand, i) => (
          <Fragment key={brand.id}>
            <button
              type="button"
              className={`hero-brand${i === active ? ' is-on' : ''}`}
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              aria-label={t.hero.slides[i].logoAria}
            >
              <img src={brand.logo} alt={t.hero.slides[i].logoAria} />
            </button>
          </Fragment>
        ))}
      </div>
    </div>
  )
}

function HomePage({ t }) {
  return (
    <main id="top">
      <section className="hero">
        <HeroShowcase t={t} />

        <HeroRibbon />
      </section>

      <WaveDivider color="var(--peel-band)" />

      <section className="flavors flavors--peelies" id="lezzetler">
        <div className="section-head reveal">
          <span className="kicker kicker--logo">
            <img src="/logo-peelies.webp?v=3" alt={t.flavors.kicker} />
          </span>
          <h2>{t.flavors.h2}</h2>
          <p>{t.flavors.p}</p>
        </div>
        <FlavorGrid copy={t.flavors} images={FLAVOR_IMGS} newIds={NEW_PEELIES} />
      </section>

      <WaveDivider color="var(--liquid-band)" />

      <section className="flavors flavors--liquid" id="liquid-gummies">
        <div className="section-head reveal">
          <span className="kicker kicker--logo kicker--liquid">
            <img src="/logo-liquid.webp?v=3" alt={t.liquid.kicker} />
          </span>
          <h2>{t.liquid.h2}</h2>
          <p>{t.liquid.p}</p>
        </div>
        <FlavorGrid copy={t.liquid} images={LIQUID_IMGS} newIds={NEW_LIQUID} />
      </section>

      <WaveDivider flip color="var(--sun)" />

      <section className="mixbox" id="mix-kutu">
        <div className="mixbox-inner">
          <div className="mixbox-art reveal">
            <img src="/products/mix-kutu.webp?v=9" alt={t.mixbox.imgAlt} />
          </div>
          <div className="mixbox-copy reveal">
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
            <div className="sachet-row" aria-hidden="true">
              <img src="/products/poset-mango.webp?v=6" alt="" loading="lazy" />
              <img src="/products/poset-muz.webp?v=6" alt="" loading="lazy" />
              <img src="/products/poset-ananas.webp?v=6" alt="" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      <WaveDivider color="var(--sun)" />

      <section className="features" id="neden-jubbys">
        <div className="section-head reveal">
          <span className="kicker">{t.features.kicker}</span>
          <h2>{t.features.h2}</h2>
        </div>
        <div className="feature-grid">
          {t.features.items.map((f, i) => (
            <article
              className="feature-card reveal"
              style={{ transitionDelay: `${i * 90}ms` }}
              key={f.icon}
            >
              <span className="feature-icon" aria-hidden="true">
                {f.icon}
              </span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="specs reveal" id="toptan">
        <div className="section-head">
          <span className="kicker">{t.specs.kicker}</span>
          <h2>{t.specs.h2}</h2>
          <p>{t.specs.p}</p>
        </div>
        <div className="specs-table-wrap">
          <table className="specs-table">
            <thead>
              <tr>
                <th>{t.specs.headers.name}</th>
                <th>{t.specs.headers.packaging}</th>
                <th>{t.specs.headers.carton}</th>
                <th>{t.specs.headers.weight}</th>
                <th>{t.specs.headers.volume}</th>
              </tr>
            </thead>
            <tbody>
              {t.specs.rows.map((s) => (
                <tr key={s.name}>
                  <td>{s.name}</td>
                  <td>{s.packaging}</td>
                  <td>{s.carton}</td>
                  <td>{s.weight}</td>
                  <td>{s.volume}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
          <section className="about-section reveal" key={i}>
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
          </section>
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
            <details
              className="faq-item reveal"
              style={{ transitionDelay: `${i * 60}ms` }}
              key={i}
            >
              <summary>
                <span>{qa.q}</span>
                <span className="faq-mark" aria-hidden="true"></span>
              </summary>
              <p>{qa.a}</p>
            </details>
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

function NewsPage({ t }) {
  const n = t.news
  return (
    <main className="about-page news-page" id="top">
      <section className="about-hero">
        <a className="about-back" href="/" onClick={(e) => goTo(e, '/')}>
          ← {t.about.back}
        </a>
        <span className="kicker">{n.kicker}</span>
        <h1>{n.h2}</h1>
        <p className="about-lead">{n.lead}</p>
      </section>
      <div className="news-body">
        <div className="news-list">
          {n.items.map((item, i) => (
            <article
              className="news-card reveal"
              style={{ transitionDelay: `${i * 70}ms` }}
              key={i}
            >
              {item.image && (
                <img className="news-image" src={item.image} alt={item.title} loading="lazy" />
              )}
              <div className="news-meta">
                <time className="news-date">{item.date}</time>
                {item.tag && <span className="news-tag">{item.tag}</span>}
              </div>
              <h2 className="news-title">{item.title}</h2>
              <p>{item.body}</p>
            </article>
          ))}
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
  const [showPopup, setShowPopup] = useState(() => {
    try {
      return !sessionStorage.getItem('jubbys-popup-foodist')
    } catch {
      return true
    }
  })
  const t = STRINGS[lang]

  const closePopup = () => {
    setShowPopup(false)
    try {
      sessionStorage.setItem('jubbys-popup-foodist', '1')
    } catch {
      /* sessionStorage unavailable */
    }
  }

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
            : route === 'news'
              ? `${t.news.kicker} | Jubbys`
              : t.title
    document.title = title
    const description =
      route === 'about'
        ? t.about.lead
        : route === 'faq'
          ? t.faq.lead
          : route === 'contact'
            ? t.contact.lead
            : route === 'news'
              ? t.news.lead
              : t.metaDescription
    const path =
      route === 'about'
        ? ABOUT_PATH
        : route === 'faq'
          ? FAQ_PATH
          : route === 'contact'
            ? CONTACT_PATH
            : route === 'news'
              ? NEWS_PATH
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

  // On page switch: scroll appropriately and (re)observe reveal elements.
  useEffect(() => {
    if (route === 'about' || route === 'faq' || route === 'contact' || route === 'news') {
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

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 },
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [route])

  useEffect(() => {
    if (!showPopup) return
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setShowPopup(false)
        try {
          sessionStorage.setItem('jubbys-popup-foodist', '1')
        } catch {
          /* ignore */
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [showPopup])

  return (
    <>
      <Header lang={lang} setLang={setLang} t={t} />
      {route === 'about' ? (
        <AboutPage t={t} />
      ) : route === 'faq' ? (
        <FaqPage t={t} />
      ) : route === 'contact' ? (
        <ContactPage t={t} />
      ) : route === 'news' ? (
        <NewsPage t={t} />
      ) : (
        <HomePage t={t} />
      )}
      <footer className="site-footer">
        <img className="footer-logo" src="/logo.webp" alt="Jubbys" />
        <p className="footer-tag">{t.footer.tag}</p>
        <nav className="footer-nav" aria-label={t.navAria}>
          <a href={FAQ_PATH} onClick={(e) => goTo(e, FAQ_PATH)}>{t.faq.kicker}</a>
          <a href={ABOUT_PATH} onClick={(e) => goTo(e, ABOUT_PATH)}>{t.nav.about}</a>
        </nav>
        <p className="footer-note">{t.footer.note}</p>
      </footer>
      {showPopup && (
        <div
          className="popup-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={t.popup.aria}
          onClick={closePopup}
        >
          <div className="popup-box" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="popup-close"
              onClick={closePopup}
              aria-label={t.popup.close}
            >
              ×
            </button>
            <img src="/news/foodist-2026.webp" alt={t.popup.alt} />
          </div>
        </div>
      )}
    </>
  )
}

export default App
