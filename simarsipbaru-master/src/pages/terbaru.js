import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SearchTable } from "../component/search";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";

const Terbaru = ({ data }) => {
  const navigate = useNavigate();
  const [archiveDataBaru, setArchiveDataBaru] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const checkAuthenticated = async () => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
    }
  };

  useEffect(() => {
    checkAuthenticated();
    const fetchData = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_PATH}/terbaru`);
        setArchiveDataBaru(response.data);
      } catch (error) {
        console.error("Error", error);
      }
    };

    fetchData();
  });
  // useEffect(() => {
  //   document.getElementById("dash").classList.remove("act");
  //   document.getElementById("dash").classList.add("text-white");
  // }, []);

  const handleDetail = async (archive_id) => {
    try {
      const role = Cookies.get('role')
      // if (role !== 'pimpinan'){
      //   navigate(`/pimpinan/terbaru/detail/${archive_id}`, {
      //     state: { archiveDataBaru },
      //   });
      // }
      // else {
      //   navigate(`/dashboard/terbaru/detail/${archive_id}`, {
      //     state: { archiveDataBaru },
      //   });
      // }
      navigate(`/pimpinan/terbaru/detail/${archive_id}`, {
        state: { archiveDataBaru },
        })
    } catch (error) {
      console.log("Error", error);
    }
  };

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get("search");

  const filteredArchiveData = archiveDataBaru.filter((archive) =>
    searchTerm
      ? Object.values(archive).some((value) =>
          value && typeof value === "string"
            ? value.toLowerCase().includes(searchTerm.toLowerCase())
            : false
        )
      : true
  );

  const totalPages = Math.ceil(filteredArchiveData.length / itemsPerPage);
  const paginatedData = filteredArchiveData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  return (
    <div className="container-fluid">
      <div className="row bg-white m-3 rounded p-3 ">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="m-0">Arsip Terbaru</h1>
          <div className="col-8 col-md-4 pe-3 d-flex align-items-center justify-content-end p-2">
            <SearchTable />
          </div>
        </div>
        <div className="table-responsive mt-3  ">
          <table class="table table-hover text-center ">
            <thead>
              <tr>
                <th scope="col">Tanggal Terbit</th>
                <th scope="col">Jenis</th>
                <th scope="col">Indeks Kategory</th>
                <th scope="col">Judul</th>
                <th scope="col">Instansi Sumber</th>
              </tr>
            </thead>
            <tbody className="overflow-scroll">
              {paginatedData.slice(0, 20).map((archive) => (
                <tr
                  key={archive.archive_id}
                  onClick={() => handleDetail(archive.archive_id)}
                >
                  <td>
                    {new Date(archive.archive_timestamp).toLocaleDateString()}
                  </td>
                  <td>{archive.archive_type_label}</td>
                  <td>{archive.archive_catalog_label}</td>
                  <td>{archive.archive_title}</td>
                  <td>{archive.archive_agency}</td>
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
                on
                onClick={handlePreviousPage}
              >
                Previous
              </a>
            </li>
            {Array.from({ length: totalPages }).map((_, index) => (
              <li
                key={index}
                className={`page-item ${
                  index + 1 === currentPage ? "active" : ""
                }`}
              >
                <a
                  className="page-link"
                  href="#"
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </a>
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
  );
};

export { Terbaru };
