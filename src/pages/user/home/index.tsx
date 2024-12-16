import "../home/home.scss";
import HomeMotelHot from "./compenent/homemotelhot";
import HomeMotelNew from "./compenent/homemotelnew";
import { useEffect, useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";


export const Home = () => {
  //motel nha
  type LocationOption = {
    name: string;
    code: number | null;
  };
  const [provinces, setProvinces] = useState<LocationOption[]>([]);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [wards, setWards] = useState<LocationOption[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<LocationOption>({
    name: "Tỉnh",
    code: null,
  });
  const [selectedDistrict, setSelectedDistrict] = useState<LocationOption>({
    name: "Thành phố",
    code: null,
  });
  const [selectedWard, setSelectedWard] = useState<string>("Phường");
  const [searchQuery, setSearchQuery] = useState<string>("");
  useEffect(() => {
    // Lấy danh sách tỉnh
    axios
      .get("https://provinces.open-api.vn/api/p/")
      .then((response) => setProvinces(response.data))
      .catch((error) => console.error("Error fetching provinces:", error));
  }, []);

  useEffect(() => {
    if (selectedProvince.code) {
      // Lấy danh sách quận/huyện khi tỉnh được chọn
      axios
        .get(
          `https://provinces.open-api.vn/api/p/${selectedProvince.code}/?depth=2`
        )
        .then((response) => setDistricts(response.data.districts))
        .catch((error) => console.error("Error fetching districts:", error));
    }
    setSelectedDistrict({ name: "Thành phố", code: null });
    setWards([]);
    setSelectedWard("Phường");
  }, [selectedProvince]);



  useEffect(() => {
    if (selectedDistrict.code) {
      // Lấy danh sách phường/xã khi quận/huyện được chọn
      axios
        .get(
          `https://provinces.open-api.vn/api/d/${selectedDistrict.code}/?depth=2`
        )
        .then((response) => setWards(response.data.wards))
        .catch((error) => console.error("Error fetching wards:", error));
    }
    setSelectedWard("Phường");
  }, [selectedDistrict]);

  const navigate = useNavigate();
  const handleSearch = () => {
   
    const searchLink = `/search?Province=${encodeURIComponent(selectedProvince.name)}&District=${encodeURIComponent(selectedDistrict.name)}&Ward=${encodeURIComponent(selectedWard)}&search=${encodeURIComponent(searchQuery)}`;
    navigate(searchLink);
  };
  return (
    <div className="container">
      <section className="header-home">
        <div className="row ">
          <div className="col-12 col-lg-6 order-2 order-lg-1 d-flex align-items-lg-center mt-3">
            <div className="w-100 w-lg-75">
              <h1 className="hero-text-header-home">
                Tìm Kiếm và Thuê Phòng Uy Tín, Nhanh Chống
              </h1>
              <span className="hero-text-content-home text-justify">
                Dịch vụ tìm phòng trọ trực quan, nhanh chóng. Đa dạng lựa
                chọn, hỗ trợ từ tìm kiếm đến ký hợp đồng.
              </span>
              <br></br>
              <button className="btn mt-3 btn-create-notification btn-transform-y2 rounded-pill">
                Tìm trọ ngay
              </button>
            </div>
          </div>
          <div className="col-12 col-lg-6 order-1 order-lg-2">
            <img
              src="src/assets/images/backgrounds/Silehome.png"
              className="img-fluid "
            ></img>
          </div>
        </div>
      </section>
      <section>
        <div className="mt-3 d-flex justify-content-center">
          <div className="px-4 shadow-sm search-box">
            <div className="d-lg-flex align-items-center search-box-flex-row">
              <div className="flex-lg-fill timkiem-search-box col-12 col-sm-12 col-md-12">
                <div className="input-search-home-motel-1 flex-nowrap input-group-lg">
                  <input
                    type="text"
                    className="form-control border-0"

                    placeholder="Tìm kiếm trọ"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <span className="bg-transparent border-0 p-0">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </span>
                </div>
              </div>
              <div className="divider px-3">
                <div className="line"></div>
              </div>
              <div className="flex-lg-fill d-flex align-items-center dropdown-search-box col-12 col-sm-12 col-md-12 justify-content-md-between">
                <div className="dropdown mx-2 my-2 flex-lg-fill">
                  <button
                    className="btn-dropdown-home px-3 py-2 btn-transform-y2 rounded-pill dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {selectedProvince.name}
                  </button>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuButton1"
                  >
                    {provinces.map((province) => (
                      <li key={province.code}>
                        <a
                          className="dropdown-item"
                          onClick={() =>
                            setSelectedProvince({
                              name: province.name,
                              code: province.code,
                            })
                          }
                        >
                          {province.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="dropdown mx-2 my-2 flex-lg-fill">
                  <button
                    className="btn-dropdown-home px-3 py-2 btn-transform-y2 rounded-pill dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton2"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    disabled={!selectedProvince.code}
                  >
                    {selectedDistrict.name}
                  </button>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuButton2"
                  >
                    {districts.map((district) => (
                      <li key={district.code}>
                        <a
                          className="dropdown-item"
                          onClick={() =>
                            setSelectedDistrict({
                              name: district.name,
                              code: district.code,
                            })
                          }
                        >
                          {district.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="dropdown mx-2 my-2 flex-lg-fill">
                  <button
                    className="btn-dropdown-home px-3 py-2 btn-transform-y2 rounded-pill dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton3"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    disabled={!selectedDistrict.code}
                  >
                    {selectedWard}
                  </button>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuButton3"
                  >
                    {wards.map((ward) => (
                      <li key={ward.code}>
                        <a
                          className="dropdown-item"
                          onClick={() => setSelectedWard(ward.name)}
                        >
                          {ward.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="divider px-3">
                <div className="line"></div>
              </div>
              <div className="d-flex justify-content-center flex-lg-fill button-search-box col-12 col-sm-12 col-md-12 justify-content-sm-start">
                <button className="btn btn-create-notification btn-transform-y2 rounded-pill d-flex align-items-center text-nowrap justify-content-md-center" onClick={handleSearch}>
                  Tìm kiếm theo địa chỉ
                  <i className="fa-solid fa-magnifying-glass ms-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <HomeMotelHot />
      <HomeMotelNew />
      <section className="header-home mt-4">
        <div className="row ">
          <div className="col-12 col-lg-6 order-2 order-lg-1 d-flex align-items-lg-center mt-3">
            <div className="w-100 w-lg-75">
              <h1 className="hero-text-header-home">
                Tại sao bạn chọn chúng tôi?{" "}
              </h1>
              <span className="hero-text-content-home-2 text-justify">
                Trang web của chúng tôi tập trung phục vụ đúng nhu cầu của
                người cho thuê và người tìm phòng, với giao diện thân thiện và
                các tính năng tối ưu để quản lý tin đăng hiệu quả.
              </span>
              <br></br>
              <button className="btn mt-3 btn-create-notification btn-transform-y2 rounded-pill">
                Đọc thêm
              </button>
            </div>
          </div>
          <div className="col-12 col-lg-6 order-1 order-lg-2">
            <img
              src="src/assets/images/backgrounds/img-home-bottom.png"
              className="img-fluid "
            ></img>
          </div>
        </div>
      </section>
    </div>
  );
};
