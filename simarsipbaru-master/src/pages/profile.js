import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import Cookies from "js-cookie";
import axios from "axios";
import { useState } from "react";

export const Profile = () => {
  const [userData, setUserData] = useState([]);
  const { user_id } = useParams;
  const navigate = useNavigate;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get(`token`);
        const user_id = Cookies.get("user_id");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.post(`${process.env.REACT_APP_PATH}/detailUser`, {
          user_id,
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error", error);
      }
    };

    fetchData();
  }, [navigate]);
  return (
    <div className="container-fluid">
      {userData.map((user) => (
        <div className="row bg-white m-3 rounded p-3">
          <h1 className="p-2">Detail Profile</h1>
          <div className="row mt-2">
            <h4 className="bg-dark text-white p-2 ps-4 rounded">
              Identitas User
            </h4>

            <ul>
              <li className="mb-3 row">
                <label for="code" class="col-sm-2 col-form-label">
                  ID
                </label>
                <div class="col-sm-9 m-2">
                  <span className="catalog">: {user.user_id}</span>
                </div>
              </li>

              <li className="mb-3 row">
                <label for="catalog" class="col-sm-2 col-form-label">
                  Username
                </label>
                <div class="col-sm-9 m-2">
                  <span className="catalog">: {user.username}</span>
                </div>
              </li>

              <li className="mb-3 row">
                <label for="tittle" class="col-sm-2 col-form-label">
                  Role
                </label>
                <div class="col-sm-9 m-2">
                  <span className="tittle">: {user.level_user_label}</span>
                </div>
              </li>

              <li className="mb-3 row">
                <label for="Release_date" class="col-sm-2 col-form-label">
                  Satker
                </label>
                <div class="col-sm-9 m-2">
                  <span className="Release_date">: {user.satker}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};
