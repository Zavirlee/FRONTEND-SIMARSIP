import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import * as React from "react";
import { useEffect, useState, useRef } from "react";
import Icon from "../images/logopolos.png";
import { FiCheckCircle } from "react-icons/fi";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Select from "react-select";

export const Update = () => {
  const [viewPdf, setViewPdf] = useState(null);
  const [catalogValue, setCatalogValue] = useState("");
  const [serialNumberValue, setSerialNumberValue] = useState("");
  const newplugin = defaultLayoutPlugin();
  const [selectedFile, setSelectedFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [archiveData, setArchiveData] = useState([]);
  const [archiveDataupdate, setArchiveDataUpdate] = useState([]);
  const [archiveDataFiks, setArchiveDataFiks] = useState([]);
  const { archive_id } = useParams();
  const navigate = useNavigate();
  const [catalogOption, setCatalogOption] = useState([]);
  const [conditionOption, setConditionOption] = useState([]);
  const [typeOption, setTypeOption] = useState([]);
  const [buildingOption, setBuildingOption] = useState([]);
  const [classOption, setClassOption] = useState([]);
  const [roomOption, setRoomOption] = useState([]);
  const [rollopackOption, setRollopackOption] = useState([]);
  const [cabinetOption, setCabinetOption] = useState([]);
  const [archiveFileName, setArchiveFileName] = useState(null);
  const inputFileRef = useRef(null);

  const archiveFileNameRef = useRef(null);

  const handleModalOpen = () => {
    // Close the modal when needed
    setShowModal(true);
  };
  const handleModalClose = () => {
    // Close the modal when needed
    setShowModal(false);
    navigate(`/dashboard`);
  };

  const handleChangePdf = (e) => {
    document.getElementById("pdf-viewer").classList.remove("d-none");
    let selectedFile = e.target.files[0];
    console.log(selectedFile.size);
    if (selectedFile) {
      let reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = (e) => {
        setViewPdf(e.target.result);
      };
    } else {
      setViewPdf(null);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setArchiveDataUpdate((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log(archiveDataupdate);
  };

  const handleSubmit = async () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result.split(",")[1];
        // 'base64Data' should be a valid Base64-encoded string
        setArchiveDataUpdate((prevData) => ({
          ...prevData,
          archive_file: base64Data,
        }));
        console.log("base64 : ", base64Data);
        // Send the 'archiveDataUpdate' object to the server
        sendDataToServer(archiveDataupdate);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // If no file selected, send the 'archiveDataUpdate' without 'archive_file'
      sendDataToServer(archiveDataupdate);
    }
    console.log(archiveDataupdate);
    // sendDataToServer(archiveDataupdate);
  };

  const sendDataToServer = async (archiveDataupdate) => {
    try {
      archiveDataupdate["archive_id"] = archive_id;
      const response = await axios.post(
        `${process.env.REACT_APP_PATH}/updateArchive`,
        {
          token: Cookies.get("token"),
          data: archiveDataupdate,
        }
      );

      console.log(response.data);
      handleModalOpen();
    } catch (error) {
      if (error === "ECONNRESET") {
        // Handle ECONNRESET error
        console.error("Connection reset by peer.");
      } else {
        // Handle other errors
        console.error("An error occurred:", error);
      }
    }
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
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_PATH}/archiveDetail`,
          { archive_id }
        );
        const archivedata = response.data;
        const { archive_file } = response.data[0];
        const { archive_title } = response.data[0];

        archiveFileNameRef.current = archive_title;

        const uint8Array = new Uint8Array(archive_file.data);
        const base64Data = uint8Array.reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        );

        const url = `data:application/pdf;base64,${base64Data}`;

        setArchiveData(archivedata);
        setArchiveFileName(archive_title);
        setViewPdf(url);
      } catch (error) {
        console.log("Error", error);
      }
    };
    if (!archiveData.length) {
      fetchData();
    }
  }, [archiveData]);
  useEffect(() => {
    // Fetch data from the database when the component mounts
    axios
      .post(`${process.env.REACT_APP_PATH}/INDEKS%20KATALOG`) // Replace with your API endpoint
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
        console.log(catalogOption);
      });

    axios
      .post(`${process.env.REACT_APP_PATH}/KONDISI`) // Replace with your API endpoint
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

    axios
      .post(`${process.env.REACT_APP_PATH}/JENIS%20ARSIP`) // Replace with your API endpoint
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

    axios
      .post(`${process.env.REACT_APP_PATH}/KELAS%20ARSIP`) // Replace with your API endpoint
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

    axios
      .post(`${process.env.REACT_APP_PATH}/GEDUNG`) // Replace with your API endpoint
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

    axios
      .post(`${process.env.REACT_APP_PATH}/RUANGAN`) // Replace with your API endpoint
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

    axios
      .post(`${process.env.REACT_APP_PATH}/ROLL%20O%20PACK`) // Replace with your API endpoint
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

    axios
      .post(`${process.env.REACT_APP_PATH}/LEMARI`) // Replace with your API endpoint
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
    generateArchiveCode();
    document.getElementById("dash").classList.remove("act");
    document.getElementById("dash").classList.add("text-white");
  }, [catalogValue, serialNumberValue]);

  function generateArchiveCode() {
    const archiveCode = `${catalogValue}/${serialNumberValue}`;
    const archiveCodeElement = document.getElementById("archive_code");
    if (archiveCodeElement) {
      archiveCodeElement.textContent = `${archiveCode}`;
      console.log("Archive Code:", archiveCode);
    }
  }

  return (
    <div className="container-fluid">
      {archiveData.map((archive) => (
        <div>
          <div className="row m-3 p-1 rounded bg-dark">
            <h1 className="text-white text-center">Update Arsip</h1>
          </div>
          <div className="row bg-white m-3 rounded p-3 ">
            <h3>A. Identitas</h3>
            <form id="formIdentitas">
              <ul>
                <li className="mb-3 row">
                  <label for="archive_code" class="col-sm-2 col-form-label">
                    Kode Arsip
                  </label>
                  <div class="col-sm-9 m-2">
                    <span
                      id="archive_code"
                      name="archive_code"
                      defaultValue={archive.archive_code}
                      onChange={handleChange}
                    ></span>
                  </div>
                </li>
                <li className="mb-3 row">
                  <label
                    for="archive_catalog_id"
                    class="col-sm-2 col-form-label"
                  >
                    Indeks Katalog
                  </label>
                  <div class="col-sm-9">
                    <Select
                      id="archive_catalog_id"
                      name="archive_catalog_id"
                      options={catalogOption}
                      defaultValue={{
                        value: archive.archive_catalog_id,
                        label: archive.archive_catalog_label,
                      }}
                      onChange={
                        // (e) => {
                        //   handleSelectCatalogChange(e);
                        // }
                        (selectedOption) => {
                          handleChange({
                            target: {
                              name: "archive_catalog_id",
                              value: selectedOption.value,
                            },
                          });
                          setCatalogValue(selectedOption.value);
                        }
                        // handleChange(e);
                      }
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
                  <div class="col-sm-3 ">
                    <input
                      type="number"
                      className="form-control"
                      id="archive_serial_number"
                      name="archive_serial_number"
                      placeholder="masukkan no buku"
                      defaultValue={archive.archive_serial_number}
                      onInput={(e) => setSerialNumberValue(e.target.value)}
                      onChange={(e) => setSerialNumberValue(e.target.value)}
                    />
                  </div>
                  <label
                    for="archive_file_number"
                    class="col-sm-2 col-form-label "
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
                      defaultValue={archive.archive_file_number}
                      onChange={handleChange}
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
                      defaultValue={archive.archive_title}
                      onChange={handleChange}
                    />
                  </div>
                </li>
                <li className="mb-3 row">
                  <label
                    for="archive_release_date"
                    class="col-sm-2 col-form-label"
                  >
                    Tanggal Surat
                  </label>
                  <div class="col-sm-3">
                    <input
                      type="date"
                      className="form-control"
                      id="archive_release_date"
                      name="archive_release_date"
                      placeholder="masukkan judul"
                      defaultValue={archive.archive_release_date}
                      onChange={handleChange}
                    />
                  </div>
                </li>
                <li className="mb-3 row">
                  <label
                    for="archive_condition_id"
                    class="col-sm-2 col-form-label"
                  >
                    Kondisi Arsip
                  </label>
                  <div class="col-sm-9">
                    <Select
                      id="archive_condition_id"
                      name="archive_condition_id"
                      options={conditionOption}
                      defaultValue={{
                        value: archive.archive_condition_id,
                        label: archive.archive_condition_label,
                      }}
                      onChange={
                        //   (e) => {
                        //   handleSelectConditionChange(e);
                        // }
                        (selectedOption) => {
                          handleChange({
                            target: {
                              name: "archive_condition_id",
                              value: selectedOption.value,
                            },
                          });
                        }
                      }
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
                      defaultValue={{
                        value: archive.archive_type_id,
                        label: archive.archive_type_label,
                      }}
                      onChange={
                        //   (e) => {
                        //   handleSelectTypeOptions(e);
                        // }
                        (selectedOption) => {
                          handleChange({
                            target: {
                              name: "archive_type_id",
                              value: selectedOption.value,
                            },
                          });
                        }
                      }
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
                      defaultValue={{
                        value: archive.archive_class_id,
                        label: archive.archive_class_label,
                      }}
                      onChange={
                        //   (e) => {
                        //   handleSelectClassOptions(e);
                        // }
                        (selectedOption) => {
                          handleChange({
                            target: {
                              name: "archive_class_id",
                              value: selectedOption.value,
                            },
                          });
                        }
                      }
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
                      defaultValue={archive.archive_agency}
                      onChange={handleChange}
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
                      defaultValue={{
                        value: archive.archive_loc_building_id,
                        label: archive.loc_building_label,
                      }}
                      onChange={
                        //   (e) => {
                        //   handleSelectBuildingOptions(e);
                        // }
                        (selectedOption) => {
                          handleChange({
                            target: {
                              name: "archive_loc_building_id",
                              value: selectedOption.value,
                            },
                          });
                        }
                      }
                      placeholder="Pilih Gedung"
                    />
                  </div>
                  <label
                    for="archive_loc_room_id"
                    class="col-sm-2 col-form-label "
                  >
                    Ruang
                  </label>
                  <div class="col-sm-3">
                    <Select
                      id="archive_loc_room_id"
                      name="archive_loc_room_id"
                      options={roomOption}
                      defaultValue={{
                        value: archive.archive_loc_room_id,
                        label: archive.loc_room_label,
                      }}
                      onChange={
                        //   (e) => {
                        //   handleSelectRoomOptions(e);
                        // }
                        (selectedOption) => {
                          handleChange({
                            target: {
                              name: "archive_loc_room_id",
                              value: selectedOption.value,
                            },
                          });
                        }
                      }
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
                      defaultValue={{
                        value: archive.archive_loc_rollopack_id,
                        label: archive.loc_rollopack_label,
                      }}
                      onChange={
                        //   (e) => {
                        //   handleSelectRollopackOptions(e);
                        // }
                        (selectedOption) => {
                          handleChange({
                            target: {
                              name: "archive_loc_rollopack_id",
                              value: selectedOption.value,
                            },
                          });
                        }
                      }
                      placeholder="Pilih roll o pack"
                    />
                  </div>
                </li>
                <li className="mb-3 row">
                  <label
                    for="archive_loc_cabinet"
                    class="col-sm-2 col-form-label"
                  >
                    Lemari
                  </label>
                  <div class="col-sm-9">
                    <Select
                      id="archive_loc_cabinet"
                      name="archive_loc_cabinet"
                      options={cabinetOption}
                      defaultValue={{
                        value: archive.archive_loc_cabinet_id,
                        label: archive.loc_cabinet_label,
                      }}
                      onChange={
                        //   (e) => {
                        //   handleSelectCabinetOptions(e);
                        // }
                        (selectedOption) => {
                          handleChange({
                            target: {
                              name: "archive_loc_cabinet_id",
                              value: selectedOption.value,
                            },
                          });
                        }
                      }
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
                      defaultValue={archive.archive_loc_rack}
                      onChange={handleChange}
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
                      defaultValue={archive.archive_loc_box}
                      onChange={handleChange}
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
                        id="archive_file"
                        name="archive_file"
                        placeholder="Pilih File"
                        accept=".pdf"
                        ref={inputFileRef}
                      />
                    </div>
                  </li>
                  <li className="mb-3 row justify-content-center align-items-center">
                    <div className="pdf-view  col-sm-9 " id="pdf-viewer">
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
              value="Submit"
              onClick={handleSubmit}
            />
          </div>
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
                <h5 className="p-2 m-2">Arsip Berhasil Di Update</h5>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
