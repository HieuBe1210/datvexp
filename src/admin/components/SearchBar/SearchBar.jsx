import "./SearchBar.modul.scss";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

const SearchBar = ({ onSearch, placeholder, value }) => {
  const [searchTerm, setSearchTerm] = useState(value || ""); // Đồng bộ với prop value
  const [isExpanded, setIsExpanded] = useState(false);

  // Đồng bộ searchTerm với prop value từ bên ngoài
  useEffect(() => {
    setSearchTerm(value || "");
  }, [value]);

  // Debounce để gọi onSearch
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        onSearch(searchTerm); // Gọi onSearch với giá trị mới
      } else {
        onSearch(""); // Reset tìm kiếm nếu searchTerm rỗng
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearch]);

  // Xử lý xóa giá trị tìm kiếm
  const handleClear = () => {
    setSearchTerm("");
    setIsExpanded(false); // Thu gọn thanh tìm kiếm
    onSearch(""); // Gọi onSearch để reset kết quả tìm kiếm
  };

  // Xử lý toggle thanh tìm kiếm
  const toggleSearch = () => {
    if (isExpanded) {
      handleClear(); // Nếu đang mở, gọi handleClear khi nhấn nút xóa
    } else {
      setIsExpanded(true); // Nếu đang thu gọn, mở thanh tìm kiếm
    }
  };

  return (
    <div>
      <div className={`search-admin-container ${isExpanded ? "expanded" : ""}`}>
        <div className="search-admin-wrapper">
          <FontAwesomeIcon className="search-icon" icon={faSearch} onClick={toggleSearch} />
          <input
            type="text"
            className="search-input"
            placeholder={placeholder || "Tìm kiếm..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {isExpanded && (
            <FontAwesomeIcon className="clear-icon" icon={faTimes} onClick={toggleSearch} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
