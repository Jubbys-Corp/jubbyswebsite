import { useEffect, useState } from 'react'
import './App.css'
import { STRINGS } from './i18n.js'

const FLAVOR_IMGS = {
  mango: '/products/flavor-mango.webp?v=6',
  muz: '/products/flavor-muz.webp?v=6',
  ananas: '/products/flavor-ananas.webp?v=6',
  karpuz: '/products/flavor-karpuz.webp?v=8',
}

const ABOUT_HASH = '#/hakkimizda'
const FAQ_HASH = '#/sss'
const CONTACT_HASH = '#/iletisim'

function getRoute() {
  const hash = window.location.hash
  if (hash.startsWith(ABOUT_HASH)) return 'about'
  if (hash.startsWith(FAQ_HASH)) return 'faq'
  if (hash.startsWith(CONTACT_HASH)) return 'contact'
  return 'home'
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
        <a href={CONTACT_HASH}>{t.nav.contact}</a>
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
            <img className="hero-pack hero-pack--1" src="/products/doypack-mango.webp?v=9" alt="" />
            <img className="hero-pack hero-pack--2" src="/products/doypack-muz.webp?v=9" alt="" />
            <img className="hero-pack hero-pack--3" src="/products/doypack-ananas.webp?v=9" alt="" />
            <img className="hero-pack hero-pack--4" src="/products/doypack-karpuz.webp?v=9" alt="" />
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
            <img src="/products/mix-kutu.webp?v=7" alt={t.mixbox.imgAlt} />
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

function FaqPage({ t }) {
  const f = t.faq
  return (
    <main className="about-page faq-page" id="top">
      <section className="about-hero">
        <a className="about-back" href="#top">
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

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Jubbys — ${form.name || c.kicker}`)
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)
    window.location.href = `mailto:${c.email}?subject=${subject}&body=${body}`
  }

  return (
    <main className="about-page contact-page" id="top">
      <section className="about-hero">
        <a className="about-back" href="#top">
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
          <button type="submit" className="btn btn--primary contact-submit">
            {c.formSend}
          </button>
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
          <div className="contact-map">
            <iframe
              title={c.mapAria}
              src="https://www.openstreetmap.org/export/embed.html?bbox=28.6237%2C41.0523%2C28.6397%2C41.0603&layer=mapnik&marker=41.0563%2C28.6317"
              loading="lazy"
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
    const setMeta = (selector, content) => {
      const el = document.head.querySelector(selector)
      if (el) el.setAttribute('content', content)
    }
    setMeta('meta[name="description"]', t.metaDescription)
    setMeta('meta[property="og:title"]', title)
    setMeta('meta[property="og:description"]', t.metaDescription)
    setMeta('meta[name="twitter:title"]', title)
    setMeta('meta[name="twitter:description"]', t.metaDescription)
    setMeta('meta[property="og:locale"]', lang === 'tr' ? 'tr_TR' : 'en_US')
  }, [lang, t, route])

  useEffect(() => {
    const onHash = () => setRoute(getRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // On page switch: scroll appropriately and (re)observe reveal elements.
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
      {route === 'about' ? (
        <AboutPage t={t} />
      ) : route === 'faq' ? (
        <FaqPage t={t} />
      ) : route === 'contact' ? (
        <ContactPage t={t} />
      ) : (
        <HomePage t={t} />
      )}
      <footer className="site-footer">
        <img className="footer-logo" src="/logo.webp" alt="Jubbys" />
        <p className="footer-tag">{t.footer.tag}</p>
        <nav className="footer-nav" aria-label={t.navAria}>
          <a href={FAQ_HASH}>{t.faq.kicker}</a>
          <a href={ABOUT_HASH}>{t.nav.about}</a>
        </nav>
        <p className="footer-note">{t.footer.note}</p>
      </footer>
    </>
  )
}

export default App
