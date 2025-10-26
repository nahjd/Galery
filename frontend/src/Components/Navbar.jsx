import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RiAdminFill } from "react-icons/ri";

function Navbar() {
  return (
    <div className="container">
      <div className="Navbar">
        <div className="centered-nav">
          <Link to="/admin/login">
            <RiAdminFill style={{ color: "black", fontSize: "30px" }} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
