import React, { useState } from "react";

const FilterSearch = ({
  prefix,
  onFilterChange, // Prop từ cha
}: {
  prefix: string;
  onFilterChange: (filters: any) => void; // Định nghĩa kiểu dữ liệu của bộ lọc
}) => {
  interface Filters {
    area: string;
    price: string;
    surrounding: string[];
  }

  const [filters, setFilters] = useState<Filters>({
    area: "",
    price: "",
    surrounding: [],
  });

  const resetFilters = () => {
    setFilters({
      area: "",
      price: "",
      surrounding: [],
    });
    onFilterChange({
      minArea: 0, // Đặt lại giá trị minArea về 0
      maxArea: 0, // Đặt lại giá trị maxArea về 0
      minPrice: 0, // Đặt lại giá trị minPrice về 0
      maxPrice: 0, // Đặt lại giá trị maxPrice về 0
      surrounding: [], // Đặt lại các tùy chọn xung quanh
    });
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFilters((prev) => {
      const surrounding = checked
        ? [...prev.surrounding, value]
        : prev.surrounding.filter((item) => item !== value);
      return { ...prev, surrounding };
    });
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  //tìm kiếm ở đây
  const handleSearch = () => {
    const mappedFilters = {
      minArea: filters.area
        ? filters.area === "1"
          ? 0
          : filters.area === "2"
          ? 0
          : filters.area === "3"
          ? 0
          : 25
        : null,
      maxArea: filters.area
        ? filters.area === "1"
          ? 15
          : filters.area === "2"
          ? 20
          : filters.area === "3"
          ? 25
          : 0
        : null,
      minPrice: filters.price
        ? filters.price === "1"
          ? 0
          : filters.price === "2"
          ? 0
          : filters.price === "3"
          ? 0
          : 3000000
        : null,
      maxPrice: filters.price
        ? filters.price === "1"
          ? 1000000
          : filters.price === "2"
          ? 2000000
          : filters.price === "3"
          ? 3000000
          : 0
        : null,
      surrounding: filters.surrounding.length ? filters.surrounding : null,
    };
    onFilterChange(mappedFilters);
  
  };
  return (
    <div className="filter-motel-search">
      <div className="filter-motel-header">
        <h2 className="h2-filter-motel">
          <i className="fa-solid fa-filter fa-lg"></i> Lọc kết quả
        </h2>
      </div>
      <div className="filter-motel-body">
        <div className="accordion" id="accordionPanelsStayOpenExample">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseOne"
                aria-expanded="true"
                aria-controls="panelsStayOpen-collapseOne"
              >
                Diện tích
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseOne"
              className="accordion-collapse collapse show"
            >
              <div className="accordion-body">
                {["1", "2", "3", "4"].map((value, idx) => (
                  <label
                    key={idx}
                    className="radio"
                    htmlFor={`${prefix}_area_${value}`}
                  >
                    <input
                     type="radio"
                     id={`${prefix}_area_${value}`}
                     name="area"
                     value={value}
                     checked={filters.area === value}
                     onChange={handleRadioChange}
                    />
                    <span></span>
                    <p>
                      {value === "1" && "Dưới 15 m²"}
                      {value === "2" && "Dưới 20 m²"}
                      {value === "3" && "Dưới 25 m²"}
                      {value === "4" && "Trên 25 m²"}
                    </p>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseTwo"
                aria-expanded="false"
                aria-controls="panelsStayOpen-collapseTwo"
              >
                Giá
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseTwo"
              className="accordion-collapse collapse show"
            >
              <div className="accordion-body">
                {["1", "2", "3", "4"].map((value, idx) => (
                  <label
                    key={idx}
                    className="radio"
                    htmlFor={`${prefix}_price_${value}`}
                  >
                    <input
                      type="radio"
                      id={`${prefix}_price_${value}`}
                      name="price"
                      value={value}
                      checked={filters.price === value}
                      onChange={handleRadioChange}
                    />
                    <span></span>
                    <p>
                      {value === "1" && "Dưới 1 triệu/tháng"}
                      {value === "2" && "Dưới 2 triệu/tháng"}
                      {value === "3" && "Dưới 3 triệu/tháng"}
                      {value === "4" && "Trên 3 triệu/tháng"}
                    </p>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseThree"
                aria-expanded="false"
                aria-controls="panelsStayOpen-collapseThree"
              >
                Môi trường xung quanh
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseThree"
              className="accordion-collapse collapse show"
            >
              <div className="accordion-body">
                {["chợ", "siêu thị", "trường", "bệnh viện", "công viên"].map(
                  (value, idx) => (
                    <label
                      key={idx}
                      className="checkbox"
                      htmlFor={`${prefix}_${value}`}
                    >
                      <input
                        type="checkbox"
                        id={`${prefix}_${value}`}
                        value={value}
                        checked={filters.surrounding.includes(value)}
                        onChange={handleCheckboxChange}
                      />
                      <span></span> 
                      <p className="mb-0">
                        {value === "chợ" && "Chợ"}
                        {value === "siêu thị" && "Siêu thị"}
                        {value === "trường" && "Trường học"}
                        {value === "bệnh viện" && "Bệnh viện"}
                        {value === "công viên" && "Công viên"}
                      </p>
                    </label>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="filter-motel-footer">
        <button className="btn-transform-y2" onClick={handleSearch}>
          Tìm kiếm
        </button>
        <button className="btn-transform-y2" onClick={resetFilters}>
          Xóa bộ lọc
        </button>
      </div>
    </div>
  );
};

export default FilterSearch;
