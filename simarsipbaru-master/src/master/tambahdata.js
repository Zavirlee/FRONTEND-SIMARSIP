import React, { useEffect, useState } from "react";
import { BiHide, BiShow } from "react-icons/bi";
import validator from "validator";
import Icon from "../images/logopolos.png";
import { FiCheckCircle } from "react-icons/fi";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

export const TambahData = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] =
    useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoleOption, setSelectedRoleOption] = useState("");
  const navigate = useNavigate();

  const { id } = useParams();

  const idToColumnsMapping = {
    "INDEKS KATALOG": [
      "archive_catalog_id",
      "archive_catalog_label",
      "insertCatalog",
      // Add more columns here if needed
    ],
    KONDISI: [
      "archive_condition_id",
      "archive_condition_label",
      "insertCondition",
      // Add more columns here if needed
    ],
    "JENIS ARSIP": [
      "archive_type_id",
      "archive_type_label",
      "insertType",
      // Add more columns here if needed
    ],
    "KELAS ARSIP": [
      "archive_class_id",
      "archive_class_label",
      "insertClassArchive",
      // Add more columns here if needed
    ],
    GEDUNG: [
      "loc_building_id",
      "loc_building_label",
      "insertBuilding",
      // Add more columns here if needed
    ],
    RUANGAN: [
      "loc_room_id",
      "loc_room_label",
      "insertRoom",
      // Add more columns here if needed
    ],
    "ROLL O PACK": [
      "loc_rollopack_id",
      "loc_rollopack_label",
      "insertRollOPack",
      // Add more columns here if needed
    ],
    LEMARI: [
      "loc_cabinet_id",
      "loc_cabinet_label",
      "insertCabinet",
      // Add more columns here if needed
    ],
  };

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
  };

  const handleModalClose = () => {
    // Close the modal when needed
    setShowModal(false);
    // navigate(`/dashboard/master`);
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

    

    const formTambahUser = new FormData(document.getElementById("tambah-label"));

    const data = {};

    for (const [key, value] of formTambahUser.entries()) {
      data[key] = value;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_PATH}/${idToColumnsMapping[id][2]}`,
        {
          data: data,
        }
      );
      console.log(response.data);
      handleModalOpen();
    } catch (error) {
      const errorText = error.response.data;
      console.error("Error:", error);
    }
  };

  return (
    <div className="container-fluid">
      <form id="tambah-label">
        <div className="row bg-white m-3 rounded p-4 ">
          <h3 className="mb-3">Tambah Data</h3>
          <ul>
            <li className="mb-3 row">
              <label htmlFor="label-data" className="col-sm-2 col-form-label">
                Label
              </label>
              <div className="col-sm-9">
                <input
                  type="text"
                  className="form-control"
                  id="label"
                  name="label"
                  placeholder="Masukkan label"
                />
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
                <h5 className="p-2 m-2">Data Baru Berhasil Ditambahkan</h5>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
