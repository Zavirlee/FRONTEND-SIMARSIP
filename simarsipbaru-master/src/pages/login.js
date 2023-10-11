import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import brand from "../images/logo.png";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const Login = () => {
  const [usernameError, setUsernameError] = useState([]);
  const [passwordError, setPasswordError] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = cookies.get(`token`);
        if (token) {
          navigate(`/${cookies.get("role")}`);
          return;
        }
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get("username");
    const password = data.get("password");

    if (!username) {
      setUsernameError("Username tidak boleh kosong *");
      document.getElementById("username").classList.add("red-border");
      setTimeout(() => {
        setUsernameError("");
        document.getElementById("username").classList.remove("red-border");
      }, 3000);
    }

    if (!password) {
      setPasswordError("Password tidak boleh kosong *");
      document.getElementById("password").classList.add("red-border");
      setTimeout(() => {
        setPasswordError("");
        document.getElementById("password").classList.remove("red-border");
      }, 3000);
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_PATH}/login`, {
        username: username,
        password: password,
      });

      document.cookie = `token=${response.data.token}; Path=/`;
      document.cookie = `user_id=${response.data.user_id}; Path=/`;

      if (response.data.level_user_id === 1) {
        document.cookie = `role= admin ; Path=/`;
        navigate(`/dashboard`);
      } else if (response.data.level_user_id === 2) {
        document.cookie = `role= operator ; Path=/`;
        navigate("/dashboard");
      } else if (response.data.level_user_id === 3) {
        document.cookie = `role= pimpinan ; Path=/`;
        navigate("/pimpinan");
      }
    } catch (error) {
      const errorData = JSON.parse(error.response.config.data);
      const errorText = error.response.data;
      console.error("Error:", error);
      console.log(errorText);

      if (errorText === "Error: Login Error") {
        if (errorData.username === "") {
          setUsernameError("Username tidak boleh kosong *");
          document.getElementById("username").classList.add("red-border");
          setTimeout(() => {
            setUsernameError("");
            document.getElementById("username").classList.remove("red-border");
          }, 3000);
        } else if (errorData.password === "") {
          setPasswordError("Password tidak boleh kosong *");
          document.getElementById("password").classList.add("red-border");
          setTimeout(() => {
            setPasswordError("");
            document.getElementById("password").classList.remove("red-border");
          }, 3000);
        }
      } else if (errorText === "Error: Already logged In") {
        alert("Already Logged In");
      } else {
        setUsernameError("Username atau Password salah *");
        document.getElementById("username").classList.add("red-border");
        setPasswordError("Username atau Password salah *");
        document.getElementById("password").classList.add("red-border");
        setTimeout(() => {
          setUsernameError("");
          document.getElementById("username").classList.remove("red-border");
          setPasswordError("");
          document.getElementById("password").classList.remove("red-border");
        }, 3000);
      }
    }
  };

  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center min-vh-100 back">
      <div class="container py-5">
        <div class="row d-flex justify-content-center align-items-center ">
          <div class="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="logo d-flex justify-content-center align-items-center">
              <img src={brand} alt="logo-depan" className="brand w-50" />
            </div>
            <div class="cards log text-white mt-3">
              <div class="cards-body p-4 text-center rounded-5">
                <form onSubmit={handleSubmit}>
                  <div class="form-outline form-white mb-4 mt-4">
                    <input
                      type="text"
                      name="username"
                      id="username"
                      class="form-control form-control-lg"
                      placeholder="Username"
                    />
                    <div className="text-danger text-start">
                      {usernameError}
                    </div>
                  </div>
                  <div class="form-outline form-white mb-4">
                    <input
                      type="password"
                      name="password"
                      id="password"
                      class="form-control form-control-lg"
                      placeholder="Password"
                    />
                    <div className="text-danger text-start">
                      {passwordError}
                    </div>
                  </div>
                  <button
                    class="btn btn-warning btn-lg px-5 text-white"
                    type="submit"
                  >
                    Masuk
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
