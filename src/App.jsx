import { useEffect, useState } from 'react'
import './App.css'
import { STRINGS } from './i18n.js'

const FLAVOR_IMGS = {
  mango: '/products/doypack-mango.webp?v=3',
  muz: '/products/doypack-muz.webp?v=3',
  ananas: '/products/doypack-ananas.webp?v=3',
}

const ABOUT_HASH = '#/hakkimizda'

function getRoute() {
  return window.location.hash.startsWith(ABOUT_HASH) ? 'about' : 'home'
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
      <a className="brand" href="#top" aria-label={t.brandAria}>
        <img src="/logo.webp" alt="Jubbys" />
      </a>
      <nav className="site-nav" aria-label={t.navAria}>
        <a href="#lezzetler">{t.nav.flavors}</a>
        <a href="#mix-kutu">{t.nav.mixbox}</a>
        <a href="#neden-jubbys">{t.nav.why}</a>
        <a href="#toptan">{t.nav.wholesale}</a>
        <a href={ABOUT_HASH}>{t.nav.about}</a>
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

function HomePage({ t }) {
  return (
    <main id="top">
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="hero-badge">{t.hero.badge}</span>
            <h1>
              {t.hero.h1a} <span className="squiggle">{t.hero.h1b}</span>
            </h1>
            <p className="hero-sub">
              Jubbys <strong>Peelies</strong>
              {t.hero.sub}
            </p>
            <div className="hero-actions">
              <a className="btn btn--primary" href="#lezzetler">
                {t.hero.ctaFlavors}
              </a>
              <a className="btn btn--ghost" href="#mix-kutu">
                {t.hero.ctaMix}
              </a>
            </div>
            <ul className="hero-chips" aria-label={t.hero.chipsAria}>
              {t.hero.chips.map((chip) => (
                <li key={chip}>{chip}</li>
              ))}
            </ul>
          </div>
          <div className="hero-stage" aria-hidden="true">
            <div className="hero-blob"></div>
            <img className="hero-pack hero-pack--1" src="/products/doypack-mango.webp?v=3" alt="" />
            <img className="hero-pack hero-pack--2" src="/products/doypack-muz.webp?v=3" alt="" />
            <img className="hero-pack hero-pack--3" src="/products/doypack-ananas.webp?v=3" alt="" />
            <span className="sprinkle sprinkle--1"></span>
            <span className="sprinkle sprinkle--2"></span>
            <span className="sprinkle sprinkle--3"></span>
            <span className="sprinkle sprinkle--4"></span>
            <span className="sprinkle sprinkle--5"></span>
          </div>
        </div>
      </section>

      <WaveDivider />

      <section className="flavors" id="lezzetler">
        <div className="section-head reveal">
          <span className="kicker">{t.flavors.kicker}</span>
          <h2>{t.flavors.h2}</h2>
          <p>{t.flavors.p}</p>
        </div>
        <div className="flavor-grid">
          {t.flavors.items.map((flavor, i) => (
            <article
              className={`flavor-card flavor-card--${flavor.id} reveal`}
              style={{ transitionDelay: `${i * 90}ms` }}
              key={flavor.id}
            >
              <div className="flavor-art">
                <img src={FLAVOR_IMGS[flavor.id]} alt={flavor.imgAlt} loading="lazy" />
              </div>
              <h3>{flavor.title}</h3>
              <p>{flavor.desc}</p>
              <div className="flavor-meta">
                <span className="chip">{flavor.weight}</span>
                <span className="chip">{t.flavors.chipPack}</span>
                <span className="chip">{t.flavors.chipHalal}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <WaveDivider flip color="var(--sun)" />

      <section className="mixbox" id="mix-kutu">
        <div className="mixbox-inner">
          <div className="mixbox-art reveal">
            <img src="/products/mix-kutu.webp?v=3" alt={t.mixbox.imgAlt} />
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
              <img src="/products/poset-mango.webp?v=3" alt="" loading="lazy" />
              <img src="/products/poset-muz.webp?v=3" alt="" loading="lazy" />
              <img src="/products/poset-ananas.webp?v=3" alt="" loading="lazy" />
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

        <div className="local-badge reveal">
          <span className="local-flag" aria-hidden="true">
            {t.features.local.flag}
          </span>
          <div className="local-text">
            <span className="kicker kicker--light">{t.features.local.kicker}</span>
            <h3>{t.features.local.title}</h3>
            <p>{t.features.local.desc}</p>
          </div>
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
        <a className="about-back" href="#top">
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

function App() {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('jubbys-lang')
    return saved === 'en' ? 'en' : 'tr'
  })
  const [route, setRoute] = useState(getRoute)
  const t = STRINGS[lang]

  useEffect(() => {
    localStorage.setItem('jubbys-lang', lang)
    document.documentElement.lang = lang
    document.title = route === 'about' ? `${t.about.kicker} | Jubbys` : t.title
  }, [lang, t, route])

  useEffect(() => {
    const onHash = () => setRoute(getRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // On page switch: scroll appropriately and (re)observe reveal elements.
  useEffect(() => {
    if (route === 'about') {
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

  return (
    <>
      <Header lang={lang} setLang={setLang} t={t} />
      {route === 'about' ? <AboutPage t={t} /> : <HomePage t={t} />}
      <footer className="site-footer">
        <img className="footer-logo" src="/logo.webp" alt="Jubbys" />
        <p className="footer-tag">{t.footer.tag}</p>
        <p className="footer-note">{t.footer.note}</p>
      </footer>
    </>
  )
}

export default App
