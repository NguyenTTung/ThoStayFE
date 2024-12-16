import { faLocationDot, faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { getRelatedApi } from "@/services/api/HomeApi";
import { useNavigate } from "react-router-dom";
interface RelevantMotelProps {
  address: string | undefined;
  currentMotelId: string | undefined;
}

interface Motel {
  id: number;
  name: string;
  address: string;
  price: string;
  images: [{ id: string; link: string; type: string }];
}

function RelevantMotel({ address, currentMotelId }: RelevantMotelProps) {
  const [motels, setMotels] = useState<Motel[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;
  const navigate = useNavigate();
  const handleMotelClick = (id: number) => {
    console.log("Motel ID: cô mà nhỉ ", id);
    navigate(`/detailmoteluser/${id}`);
  };
  // Lấy dữ liệu từ API khi component được render
  useEffect(() => {
    if (typeof address === "string" && address.trim() !== "") {
      getRelatedApi(address)
        .then((response) => {
          const motels = response.data.data.value;
          const filteredMotels = motels.filter(
            (motel: Motel) => motel.id !== Number(currentMotelId)
          );
          setMotels(filteredMotels);
        })

        .catch((error) => {
          console.error("Lỗi khi lấy dữ liệu:", error);
        });
    } else {
      console.error("Địa chỉ không hợp lệ:", address);
    }
  }, [address, currentMotelId]);
  console.log(motels);
  console.log(address);
  // Xác định dãy trọ hiển thị theo kiểu tuần hoàn
  const displayedMotels = Array.from(
    { length: itemsPerPage },
    (_, i) => motels[(currentIndex + i) % motels.length]
  );

  // Hàm xử lý nút tiến (tuần hoàn)
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % motels.length);
  };

  // Hàm xử lý nút lùi (tuần hoàn)
  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + motels.length) % motels.length
    );
  };

  return (
    <>
      <section className="home-show-motel-2 mt-5">
        <div className="row">
          <div className="col-12 col-lg-6">
            <h2>Trọ liên quan</h2>
            <p>Phòng trọ tháng: 12</p>
          </div>
          <div className="col-12 col-lg-6 d-flex justify-content-end">
            <div className="d-flex">
              <button
                type="button"
                className="btn-home-motel-slide-new rounded-circle me-2"
                onClick={handlePrev}
              >
                <i className="fa-light fa-angle-left icon-table-motel fa-lg"></i>
              </button>
              <button
                type="button"
                className="btn-home-motel-slide-new rounded-circle"
                onClick={handleNext}
              >
                <i className="fa-light fa-angle-right icon-table-motel fa-lg"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="row motol-new-index">
          {motels.length > 0 ? (
            displayedMotels.map((motel, index) =>
              motel &&
              motel.images &&
              Array.isArray(motel.images) &&
              motel.images.length > 0 ? (
                <div
                  key={index}
                  className="col-6 col-md-4 col-lg-4 col-xl-3 mt-3"
                >
                  <div className="border-motel-info-home">
                    {/* Slider */}
                    <div
                      className="ngontay-hover"
                      onClick={() => handleMotelClick(motel.id)}
                    >
                      <div
                        id={`carouselExampleIndicators-2-${index}`}
                        className="carousel slide"
                        data-bs-ride="carousel"
                      >
                        <div className="carousel-indicators mb-0">
                          {motel.images &&
                            motel.images.length > 0 &&
                            motel.images.map((image, imgIndex) => (
                              <button
                                key={`${imgIndex}`}
                                type="button"
                                data-bs-target={`#carouselExampleIndicators-2-${index}`}
                                data-bs-slide-to={imgIndex}
                                className={imgIndex === 0 ? "active" : ""}
                                aria-label={`Slide ${imgIndex + 1}`}
                                onClick={(e) => e.stopPropagation()}
                              ></button>
                            ))}
                        </div>
                        <div className="carousel-inner position-relative">
                          {motel.images &&
                            motel.images.length > 0 &&
                            motel.images.map((image, imgIndex) => (
                              <div
                                key={imgIndex}
                                className={`carousel-item ${
                                  imgIndex === 0 ? "active" : ""
                                } position-relative`}
                              >
                                <img
                                  src={image.link}
                                  className="img-slider-home-motel rounded-3"
                                  alt={`Motel Image ${imgIndex + 1}`}
                                />
                              </div>
                            ))}
                          <div className="Icon-Vip-user-home">
                            {/* <i className="fa-solid fa-crown"></i> */}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Phần chữ */}
                    <div className="mt-3">
                      <h5 className="name-motel-home-1">{motel.name}</h5>
                      <p className="dia-chi-motel-home-1">
                        <FontAwesomeIcon
                          icon={faLocationDot}
                          size="lg"
                          color="#ff522a"
                          className="icon-table-motel me-2"
                        />
                        {motel.address}
                      </p>
                      <span className="price-home-1">
                        <FontAwesomeIcon
                          icon={faMoneyBill}
                          size="lg"
                          color="#298B90"
                          className="icon-table-motel me-2"
                        />
                        {Number(motel?.price)?.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                // Nếu không có ảnh, không render gì
                <div
                  key={index}
                  className="col-6 col-md-4 col-lg-4 col-xl-3 mt-3"
                >
                  <p>Không có hình ảnh</p>
                </div>
              )
            )
          ) : (
            <p>Không có dữ liệu dãy trọ.</p>
          )}
        </div>
      </section>
    </>
  );
}

export default RelevantMotel;
