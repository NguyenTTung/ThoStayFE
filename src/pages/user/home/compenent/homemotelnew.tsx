import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RoomType, getSaleRoomTypeApi } from '@/services/api/HomeApi'
import {
  faLocationDot,
  faMoneyBill,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";


import { useNavigate } from "react-router-dom";
function HomeMotelNew() {
  const [roomtypes, setroomtypes] = useState<RoomType[]>([]);
  useEffect(() => {
    const fetchOutstandingMotels = async (data: RoomType) => {
      try {
        const response = await getSaleRoomTypeApi(data);
        console.log(response)
        setroomtypes(response.data); // Gán dữ liệu vào state


      } catch (error) {
        console.error("Failed to fetch outstanding motels:", error);
      };
    };


    fetchOutstandingMotels({ id: 0, price: 0, name: "", address: "", images: [] });
  }, []);
  console.log(roomtypes);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };
  const navigate = useNavigate();

  const handleMotelClick = (id: number) => {
    navigate(`/detailmoteluser/${id}`); // Navigate to the motel detail page using its ID
  };

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
  const handleSearch = () => {
    console.log("Giá trị bộ lọc hiện tại: ", selectedProvince.name, selectedDistrict.name, selectedWard);
    const searchLink = `/search?Province=${encodeURIComponent(selectedProvince.name)}&District=${encodeURIComponent(selectedDistrict.name)}&Ward=${encodeURIComponent(selectedWard)}&search=${encodeURIComponent(searchQuery)}`;
    navigate(searchLink);
  };
  return (
    <>
      <section className="home-show-motel-1 mt-5">

        <div className="row justify-content-between align-items-center">
          <div className="col-12 col-lg-6 ">
            <h2 className="mb-0">PHÒNG TRỌ GIÁ RẺ</h2>
          </div>

        </div>
        <div className="row">
          {roomtypes && roomtypes.length > 0 ? (
            roomtypes.map((roomtype, index) => (
              <div key={index} className="col-6 col-md-4 col-lg-4 col-xl-3 mt-3 ngontay-hover" onClick={() => handleMotelClick(roomtype.id)}>
                {/* Slider */}
                <div className="border-motel-info-home">
                <div className="">
                  <div
                    id={`carouselExampleIndicators-1-${roomtype.id}`}
                    className="carousel slide"
                    data-bs-ride="carousel"
                  >
                    <div className="carousel-indicators mb-0">
                      {roomtype.images &&
                        roomtype.images.length > 0 &&
                        roomtype.images.map((_, imgIndex) => (
                          <button
                            key={`${imgIndex}`}
                            type="button"
                            data-bs-target={`#carouselExampleIndicators-1-${roomtype.id}`}
                            data-bs-slide-to={imgIndex}
                            className={imgIndex === 0 ? "active" : ""}
                            aria-label={`Slide ${imgIndex + 1}`}
                            onClick={(e) => e.stopPropagation()}
                          ></button>
                        ))}
                    </div>
                    <div className="carousel-inner rounded-4 position-relative">
                      {roomtype.images &&
                        roomtype.images.length > 0 &&
                        roomtype.images.map((img, imgIndex) => (
                          <div
                            key={`${imgIndex}`}
                            className={`position-relative carousel-item ${imgIndex === 0 ? "active" : ""
                              }`}
                          >
                            <img
                              src={img.link || "#"}
                              className="img-slider-home-motel"
                              alt={`RoomType ${imgIndex + 1} Image ${imgIndex + 1}`}
                            />
                          </div>
                        ))}
                      <div className="Icon-Vip-user-home">
                        {/* <i className="fa-solid fa-crown"></i> */}
                      </div>
                    </div>
                    <button
                      className="carousel-control-prev"
                      type="button"
                      data-bs-target={`#carouselExampleIndicators-1-${index}`}
                      data-bs-slide="prev"
                      onClick={(e) => e.stopPropagation()}
                    ></button>
                    <button
                      className="carousel-control-next"
                      type="button"
                      data-bs-target={`#carouselExampleIndicators-1-${index}`}
                      data-bs-slide="next"
                      onClick={(e) => e.stopPropagation()}
                    ></button>
                  </div>
                </div>
                {/* Phần chữ */}
                <div className="mt-3">
                  <h5 className="name-motel-home-1">{roomtype.name || "N/A"}</h5>
                  <p className="dia-chi-motel-home-1">
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      size="lg"
                      color="#ff522a"
                      className="icon-table-motel me-2"
                    />
                    {roomtype.address || "Address not available"}
                  </p>
                  {/* Hiển thị giá từ roomType */}
                  <span key={index} className="price-home-1">
                    <FontAwesomeIcon
                      icon={faMoneyBill}
                      size="lg"
                      color="#298B90"
                      className="icon-table-motel me-2"
                    />
                    {formatPrice(roomtype.price)}đ
                  </span>
                </div>
                </div>

              </div>
            ))
          ) : (
            <div className="col-12 mt-3">
              <p className="text-center text-muted">
                Hiện tại chưa có phòng loại này.
              </p>
            </div>
          )}


        </div>
        <div className="d-flex justify-content-center ">
          <button className="btn mt-3 btn-create-notification btn-transform-y2 rounded-pill d-flex align-items-center" onClick={handleSearch}>
            <FontAwesomeIcon
              icon={faSpinner}
              size="sm"
              color=""
              className="me-2 fa-spin"
            ></FontAwesomeIcon>
            Xem thêm
          </button>
        </div>
      </section>
    </>
  );
}

export default HomeMotelNew;
