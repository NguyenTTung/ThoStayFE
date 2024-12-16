import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Pagination, Navigation } from 'swiper/modules';
import { useEffect, useState } from "react";
import { postVnpayApi, VnPay } from "@/services/api/HomeApi";
import '../styles/motel.scss'
import { GetRentalRoomDetailAPI } from '@/services/api/HomeApi';
import Feedback from './feedback';
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from 'react-router-dom';
const Motel = () => {
    const location = useLocation(); // Lấy thông tin URL hiện tại
    const navigate = useNavigate();
    const [rentalDetail, setRentalDetail] = useState<any | null>(null);
    useEffect(() => {
        const token = localStorage.getItem("token");
        const fetchRetalRoomDetail = async () => {
            try {
                if (token) {
                    const response = await GetRentalRoomDetailAPI(token)
                    setRentalDetail(response.data)
                }
            } catch (error) {
                console.log("fetch error!!", error)
            }
        };
        fetchRetalRoomDetail();
    }, []);

    const handleVnPayPayment = async (billId: number, amount: number) => {
        console.log('Inside handleVnPayPayment');
        try {
            const vnpayPayload: VnPay = {
                orderId: billId.toString(),
                amount,
                returnUrl: `https://localhost:7299/api/Main/vnpay-return`,
            };
            const response = await postVnpayApi(vnpayPayload);
            if (response.status === 200) {
                window.location.href = response.data;

            } else {
                Swal.fire({
                    title: 'Chưa thanh toán',
                    text: 'Thanh toán thất bại',
                    icon: 'error',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
                navigate('/user/motel');
            }
        } catch (error: any) {
            console.error('Error creating order:', error.message);
            alert('An error occurred while creating the order');
        }
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const status = queryParams.get('status');
        const orderId = queryParams.get('orderId');

        if (status === 'success' && orderId) {
            Swal.fire({
                title: 'Thanh toán thành công',
                text: `Hóa đơn #${orderId} đã được thanh toán thành công.`,
                icon: 'success',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
            });

            window.history.replaceState({}, document.title, '/user/motel');
        } else if (status === 'fail') {
            Swal.fire({
                title: 'Thanh toán thất bại',
                text: 'Vui lòng thử lại.',
                icon: 'error',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
            });
            window.history.replaceState({}, document.title, '/user/motel');
        }
    }, [location.search]);

    const formatDate = (date: string) => {
        const formattedDate = new Date(date);
        return formattedDate.toLocaleDateString('vi-VN'); // Định dạng ngày theo kiểu Việt Nam (Ngày/Tháng/Năm)
    };
    return (
        <div className="container user-motel p-4">
            {rentalDetail ? (
                <div className="row align-items-center">
                    <div className="col-5">
                        <Swiper
                            slidesPerView={1}
                            spaceBetween={10}
                            loop={true}
                            pagination={{
                                clickable: true,
                            }}
                            navigation={true}
                            modules={[Pagination, Navigation]}
                            className="mySwiper rounded my-custom-swiper"
                        >
                            {rentalDetail.roomImages.map((image: any) => (
                                <SwiperSlide key={image.id}>
                                    <img src={image.link} alt="Room" className="slide-img" />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                    <div className="col-7 container">
                        <div className="row mb-3">
                            <div className="col-6">
                                <div className="motel text-dark">Dãy trọ: {rentalDetail.motelName}</div>
                                <div className="address text-dark">Địa chỉ: {rentalDetail.motelAdress}</div>
                                <div className="room text-dark">Phòng: {rentalDetail.roomNumber}</div>
                                <div className="price text-dark">Giá thuê: {rentalDetail.price} VNĐ</div>
                                <div className="area text-dark">Diện tích: {rentalDetail.area} m²</div>
                            </div>
                            <div className="col-6">
                                <div className="service-title text-dark">Dịch vụ tiện ích</div>
                                <div className="service text-dark">Điện: {rentalDetail.electricPrice.toLocaleString()} vnđ</div>
                                <div className="service text-dark">Nước: {rentalDetail.waterPrice.toLocaleString()} vnđ</div>
                                {rentalDetail.otherService.map((service: any, index: number) => (
                                    <div key={index} className="service text-dark">
                                        {service.name}: {service.price.toLocaleString()} vnđ
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-6">
                                <div className="infomation-title text-dark">Người thuê</div>
                                <div className="infomation text-dark">Tên người thuê: {rentalDetail.fullName}</div>
                                <div className="infomation text-dark">
                                    Ngày thuê: {formatDate(rentalDetail.createDate)}
                                </div>
                                <div className="infomation text-dark">
                                    Tháng {new Date(rentalDetail.createDate).getMonth() + 1}:
                                    {rentalDetail.status === 1 ? ' Chưa thanh toán' : ' Đã thanh toán'}
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="owner-title text-dark">Liên hệ chủ trọ</div>
                                <div className="owner text-dark">Tên chủ trọ: {rentalDetail.owner}</div>
                                <div className="owner text-dark">SDT: {rentalDetail.phone}</div>
                            </div>
                        </div>
                        <div className="row">
                            {/* <div className={`col-6 ${rentalDetail.status === 2 ? 'd-none' : ''}`}>
                                <button
                                    className="btn col-10 btn-motel"
                                    onClick={() => handleVnPayPayment(rentalDetail.billId, rentalDetail.totalMoney)}
                                >
                                    Thanh toán
                                </button>
                            </div> */}
                            <Feedback motelId={rentalDetail.id} />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center text-dark">
                    <h4>Bạn chưa thuê phòng nào</h4>
                </div>
            )}
        </div>
    )
}

export default Motel