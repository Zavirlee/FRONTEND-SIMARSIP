import React, { useEffect, useState } from "react";
import { BiHide, BiShow } from "react-icons/bi";
import validator from "validator";
import Icon from "../images/logopolos.png";
import { FiCheckCircle } from "react-icons/fi";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

export const TambahUser = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoleOption, setSelectedRoleOption] = useState("");
  const navigate = useNavigate();

  const checkAuthenticated = async () => {
    const token = Cookies.get("token");
    if (!token) {
      // Redirect to login if not authenticated
      navigate("/login");
    }
  };

  useEffect(() => {
    checkAuthenticated();
  }, []);

  const handleModalOpen = () => {
    // Open the modal when needed
    setShowModal(true);
    
    setTimeout(() => {
      setShowModal(false);
      navigate(`/dashboard/user`);
      // window.location.reload();
    }, 2000);
  };

  const handleModalClose = () => {
    // Close the modal when needed
    setShowModal(false);
        navigate(`/dashboard/user`);
    window.location.reload();
  };

  const validatePassword = (value) => {
    setPassword(value);

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
  const selectRoleOptions = [
    { value: "1", label: "Admin" },
    { value: "2", label: "Operator" },
    { value: "3", label: "Pimpinan" },
  ];
  const handleSelectRoleChange = (selectedRoleOption) => {
    setSelectedRoleOption(selectedRoleOption);
    // setCatalogValue(selectedCatalogOption.value); // Gunakan selectedOption.value untuk mengatur catalogValue
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formTambahUser = new FormData(document.getElementById("tambahUser"));

    const data = {};

    for (const [key, value] of formTambahUser.entries()) {
      data[key] = value;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_PATH}/createUser`, {
        ip: Cookies.get("ip"),
        token: Cookies.get("token"),
        data: data,
      });
      console.log(response.data);
      handleModalOpen();
    } catch (error) {
      const errorText = error.response.data;
      console.error("Error:", error);

      if (errorText === "Error: Username yang anda pilih sudah digunakan"){
        alert("Username yang anda pilih sudah digunakan");
      }
    }
  };

  return (
    <div className="container-fluid">
      <form id="tambahUser">
        <div className="row bg-white m-3 rounded p-4 ">
          <h3 className="mb-3">Tambah User</h3>
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
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                <Select
                  id="level_user"
                  name="level_user_id"
                  options={selectRoleOptions}
                  value={selectedRoleOption}
                  onChange={handleSelectRoleChange}
                  placeholder="Pilih Role User
                  .;."
                />
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
                />
              </div>
            </li>

            <li className="mb-3 row">
              <label htmlFor="password" className="col-sm-2 col-form-label">
                Password
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
                    onChange={(e) => validateConfirmPassword(e.target.value)}
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
                <h5 className="p-2 m-2">User Baru Berhasil Ditambahkan</h5>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
