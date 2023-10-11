import React from "react";
import bg from "../images/404.png";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const PageNotFound = () => {
  const navigate = useNavigate()

  const handleDashboard = () => {
    const role = Cookies.get("role");
    if (role === "pimpinan") {
      navigate("/pimpinan");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center min-vh-100">
      <div className="d-flex flex-column align-items-center justify-content-center h-100 error">
        <h1 className="error">404</h1>
        <h1 className="errorText">Page Not Found</h1>
        <button onClick={handleDashboard}>Back To Dashboard</button>
        <img src={bg} alt="bg" className="col-12 col-md-12"></img>
      </div>
    </div>
  );
};

export { PageNotFound };
