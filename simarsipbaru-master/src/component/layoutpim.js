import { Outlet } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { AiFillHome } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Dropdown } from "react-bootstrap"; // Import Dropdown dari react-bootstrap
import Icon from "../images/logopolos.png";
import Cookies from "js-cookie";
import axios from "axios";
import { useEffect } from "react";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import { HiUserCircle } from "react-icons/hi";

function Layoutpim() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const user_id = Cookies.get("user_id");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get(`token`)
        if (!token){
          navigate("/login")
          return
        }
        
        const response = await axios.post(`${process.env.REACT_APP_PATH}/detailUser`, {
          user_id,
        });
        setUserData(response.data);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchData();
  }, []);

  function handleHome() {
    navigate("/pimpinan");
  }
  function handleSignOutklik() {
    setShowModal(true);
  }
  const handleModal = () => {
    // Close the modal when needed
    setShowModal(false);
  };
  const handleLogout = async () => {
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

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  const goback = () => {
    const currentPath = window.location.pathname;

    // window.history.back();
    if (currentPath === "/login") {
      // Jika pengguna berada di halaman awal, arahkan mereka ke halaman lain (misalnya, '/dashboard').
      window.location.href = "/pimpinan"; // Gantilah '/dashboard' dengan rute yang sesuai.
    } else {
      // Jika pengguna tidak berada di halaman awal, gunakan window.history.back() sekali saja.
      window.history.back();
    }
  };
  const handleEdit = (user_id) => {
    try {
      navigate(`/pimpinan/updateuser/${Cookies.get("user_id")}`, {
        state: { userData },
      });
    } catch (error) {
      console.log("Error", error);
    }
  };
  return (
    <div id="pimpinan" className="container-fluid min-vh-100">
      <div className="row d-flex bg-dark">
        <div className="container d-flex justify-content-between align-items-center py-3">
          <div
            className="col-md-3 col-3 d-flex align-items-center justify-content-start text-white"
            
          >
            <IoChevronBackCircleSharp
              className="fs-1 col-3 col-md-3"
              onClick={goback}
              role="button"
            />
            <span className="fs-2 ms-2" onClick={handleHome} role="button">
              SIM ARSIP
            </span>
          </div>
          {/* <div className="d-flex col-3 col-md-3 bg-white rounded-pill justify-content-center m-2"> */}
          <Dropdown
            show={isDropdownOpen}
            onClick={toggleDropdown}
            className="d-flex col-3 col-md-3 bg-white align-items-center rounded-pill justify-content-center m-2"
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
          {/* </div> */}
        </div>
        {showModal && (
          <div className="modal d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content text-dark">
                <div className="modal-header">
                  <div className="row align-items-center">
                    <div className="col-auto">
                      <img src={Icon} className="logopop" alt="Icon" />
                    </div>
                    <div className="col">
                      <h5 className="modal-title">Peringatan</h5>
                    </div>
                  </div>
                </div>
                <div className="modal-body">
                  {/* Add your modal content here */}
                  <h6>Anda yakin untuk keluar?</h6>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleModal}
                  >
                    Tidak
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleLogout}
                  >
                    Ya
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="row d-flex justify-content-center align-items-center">
        <Outlet />
      </div>
    </div>
  );
}

export default Layoutpim;
