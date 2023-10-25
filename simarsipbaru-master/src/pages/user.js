import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import { BsPlusSquare } from "react-icons/bs";
import Cookies from "js-cookie";
import axios from "axios";
import Icon from "../images/logopolos.png";
import { HiUserCircle } from "react-icons/hi";
import { ImSearch } from "react-icons/im";
import { FiCheckCircle } from "react-icons/fi";

export const User = ({ data }) => {
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState([]);
  const [userDetail, setUserDetail] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUser, setFilteredUser] = useState([]);
  const [showModalHapus, setShowModalHapus] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [hiddenDeleteButtons, setHiddenDeleteButtons] = useState([]);
  const [hapusData, setHapusData] = useState([]);

  const currentUserID = Cookies.get("user_id");

  const handleTambah = async (event) => {
    navigate(`/dashboard/user/tambahuser`);
  };

  const handleHapusClick = (username) => {
    setShowModal(true);
    setHapusData(username);
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
      const response = await axios.post(
        `${process.env.REACT_APP_PATH}/deleteUser`,
        {
          ip: Cookies.get("ip"),
          token: Cookies.get("token"),
          username: hapusData,
        }
      );
      setShowModalHapus(true);
      setShowModal(false);
      setTimeout(() => {
        setShowModalHapus(false);
        document.getElementById("detail").classList.add("d-none");
        document.getElementById("table").classList.remove("col-md-9");
      }, 2000);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleDetail = (user) => {
    document.getElementById("detail").classList.remove("d-none");
    document.getElementById("table").classList.add("col-md-9");

    const { user_id, username, password, level_user_id, satker } = user;

    setUserDetail([user]);

    console.log("clicked user : ", {
      user_id,
      username,
      password,
      level_user_id,
      satker,
    });
  };

  const handleTutupDetail = () => {
    document.getElementById("detail").classList.add("d-none");
    document.getElementById("table").classList.remove("col-md-9");
  };

  const handleEdit = (user_id) => {
    try {
      navigate(`/dashboard/updateuser/${user_id}`, {
        state: { userData },
      });
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    document.getElementById("user").classList.add("act");
    document.getElementById("user").classList.remove("text-white");

    const fetchData = async () => {
      try {
        const token = Cookies.get(`token`);
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.post(
          `${process.env.REACT_APP_PATH}/readUser`
        );
        setUserData(response.data);

        // Filter users based on the search term
        const filteredUser = response.data.filter((user) => {
          const columnsToSearch = [
            user.user_id,
            user.username,
            user.level_user_label,
            mapLoginSession(user.login_session),
            user.satker,
            formatTimestamp(user.last_login),
            // Add more columns here if needed
          ];
          console.log(user.last_login)

          return columnsToSearch.some(
            (column) =>
              column &&
              column.toString().toLowerCase().includes(searchTerm.toLowerCase())
          );
        });
        setFilteredUser(filteredUser);

        // // Cari user yang sesuai dengan user yang sedang login
        // const check = filteredUser.find(
        //   (user) => user.user_id === Cookies.get("user_id")
        // );
        // setCurrentUser(check);

        // Membuat array yang menandakan apakah tombol hapus perlu disembunyikan atau tidak
        const hiddenButtons = filteredUser.map(
          (user) => user.user_id.toString() !== Cookies.get("user_id")
        );
        filteredUser.forEach((user) => {
          const { id } = toString(user.user_id);
          if (id === Cookies.get("user_id")) {
            console.log("ketemu");
          } else {
            console.log(id);
          }
        });
        setHiddenDeleteButtons(hiddenButtons);
      } catch (error) {
        console.error("Error", error);
      }
      
    };
    fetchData();

    const userLinks = document.querySelectorAll(`[id^="tombolhapus"]`);

    userLinks.forEach((userLink) => {
      const userIdFromElement = userLink
        .getAttribute("id")
        .replace("tombolhapus", "");
      if (userIdFromElement === Cookies.get("user_id")) {
        userLink.classList.add("d-none");
      }
    });
  }, [navigate, searchTerm]);

 
  const formatTimestamp = (timestamp) => {
    if (timestamp === null) {
      return "sedang login";
    } else {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
  
      return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    }
  };
  

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search button click
  const handleSearchClick = () => {
    navigate(`/dashboard/user?search=${encodeURIComponent(searchTerm)}`);
  };

  // Handle Enter key press in the search input
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };
  const mapLoginSession = (loginSession) =>
    loginSession != "0" ? "Aktif" : "Tidak Aktif";

  return (
    <div className="container-fluid">
      <div className="row justify-content-center align-items-center m-1 mt-4">
        <div id="table" className="bg-white rounded p-3 col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="m-0">Manajemen User</h1>
            <div className="col-4 col-md-6 col-lg-4 d-flex align-items-center justify-content-end">
              <div className="input-group">
                <input
                  id="search"
                  type="text"
                  placeholder="Cari User"
                  className="form-control"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyUp={handleKeyPress}
                />
                <span className="input-group-text" onClick={handleSearchClick}>
                  <ImSearch />
                </span>
              </div>
            </div>
            <button
              className="btn btn-success d-flex align-items-center"
              onClick={handleTambah}
            >
              <BsPlusSquare className="m-2" />
              <span className="d-none d-md-inline">Tambah User</span>
            </button>
          </div>

          <div className="table-responsive mt-3">
            <table className="table table-hover text-center">
              <thead>
                <tr>
                  <th scope="col">No</th>
                  <th scope="col">Username</th>
                  <th scope="col">Role</th>
                  <th scope="col">Satker</th>
                  <th scope="col">Sesi</th>
                  <th scope="col">Login Terakhir</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUser.map((user, index) => (
                  <tr
                    key={user.user_id}
                    onClick={() => handleDetail(user)}
                    role="button"
                  >
                    <td>{index + 1}</td>
                    <td>{user.username}</td>
                    {/* <td className="d-none d-md-block">{user.password}</td> */}
                    <td>{user.level_user_label}</td>
                    <td>{user.satker}</td>
                    <td>{mapLoginSession(user.login_session)}</td>
                    <td>{formatTimestamp(user.last_login)}</td>
                    {/* <td>{user.last_login}</td> */}
                    <td className="d-none d-md-block">
                      <FaEdit
                        id="tomboledit"
                        className="ms-2"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Edit User"
                        role="button"
                        onClick={() => handleEdit(user.user_id)}
                      />
                      {hiddenDeleteButtons[index] ? (
                        <MdOutlineDeleteOutline
                          id={`tombolhapus-${user.user_id}`}
                          className="ms-2"
                          data-toggle="tooltip"
                          data-placement="bottom"
                          title="Delete User"
                          role="button"
                          onClick={() => handleHapusClick(user.username)}
                        />
                      ) : null}
                      {/* <MdOutlineDeleteOutline
                        id={`tombolhapus`}
                        className="ms-2"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Delete User"
                        onClick={() => handleHapusClick(user.username, user.user_id)}
                      /> */}
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
          </div>
        </div>
        <div
          id="detail"
          className="d-none col-12 col-md-3 p-2 justify-content-end"
        >
          <div className="row bg-white ms-1 rounded p-2 justify-content-between align-items-center d-flex">
            <div className="row justify-content-start">
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleTutupDetail}
              ></button>
            </div>
            <div className="row m-0">
              {userDetail.map((user) => (
                <ul className="">
                  <li className="row justify-content-between align-items-center">
                    <HiUserCircle className="fs-1 m-2 col-md-12" />
                    {/* <label for="code" className=" col-form-label">
                    Username
                  </label> */}
                    <div className="col-md-12 col-12 text-center border border-dark rounded">
                      <span className="fs-4 m-1"> {user.username}</span>
                    </div>
                  </li>
                  <li className="row justify-content-between align-items-center">
                    <label for="code" className="col-md-5 col-5 col-form-label">
                      ID
                    </label>
                    <div className="col-md-7">
                      <span className="">: {user.user_id}</span>
                    </div>
                  </li>

                  <li className="row justify-content-between align-items-center">
                    <label for="code" className="col-md-5 col-5 col-form-label">
                      Role
                    </label>
                    <div className="col-md-7 col-7">
                      <span className="">: {user.level_user_label}</span>
                    </div>
                  </li>
                  <li className="row justify-content-between align-items-center">
                    <label for="code" className="col-md-5 col-5 col-form-label">
                      Satker
                    </label>
                    <div className="col-md-7 col-7">
                      <span className="">: {user.satker}</span>
                    </div>
                  </li>
                </ul>
              ))}
            </div>
            {showModalHapus && (
              <div className="modal d-block" tabIndex="-1" role="dialog">
                <div
                  className="modal-dialog modal-dialog-centered"
                  role="document"
                >
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
                      <h5 className="p-2 m-2">User Berhasil di Hapus</h5>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
