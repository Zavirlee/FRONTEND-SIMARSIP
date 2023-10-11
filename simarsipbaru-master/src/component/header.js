import React from "react";
import { ImSearch } from "react-icons/im";
import { CgProfile } from "react-icons/cg";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import { SearchTable } from "./search";
import { Navigate } from "react-router";
import Cookies from "js-cookie";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { HiUserCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap"; // Import Dropdown dari react-bootstrap

export const Header = () => {
  const [userData, setUserData] = useState([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const user_id = Cookies.get("user_id");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
   //   const token = cookies.get(`token`);
  
  // const checkAuthenticated = async () => {
 
  //   if (token) {
  //     try {
  //       const response = await axios.post(`${process.env.REACT_APP_PATH}/verify`, {
  //         token,
  //       });
  //       console.log(response)
  //       if (response.status === 200) {
  //                 // Redirect to dashboard if authenticated
  //         navigate(`/${Cookies.get('role')}`);
  //       } else {
  //         navigate("/login");
  //       }
  //     } catch (error) {
  //       console.error("Error verifying token:", error);
  //     }
  //   }

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  const handleEdit = (user_id) => {
    try {
      navigate(`/dashboard/updateuser/${Cookies.get("user_id")}`, {
        state: { userData },
      });
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleSignOutklik = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_PATH}/logout`, {
        token: Cookies.get("token"),
        user_id: Cookies.get("user_id")
      });
      console.log(response);
      if (response.data === "Berhasil Logout") {
        const removeAllCookies = () => {
          const cookies = Cookies.get();
          Object.keys(cookies).forEach((cookieName) => {
            Cookies.remove(cookieName);
          });
        };
        removeAllCookies();

        navigate("/");
        window.location.reload()
      }
    } catch (error) {
      console.log("Error ", error);
    }
  };

  // function handleSignOutklik() {
  //   setShowModal(true);
  // }

  const goback = () => {
    const currentPath = window.location.pathname;

    // window.history.back();
    if (currentPath === "/login") {
      // Jika pengguna berada di halaman awal, arahkan mereka ke halaman lain (misalnya, '/dashboard').
      window.location.href = "/dashboard"; // Gantilah '/dashboard' dengan rute yang sesuai.
    } else {
      // Jika pengguna tidak berada di halaman awal, gunakan window.history.back() sekali saja.
      window.history.back();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_PATH}/detailUser`, {
          user_id,
        });
        setUserData(response.data);
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchData();
  }, []);

  return (
    <header className="">
      <div className="row">
        <div className="col-12 col-md-12">
          <div className="row bg-dark d-flex flex-column justify-content-end align-items-end">

            <Dropdown
            show={isDropdownOpen}
            onClick={toggleDropdown}
            className="d-flex col-3 col-md-3  align-items-center rounded-pill justify-content-center m-2"
          >
            <Dropdown.Toggle
              className="p-2 d-flex align-items-center justify-content-center bg-white text-dark text-decoration-none col-12 col-md-12 rounded-pill"
              role="button"
              id="dropdown-basic"
            >
              <CgProfile className="prof" />
              {userData.map((user) => (
                <span className="ms-1 d-none d-md-block" id="username">
                  {user.username}
                </span>
              ))}
            </Dropdown.Toggle>

            <Dropdown.Menu className="p-2 bg-white text-dark col-12 col-md-12">
              <Dropdown.Item className="dropdown-menu-item">
                <div className="row m-0">
                  {userData.map((user) => (
                    <ul className="">
                    <li className="row justify-content-between align-items-center">
                      <HiUserCircle className="fs-1 m-2 col-md-12" />
                      <div className="col-md-12 col-12 text-center border border-dark rounded">
                        <span className="fs-4 m-1"> {user.username}</span>
                      </div>
                    </li>
                    <li className="row justify-content-between align-items-center">
                      <label
                        for="code"
                        className="col-md-5 col-5 col-form-label"
                      >
                        ID
                      </label>
                      <div className="col-md-7">
                        <span className="">: {user.user_id}</span>
                      </div>
                    </li>

                    <li className="row justify-content-between align-items-center">
                      <label
                        for="code"
                        className="col-md-5 col-5 col-form-label"
                      >
                        Role
                      </label>
                      <div className="col-md-7 col-7">
                        <span className="">: {user.level_user_label}</span>
                      </div>
                    </li>
                    <li className="row justify-content-between align-items-center">
                      <label
                        for="code"
                        className="col-md-5 col-5 col-form-label"
                      >
                        Satker
                      </label>
                      <div className="col-md-7 col-7">
                        <span className="">: {user.satker}</span>
                      </div>
                    </li>
                  </ul>
                  ))}
                </div>
              </Dropdown.Item>
              <Dropdown.Item className="dropdown-menu-item d-flex justify-content-end">
                <button className="btn btn-success mx-2" onClick={handleEdit}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={handleSignOutklik}>
                  Keluar
                </button>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          </div>
          <div
            className="row d-flex flex-row bg-white align-items-center justify-content-between p-2"
            role="button"
          >
            <div
              className="col-md-2 col-2 d-flex align-items-center justify-content-start"
              onClick={goback}
            >
              <IoChevronBackCircleSharp className="fs-4 col-12 col-md-2" />
              <span className="p-2 d-none d-md-block fs-5">Kembali</span>
            </div>
            {/* <div className="col-8 col-md-4 pe-3 d-flex align-items-center justify-content-end p-2">
              <SearchTable />
            </div> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
