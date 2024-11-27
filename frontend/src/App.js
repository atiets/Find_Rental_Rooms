import { useSelector } from 'react-redux';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import AdminDashboard from './components/Admin/AdminDashboard/AdminDashboard';
import AdminHeader from './components/Admin/AdminHeader/AdminHeader';
import ManageUsers from './components/Admin/ManageUsers/ManageUsers';
import UserPosts from './components/Admin/ManageUsers/UserPosts';
import Footer from './components/Footer/Footer';
import ForgotPassword from './components/ForgotPassword/ForgotPassword ';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import ResetPassword from './components/ResetPassword/ResetPassword';
import Header from './components/User/Header/Header';
import Home from './components/User/Home/Home';
import ManageAcount from './components/User/ManageAcount/ManageAcount';
import AddPost from './components/User/Post/AddPost';
import PostDetail from './components/User/Post/PostDetail';
import ManagePostAdmin from './components/Admin/AdminDashboard/ManagePostAdmin';

function App() {
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route path="/AddPost" element={
            <>
              <Header />
              <AddPost/>
            </>} />
            <Route path="/posts/:id" element={
            <>
              {currentUser?.admin ? <AdminHeader /> : <Header />}
              <PostDetail />
              <Footer/>
            </>} 
          />
          <Route path="/managerAc" element={<ManageAcount />} />
          <Route path="/admin-dashboard" element={
            <>
              <AdminHeader />
              <AdminDashboard />
              <Footer />
            </>
          } />
          <Route path="/admin-dashboard" element={
            <>
              <AdminHeader />
              <AdminDashboard />
              <Footer />
            </>
          } />

          <Route path="/manage-posts" element={
            <>
              <AdminHeader />
              <ManagePostAdmin />
              <Footer />
            </>
          } />

          <Route path="/user-posts/:userId" element={
            <>
              <AdminHeader />
              <UserPosts />
              <Footer/>
            </>
          } />
          <Route path="/manage-users" element={
            <>
              <AdminHeader />
              <ManageUsers />
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