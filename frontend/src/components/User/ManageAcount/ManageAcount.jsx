import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Footer from "../../Footer/Footer";
import Header from "../Header/Header";
import AddPost from "../Post/AddPost";
import "./ManageAcount.css";
import Sidebar from "./Sidebar";
import ListUserPost from "./listUserPost";
import UserProfile from "./UserProfile";
import { updateProfilePicture } from "../../../redux/authSlice";

const ManageAcount = () => {
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const [selectedMenu, setSelectedMenu] = useState("manageAccount");
  const dispatch = useDispatch();

  const renderContent = () => {
    switch (selectedMenu) {
      case "newPost":
        return <AddPost />;
      case "postList":
        return <ListUserPost />;
      case "manageAccount":
        return <UserProfile />;
      default:
        return <div>Không tìm thấy nội dung</div>;
    }
  };

  return (
    <div className="manageAcount-container">
      <Header />
      <div className="container-body">
        <Sidebar
          user={currentUser}
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
          updateProfilePicture={(newPicture) => dispatch(updateProfilePicture(newPicture))}
        />
        <div className="content">{renderContent()}</div>
      </div>
      <Footer />
    </div>
  );
};

export default ManageAcount;
