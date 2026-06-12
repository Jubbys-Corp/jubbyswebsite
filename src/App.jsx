import { useEffect } from 'react'
import './App.css'

const FLAVORS = [
  {
    id: 'mango',
    name: 'Mango',
    title: 'Peelies Mango',
    img: '/products/doypack-mango.webp',
    desc: 'Güneş gibi parlak, bal gibi tatlı. Soydukça ortaya çıkan tropik mango keyfi!',
    weight: '55 g (1.94 oz)',
  },
  {
    id: 'muz',
    name: 'Muz',
    title: 'Peelies Muz',
    img: '/products/doypack-muz.webp',
    desc: 'Tıpkı gerçeği gibi soyulur! Yumuşacık dokusuyla muz aromalı soyulabilir eğlence.',
    weight: '55 g (1.94 oz)',
  },
  {
    id: 'ananas',
    name: 'Ananas',
    title: 'Peelies Ananas',
    img: '/products/doypack-ananas.webp',
    desc: 'Tropik bir esinti! Dilim dilim ananas tadı — soy, keşfet, tadını çıkar.',
    weight: '55 g (1.94 oz)',
  },
]

const FEATURES = [
  {
    icon: '🧃',
    title: 'Gerçek Meyve Sulu',
    desc: 'Her Peelies, gerçek meyve suyu ile hazırlanır. Tadı meyvenin ta kendisi!',
  },
  {
    icon: '🍌',
    title: 'Soyulabilir Eğlence',
    desc: 'Önce soy, sonra ye! Yemesi kadar soyması da eğlenceli yumuşak şeker.',
  },
  {
    icon: '✅',
    title: 'Helal Sertifikalı',
    desc: 'Tüm ürünlerimiz helal sertifikalıdır, gönül rahatlığıyla tüketebilirsiniz.',
  },
  {
    icon: '🎁',
    title: 'Her Ana Uygun Boy',
    desc: '55 g paketler ve 5,5 g mini poşetli Mix Kutu — okulda, yolda, her yerde.',
  },
]

const SPECS = [
  {
    name: 'Peelies Mix Kutu',
    packaging: '5,5 g × 100 × 8',
    carton: '375 × 175 × 335 mm',
    weight: '4,4 kg',
    volume: '0,022 m³',
  },
  {
    name: 'Peelies Mango',
    packaging: '55 g (1.94 oz) × 12 × 6',
    carton: '375 × 290 × 335 mm',
    weight: '3,96 kg',
    volume: '0,036 m³',
  },
  {
    name: 'Peelies Muz',
    packaging: '55 g (1.94 oz) × 12 × 6',
    carton: '375 × 290 × 335 mm',
    weight: '3,96 kg',
    volume: '0,036 m³',
  },
  {
    name: 'Peelies Ananas',
    packaging: '55 g (1.94 oz) × 12 × 6',
    carton: '375 × 290 × 335 mm',
    weight: '3,96 kg',
    volume: '0,036 m³',
  },
]

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

function App() {
  useEffect(() => {
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
  }, [])

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Jubbys ana sayfa">
          <img src="/logo.webp" alt="Jubbys" />
        </a>
        <nav className="site-nav" aria-label="Site içi gezinme">
          <a href="#lezzetler">Lezzetler</a>
          <a href="#mix-kutu">Mix Kutu</a>
          <a href="#neden-jubbys">Neden Jubbys?</a>
          <a href="#toptan">Toptan</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-copy">
              <span className="hero-badge">🧃 Gerçek meyve sulu</span>
              <h1>
                Soy &amp; <span className="squiggle">Tadını Çıkar!</span>
              </h1>
              <p className="hero-sub">
                Jubbys <strong>Peelies</strong> — soyulabilir meyveli yumuşak şeker. Mango, muz ve
                ananas lezzetleriyle; soyması da yemesi kadar eğlenceli!
              </p>
              <div className="hero-actions">
                <a className="btn btn--primary" href="#lezzetler">
                  Lezzetleri Keşfet
                </a>
                <a className="btn btn--ghost" href="#mix-kutu">
                  Mix Kutu 🎁
                </a>
              </div>
              <ul className="hero-chips" aria-label="Öne çıkanlar">
                <li>🥭 Mango</li>
                <li>🍌 Muz</li>
                <li>🍍 Ananas</li>
              </ul>
            </div>
            <div className="hero-stage" aria-hidden="true">
              <div className="hero-blob"></div>
              <img className="hero-pack hero-pack--1" src="/products/doypack-mango.webp" alt="" />
              <img className="hero-pack hero-pack--2" src="/products/doypack-muz.webp" alt="" />
              <img className="hero-pack hero-pack--3" src="/products/doypack-ananas.webp" alt="" />
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
            <span className="kicker">Lezzetlerimiz</span>
            <h2>Hangisini önce soyacaksın?</h2>
            <p>Her paket 55 g saf eğlence. Gerçek meyve suyuyla hazırlanan üç tropik lezzet.</p>
          </div>
          <div className="flavor-grid">
            {FLAVORS.map((flavor, i) => (
              <article
                className={`flavor-card flavor-card--${flavor.id} reveal`}
                style={{ transitionDelay: `${i * 90}ms` }}
                key={flavor.id}
              >
                <div className="flavor-art">
                  <img src={flavor.img} alt={`Jubbys ${flavor.title} paketi`} loading="lazy" />
                </div>
                <h3>{flavor.title}</h3>
                <p>{flavor.desc}</p>
                <div className="flavor-meta">
                  <span className="chip">{flavor.weight}</span>
                  <span className="chip">Doypack</span>
                  <span className="chip">Helal</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <WaveDivider flip color="var(--sun)" />

        <section className="mixbox" id="mix-kutu">
          <div className="mixbox-inner">
            <div className="mixbox-art reveal">
              <img src="/products/mix-kutu.webp" alt="Jubbys Peelies Mix Kutu — 100 mini poşet" />
            </div>
            <div className="mixbox-copy reveal">
              <span className="kicker kicker--light">Karar veremeyenlere</span>
              <h2>Peelies Mix Kutu</h2>
              <p className="mixbox-lead">
                Tek kutuda <strong>100 mini poşet</strong>! Her biri 5,5 g — mango, muz ve ananas
                bir arada. Paylaşması kolay, bitirmesi zor.
              </p>
              <ul className="mixbox-list">
                <li>🍬 100 × 5,5 g mini poşet</li>
                <li>🥭🍌🍍 Üç lezzet tek kutuda</li>
                <li>🏪 Tezgah üstü stantlı kutu</li>
              </ul>
              <div className="sachet-row" aria-hidden="true">
                <img src="/products/poset-mango.webp" alt="" loading="lazy" />
                <img src="/products/poset-muz.webp" alt="" loading="lazy" />
                <img src="/products/poset-ananas.webp" alt="" loading="lazy" />
              </div>
            </div>
          </div>
        </section>

        <WaveDivider color="var(--sun)" />

        <section className="features" id="neden-jubbys">
          <div className="section-head reveal">
            <span className="kicker">Neden Jubbys?</span>
            <h2>Çünkü şeker dediğin eğlenceli olmalı</h2>
          </div>
          <div className="feature-grid">
            {FEATURES.map((f, i) => (
              <article
                className="feature-card reveal"
                style={{ transitionDelay: `${i * 90}ms` }}
                key={f.title}
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
            <span className="kicker">Toptan &amp; İhracat</span>
            <h2>Koli Bilgileri</h2>
            <p>Bayilik ve ihracat talepleriniz için ürün ve koli detaylarımız.</p>
          </div>
          <div className="specs-table-wrap">
            <table className="specs-table">
              <thead>
                <tr>
                  <th>Ürün</th>
                  <th>Paketleme</th>
                  <th>Koli Ölçüsü</th>
                  <th>Net Ağırlık</th>
                  <th>Hacim</th>
                </tr>
              </thead>
              <tbody>
                {SPECS.map((s) => (
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

      <footer className="site-footer">
        <img className="footer-logo" src="/logo.webp" alt="Jubbys" />
        <p className="footer-tag">Meyve aromalı soyulabilir yumuşak şeker — Soy &amp; tadını çıkar!</p>
        <p className="footer-note">© 2026 Jubbys. Tüm hakları saklıdır.</p>
      </footer>
    </>
  )
}

export default App
