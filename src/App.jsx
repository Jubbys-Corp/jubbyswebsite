import './App.css'

function App() {
  return (
    <main className="welcome-page">
      <div className="garage-scene" aria-hidden="true">
        <img className="bg-video bg-video--desktop" src="/bg.gif" alt="" />
        <img className="bg-video bg-video--mobile" src="/bg-mobile.gif" alt="" />
        <div className="pink-filter"></div>
        <div className="smoke">
          <span className="smoke-cloud smoke-cloud-1"></span>
          <span className="smoke-cloud smoke-cloud-2"></span>
          <span className="smoke-cloud smoke-cloud-3"></span>
        </div>
      </div>

      <section className="welcome-content">
<h1>Sizin için harika şeyler pişiriyoruz...</h1>
        <p className="description">Çok yakında sizlerleyiz.</p>
      </section>
    </main>
  )
}

export default App
