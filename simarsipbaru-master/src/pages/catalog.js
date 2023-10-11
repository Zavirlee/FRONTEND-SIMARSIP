import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { TiArrowSortedDown } from "react-icons/ti";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";

const Catalog = ({ data }) => {
  const navigate = useNavigate();
  const [archiveDataBaru, setArchiveDataBaru] = useState([]);
  const { archive_catalog_id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const location = useLocation();
  const currentPath = location.pathname;

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
        const response = await axios.post(
          `${process.env.REACT_APP_PATH}/category`,
          {
            archive_catalog_id,
          }
        );
        setArchiveDataBaru(response.data);
      } catch (error) {
        console.error("Error", error);
      }
    };
    console.log(archiveDataBaru);
    fetchData();
  });

  const handleDetail = async (archive_id) => {
    try {
      const role = Cookies.get("role");
      // navigate(`/pimpinan/category/detail/${archive_catalog_id}`, {
      //   state: { archiveDataBaru },
      // });
      if (role === 'pimpinan' && currentPath===`/pimpinan/category/${archive_catalog_id}` || role === 'admin' && currentPath===`/pimpinan/category/${archive_catalog_id}`){
        navigate(
          `/pimpinan/category/detail/${archive_id}`,
          {
            state: { archiveDataBaru },
          }
        );
      }
      else {
        navigate(
          `/dashboard/category/detail/${archive_id}`,
          {
            state: { archiveDataBaru },
          }
        );
      }
    } catch (error) {
      console.log("Error", error);
    }
  };
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
          <h1 className="m-0">Arsip Katalog</h1>
          <button
            className="btn btn-dark d-flex align-items-center"
            // onClick={handleTambah}
          >
            <TiArrowSortedDown className="m-2" />
            <span className="d-none d-md-inline">Urutkan</span>
          </button>
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

export { Catalog };
