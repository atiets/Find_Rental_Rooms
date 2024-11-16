import React, { useState } from "react";
import { useSelector } from "react-redux";
import Footer from "../../Footer/Footer";
import Header from "../Header/Header";
import AddPost from "../Post/AddPost";
import './ManageAcount.css';
import Sidebar from "./Sidebar";
import ListUserPost from "./listUserPost";

const ManageAcount = () => {
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  console.log("info-user", currentUser);
  const [selectedMenu, setSelectedMenu] = useState('manageAccount');

  const renderContent = () => {
    switch (selectedMenu) {
      case 'newPost':
        return <AddPost/>;
      case 'postList':
        return <ListUserPost/>;
      case 'manageAccount':
        return <div>Quản lý tài khoản</div>;
      default:
        return <div>Quản lý tài khoản</div>;
    }
  };

  return (
    <div className="manageAcount-container">
      <Header />
      <div className="container-body">
        <Sidebar user={currentUser} setSelectedMenu={setSelectedMenu} />
        <div className="content">
          {renderContent()}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ManageAcount;