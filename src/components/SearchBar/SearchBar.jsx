import "./SearchBar.modul.scss";
import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { searchDataService } from "../../services/dataService";
import FullPageSkeleton from "../Skeleton/FullPageSkeleton";
import { renderStars } from "../Cards/Cards";
import { Link, NavLink } from "react-router-dom";

const SearchBar = ({ onSearch, placeholder }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]); // Lưu kết quả tìm kiếm
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const inputRef = useRef(null); // State để Con trỏ tự focus vào ô input
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    () => {
      if (searchTerm.trim() !== "") {
        setIsDropdownVisible(true);
        setIsLoading(true); // Bắt đầu loading khi nhập

        const delayDebounceFn = setTimeout(async () => {
          try {
            // Gọi API tìm kiếm từ `dataService.js`
            const results = await searchDataService.getSearchSuggestions(
              searchTerm
            );
            setSearchResults(results); // Lưu kết quả vào state
          } catch (error) {
            console.error("Lỗi khi tìm kiếm:", error);
            setSearchResults([]);
          } finally {
            setIsLoading(false); // Dừng loading khi có kết quả
          }
        }, 400);

        return () => clearTimeout(delayDebounceFn);
      } else {
        setSearchResults([]);
        setIsDropdownVisible(false);
        setIsLoading(false);
      }
    },
    [searchTerm],
    [onSearch]
  );

  const handleClearAndClose = () => {
    setSearchTerm(""); // Xóa nội dung ô tìm kiếm
    setSearchResults([]); // Xóa kết quả tìm kiếm
    setIsDropdownVisible(false); // Ẩn dropdown
    setIsExpanded(false); // Đóng thanh tìm kiếm
    setIsLoading(false);
  };

  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setSearchTerm("");
      setSearchResults([]);
      setIsDropdownVisible(false);
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };
  return (
    <div>
      {isExpanded && (
        <div className="search-overlay" onClick={handleClearAndClose}></div>
      )}
      <div className={`search-container ${isExpanded ? "expanded" : ""}`}>
        <div className="search-wrapper">
          <FontAwesomeIcon
            className="search-icon"
            icon={faSearch}
            onClick={toggleSearch}
          />
          <input
            ref={inputRef} // Gắn ref vào input để con trỏ tự focus
            type="text"
            className="search-input"
            placeholder={placeholder || "Tìm kiếm..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsDropdownVisible(searchTerm.length > 0)}
          />
          {isExpanded && (
            <FontAwesomeIcon
              className="clear-icon"
              icon={faTimes}
              onClick={handleClearAndClose}
            />
          )}
        </div>
      </div>
      <div className="search-dropdown-wrapper">
        {isDropdownVisible && (
          <div className="search-dropdown">
            {isLoading ? ( // Hiển thị loading khi đang tìm kiếm
              <FullPageSkeleton message="Đang tìm kiếm..." />
            ) : searchResults.length > 0 ? (
              searchResults.map((result, index) => (
                <Link
                  to={`/movieinf/${result.movie_id}`}
                  onClick={handleClearAndClose}
                >
                  <div key={index} className="search-item">
                    <img
                      src={result.image || "/default-movie.jpg"}
                      alt={result.movie_name}
                    />
                    <div>
                      <h4>{result.movie_name}</h4>
                      <p>Diễn viên: {result.actor}</p>
                      <div className="render_stars">
                        {renderStars(result.rating)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="no-results">Không có kết quả phù hợp</p> //  Hiển thị khi không có kết quả
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
