import React, { useEffect, useState } from "react";
import { useLocation, } from "react-router-dom";
import FilterSearch from "./compenent/filtersearch";
import { getSearchMotelApi } from "@/services/api/HomeApi";
import "../search/search.scss";
import { useNavigate } from "react-router-dom";

export const SearchMotel = () => {
  interface Motel {
    id: number;
    images: { id: number; link: string; type: string }[];
    name: string;
    price: string;
    address: string;
    area: string;
  }

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [motels, setMotels] = useState<Motel[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortOption, setSortOption] = useState<string>(""); // Default sort

  const province = queryParams.get("Province") || "";
  const district = queryParams.get("District") || "";
  const ward = queryParams.get("Ward") || "";
  const search = queryParams.get("search") || "";

  const [filters, setFilters] = useState({
    minArea: 0,
    maxArea: 0,
    minPrice: 0,
    maxPrice: 0,
    surrounding: [],
  });


  useEffect(() => {
    const fetchMotels = async () => {
      setLoading(true);
    

      try {
        const response = await getSearchMotelApi(province, district, ward, search, currentPage, sortOption,
          filters.minPrice,
          filters.maxPrice,
          filters.minArea,
          filters.maxArea,
          filters.surrounding || []
        ); // Pass sortOption to API
        if (response.data && response.data.data) {
          setMotels(response.data.data.list);
          setTotalPages(response.data.data.totalPage || 1);
        }
        else{
          setMotels([]);
          setTotalPages(0);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }

    };

    fetchMotels();
  }, [province, district, ward, search, currentPage, sortOption, filters]); // Add sortOption to dependencies

  const handlePageChange = async (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
   
    setCurrentPage(pageNumber);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value); // Update the sort option
  };

  const pageNumbers = Array.from({ length: totalPages || 1 }, (_, i) => i + 1);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const navigate = useNavigate();

  const handleMotelClick = (id: number) => {
    navigate(`/detailmoteluser/${id}`); // Navigate to the motel detail page using its ID
  };


  return (
    <div className="Search-motel-user pt-3 pb-5">
      <div className="container">
        <section className="mt-3 link-search">
          <div className="d-flex breadcrumbs-wrap">
            <span className="span-link">
              <a href="/" className="a-link">Trang chủ</a>
            </span>
            <span className="span-link"> /</span>
            <span className="span-link">
              <a href="/" className="a-link">Tìm kiếm</a>
            </span>
          </div>
        </section>
        <section className="mt-3">
          <div className="box-header-search">
            <h1 className="box-title">
              CHO THUÊ PHÒNG TRỌ BUÔN MA THUỘC RẺ, MỚI NHẤT
            </h1>
          </div>
        </section>
        <section className="mt-3 main-motel-search">
          <div className="row">
            <section className="col-12 col-lg-9 pe-lg-3 pe-xl-4 row">
              <div className="list-motel-search col-12">
                <div className="col-12 d-flex justify-content-between align-items-center flex-wrap">
                  <div className="d-none d-sm-none d-md-none d-lg-block count">
                    <strong>Tổng (Số) kết quả </strong>
                  </div>
                  <div className="arrange">
                    <div className="arrange-label">Sắp xếp theo: </div>
                    <div className="arrange-select">
                      <select
                        className="form-select px-2"
                        id="floatingSelect"
                        aria-label="Floating label select example"
                        value={sortOption} // Bind value to state
                        onChange={handleSortChange} // Handle sort change
                      >
                        <option value="">Mặc định</option>
                        <option value="new">Mới nhất</option>
                        <option value="price_asc">Tăng dần</option>
                        <option value="price_desc">Giảm dần</option>
                      </select>
                    </div>
                  </div>
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    <div className="row list-motel-filter-search">
                      {motels.map((motel) => (
                        <div className="col-12 mt-3" key={motel.id} >
                          <div className="item-list-motel row">
                            <div className="col-4 list-motel-img">
                              <a className="ngontay-hover" onClick={() => handleMotelClick(motel.id)}>
                                <img
                                  src={motel.images[0]?.link || "#"}
                                  alt="Hình ảnh không khả dụng"
                                  className="img-fluid"
                                />
                              </a>
                            </div>
                            <div className="col-8 list-motel-body">
                              <div className="motel-item-name">
                                <a className="motel-item-link ngontay-hover" onClick={() => handleMotelClick(motel.id)}>
                                  <h3 className="mb-0">{motel.name}</h3>
                                </a>
                              </div>
                              <div className="motel-item-price">
                                <small className="me-2">Giá: </small>
                                <span>{Number(motel?.price)?.toLocaleString('vi-VN')}đ/tháng</span>
                              </div>
                              <div className="motel-item-area">
                                <small className="me-2">Diện tích: </small>
                                <span>{motel?.area} M<sup>2</sup></span>
                              </div>
                              <div className="motel-item-address">
                                <i className="fa-thin fa-location-dot fa-lg me-2"></i>
                                <p>{motel.address}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="d-flex justify-content-center align-items-center mt-3 w-100">
                    <nav aria-label="Page navigation example">
                      <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                          <button
                            className="page-link btn-filter"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            &laquo;
                          </button>
                        </li>
                        {totalPages > 0 ? (
                          pageNumbers.map((number) => (
                            <li
                              className={`page-item `}
                              key={number}
                            >
                              <button
                                className={`page-link btn-filter ${number === currentPage ? "active-filter-motel" : ""}`}
                                onClick={() => handlePageChange(number)}
                              >
                                {number}
                              </button>
                            </li>
                          ))
                        ) : (
                          <li className="page-item disabled">
                            <span className="page-link">Không có trang</span>
                          </li>
                        )}
                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                          <button
                            className="page-link btn-filter"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            &raquo;
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </section>
            <section className="col-12 col-lg-3 ps-lg-3 ps-xl-4 d-none d-sm-none d-md-none d-lg-block">
              <FilterSearch prefix="main" onFilterChange={handleFilterChange} />
            </section>
          </div>
        </section>
      </div>
    </div>
  );
};
