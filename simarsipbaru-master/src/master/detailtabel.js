import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { BsPlusSquare } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import Icon from "../images/logopolos.png";
import { FiCheckCircle } from "react-icons/fi";

export const DetailTabel = () => {
  const [catalogData, setCatalogData] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCatalog, setFilteredCatalog] = useState([]);
  const [showModalHapus, setShowModalHapus] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hapusLabel, setHapusLabel] = useState([])

  const { id } = useParams();


  const idToColumnsMapping = {
    "INDEKS KATALOG": [
      "archive_catalog_id",
      "archive_catalog_label",
      "insertCatalog",
      "deleteCatalog",
      "updateCatalog",
      // Add more columns here if needed
    ],
    KONDISI: [
      "archive_condition_id",
      "archive_condition_label",
      "insertCondition",
      "deleteCondition",
      "updateCondition",
      // Add more columns here if needed
    ],
    "JENIS ARSIP": [
      "archive_type_id",
      "archive_type_label",
      "insertType",
      "deleteType",
      "updateType",
      // Add more columns here if needed
    ],
    "KELAS ARSIP": [
      "archive_class_id",
      "archive_class_label",
      "insertClassArchive",
      "deleteClassArchive",
      "updateClassArchive",
      // Add more columns here if needed
    ],
    GEDUNG: [
      "loc_building_id",
      "loc_building_label",
      "insertBuilding",
      "deleteBuilding",
      "updateBuilding",
      // Add more columns here if needed
    ],
    RUANGAN: [
      "loc_room_id",
      "loc_room_label",
      "insertRoom",
      "deleteRoom",
      "updateRoom",
      // Add more columns here if needed
    ],
    "ROLL O PACK": [
      "loc_rollopack_id",
      "loc_rollopack_label",
      "insertRollOPack",
      "deleteRollOPack",
      "updateRollOPack",
      // Add more columns here if needed
    ],
    LEMARI: [
      "loc_cabinet_id",
      "loc_cabinet_label",
      "insertCabinet",
      "deleteCabinet",
      "updateCabinet",
      // Add more columns here if needed
    ],
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
          `${process.env.REACT_APP_PATH}/${id}`
        );
        console.log(response.data);
        setCatalogData(response.data);
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleCategory = () => {
      if (id && id in idToColumnsMapping) {
        const columnsToSearch = idToColumnsMapping[id];
        const filtered = catalogData.filter((catalog) => {
          return columnsToSearch.some(
            (column) =>
              catalog[column] &&
              catalog[column]
                .toString()
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
          );
        });
        setFilteredCatalog(filtered);
      }
    };
    handleCategory();
  }, [id, catalogData, searchTerm]);
  const handleEdit = (id1, id2, id3) => {
    navigate(`/dashboard/master/editdata/${id1}/${id2}/${id3}`)
  };

  const handleCategory = async (archive_catalog_id) => {
    // try {
    //   const role = Cookies.get('role')
    //   if (role === 'pimpinan'){
    //     navigate(`/pimpinan/category/${archive_catalog_id}`, {
    //       state: { catalogData },
    //     });
    //   }
    //   else {
    //     navigate(`/dashboard/category/${archive_catalog_id}`, {
    //       state: { catalogData },
    //     });
    //   }
    // } catch (error) {
    //   console.log("Error", error);
    // }
  };

  const handleCategoryClick = () => {

  }
  
  // const handleData = (e) => {
  //   navigate("/dashboard/detailtabel");
  // };
  const handleTambah = async (event) => {
    navigate(`/dashboard/master/tambahdata/${id}`);
  };

  const handleHapusClick = (label) => {
    setShowModal(true);
    setHapusLabel(label)
  };

  const handleModalClose = (e) => {
    // Close the modal when needed
    setShowModal(false);
    e.stopPropagation();
  };
  const handleModalHapusClose = (e) => {
    // Close the modal when needed
    setShowModalHapus(false);
    setShowModal(false);
    window.location.reload();
    e.stopPropagation();
  };


  const handleHapus = async () => {
    try {

      const data = {};

      data['label'] = hapusLabel

      const response = await axios.post(
        `${process.env.REACT_APP_PATH}/${idToColumnsMapping[id][3]}`,
        {
          data
        }
      );
      setShowModalHapus(true)
      setShowModal(false)
      
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row bg-white m-3 rounded p-3">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="m-0">Tabel</h1>
          {/* <div className="col-8 col-md-4 pe-3 d-flex align-items-center justify-content-end p-2">
            <div className="input-group">
              <input
                id="search"
                type="text"
                placeholder="Cari Kategori"
                className="form-control"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyUp={handleKeyPress}
              />
              <span className="input-group-text" onClick={handleSearchClick}>
                <ImSearch />
              </span>
            </div>
          </div> */}
          <button
              className="btn btn-success d-flex align-items-center"
              onClick={handleTambah}
            >
              <BsPlusSquare className="m-2" />
              <span className="d-none d-md-inline">Tambah Data</span>
            </button>
        </div>
        <div className="table-responsive">
          <table className="table table-hover ">
            <thead class="">
              <tr>
                <th class="text-center">No</th>
                <th class="text-center">Label</th>
                <th class="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredCatalog.map((catalog, index) => (
                <tr
                  key={catalog[idToColumnsMapping[id][0]]}
                  onClick={() => handleCategoryClick(catalog[idToColumnsMapping[id][0]])}
                >
                  <td className="text-center">{index + 1}</td>
                  <td className="text-center">{catalog[idToColumnsMapping[id][1]]}</td>
                  <td className="d-none d-md-block text-center">
                      <FaEdit
                        id="tomboledit"
                        className="ms-2"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Edit data"
                        role="button"
                        onClick={() => handleEdit(id, catalog[idToColumnsMapping[id][1]], catalog[idToColumnsMapping[id][0]] )}
                      />
                      {/* {hiddenDeleteButtons[index] ? (
                        <MdOutlineDeleteOutline
                          id={`tombolhapus-${user.user_id}`}
                          className="ms-2"
                          data-toggle="tooltip"
                          data-placement="bottom"
                          title="Delete User"
                          role="button"
                          onClick={handleHapusClick}
                        />
                      ) : null} */}
                      <MdOutlineDeleteOutline
                        id={`tombolhapus`}
                        className="ms-2"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Delete User"
                        onClick={() => handleHapusClick(catalog[idToColumnsMapping[id][0]])}
                      />
                      {showModal && (
                        <div
                          className="modal d-block"
                          tabIndex="-1"
                          role="dialog"
                        >
                          <div
                            className="modal-dialog modal-dialog-centered"
                            role="document"
                          >
                            <div className="modal-content">
                              <div className="modal-header">
                                <div className="row align-items-center">
                                  <div className="col-auto">
                                    <img
                                      src={Icon}
                                      className="logopop"
                                      alt="Icon"
                                    />
                                  </div>
                                  <div className="col">
                                    <h5 className="modal-title">Hapus User</h5>
                                  </div>
                                </div>
                              </div>
                              <div className="modal-body">
                                <h6>Anda Yakin Ingin Menghapus User ini?</h6>
                              </div>
                              <div className="modal-footer">
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  onClick={handleModalClose}
                                >
                                  Tidak
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  onClick={handleHapus}
                                >
                                  Ya
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showModalHapus && (
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
                  onClick={handleModalHapusClose}
                ></button>
              </div>
              <div className="modal-body text-center">
                {/* Add your modal content here */}
                <FiCheckCircle className="fs-1 text-success " />
                <h5 className="p-2 m-2">Data Berhasil di Hapus</h5>
              </div>
            </div>
          </div>
        </div>
        )}
        </div>
        
      </div>
    </div>
  );
};
