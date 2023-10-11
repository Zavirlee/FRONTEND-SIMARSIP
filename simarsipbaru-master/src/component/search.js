import { ImSearch } from "react-icons/im";
import { Tabel } from "../pages/tabel";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export const SearchTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    navigate(
      `/${Cookies.get(`role`)}/tabel?search=${encodeURIComponent(searchTerm)}`
    );
    window.location.reload();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <div className="input-group">
      <input
        id="search"
        type="text"
        placeholder="Cari Arsip"
        className="form-control"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyUp={handleKeyPress}
      />
      <span className="input-group-text" onClick={handleSearch}>
        <ImSearch />
      </span>
    </div>
  );
};
