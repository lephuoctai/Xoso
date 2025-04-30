import './App.css'
import LotteryChecker from './components/LotteryChecker'

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Ứng Dụng Dò Vé Số</h1>
      </header>
      <main>
        <LotteryChecker />
      </main>
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} - Ứng dụng Dò Vé Số</p>
      </footer>
    </div>
  )
}

export default App
