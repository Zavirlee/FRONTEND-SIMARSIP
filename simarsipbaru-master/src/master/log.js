import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Log = () => {
  const [logData, setLogData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    document.getElementById("log").classList.add("act");
    document.getElementById("log").classList.remove("text-white");

    const role = Cookies.get("role");
    if (role !== "admin") {
      navigate(`*`);
    } else {
    }
    const fetchData = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          // You might want to handle the case where there's no token differently
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
        console.log(response.data);
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchData();
  }, []);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const seconds = date.getUTCSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center align-items-center m-1 mt-4">
        <div id="table" className="bg-white rounded p-3 col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="m-0">Log Aktivitas</h1>
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
                {logData.map((log, index) => (
                  <tr
                    key={log.log_id}
                    //   onClick={() => handleData(master.label)}
                    role="button"
                  >
                    <td class="text-center">{index + 1}</td>
                    <td class="text-center">{log.timestamp}</td>
                    <td class="text-center">{log.action}</td>
                    <td class="text-center">{log.ip}</td>
                    <td class="text-center">{log.username}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Log };
