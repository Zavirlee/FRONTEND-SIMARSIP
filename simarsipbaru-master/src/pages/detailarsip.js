import { Viewer, Worker, OpenFile } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/toolbar/lib/styles/index.css";
import { BsPlusSquare } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { BiSolidDownload } from "react-icons/bi";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import { getFilePlugin } from "@react-pdf-viewer/get-file";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";

const cookies = new Cookies();

export const Detail = () => {
  const [archiveData, setArchiveData] = useState([]);
  const { archive_id } = useParams();
  const [viewPdf, setViewPdf] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [archiveFileName, setArchiveFileName] = useState(null);

  const archiveFileNameRef = useRef(null);

  const navigate = useNavigate();

  const checkAuthenticated = async () => {
    const token = cookies.get("token");
    if (!token) {
      // Redirect to login if not authenticated
      navigate("/login");
    }
  };

  const nonActiveButton = async () => {
    const buttonupdate = document.getElementById("buttonupdate")
    if (buttonupdate && cookies.get(`role`) === "pimpinan") {
      buttonupdate.classList.add("d-none");
    }
    
  }
  const formatTimestamp = (timestamp) => {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
  
      return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };
  const formatTimestampRelease = (timestamp) => {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      // const minutes = date.getMinutes().toString().padStart(2, '0');
      // const seconds = date.getSeconds().toString().padStart(2, '0');
  
      return `${day}-${month}-${year} `;
  };
  
  

  useEffect(() => {
    nonActiveButton()
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
        
        archiveFileNameRef.current = archive_title

        const uint8Array = new Uint8Array(archive_file.data);
        const base64Data = uint8Array.reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        );
        setArchiveData(archivedata);
        setArchiveFileName(archive_title);
        setViewPdf(base64Data);
      } catch (error) {
        console.log("Error", error);
      }
    };
    if (!archiveData.length) {
      fetchData();
    }
  }, [archiveData]);

  const handleupdate = () => {
    try {
      navigate(`/dashboard/updatearsip/${archive_id}`, {
        state: { archiveData },
      });
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleDownload = () => {
    const { archive_title } = archiveData[0];
    if (!archiveData || !archiveData[0] || !archiveData[0].archive_title) {
      console.error("Archive data or filename not available.");
      return;
    }

    const fileName = `${archive_title}.pdf`;
    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${viewPdf}`;
    link.target = "_blank";
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const toolbarPluginInstance = toolbarPlugin({
    getFilePlugin: {
      fileNameGenerator: () => {
        const fileName = archiveFileNameRef.current;
        return fileName;
      },
    },
  });
  
  const { Toolbar } = toolbarPluginInstance;

  const getFilePluginInstance = getFilePlugin({
    fileNameGenerator: () => {
      // `file.name` is the URL of opened file
      return archiveFileName;
    },
  });

  const { DownloadButton } = getFilePluginInstance;

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

  return (
    <div className="container-fluid">
      {archiveData.map((archive) => (
        <div className="row bg-white m-3 rounded p-3">
          <div className="d-flex justify-content-between align-items-center p-2">
            <h1 className="m-0 ">Detail Arsip</h1>
            <div className="d-flex p-2">
              <button
                className="btn btn-success d-flex align-items-center me-2 "
                onClick={handleDownload}
              >
                <BiSolidDownload className="m-2" />
                <span className="d-none d-md-inline">Download</span>
              </button>
              <button
                id="buttonupdate"
                className="btn btn-secondary d-flex align-items-center"
                onClick={handleupdate}
              >
                <BsPlusSquare className="m-2" />
                <span className="d-none d-md-inline">Update Arsip</span>
              </button>
            </div>
          </div>
          <div className="row mt-3">
            <h4 className="bg-dark text-white p-2 ps-4 rounded">
              Identitas Arsip
            </h4>
            <ul>
              <li className="mb-3 row">
                <label for="code" class="col-sm-2 col-form-label">
                  Kode Arsip
                </label>
                <div class="col-sm-9 m-2">
                  <span className="catalog">{archive.archive_code}</span>
                </div>
              </li>
              <li className="mb-3 row">
                <label for="catalog" class="col-sm-2 col-form-label">
                  Indeks Katalog
                </label>
                <div class="col-sm-9 m-2">
                  <span className="catalog">
                    {archive.archive_catalog_label}
                  </span>
                </div>
                </li>
                <li className="mb-3 row">
                  <label for="catalog" class="col-sm-2 col-form-label">
                    No Buku
                  </label>
                  <div class="col-sm-9 m-2">
                    <span className="catalog">
                       {archive.archive_serial_number}
                    </span>
                  </div>
                </li>
                <li className="mb-3 row">
                  <label for="catalog" class="col-sm-2 col-form-label">
                    No Naskah
                  </label>
                  <div class="col-sm-9 m-2">
                    <span className="catalog">
                       {archive.archive_file_number}
                    </span>
                  </div>
                </li>
              <li className="mb-3 row">
                <label for="tittle" class="col-sm-2 col-form-label">
                  Judul
                </label>
                <div class="col-sm-9 m-2">
                  <span className="tittle">{archive.archive_title}</span>
                </div>
              </li>
              <li className="mb-3 row">
                <label for="Release_date" class="col-sm-2 col-form-label">
                  Tanggal Surat
                </label>
                <div class="col-sm-9 m-2">
                  <span className="Release_date">
                    {formatTimestampRelease(archive.archive_release_date)}
                  </span>
                </div>
              </li>
              <li className="mb-3 row">
                <label for="timestamp" class="col-sm-2 col-form-label">
                  Tanggal Input
                </label>
                <div class="col-sm-9 m-2">
                  <span className="timestamp">{formatTimestamp(archive.archive_timestamp)}</span>
                </div>
              </li>
              <li className="mb-3 row">
                <label for="condition_id" class="col-sm-2 col-form-label">
                  Kondisi Arsip
                </label>
                <div class="col-sm-9 m-2">
                  <span className="condition_id">
                    {archive.archive_condition_label}
                  </span>
                </div>
              </li>
              <li className="mb-3 row">
                <label for="type" class="col-sm-2 col-form-label">
                  Jenis Arsip
                </label>
                <div class="col-sm-9 m-2">
                  <span className="type">{archive.archive_type_label}</span>
                </div>
              </li>
              <li className="mb-3 row">
                <label for="class" class="col-sm-2 col-form-label">
                  Kelas Arsip
                </label>
                <div class="col-sm-9 m-2">
                  <span className="class">{archive.archive_class_label}</span>
                </div>
              </li>
              <li className="mb-3 row">
                <label for="agency" class="col-sm-2 col-form-label">
                  Asal Instansi
                </label>
                <div class="col-sm-9 m-2">
                  <span className="agency">{archive.archive_agency}</span>
                </div>
              </li>
            </ul>
          </div>
          <div className="row mt-2">
            <h4 className="bg-dark text-white p-2 ps-4 rounded">
              Lokasi Penyimpanan Arsip
            </h4>
            <ul>
              <li className="mb-3 row">
                <label for="building" class="col-sm-2 col-form-label">
                  No Gedung
                </label>
                <div class="col-sm-9 m-2">
                  <span className="building">{archive.loc_building_label}</span>
                </div>
              </li>
              <li className="mb-3 row">
                <label for="room" class="col-sm-2 col-form-label">
                  Ruang
                </label>
                <div class="col-sm-9 m-2">
                  <span className="room">{archive.loc_room_label}</span>
                </div>
              </li>
              <li className="mb-3 row">
                <label for="rollopack" class="col-sm-2 col-form-label">
                  Roll O Pack
                </label>
                <div class="col-sm-9 m-2">
                  <span className="rollopack">
                    {archive.loc_rollopack_label}
                  </span>
                </div>
              </li>
              <li className="mb-3 row">
                <label for="cabinet" class="col-sm-2 col-form-label">
                  Lemari
                </label>
                <div class="col-sm-9 m-2">
                  <span className="cabinet">{archive.loc_cabinet_label}</span>
                </div>
              </li>
              <li className="mb-3 row">
                <label for="rack" class="col-sm-2 col-form-label">
                  Rak
                </label>
                <div class="col-sm-9 m-2">
                  <span className="rack">{archive.archive_loc_rack}</span>
                </div>
              </li>
              <li className="mb-3 row">
                <label for="box" class="col-sm-2 col-form-label">
                  Box
                </label>
                <div class="col-sm-9 m-2">
                  <span className="box">{archive.archive_loc_box}</span>
                </div>
              </li>
              <li className="mb-3 row justify-content-center align-items-center">
                <div className="pdf-view col-sm-9" id="pdf-viewer">
                  <div>
                    <Toolbar />
                    {/* <DownloadButton /> */}
                  </div>
                  <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
                    {archive.archive_file && (
                      <div className="view">
                        <Viewer
                          fileUrl={`data:application/pdf;base64,${viewPdf}`}
                          plugins={[toolbarPluginInstance]}
                          onError={(error) =>
                            console.error("PDF Viewer Error:", error)
                          }
                        />
                      </div>
                    )}
                  </Worker>
                </div>
              </li>
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};
