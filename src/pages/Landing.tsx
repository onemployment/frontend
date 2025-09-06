import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

function Landing() {
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const u = localStorage.getItem('onemployment:username');
    setUsername(u);
  }, []);

  const logout = () => {
    localStorage.removeItem('onemployment:username');
    navigate('/login');
  };

  return (
    <div className="Landing">
      <header className="landing-header">
        <div className="brand">Onemployment</div>
        <div className="header-right">
          {username ? (
            <span className="welcome">Welcome {username}</span>
          ) : null}
          <button className="logout-btn" onClick={logout}>
            Log out
          </button>
        </div>
      </header>
      <main className="landing-content">{/* Future content goes here */}</main>
    </div>
  );
}

export default Landing;
