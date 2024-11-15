import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import AdminDashboard from './components/Admin/AdminDashboard/AdminDashboard';
import AdminHeader from './components/Admin/AdminHeader/AdminHeader';
import Footer from './components/Footer/Footer';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Header from './components/User/Header/Header';
import Home from './components/User/Home/Home';
import ManageAcount from './components/User/ManageAcount/ManageAcount';
import AddPost from './components/User/Post/AddPost';
import PostDetail from './components/User/Post/PostDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/AddPost" element={<AddPost />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/managerAc" element={<ManageAcount/>}/>
          <Route path="/admin-dashboard" element={
          <>
            <AdminHeader /> 
            <AdminDashboard /> 
            <Footer /> 
          </>
        } />

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