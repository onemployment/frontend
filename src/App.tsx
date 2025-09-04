import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import './App.css'

function App() {
  const [currentLetter, setCurrentLetter] = useState('O')
  const [showButton, setShowButton] = useState(false)
  
  useEffect(() => {
    const sequence = ['O', 'U', 'O']
    let currentIndex = 0
    
    const timer = setInterval(() => {
      currentIndex++
      if (currentIndex < sequence.length) {
        setCurrentLetter(sequence[currentIndex])
      } else {
        clearInterval(timer)
        setTimeout(() => setShowButton(true), 500)
      }
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="App">
      <div className="text-container">
        <h1>
          <motion.span
            key={currentLetter}
            initial={{ scale: 0.8, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.8, 
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            {currentLetter}
          </motion.span>
nemployment
        </h1>
        
        {showButton && (
          <motion.button
            className="get-started-btn"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1]
            }}
            onClick={() => console.log('Get Started clicked')}
          >
            Get Started
          </motion.button>
        )}
      </div>
    </div>
  )
}

export default App
