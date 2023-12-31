import React, { useEffect, useState } from "react";
import { BiHide, BiShow } from "react-icons/bi";
import validator from "validator";
import Icon from "../images/logopolos.png";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";


export const TambahData = () => {
  const [showModal, setShowModal] = useState(false);
  const [showModalAda, setShowModalAda] = useState(false);
  const [showModalGagal, setShowModalGagal] = useState(false);
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
    setTimeout(() => {
      setShowModal(false);
      navigate(`/dashboard/master/detailtabel/${id}`);
      window.location.reload();
    }, 2000);
  };

  const handleModalClose = () => {
    // Close the modal when needed
    setShowModal(false);
    navigate(`/dashboard/master/detailtabel/${id}`);
    window.location.reload();
  };
  const handleModalAdaOpen = () => {
    setShowModalAda(true);

  };
  const handleModalAdaClose = () => {
    setShowModalAda(false);

  };
  const handleModalGagalOpen = () => {
    setShowModalGagal(true);

  };
  const handleModalGagalClose = () => {
    setShowModalGagal(false);

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
          ip: Cookies.get("ip"),
          token: Cookies.get("token"),
          data: data,
        }
      );
      console.log(response.data);
      handleModalOpen();
    } catch (error) {
      const errorText = error.response.data;
      
      if (errorText === "Error: Data yang anda masukkan sudah ada") {
        handleModalAdaOpen()
      } else if (errorText === "Error: Tambah data Gagal"){
        handleModalGagalOpen()
      }
      else {
        console.error("Error:", error);
      }

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
      {showModalAda && (
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
                  onClick={handleModalAdaClose}
                ></button>
              </div>
              <div className="modal-body text-center">
                {/* Add your modal content here */}
                <FiXCircle className="fs-1 text-danger " />
                <h5 className="p-2 m-2">Data Sudah Ada</h5>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModalGagal && (
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
                  onClick={handleModalGagalClose}
                ></button>
              </div>
              <div className="modal-body text-center">
                {/* Add your modal content here */}
                <FiXCircle className="fs-1 text-danger " />
                <h5 className="p-2 m-2">Data Gagal ditambahkan</h5>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
