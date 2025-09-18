// src/pages/AdminPost.jsx
import React from "react";

import AdminContact from "../components/admin/AdminContact";
import AdminHeader from "../components/admin/AdminHeader";
import "./styles/AdminPost.scss"
const AdminPost = () => {


  return (
    <div className="admin-container">

      <AdminHeader/>
      <AdminContact/>

    </div>
  );
};

export default AdminPost;