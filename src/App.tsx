import './App.css'
import LotteryChecker from './components/LotteryChecker'
import FloatingMenu from './components/FloatingMenu'

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Dò Vé Số</h1>
      </header>

      <main>
        <LotteryChecker />
      </main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} - Ứng dụng Dò Vé Số</p>
      </footer>
      
      <FloatingMenu /> 
    </div>
  )
}

export default App
