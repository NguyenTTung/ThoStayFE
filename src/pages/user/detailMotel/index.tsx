import { useState, useEffect } from "react";
import "../detailMotel/detaimotel.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { GetRoomTypeID } from "@/services/api/HomeApi";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import RelevantMotel from "./components/relevantmotel";
export const DetailMotelUser = () => {
  interface Motel {
    name: string;
    address: string;
    price: string;
    images: { id: number; link: string; type: string }[];
    updateDate: string;
    area: number;
    fullName: string;
    phoneNumber: string;
    email: string;
    roomTypeCount: number;
    description: string;
  }
  const { id } = useParams<{ id: string }>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 5; // Số ảnh nhỏ hiển thị tối đa mỗi lần
  const [motel, setMotel] = useState<Motel | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Thêm state isLoading
  useEffect(() => {
    setIsLoading(true);
    setMotel(null); // Reset dữ liệu cũ
    if (id) {
      GetRoomTypeID(Number(id))
        .then((res) => {
          const fetchedMotel: Motel = res.data.data;
          setMotel(fetchedMotel);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching motel:", error);
          setIsLoading(false);
        });
    }
  }, [id]);
  //log data
  console.log("Motel:", motel);
  console.log("Images:", motel?.images);

  const handleNext = () => {
    if (!motel?.images?.length) return;
    setCurrentIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % motel.images.length;
      return nextIndex;
    });
  };

  const handlePrev = () => {
    if (!motel?.images?.length) return;
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + motel.images.length) % motel.images.length
    );
  };

  // Hiển thị các ảnh tuần hoàn từ currentIndex
  const displayedImages = [];
  for (let i = 0; i < itemsPerPage; i++) {
    const index = (currentIndex + i) % (motel?.images.length || 1); // Sử dụng optional chaining để kiểm tra motel?.images
    displayedImages.push(motel?.images[index]);
  }

  const [isPhoneVisible, setIsPhoneVisible] = useState(false);

  const handleClick = () => {
    if (isPhoneVisible && motel?.phoneNumber) {
      handleZaloRedirect(motel.phoneNumber); // Chỉ thực hiện khi bấm lần thứ 2
    } else {
      setIsPhoneVisible(true); // Hiển thị số điện thoại khi bấm lần đầu
    }
  };

  const handleZaloRedirect = (phoneNumber: string) => {
    if (!phoneNumber) return;
    // Tạo URL deep link của Zalo
    const zaloLink = `https://zalo.me/${phoneNumber}`;
    // Mở link Zalo trong một tab mới
    window.open(zaloLink, "_blank");
  };
  if (isLoading) {
    return <div className="loading-spinner">Đang tải dữ liệu...</div>;
  }

  if (!motel) {
    return (
      <div className="error-message">Không tìm thấy thông tin nhà trọ.</div>
    );
  }
  return (
    <div className="bgr-detail-motel-user pb-3">
      <div className="container pt-4">
        <section className="">
          <div className="row">
            <div className="col-12 col-sm-12 col-lg-9">
              <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner img-detail-motel-user-slide">
                  {motel?.images.map((image, index) => (
                    <div
                      key={index}
                      className={`carousel-item ${index === 0 ? "active" : ""}`}
                    >
                      <img
                        src={image.link}
                        className="d-block w-100"
                        alt={`Slide ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
                <div className="carousel-indicators-container mt-3 d-flex">
                  {/* Hiển thị ảnh tuần hoàn */}
                  <button onClick={handlePrev} className="btn-prev">
                    <i className="fa-light fa-angle-left"></i>
                  </button>
                  {displayedImages.map((image, index) => {
                    const actualIndex =
                      (currentIndex + index) % (motel?.images?.length || 1); // Tính chỉ số thực
                    return (
                      <img
                        key={index}
                        src={image?.link}
                        data-bs-target="#carouselExampleIndicators"
                        data-bs-slide-to={actualIndex} // Sử dụng chỉ số thực
                        alt={`Slide ${actualIndex + 1}`}
                        className="indicator mx-1"
                      />
                    );
                  })}
                  <button onClick={handleNext} className="btn-next">
                    <i className="fa-light fa-angle-right"></i>
                  </button>
                </div>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide="prev"
                ></button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide="next"
                ></button>
              </div>
              {/* thông tin trọ */}
              <div className="mt-4 bgr-detail-motel-text-user p-4 ">
                <h2 className="name-detail-motel-user">{motel?.name}</h2>
                <div className="d-flex mt-3 align-items-center">
                  <h3 className="me-3 mb-0 price-detail-motel-user">
                    Giá: {Number(motel?.price)?.toLocaleString("vi-VN")}đ /
                    tháng
                  </h3>
                  <FontAwesomeIcon
                    icon={faCircle}
                    size="sm"
                    color="#0B1A46"
                    className="me-3"
                  />
                  <h3 className="mb-0 area-detail-motel-user">
                    Diện tích: {motel?.area}M<sup>2</sup>
                  </h3>
                </div>
                <h5 className="mt-3 mb-0 text-deltail-motel-user">
                  <i className="fa-light fa-location-dot me-1"></i>
                  {motel?.address}
                </h5>
                <h5 className="mt-3 mb-0 text-deltail-motel-user">
                  <i className="fa-light fa-clock me-1"></i>Thời gian cập nhật
                  lần cuối:{" "}
                  {format(
                    motel?.updateDate
                      ? new Date(motel?.updateDate)
                      : new Date(),
                    "dd/MM/yyyy"
                  )}{" "}
                </h5>
                <h4
                  className="mt-5 mb-0 motachitiet-deltail-motel-user"
                  dangerouslySetInnerHTML={{ __html: motel?.description || "" }}
                ></h4>
              </div>
            </div>
            <div className="col-12 col-sm-12 col-lg-3 ">
              {/* Code phần chủ trọ vô đây */}
              <div className="bgr-detail-motel-user p-4">
                <div className="row">
                  <div className="col-3 width-height">
                    <img
                      src="https://png.pngtree.com/png-vector/20240131/ourlarge/pngtree-circle-greek-frame-round-meander-border-decoration-pattern-png-image_11520606.png"
                      alt="user-avatar"
                      className="img-fluid rounded-circle"
                    />
                  </div>
                  <div className="col-9 text-nowrap overflow-hidden">
                    <h5>{motel?.fullName}</h5>
                    <h6 className="color-xam">{motel?.email}</h6>
                  </div>
                </div>
                <div>
                  <p className="text-detail-motel-user">
                    Tổng dãy trọ có trên{" "}
                    <a href="#" className="header-thotay">
                      Thỏ Stay
                    </a>
                    : {motel?.roomTypeCount}
                  </p>
                </div>
                <div>
                  <button
                    className="btn mt-3 btn-create-notification btn-transform-y2 rounded-3 w-100"
                    onClick={handleClick}
                  >
                    {isPhoneVisible
                      ? motel?.phoneNumber
                      : `${motel?.phoneNumber.slice(0, -3)}***`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="mt-5">
          {/* code phần trọ tương tự ở đây 
            có thể copy từ homemotelnew */}
          <RelevantMotel address={motel?.address || ""} currentMotelId={id} />
        </section>
      </div>
    </div>
  );
};
