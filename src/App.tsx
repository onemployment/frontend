import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Typography, Button } from '@mui/material';

function App() {
  const navigate = useNavigate();
  const [currentLetter, setCurrentLetter] = useState('o');
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const sequence = ['o', 'u', 'o'];
    let currentIndex = 0;

    const timer = setInterval(() => {
      currentIndex++;
      if (currentIndex < sequence.length) {
        setCurrentLetter(sequence[currentIndex]);
      } else {
        clearInterval(timer);
        setTimeout(() => setShowButton(true), 500);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#000000',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            color: 'white',
            margin: 0,
            fontSize: '6.4rem',
            fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
            fontWeight: 'bold',
          }}
        >
          <motion.span
            key={currentLetter}
            initial={{ scale: 0.8, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ display: 'inline-block' }}
          >
            {currentLetter}
          </motion.span>
          nemployment
        </Typography>

        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{
                mt: 7,
                py: 1.5,
                px: 6,
                backgroundColor: 'white',
                color: 'black',
                borderRadius: '18px',
                fontSize: '1.8rem',
                fontWeight: 'bold',
                fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
                textTransform: 'none',
                boxShadow: '0 6px 18px rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 9px 24px rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              Get Started
            </Button>
          </motion.div>
        )}
      </Box>
    </Box>
  );
}

export default App;
