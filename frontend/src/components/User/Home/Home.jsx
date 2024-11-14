import { useState } from 'react';
import './Home.css';

const Home = () => {
  const [user, setUser] = useState(null); 

  const handleLogout = () => {
    setUser(null); 
  };

  return (
    <div className="home-container">
      {user ? (
        <>
          <p>Hello, {user}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : null} 
    </div>
  );
};

export default Home;