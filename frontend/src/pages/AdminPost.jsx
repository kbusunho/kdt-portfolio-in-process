// src/pages/AdminPost.jsx
import React from "react";
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

import AdminHeader from "../components/Admin/AdminHeader";
import AdminContact from "../components/Admin/AdminContact";
import "./styles/AdminPost.scss";

const AdminPost = () => {
  return (
    <div className="admin-post">
      <AdminHeader />
      <AdminContact />
    </div>
  );
};

export default AdminPost;
