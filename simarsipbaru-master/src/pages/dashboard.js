import * as React from "react";
import axios from "axios";
import { TbCategory, TbListTree } from "react-icons/tb";
import { HiOutlineUsers } from "react-icons/hi2";
import { CgFileDocument } from "react-icons/cg";
import { BsShop } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { Tabel } from "./tabel";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { SearchTable } from "../component/search";

const cookies = new Cookies();

export const Dashboard = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = React.useState(false);
  const [dashboardData, setDashboardData] = useState([]);

  React.useEffect(() => {
    const verify = async () => {
      let token = cookies.get(`token`);
      if (!token) {
        navigate("/login");
      } else {
        try {
          const response = await axios.post(`${process.env.REACT_APP_PATH}/verify`, {
            token,
          });
          if (response.status === 200) {
            setIsLogin(true);
            const fetchData = async () => {
              try {
                const response = await axios.post(
                  `${process.env.REACT_APP_PATH}/dashboardData`
                );
                console.log(response.data);
                setDashboardData(response.data);
              } catch (error) {
                console.log("Error", error);
              }
            };
            fetchData();
          } else {
            navigate("/login");
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    verify();
  }, [navigate]);

  const handleJumlah = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_PATH}/home`);
      console.log(response.data);
      navigate(`/dashboard/tabel`);
    } catch (error) {
      console.error("Error", error);
    }
  };

  const handleTerbaru = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_PATH}/terbaru`);
      console.log(response.data);
      navigate(`/dashboard/terbaru`);
    } catch (error) {
      console.error("Error", error);
    }
  };

  const handleCategory = async (event) => {
    navigate(`/dashboard/category`);
  };

  React.useEffect(() => {
    document.getElementById("dash").classList.add("act");
    document.getElementById("dash").classList.remove("text-white");
  }, []);

  return (
    <div className="container-fluid">
      {dashboardData.map((dashboard) => (
        <div
          className="row d-flex justify-content-center align-items-center mt-3"
          role="button"
        >
          <div
            className="col-md-4 col-lg-2 col-3 card m-3"
            onClick={handleJumlah}
          >
            <div className="card-body row d-flex justify-content-center align-items-center text-center">
              <div className="col-md-3 col-12">
                <CgFileDocument className="fs-1" />{" "}
                {/* Adjust the fs-4 class to set the desired size */}
              </div>
              <div className="col-md-9 justify-content-center align-items-center d-none d-md-block">
                <p className="fs-6">Jumlah Arsip</p>
                <h3 className="fs-4">{dashboard.total_archives}</h3>
              </div>
            </div>
          </div>
          <div
            className="col-md-4 col-lg-2 col-3 card m-3"
            onClick={handleTerbaru}
          >
            <div
              className="card-body row d-flex justify-content-center align-items-center text-center"
              role="button"
            >
              <div className="col-md-3 col-12">
                <BsShop className="fs-1" />
              </div>
              <div className="col-md-9 col-9 justify-content-center align-items-center d-none d-md-block">
                <p className="fs-6">Arsip Baru</p>
                <h3 className="fs-4">{dashboard.newest_archives_count}</h3>
              </div>
            </div>
          </div>
          <div
            className="col-md-4 col-lg-2 col-3 card m-3"
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
      ))}
      <div className="row d-flex justify-content-center align-items-center  ">
        <div id="tabel" className="col-12 ">
          <Tabel />
        </div>
        <div
          id="cariarsip"
          className="col-12 col-md-8 d-flex justify-content-center p-5 rounded h-100 d-none "
        >
          {/* Menempatkan elemen pencarian tabel di tengah */}
          <SearchTable />
        </div>
      </div>
    </div>
  );
};
