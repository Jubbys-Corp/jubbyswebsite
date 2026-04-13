import './App.css'

function App() {
  return (
    <main className="welcome-page">
      <div className="garage-scene" aria-hidden="true">
        <video
          className="bg-video"
          src="/bg-video.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
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
