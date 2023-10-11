import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { ImSearch } from "react-icons/im";

export const MasterTabel = () => {
  const [masterData, setMasterData] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCatalog, setFilteredCatalog] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          // You might want to handle the case where there's no token differently
          navigate("/login");
          return;
        }

        const response = await axios.post(
          `${process.env.REACT_APP_PATH}/masterData`
        );

        setMasterData(response.data);
        console.log(response.data);
      } catch (error) {
        console.log("Error", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filteredCatalog = masterData.filter((master) => {
      const columnsToSearch = [
        master.label,
        master.count,
        // Add more columns here if needed
      ];

      return columnsToSearch.some(
        (column) =>
          column &&
          column.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    setFilteredCatalog(filteredCatalog);
  }, [masterData, searchTerm]);

  useEffect(() => {
    document.getElementById("master").classList.add("act");
    document.getElementById("master").classList.remove("text-white");
  }, []);


  const handleData = (id) => {
    navigate(`/dashboard/master/detailtabel/${id}`);
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search button click
  const handleSearchClick = () => {
    navigate(
      `/${Cookies.get("role")}/category?search=${encodeURIComponent(
        searchTerm
      )}`
    );
  };

  // Handle Enter key press in the search input
  const handleKeyPress = (e) => {
    // if (e.key === "Enter") {
    //   handleSearchClick();
    // }
  };

  return (
    <div className="container-fluid">
      <div className="row bg-white m-3 rounded p-3">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="m-0">Daftar Master</h1>
        </div>
        <div className="table-responsive">
          <table className="table table-hover ">
            <thead class="">
              <tr>
                <th class="text-center">No</th>
                <th class="text-center">Nama Tabel</th>
                <th class="text-center">Jumlah Data</th>
              </tr>
            </thead>
            <tbody>
              {filteredCatalog.map((master, index) => (
                <tr
                  key={master.id}
                  onClick={() => handleData(master.label)}
                  role="button"
                >
                  <td class="text-center">{index + 1}</td>
                  <td class="text-center">{master.label}</td>
                  <td class="text-center">{master.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
