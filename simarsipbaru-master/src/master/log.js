import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { ImSearch } from "react-icons/im";

const Log = () => {
  const [logData, setLogData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLogData, setFilteredLogData] = useState([]);

  useEffect(() => {
    document.getElementById("log").classList.add("act");
    document.getElementById("log").classList.remove("text-white");

    const role = Cookies.get("role");
    if (role !== "admin") {
      navigate(`*`);
    } else {
      fetchData();
    }
  }, [currentPage]);

  const fetchData = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_PATH}/logArchive`
      );
      const formattedLogData = response.data.map((log) => ({
        ...log,
        timestamp: formatTimestamp(log.timestamp),
      }));

      setLogData(formattedLogData);
    } catch (error) {
      console.log("Error", error);
    }
  };
  useEffect(() => {
    const filteredLog = logData.filter((log) => {
      const columnsToSearch = [
        log.timestamp,
        log.action,
        log.ip.replace(/^::ffff:/, ""),
        log.username,
        // Add more columns here if needed
      ];
      

      return columnsToSearch.some(
        (column) =>
          column &&
          column.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredLogData(filteredLog);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredLogData.slice(startIndex, endIndex);
    setPaginatedData(paginatedData);
  }, [searchTerm, currentPage, logData]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };

  const totalPages = Math.ceil(logData.length / itemsPerPage);


  const calculatePageRange = () => {
    const pagesToShow = 4;
    let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    let endPage = startPage + pagesToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - pagesToShow + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };  // Handle search button click
  const handleSearchClick = () => {
    navigate(`/dashboard/log?search=${encodeURIComponent(searchTerm)}`);
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center align-items-center m-1 mt-4">
        <div id="table" className="bg-white rounded p-3 col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="m-0">Log Aktivitas</h1>
            <div className="col-4 col-md-6 col-lg-4 d-flex align-items-center justify-content-end">
              <div className="input-group">
                <input
                  id="search"
                  type="text"
                  placeholder="Cari Log"
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
          </div>

          <div className="table-responsive mt-3">
            <table className="table table-hover text-center">
              <thead>
                <tr>
                  <th scope="col">No</th>
                  <th scope="col">Waktu</th>
                  <th scope="col">Aksi</th>
                  <th scope="col">ip</th>
                  <th scope="col">User</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((log, index) => (
                  <tr key={log.log_id}>
                    <td className="text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="text-center">{log.timestamp}</td>
                    <td className="text-center">{log.action}</td>
                    <td className="text-center">
                      {log.ip.replace(/^::ffff:/, "")}
                    </td>
                    <td className="text-center">{log.username}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <nav aria-label="...">
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <a
                  className="page-link"
                  href="#"
                  tabIndex="-1"
                  onClick={handlePreviousPage}
                >
                  Previous
                </a>
              </li>
              {calculatePageRange().map((page) => (
              <li
                key={page}
                className={`page-item ${page === currentPage ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              </li>
            ))}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <a className="page-link" href="#" onClick={handleNextPage}>
                  Next
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export { Log };
