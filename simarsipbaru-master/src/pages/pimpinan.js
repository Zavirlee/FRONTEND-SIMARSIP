import React from "react";
import { TbListTree } from "react-icons/tb";
import { CgFileDocument } from "react-icons/cg";
import { BsShop } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Icon from "../images/logopolos.png";
import axios from "axios";
import Cookies from "js-cookie";
import { Category } from "./category";
import { ImSearch } from "react-icons/im";
import { BarChart } from "../component/barchart";
import LineChart from "../component/linearchart";

export const Pimpinan = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [lineChartData, setLineChartData] = useState({ labels: [], values: [] });
  const [barChartData, setBarChartData] = useState({ labels: [], values: []});
  const [catalogIdMapping, setCatalogIdMapping] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get(`token`);
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.post(
          `${process.env.REACT_APP_PATH}/dashboardData`
        );
        setDashboardData(response.data);
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formatDate = (dateStr) => {
          const options = { year: "numeric", month: "long", day: "numeric" };
          return new Date(dateStr).toLocaleDateString(undefined, options);
        };      
        const response = await axios.post(`${process.env.REACT_APP_PATH}/byDate`);
        console.log(response.data)
        const mappedData = response.data.map(item => ({
          label: formatDate(item.tanggal),
          value: item.jumlah_arsip,
        }));
        const limitedData = mappedData.slice(0, 5);

        const labels = limitedData.map(item => item.label);
        const values = limitedData.map(item => item.value);

        // Set the chartData state with the mapped data
        setLineChartData({ labels, values });
      } catch (error) {
        console.log("Error", error);
      }
    };

    // Call the fetchData function
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_PATH}/bardata`);
        console.log(response.data)
        const mappedData = response.data.map(item => ({
          label: item.archive_catalog_label,
          value: item.cpc,
        }));


        const limitedData = mappedData.slice(0, 5);

        const labels = limitedData.map(item => item.label);
        const values = limitedData.map(item => item.value);

        const idMapping = {};
        response.data.forEach((item) => {
          idMapping[item.archive_catalog_label] = item.archive_catalog_id;
        });

        setCatalogIdMapping(idMapping);

        // Set the chartData state with the mapped data
        setBarChartData({ labels, values });
      } catch (error) {
        console.log("Error", error);
      }
    };

    // Call the fetchData function
    fetchData();
  }, []);

  const handleBarchartClick = async (label) => {
    try {

      const role = Cookies.get('role')
        navigate(`/pimpinan/category/${label}`);
        // window.location.reload()
      
    } catch (error) {
      console.log("Error", error);
    }
  };
  

  function handleJumlah() {
    navigate(`/pimpinan/tabel`);
  }
  function handleBaru() {
    navigate(`/pimpinan/terbaru`);
  }

  function handleCategory() {
    navigate(`/pimpinan/category`);
  }
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search button click
  const handleSearchClick = () => {
    navigate(
      `/pimpinan/tabel?search=${encodeURIComponent(searchTerm)}`
    );
    setSearchTerm("")
  };

  // Handle Enter key press in the search input
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };
  
  return (
    <div id="pimpinan" className="container-fluid  min-vh-100 ">
      {dashboardData.map((dashboard) => (
        <div id="dashboard">
          <div className="row d-flex justify-content-center align-items-center mt-3">
            <div className="col-12 col-md-8 d-flex justify-content-center align-items-center flex-column">
              <img src={Icon} alt="icon" className="icon p-2 w-25" />
            </div>
          </div>

          <div className="row d-flex justify-content-center align-items-center mt-3">
            <div className="col-10 col-md-8">
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
          <div className="row d-flex justify-content-center align-items-center mt-3">
            <div
              className="col-md-4 col-lg-2 col-6 card m-3"
              onClick={handleJumlah}
            >
              <div
                className="card-body row d-flex justify-content-center align-items-center text-center"
                role="button"
              >
                <div className="col-md-3 col-3">
                  <CgFileDocument className="fs-1" />{" "}
                  {/* Adjust the fs-4 class to set the desired size */}
                </div>
                <div className="col-md-9 col-9 justify-content-center align-items-center d-none d-md-block">
                  <p className="fs-6">Jumlah Arsip</p>
                  <h3 className="fs-4">{dashboard.total_archives}</h3>
                </div>
              </div>
            </div>
            <div
              className="col-md-4 col-lg-2 col-6 card m-3"
              onClick={handleBaru}
            >
              <div
                className="card-body row d-flex justify-content-center align-items-center text-center"
                role="button"
              >
                <div className="col-md-3 col-3">
                  <BsShop className="fs-1" />
                </div>
                <div className="col-md-9 col-9 justify-content-center align-items-center d-none d-md-block">
                  <p className="fs-6">Arsip Baru</p>
                  <h3 className="fs-4">{dashboard.newest_archives_count}</h3>
                </div>
              </div>
            </div>
            <div
              className="col-md-4 col-lg-2 col-6 card m-3"
              onClick={handleCategory}
            >
              <div
                className="card-body row d-flex justify-content-center align-items-center text-center"
                role="button"
              >
                <div className="col-md-3 col-12">
                  <TbListTree className="fs-1" />
                </div>
                <div className="col-md-9 col-9 justify-content-center align-items-center d-none d-md-block">
                  <p className="fs-6">Kategori</p>
                  <h3 className="fs-4">{dashboard.total_archive_catalogs}</h3>
                </div>
              </div>
            </div>
          </div>
          <div className="row d-flex justify-content-center align-items-center m-3">
            <div className="col-12 col-md-5 bg-white text-center  rounded align-items-center m-2">
            <h1 className="p-2">Arsip Baru</h1>
              <LineChart data={lineChartData}/>
            </div>
            <div className="col-12 col-md-5 bg-white text-center  rounded align-items-center m-2">
            <h1 className="p-2">Top 5 Kategori</h1>
              <BarChart data={barChartData} catalogIdMapping={catalogIdMapping} onBarClick={handleBarchartClick}/>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
