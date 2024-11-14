import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Header from './components/User/Header/Header';
import Home from './components/User/Home/Home';
import Footer from './components/Footer/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <div className="content-wrapper">
              <Header />
              <Home />
              <Footer />
            </div>
          } />        
        </Routes>
      </div>
    </Router>
  );
}

export default App;