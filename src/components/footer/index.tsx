import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faGlobe, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons'; // Icon từ gói solid
import { faFacebookF, faLinkedinIn, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons'; // Icon từ gói brands
import "./styles/footer.scss";

const Footer = () => {
  return (
    <div className="container-fluid bgr-img-footer py-5">
      <div className="container">
        <div className="bg-input-footer-search p-4 rounded-3">
          <div className="row px-3">
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6 col-xxl-6">
              <h6 className="h6-footer">Cung cấp và cho thuê phòng trọ</h6>
              <p className="p-footer-form">Tham gia vào cộng đồng Thỏ Stay của chúng tôi</p>
            </div>
            <div className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6 col-xxl-6">
              <form className="Form-footer-submit">
                <input className="form-control rounded-2 input-bgr-footer" placeholder="Nhập địa chỉ email của bạn"></input>
                <button className="btn rounded-2 button-bgr-footer btn-create-notification btn-transform-y2">Đăng ký ngay</button>
              </form>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <div className="row justify-content-between">
            <div className="colum-footer-1 margin-footer-mobie-1 col-12 col-sm-12 col-md-5 col-lg-5 col-xl-3 col-xxl-3 text-center text-md-start text-lg-start text-xl-start text-xxl-start">

              <div className='d-flex align-items-center'>
                <img src="/src/assets/images/Logo-New.png" className='w-25' alt="logo" />
                <p className='fs-10 m-0 text-dark ms-2'>Thỏ Stay</p>
              </div>

              <p className="p-footer-tieusu mt-2">Thỏ Stay luôn đặt mục tiêu mang đến cho khách hàng không gian sống tiện nghi, sạch sẽ, giá cả hợp lý, phù hợp cho sinh viên và người lao động tìm kiếm nơi an cư lâu dài.</p>
              <div className="d-flex justify-content-center  justify-content-md-start justify-content-xl-start justify-content-lg-start justify-content-xxl-start">
                <div className="icon-footer-col-1 mx-2">
                  <FontAwesomeIcon icon={faFacebookF} size="lg" color="#138086" />
                </div>
                <div className="icon-footer-col-1 mx-2">
                  <FontAwesomeIcon icon={faTwitter} size="lg" color="#138086" />
                </div>
                <div className="icon-footer-col-1 mx-2">
                  <FontAwesomeIcon icon={faLinkedinIn} size="lg" color="#138086" />
                </div>
                <div className="icon-footer-col-1 mx-2">
                  <FontAwesomeIcon icon={faYoutube} size="lg" color="#138086" />
                </div>

              </div>
            </div>
            <div className="colum-footer-1 col-6 col-sm-6 col-md-5 col-lg-5 col-xl-2 col-xxl-2 text-start text-md-start text-lg-start text-xl-start text-xxl-start">
              <h3 className="h3-footer-quick">Liên kết</h3>
              <div className="mt-4">
                <ul className="list-unstyled">
                  <li className="my-2"><a className="a-footer-quick" href="/">Trang chủ</a></li>
                  <li className="my-2"><a className="a-footer-quick" href="#">Danh sách trọ</a></li>
                  <li className="my-2"><a className="a-footer-quick" href="#">Tìm kiếm</a></li>
                  <li className="my-2"><a className="a-footer-quick" href="#">Giới thiệu</a></li>
                  <li className="my-2"><a className="a-footer-quick" href="#"></a></li>
                </ul>
              </div>

            </div>
            <div className="colum-footer-1 col-6 col-sm-6 col-md-5 col-lg-5 col-xl-2 col-xxl-2 text-start text-md-start text-lg-start text-xl-start text-xxl-start">
              <h3 className="h3-footer-quick">Dịch vụ</h3>
              <div className="mt-4">
                <ul className="list-unstyled">
                  <li className="my-2"><a className="a-footer-quick" href="#">Wifi miễn phí</a></li>
                  <li className="my-2"><a className="a-footer-quick" href="#">Đỗ xe miễn phí</a></li>
                  <li className="my-2"><a className="a-footer-quick" href="#">Tiện ích phòng</a></li>
                  <li className="my-2"><a className="a-footer-quick" href="#">Dịch vụ điện nước miễn phí</a></li>
                  <li className="my-2"><a className="a-footer-quick" href="#">Dịch vụ nước miễn phí</a></li>
                </ul>
              </div>

            </div>
            <div className="colum-footer-1 col-12 col-sm-12 col-md-5 col-lg-5 col-xl-3 col-xxl-3 text-start text-md-start text-lg-start text-xl-start text-xxl-start">
              <h3 className="h3-footer-quick">Liên hệ</h3>
              <div className="mt-4">
                <ul className="list-unstyled">
                  <li className=" a-footer-quick d-flex justify-content-start justify-content-md-start justify-content-lg-start justify-content-xl-start justify-content-xxl-start">
                    <FontAwesomeIcon className="me-2" icon={faPhone} size="lg" color="#138086" /> <p> +(84)9653812674</p>
                  </li>
                  <li className=" a-footer-quick d-flex justify-content-start justify-content-md-start justify-content-lg-start justify-content-xl-start justify-content-xxl-start">

                    <FontAwesomeIcon className="me-2" icon={faEnvelope} size="lg" color="#138086" /> <p>thostay@gmail.com</p>
                  </li>
                  <li className=" a-footer-quick d-flex justify-content-start justify-content-md-start justify-content-lg-start justify-content-xl-start justify-content-xxl-start">
                    <FontAwesomeIcon className="me-2" icon={faGlobe} size="lg" color="#138086" /> <p>thostay.com</p>

                  </li>
                  <li className=" a-footer-quick d-flex justify-content-start justify-content-md-start justify-content-lg-start justify-content-xl-start justify-content-xxl-start">
                    <FontAwesomeIcon className="me-2" icon={faLocationDot} size="lg" color="#138086" /> <p>300 Hà Huy Tập, Tân An, TP-Buôn Ma Thuộc, Đắk Lắk</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
