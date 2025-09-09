import { useNavigate } from 'react-router-dom';
import { useStore } from 'react-redux';
import type { RootState } from '../store';
import { useLogoutMutation } from '../store/apiSlice';
import { createLandingBindings } from './landingBindings';
import './Landing.css';

function Landing() {
  const navigate = useNavigate();
  const store = useStore<RootState>();
  const [logoutMutation] = useLogoutMutation();

  const { currentUser, handleLogout } = createLandingBindings({
    getState: () => store.getState(),
    logout: () => logoutMutation().unwrap(),
    navigate,
  });

  return (
    <div className="Landing">
      <header className="landing-header">
        <div className="brand">onemployment</div>
        <div className="header-right">
          {currentUser ? (
            <span className="welcome">Welcome {currentUser.username}</span>
          ) : null}
          <button className="logout-btn" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </header>
      <main className="landing-content">{/* Future content goes here */}</main>
    </div>
  );
}

export default Landing;
