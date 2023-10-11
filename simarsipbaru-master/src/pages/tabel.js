import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useTable, useSortBy } from "react-table"; // Import react-table hooks
import { ImSearch } from "react-icons/im";
import { useLocation } from "react-router-dom";

const Tabel = ({ data }) => {
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();
  const [archiveData, setArchiveData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [searchTerm, setSearchTerm] = useState("")
  const [paginatedData, setPaginatedData] = useState([]);
  const [filteredArchiveData, setFilteredArchiveData] = useState([]);
  const location = useLocation();
  const searchParam = new URLSearchParams(location.search).get("search");


  const columns = React.useMemo(
    () => [
      {
        Header: "Tanggal Terbit",
        accessor: "archive_release_date",
        Cell: ({ value }) => {
          const options = { day: "numeric", month: "long", year: "numeric" };
          return new Date(value).toLocaleDateString(undefined, options);
        },
      },
      {
        Header: "Jenis",
        accessor: "archive_type_label",
      },
      {
        Header: "Indeks Kategory",
        accessor: "archive_catalog_label",
      },
      {
        Header: "Judul",
        accessor: "archive_title",
      },
      {
        Header: "Instansi Sumber",
        accessor: "archive_agency",
      },
    ],
    []
  );

  // Define the table structure and initialize useTable outside of the fetchData function
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data: paginatedData, // Use paginatedData as your data source
      },
      useSortBy // Enable sorting
    );

  useEffect(() => {
    const verify = async () => {
      let token = Cookies.get(`token`);
      let role = Cookies.get(`role`);
      if (!token || !role) {
        navigate("/login");
      } else {
        try {
          const response = await axios.post(`${process.env.REACT_APP_PATH}/verify`, {
            token,
          });
          if (response.status === 200) {
            setIsLogin(true);
            fetchData();
          } else {
            navigate("/login");
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    // Define the fetchData function separately
    const fetchData = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_PATH}/home`);
        setArchiveData(response.data);
      
      } catch (error) {
        console.error("Error", error);
      }
    };
    

    verify();
}, [navigate]);

useEffect(() => {
  const formatDate = (dateStr) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };
  
  // Filter data based on the searchTerm
  const filteredData = archiveData.filter((archive) => {
    const columnsToSearch = [
      formatDate(archive.archive_release_date),
      archive.archive_type_label,
      archive.archive_catalog_label,
      archive.archive_title,
      archive.archive_agency,
      // Add more columns here if needed
    ];
    if (searchParam) {
      return columnsToSearch.some(
        (column) =>
          column &&
          column.toString().toLowerCase().includes(searchParam.toLowerCase())
      );
    
    }else{
      return columnsToSearch.some(
        (column) =>
          column &&
          column.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  });

  setFilteredArchiveData(filteredData);

  // Update the paginatedData based on the filtered data and current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  setPaginatedData(paginatedData);
}, [searchParam, searchTerm, currentPage, archiveData]);

// useEffect(() => {
//   document.getElementById("dash").classList.remove("act");
//   document.getElementById("dash").classList.add("text-white");
// }, []);


  const handleDetail = async (archive_id) => {
    try {
      const role = Cookies.get('role')
      if (role !== 'pimpinan') {
        navigate(`/dashboard/tabel/detail/${archive_id}`, {
          state: { archiveData },
        });
      }
      else {
        navigate(`/pimpinan/tabel/detail/${archive_id}`, {
          state: { archiveData },
        });
      }
    } catch (error) {
      console.log("Error", error);
    }
  };


  const totalPages = Math.ceil(filteredArchiveData.length / itemsPerPage);

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
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search button click
  const handleSearchClick = () => {
    setCurrentPage(1);
    navigate(
      `/${Cookies.get("role")}/tabel?search=${encodeURIComponent(searchTerm)}`
    );
  };

  // Handle Enter key press in the search input
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  return (
    <div className="container-fluid">
      <div className="row bg-white m-3 rounded p-3 ">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="m-0">Daftar Arsip</h1>
          <div className="col-8 col-md-4 pe-3 d-flex align-items-center justify-content-end p-2">
          <div className="input-group">
                <input
                  id="search"
                  type="text"
                  placeholder="Cari Arsip"
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
        <div className="table-responsive mt-3  ">
          <table class="table table-hover text-center ">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render("Header")}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody {...getTableBodyProps()} className="overflow-scroll">
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    key={row.original.archive_id}
                    {...row.getRowProps()}
                    onClick={() => handleDetail(row.original.archive_id)}
                    role="button"
                  >
                    {row.cells.map((cell) => {
                      return (
                        <td key={cell.row.id} {...cell.getCellProps()}>
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
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

export { Tabel };
