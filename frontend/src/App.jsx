import { useState } from 'react'
import FileUpload from './components/FileUpload'
import Results from './components/Results'
import './App.css'

function App() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAnalysisComplete = (data) => {
    setResults(data)
    setError(null)
  }

  const handleError = (errorMessage) => {
    setError(errorMessage)
    setResults(null)
  }

  const handleReset = () => {
    setResults(null)
    setError(null)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🚕 Taxi Trip Optimizer</h1>
        <p>Upload taxi trip data to find the best times and zones for highest fares</p>
      </header>

      <main className="main-content">
        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
            <button onClick={handleReset} className="close-btn">×</button>
          </div>
        )}

        {!results ? (
          <FileUpload 
            onAnalysisComplete={handleAnalysisComplete}
            onError={handleError}
            setLoading={setLoading}
          />
        ) : (
          <Results 
            results={results}
            onReset={handleReset}
          />
        )}

        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Analyzing taxi trip data...</p>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Powered by Flask + PySpark + React</p>
      </footer>
    </div>
  )
}

export default App
