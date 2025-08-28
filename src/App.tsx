import { useState } from 'react'
import { apiSlice } from './store/apiSlice'
import './App.css'

function App() {
  const [response, setResponse] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCallAPI = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await fetch('http://localhost:8000/')
      const data = await result.text()
      setResponse(data)
    } catch (err) {
      setError('Failed to call job application service')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="App">
      <h1>OnEmployment Frontend</h1>
      <div className="card">
        <button 
          onClick={handleCallAPI} 
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Call Job Application Service'}
        </button>
        
        {response && (
          <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
            <strong>Response:</strong> {response}
          </div>
        )}
        
        {error && (
          <div style={{ marginTop: '20px', padding: '10px', border: '1px solid red', color: 'red' }}>
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
