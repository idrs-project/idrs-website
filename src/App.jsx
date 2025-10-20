import Hero from './components/Hero'

function App() {
  return (
    <div className="homepage">
      <header className="header">
        <div className="logo">IDRS Group</div>
        <nav className="nav">
          <a href="#how-it-works">How it Works</a>
          <a href="#docs">Docs</a>
          <a href="#ecosystem">Ecosystem</a>
        </nav>
        <a href="#get-idrs" className="cta">Get IDRS</a>
      </header>

      <Hero />
    </div>
  )
}

export default App
