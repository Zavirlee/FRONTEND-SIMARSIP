import React, { useState, useEffect } from "react";
import { BiHide, BiShow } from "react-icons/bi";
import validator from "validator";
import Icon from "../images/logopolos.png";
import { FiCheckCircle } from "react-icons/fi";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export const UpdateUser = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] =
    useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userData, setUserData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { user_id } = useParams();
  const navigate = useNavigate();

  const handleModalOpen = () => {
    // Close the modal when needed
    setShowModal(true);
  };
  const handleModalClose = () => {
    // Close the modal when needed
    setShowModal(false);
  };

  const validatePassword = (value) => {
    if (
      validator.isStrongPassword(value, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      setPasswordErrorMessage("");
    } else {
      setPasswordErrorMessage("Password Lemah");
    }
  };

  const validateConfirmPassword = (value) => {
    setConfirmPassword(value);

    if (value === password) {
      setConfirmPasswordErrorMessage("");
    } else {
      setConfirmPasswordErrorMessage("Konfirmasi Password Tidak Sama");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get(`token`);
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.post(
          `${process.env.REACT_APP_PATH}/detailUser`,
          {
            user_id,
          }
        );
        setUserData(response.data);
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formTambahUser = new FormData(document.getElementById("updateUser"));

    console.log(formTambahUser);

    const data = {};
    formTambahUser.forEach((value, key) => {
      data[key] = value;
    });

    data["user_id"] = user_id;

    console.log(data);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_PATH}/uppdateUser`,
        {
          data: data,
        }
      );
      console.log(response.data);
      handleModalOpen();
    } catch (error) {
      const errorText = error.response.data;
      console.error("Error:", error);

      if (errorText === "Error: Username yang anda pilih sudah digunakan") {
        alert("Username yang anda pilih sudah digunakan");
      }
    }
  };

  return (
    <div className="container-fluid">
      {userData.map((user) => (
        <div>
          <form id="updateUser">
            <div className="row m-3 p-1 rounded bg-dark">
              <h1 className="text-white text-center">Update User</h1>
            </div>
            <div className="row bg-white m-3 rounded p-4 ">

              <ul>
                <li className="mb-3 row">
                  <label htmlFor="username" className="col-sm-2 col-form-label">
                    Username
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      placeholder="Masukkan Username"
                      defaultValue={user.username}
                    />
                  </div>
                </li>

                <li className="mb-3 row">
                  <label
                    htmlFor="level_user_label"
                    className="col-sm-2 col-form-label"
                  >
                    Role
                  </label>
                  <div className="col-sm-9">
                    <select
                      id="level_user_label"
                      name="level_user_id"
                      className="form-select"
                      style={{ width: "200px" }}
                      aria-label="Default select example"
                      defaultValue={user.level_user_id}
                    >
                      <option selected>Pilih Role</option>
                      <option value="1" selected={user.level_user_id === 1}>
                        Admin
                      </option>
                      <option value="2" selected={user.level_user_id === 2}>
                        Operator
                      </option>
                      <option value="3" selected={user.level_user_id === 3}>
                        Pimpinan
                      </option>
                    </select>
                  </div>
                </li>

                <li className="mb-3 row">
                  <label htmlFor="satkr" className="col-sm-2 col-form-label">
                    Satker
                  </label>
                  <div className="col-sm-9">
                    <input
                      type="text"
                      className="form-control"
                      id="satker"
                      name="satker"
                      placeholder="Masukkan Satker"
                      defaultValue={user.satker}
                    />
                  </div>
                </li>

                <li className="mb-3 row">
                  <label htmlFor="password" className="col-sm-2 col-form-label">
                    Password Baru
                  </label>
                  <div className="col-sm-9">
                    <div className="d-flex justify-content-start align-items-center">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="form-control form-control-md"
                        placeholder="Masukkan Password"
                        value={password}
                        onChange={(e) => validatePassword(e.target.value)}
                      />
                      <span
                        onClick={togglePasswordVisibility}
                        style={{
                          cursor: "pointer",
                          fontWeight: "normal",
                          fontSize: "10px",
                          color: "black",
                          marginLeft: "10px",
                          display: "inline-block",
                          marginTop: "5px",
                        }}
                      >
                        {showPassword ? (
                          <BiShow className="fs-5" />
                        ) : (
                          <BiHide className="fs-5" />
                        )}
                      </span>
                    </div>
                    <span
                      style={{
                        fontWeight: "normal",
                        fontSize: "10px",
                        color: "red",
                        marginTop: "5px",
                        display: "block",
                      }}
                    >
                      {passwordErrorMessage}
                    </span>
                  </div>
                </li>

                <li className="mb-3 row">
                  <label
                    htmlFor="confirmPassword"
                    className="col-sm-2 col-form-label"
                  >
                    Konfirmasi Password
                  </label>
                  <div className="col-sm-9">
                    <div className="d-flex justify-content-start align-items-center">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        className="form-control form-control-md"
                        placeholder="Ulangi Password"
                        value={confirmPassword}
                        onChange={(e) =>
                          validateConfirmPassword(e.target.value)
                        }
                      />
                      <span
                        onClick={toggleConfirmPasswordVisibility}
                        style={{
                          cursor: "pointer",
                          fontWeight: "normal",
                          fontSize: "10px",
                          color: "black",
                          marginLeft: "10px",
                          display: "inline-block",
                          marginTop: "5px",
                        }}
                      >
                        {showConfirmPassword ? (
                          <BiShow className="fs-5" />
                        ) : (
                          <BiHide className="fs-5" />
                        )}
                      </span>
                    </div>
                    <span
                      style={{
                        fontWeight: "normal",
                        fontSize: "10px",
                        color: "red",
                        marginTop: "5px",
                        display: "block",
                      }}
                    >
                      {confirmPasswordErrorMessage}
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="row d-flex flex-column justify-content-between align-items-end">
              <input
                className="col-md-1 me-5 mt-2 mb-2 btn btn-primary"
                type="submit"
                value="Submit"
                onClick={handleSubmit}
              />
            </div>
          </form>
        </div>
      ))}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header d-flex justify-content-between align-items-center">
                <div className="row align-items-center">
                  <div className="col-auto">
                    <img src={Icon} className="logopop" alt="Icon" />
                  </div>
                  <div className="col">
                    <h4 className="modal-title">Sim Arsip</h4>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={handleModalClose}
                ></button>
              </div>
              <div className="modal-body text-center">
                {/* Add your modal content here */}
                <FiCheckCircle className="fs-1 text-success " />
                <h5 className="p-2 m-2">Data User berhasil Di Update</h5>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
