import { useEffect, useState } from 'react';
import ListPostHome from '../Post/ListPostHome';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import './Home.css';

const Home = () => {
  const [user, setUser] = useState(null); 
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.login.currentUser);

  useEffect(() => {
    console.log("Current User:", currentUser);
    if (currentUser && currentUser.admin !== undefined) {
        if (currentUser.admin === true) {
            navigate("/admin-dashboard");
        } else {
            navigate("/");
        }
    }
}, [currentUser, navigate]);

  const handleLogout = () => {
    setUser(null); 
  };

  return (
    <div className="home-container">
      <ListPostHome/>
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