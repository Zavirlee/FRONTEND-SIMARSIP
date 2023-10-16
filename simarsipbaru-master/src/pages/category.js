import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { ImSearch } from "react-icons/im";
import { useLocation } from "react-router-dom";

export const Category = () => {
  const [catalogData, setCatalogData] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCatalog, setFilteredCatalog] = useState([]);
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get(`token`);
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.post(`${process.env.REACT_APP_PATH}/catalogData`);
        console.log(response.data);
        setCatalogData(response.data);


      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filteredCatalog = catalogData.filter((catalog) => {
      const columnsToSearch = [
        catalog.archive_catalog_id,
        catalog.archive_catalog_label,
        catalog.cpc,
        // Add more columns here if needed
      ];

      return columnsToSearch.some((column) =>
        column && column.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    setFilteredCatalog(filteredCatalog);
  }, [catalogData, searchTerm]);
  // useEffect(() => {
  //   document.getElementById("dash").classList.remove("act");
  //   document.getElementById("dash").classList.add("text-white");
  // }, []);

  const handleCategory = async (archive_catalog_id) => {
    try {
      const role = Cookies.get('role')
      if (role === 'pimpinan' && currentPath==='/pimpinan/category' || role === 'admin' && currentPath==='/pimpinan/category'){
        navigate(`/pimpinan/category/${archive_catalog_id}`, {
          state: { catalogData },
        });
      }
      else {
        navigate(`/dashboard/category/${archive_catalog_id}`, {
          state: { catalogData },
        });
      }

    } catch (error) {
      console.log("Error", error);
    }
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search button click
  const handleSearchClick = () => {
    // navigate(
    //   `/${Cookies.get("role")}/category?search=${encodeURIComponent(searchTerm)}`
    // );
    const role = Cookies.get("role");
    if (role === 'pimpinan' && currentPath===`/pimpinan/category` || role === 'admin' && currentPath===`/pimpinan/category`){
      navigate(
        `/pimpinan/category?search=${encodeURIComponent(searchTerm)}`
      );
    }
    else {
      navigate(
        `/dashboard/category?search=${encodeURIComponent(searchTerm)}`
      );
    }
  };

  // Handle Enter key press in the search input
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  return (
    <div className="container-fluid">
      <div className="row bg-white m-3 rounded p-3">
      <div className="d-flex justify-content-between align-items-center">
          <h1 className="m-0">Daftar Kategori</h1>
          <div className="col-8 col-md-4 pe-3 d-flex align-items-center justify-content-end p-2">
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
            </div>
        </div>
        <div className="table-responsive">
          <table className="table table-hover ">
            <thead class="">
              <tr>
                <th class="text-center">Indeks Id</th>
                <th class="text-center">Nama Indeks Kategori</th>
                <th class="text-center">Jumlah Arsip</th>
              </tr>
            </thead>
            <tbody>
              {filteredCatalog.map((catalog) => (
                <tr
                  key={catalog.archive_catalog_id}
                  onClick={() => handleCategory(catalog.archive_catalog_id)}
                  role="button"
                >
                  <td class="text-center">{catalog.archive_catalog_id}</td>
                  <td class="text-center">{catalog.archive_catalog_label}</td>
                  <td class="text-center">{catalog.cpc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
