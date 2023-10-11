import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Icon from "../images/logopolos.png";
import { FiCheckCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

export const Tambah = () => {
  const navigate = useNavigate();

  const checkAuthenticated = async () => {
    const token = Cookies.get("token");
    if (!token) {
      // Redirect to login if not authenticated
      navigate("/login");
    }
  };

  const [viewPdf, setViewPdf] = useState(null);
  const [catalogValue, setCatalogValue] = useState("");
  const [inputs, setInputs] = React.useState({});
  const [serialNumberValue, setSerialNumberValue] = useState("");
  const [file_numberValue, setFileNumberValue] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const newplugin = defaultLayoutPlugin();
  const [showModal, setShowModal] = useState(false);
  const [catalogOption, setCatalogOption] = useState([]);
  const [selectedCatalogOption, setSelectedCatalogOption] = useState("");
  const [conditionOption, setConditionOption] = useState([]);
  const [selectedConditionOption, setSelectedConditionOption] = useState("");
  const [typeOption, setTypeOption] = useState([]);
  const [selectedTypeOption, setSelectedTypeOption] = useState("");
  const [buildingOption, setBuildingOption] = useState([]);
  const [selectedBuildingOption, setSelectedBuildingOption] = useState("");
  const [classOption, setClassOption] = useState([]);
  const [selectedClassOption, setSelectedClassOption] = useState("");
  const [roomOption, setRoomOption] = useState([]);
  const [selectedRoomOption, setSelectedRoomOption] = useState("");
  const [rollopackOption, setRollopackOption] = useState([]);
  const [selectedRollopackOption, setSelectedRollopackOption] = useState("");
  const [cabinetOption, setCabinetOption] = useState([]);
  const [selectedCabinetOption, setSelectedCabinetOption] = useState("");

  const handleModalOpen = () => {
    // Close the modal when needed
    setShowModal(true);
  };
  const handleModalClose = () => {
    // Close the modal when needed
    setShowModal(false);
    navigate(`/dashboard`);
    document.getElementById("tambah").classList.remove("act");
    document.getElementById("tambah").classList.add("text-white");
  };

  const handleChangePdf = (e) => {
    document.getElementById("pdf-viewer").classList.remove("d-none");
    let selectedFile = e.target.files[0];
    setSelectedFile(e.target.files[0]);
    console.log("selectedFile", selectedFile);
    console.log(selectedFile.size);
    if (selectedFile) {
      if (selectedFile) {
        let reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload = (e) => {
          setViewPdf(e.target.result);
        };
      } else {
        setViewPdf(null);
      }
    } else {
      console.log("Select File");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formDataIdentitas = new FormData(
      document.getElementById("formIdentitas")
    );
    const formDataLokasi = new FormData(document.getElementById("formLokasi"));
    const archive_code = document
      .getElementById("archive_code")
      .textContent.trim()
      .slice(2);

    const data = {};

    data["archive_code"] = archive_code;

    for (const [key, value] of formDataIdentitas.entries()) {
      data[key] = value;
    }

    for (const [key, value] of formDataLokasi.entries()) {
      data[key] = value;
    }

    try {
      // Assuming 'selectedFile' is a Blob representing the PDF file
      if (selectedFile) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64Data = reader.result.split(",")[1];
          // 'base64Data' should be a valid Base64-encoded string
          data["archive_file"] = base64Data;
          console.log("base64 : ", base64Data);
          // Send the 'data' object to the server
          sendDataToServer(data);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        // If no file selected, send the data without 'archive_file'
        sendDataToServer(data);
      }
    } catch (error) {
      const errorText = error.response.data;
      console.log(error.response.data);
      if (errorText === "Cannot Add Archive") {
        alert("Data Tidak boleh dikosongkan");
      } else {
        console.error("Error during form submission:", error);
        // Handle or display the error as needed
      }
    }
  };

  const sendDataToServer = async (data) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_PATH}/addArchive`,
        {
          token: Cookies.get("token"),
          data: data,
        }
      );
      console.log(response.data);
      handleModalOpen();
    } catch (error) {
      const errorText = error.response.data;
      if (error === "ECONNRESET") {
        // Handle ECONNRESET error
        console.error("Connection reset by peer.");
      } else if (errorText === "Cannot Add Archive") {
        alert("Data Tidak boleh dikosongkan");
      } else {
        // Handle other errors
        console.error("An error occurred:", error);
      }
    }
  };

  useEffect(() => {
    document.getElementById("tambah").classList.add("act");
    document.getElementById("tambah").classList.remove("text-white");
    checkAuthenticated();
  }, []);

  useEffect(() => {
    // Fetch data from the database when the component mounts
    axios.post(`${process.env.REACT_APP_PATH}/INDEKS%20KATALOG`) // Replace with your API endpoint
      .then((response) => {
        // Transform the fetched data into the format expected by react-select
        const transformedCatalogOptions = response.data.map((option) => ({
          value: option.archive_catalog_id,
          label: option.archive_catalog_label,
        }));
        setCatalogOption(transformedCatalogOptions);
       
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        console.log(catalogOption)
      });

      axios.post(`${process.env.REACT_APP_PATH}/KONDISI`) // Replace with your API endpoint
      .then((response) => {
        // Transform the fetched data into the format expected by react-select
        const transformedConditionOptions = response.data.map((option) => ({
          value: option.archive_condition_id,
          label: option.archive_condition_label,
        }));
        setConditionOption(transformedConditionOptions);
        
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });

      axios.post(`${process.env.REACT_APP_PATH}/JENIS%20ARSIP`) // Replace with your API endpoint
      .then((response) => {
        // Transform the fetched data into the format expected by react-select
        const transformedTypeOptions = response.data.map((option) => ({
          value: option.archive_type_id,
          label: option.archive_type_label,
        }));
        setTypeOption(transformedTypeOptions);
        
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });

      axios.post(`${process.env.REACT_APP_PATH}/KELAS%20ARSIP`) // Replace with your API endpoint
      .then((response) => {
        // Transform the fetched data into the format expected by react-select
        const transformedClassOptions = response.data.map((option) => ({
          value: option.archive_class_id,
          label: option.archive_class_label,
        }));
        setClassOption(transformedClassOptions);
        
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });

      axios.post(`${process.env.REACT_APP_PATH}/GEDUNG`) // Replace with your API endpoint
      .then((response) => {
        // Transform the fetched data into the format expected by react-select
        const transformedBuildingOptions = response.data.map((option) => ({
          value: option.loc_building_id,
          label: option.loc_building_label,
        }));
        setBuildingOption(transformedBuildingOptions);
        
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });

      axios.post(`${process.env.REACT_APP_PATH}/RUANGAN`) // Replace with your API endpoint
      .then((response) => {
        // Transform the fetched data into the format expected by react-select
        const transformedRoomOptions = response.data.map((option) => ({
          value: option.loc_room_id,
          label: option.loc_room_label,
        }));
        setRoomOption(transformedRoomOptions);
        
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });

      axios.post(`${process.env.REACT_APP_PATH}/ROLL%20O%20PACK`) // Replace with your API endpoint
      .then((response) => {
        // Transform the fetched data into the format expected by react-select
        const transformedRollopackOptions = response.data.map((option) => ({
          value: option.loc_rollopack_id,
          label: option.loc_rollopack_label,
        }));
        setRollopackOption(transformedRollopackOptions);
        
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });

      axios.post(`${process.env.REACT_APP_PATH}/LEMARI`) // Replace with your API endpoint
      .then((response) => {
        // Transform the fetched data into the format expected by react-select
        const transformedCabinetOptions = response.data.map((option) => ({
          value: option.loc_cabinet_id,
          label: option.loc_cabinet_label,
        }));
        setCabinetOption(transformedCabinetOptions);
        
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });



  }, []);

  useEffect(() => {
  generateArchiveCode(); // Call the function when either value changes
}, [catalogValue, serialNumberValue]);

  function generateArchiveCode() {
    const archiveCode = `${catalogValue}/${serialNumberValue}`;
    const archiveCodeElement = document.getElementById("archive_code");
    if (archiveCodeElement) {
      archiveCodeElement.textContent = `${archiveCode}`;
      console.log("Archive Code:", archiveCode);
    }
  }
  


  const handleSelectCatalogChange = (selectedCatalogOption) => {
    setSelectedCatalogOption(selectedCatalogOption);
    setCatalogValue(selectedCatalogOption.value); // Gunakan selectedOption.value untuk mengatur catalogValue
    console.log(catalogValue)
  };

  const handleSelectConditionChange = (selectedConditionOption) => {
    setSelectedConditionOption(selectedConditionOption);
    // setCatalogValue(selectedCatalogOption.value); // Gunakan selectedOption.value untuk mengatur catalogValue
  };

  const handleSelectTypeOptions = (selectedTypeOption) => {
    setSelectedTypeOption(selectedTypeOption);
  };


  const handleSelectClassOptions = (selectedClassOption) => {
    setSelectedClassOption(selectedClassOption);
  };


  const handleSelectBuildingOptions = (selectedBuildingOption) => {
    setSelectedBuildingOption(selectedBuildingOption);
  };

  const handleSelectRoomOptions = (selectedRoomOption) => {
    setSelectedRoomOption(selectedRoomOption);
  };

  const handleSelectRollopackOptions = (selectedRollopackOption) => {
    setSelectedRollopackOption(selectedRollopackOption);
  };

  const handelSelectCabinetOptions = (selectedCabinetOption) => {
    setSelectedCabinetOption(selectedCabinetOption);
  };

  return (
    <div className="container-fluid">
      <div className="row bg-white m-3 rounded p-3 ">
        <h3>A. Identitas</h3>
        <form id="formIdentitas">
          <ul>
            <li className="mb-3 row">
              <label for="archive_code" class="col-sm-2 col-form-label">
                Kode Arsip
              </label>
              <div class="col-sm-9 m-2">
                <span id="archive_code" name="archive_code">
                  :{}
                </span>
              </div>
            </li>
            <li className="mb-3 row">
              <label for="archive_catalog_id" class="col-sm-2 col-form-label">
                Indek Katalog
              </label>
              <div class="col-sm-9">
                <Select
                  id="archive_catalog_id"
                  name="archive_catalog_id"
                  options={catalogOption}
                  value={selectedCatalogOption}
                  onChange={handleSelectCatalogChange}
                  placeholder="Pilih no indeks katalog"
                />
              </div>
            </li>
            <li className="mb-3 row">
              <label
                for="archive_serial_number"
                class="col-sm-2 col-form-label"
              >
                No Buku
              </label>
              <div class="col-sm-3 me-5">
                <input
                  type="number"
                  className="form-control"
                  id="archive_serial_number"
                  name="archive_serial_number"
                  placeholder="masukkan no buku"
                  onInput={(e) => setSerialNumberValue(e.target.value)}
                />
              </div>
              <label
                for="archive_file_number"
                class="col-sm-2 col-form-label ms-4"
              >
                No Berkas
              </label>
              <div class="col-sm-3">
                <input
                  type="text"
                  className="form-control"
                  id="archive_file_number"
                  name="archive_file_number"
                  placeholder="masukkan no berkas"
                />
              </div>
            </li>
            <li className="mb-3 row">
              <label for="archive_title" class="col-sm-2 col-form-label">
                Judul
              </label>
              <div class="col-sm-9">
                <input
                  type="text"
                  className="form-control"
                  id="archive_title"
                  name="archive_title"
                  placeholder="masukkan judul"
                />
              </div>
            </li>
            <li className="mb-3 row">
              <label for="archive_release_date" class="col-sm-2 col-form-label">
                Tanggal Surat
              </label>
              <div class="col-sm-3">
                <input
                  type="date"
                  className="form-control"
                  id="archive_release_date"
                  name="archive_release_date"
                  placeholder="masukkan judul"
                />
              </div>
            </li>
            <li className="mb-3 row">
              <label for="archive_condition_id" class="col-sm-2 col-form-label">
                Kondisi Arsip
              </label>
              <div class="col-sm-9">
                <Select
                  id="archive_condition_id"
                  name="archive_condition_id"
                  options={conditionOption}
                  value={selectedConditionOption}
                  onChange={handleSelectConditionChange}
                  placeholder="Pilih Kondisi Arsip"
                />
              </div>
            </li>
            <li className="mb-3 row">
              <label for="archive_type_id" class="col-sm-2 col-form-label">
                Jenis Arsip
              </label>
              <div class="col-sm-9">
                <Select
                  id="archive_type_id"
                  name="archive_type_id"
                  options={typeOption}
                  Value={selectedTypeOption}
                  onChange={handleSelectTypeOptions}
                  placeholder="Pilih Jenis Arsip"
                />
              </div>
            </li>
            <li className="mb-3 row">
              <label for="archive_class_id" class="col-sm-2 col-form-label">
                Kelas Arsip
              </label>
              <div class="col-sm-9">
                <Select
                  id="archive_class_id"
                  name="archive_class_id"
                  options={classOption}
                  Value={selectedClassOption}
                  onChange={handleSelectClassOptions}
                  placeholder="Pilih kelas arsip"
                />
              </div>
            </li>
            <li className="mb-3 row">
              <label for="archive_agency" class="col-sm-2 col-form-label">
                Asal Instansi
              </label>
              <div class="col-sm-9">
                <input
                  type="text"
                  className="form-control"
                  id="archive_agency"
                  name="archive_agency"
                  placeholder="Masukkan Instansi"
                />
              </div>
            </li>
          </ul>
        </form>
      </div>
      <div className="row bg-white m-3 rounded p-3 ">
        <h3>B. Lokasi</h3>
        <form id="formLokasi">
          <ul>
            <li className="mb-3 row">
              <label
                for="archive_loc_building_id"
                class="col-sm-2 col-form-label"
              >
                Gedung
              </label>
              <div class="col-sm-3">
                <Select
                  id="archive_loc_building_id"
                  name="archive_loc_building_id"
                  options={buildingOption}
                  Value={selectedBuildingOption}
                  onChange={handleSelectBuildingOptions}
                  placeholder="Pilih Gedung"
                />
              </div>
              <label
                for="archive_loc_room_id"
                class="col-sm-2 col-form-label ms-4"
              >
                Ruang
              </label>
              <div class="col-sm-3">
                <Select
                  id="archive_loc_room_id"
                  name="archive_loc_room_id"
                  options={roomOption}
                  Value={selectedRoomOption}
                  onChange={handleSelectRoomOptions}
                  placeholder="Pilih Ruang"
                />
              </div>
            </li>
            <li className="mb-3 row">
              <label
                for="archive_loc_rollopack_id"
                class="col-sm-2 col-form-label"
              >
                Roll O Pack
              </label>
              <div class="col-sm-9">
                <Select
                  id="archive_loc_rollopack_id"
                  name="archive_loc_rollopack_id"
                  options={rollopackOption}
                  Value={selectedRollopackOption}
                  onChange={handleSelectRollopackOptions}
                  placeholder="Pilih roll o pack"
                />
              </div>
            </li>
            <li className="mb-3 row">
              <label for="archive_loc_cabinet" class="col-sm-2 col-form-label">
                Lemari
              </label>
              <div class="col-sm-9">
                <Select
                  id="archive_loc_cabinet"
                  name="archive_loc_cabinet"
                  options={cabinetOption}
                  Value={selectedCabinetOption}
                  onChange={handelSelectCabinetOptions}
                  placeholder="Pilih Lemari"
                />
              </div>
            </li>
            <li className="mb-3 row">
              <label for="archive_loc_rack" class="col-sm-2 col-form-label">
                Rak
              </label>
              <div class="col-sm-9">
                <input
                  type="text"
                  className="form-control"
                  id="archive_loc_rack"
                  name="archive_loc_rack"
                  placeholder="Masukkan Rak"
                />
              </div>
            </li>
            <li className="mb-3 row">
              <label for="archive_loc_box" class="col-sm-2 col-form-label">
                Box
              </label>
              <div class="col-sm-9">
                <input
                  type="text"
                  className="form-control"
                  id="archive_loc_box"
                  name="archive_loc_box"
                  placeholder="Masukkan Box"
                />
              </div>
            </li>
          </ul>
        </form>
        <div>
          <form id="scan">
            <ul>
              <li className="mb-3 row">
                <label for="scan" class="col-sm-2 col-form-label">
                  File Scan
                </label>
                <div class="col-sm-9">
                  <input
                    onChange={handleChangePdf}
                    type="file"
                    className="form-control"
                    id="scan"
                    name="scan"
                    placeholder="Pilih File"
                    accept=".pdf"
                  />
                </div>
              </li>
              <li className="mb-3 row justify-content-center align-items-center">
                <div className="pdf-view d-none col-sm-9 " id="pdf-viewer">
                  <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
                    {viewPdf && (
                      <>
                        <div className="view">
                          <Viewer fileUrl={viewPdf} plugins={[newplugin]} />
                        </div>
                      </>
                    )}
                    {!viewPdf && <></>}
                  </Worker>
                </div>
              </li>
            </ul>
          </form>
        </div>
      </div>

      <div className="row d-flex flex-column justify-content-between align-items-end">
        <input
          class="col-md-1 col-3 me-5 mt-2 mb-2 btn btn-primary"
          type="submit"
          onClick={handleSubmit}
          value="Submit"
        />
      </div>
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
                <h5 className="p-2 m-2">Arsip Berhasil Ditambahkan</h5>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
