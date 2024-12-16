import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Pagination, Navigation } from 'swiper/modules';
import { format } from 'date-fns';
import { useNavigate } from "react-router-dom";

import { useSelector } from 'react-redux';
import { RootState, userAppDispatch } from '@/redux/store';
import { fetchMyMotel } from '@/components/header/redux/action';
import { Fragment } from 'react/jsx-runtime';
import Swal from 'sweetalert2';
import { deleteMyMotel } from '@/services/api/HomeApi';



const MyMotel = () => {
    const dispatch = userAppDispatch();
    const navigate = useNavigate();
    const { myMotel } = useSelector((state: RootState) => state.user);

    const handleDeleteMyMotel = async (id: number) => {
        try {
            const result = await Swal.fire({
                title: 'Bạn có chắc chắn?',
                text: 'Bạn có muốn hủy đăng ký trọ không?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Có, tôi đồng ý!',
                cancelButtonText: 'Hủy bỏ',
            });
    
            if (result.isConfirmed) {
                const res = await deleteMyMotel(id);
                console.log(res);
                if (res.data.code === 200) {
                    dispatch(fetchMyMotel());
                    navigate("/user");
                    Swal.fire({
                        icon: 'success',
                        title: 'Thành công',
                        text: 'Bạn đã hủy đăng ký trọ thành công!',
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi!',
                        text: 'Có lỗi khi gọi API',
                    });
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Không thể gọi API',
            });
        }
    };
    return (
        <div className="container user-motel p-4">
            {myMotel ? (
                <>
                    <h1 className='mb-5 text-center'>Thông tin đăng ký trọ</h1>
                    {myMotel.length > 0 && myMotel.map((item, index) => (
                        <Fragment key={item.id}>
                            <div className='row mb-3'>
                                <div className='col-6'>
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
                                        {item.roomType.map((room: any) =>
                                            room.images.map((image: any) => (
                                                <SwiperSlide key={image.id}>
                                                    <img src={image.link} style={{ width: '100%', height: '450px', objectFit: 'cover' }} alt="Room" className="slide-img" />
                                                </SwiperSlide>
                                            ))
                                        )}
                                    </Swiper>
                                </div>
                                <div className='col-6 ps-3'>
                                    <div className='mb-3'>
                                        <h4>Trọ: {item.name} {item.status === 1 && "(Đang chờ duyệt)"}</h4>
                                        <div>Địa chỉ: {item.address}</div>
                                        <div>Tổng phòng: {item.roomType.reduce((sum, room) => sum + room.totalRoom, 0)}</div>
                                        <div className='d-flex'>Mô tả: <div className="motel-diachi ps-2" dangerouslySetInnerHTML={{ __html: item?.description || "",}}></div></div>
                                        <div>Ngày tạo: {format(item?.createDate ? new Date(item.createDate) : new Date(), 'dd/MM/yyyy')}</div>
                                    </div>
                                    <div className='mb-3'>
                                        <h4>Dịch vụ tiện ích</h4>
                                        {item.service.length > 0 && item.service.map((item, index) => (
                                            <div key={item.id}>{item.name}: {`${item.price} vnd`}</div>
                                        ))}
                                    </div>
                                    <div className='mb-3'>
                                        <h4>Loại phòng</h4>
                                        {item.roomType.length > 0 && item.roomType.map((item, index) => (
                                            <Fragment key={item.id}>
                                                <div>Phòng: {item.name}</div>
                                                <div className='d-flex'>Mô tả: <div className="motel-diachi ps-2" dangerouslySetInnerHTML={{ __html: item?.description || "",}}></div></div>
                                                <div>Giá: {`${item.price} vnd`}</div>
                                                <div>Diện tích: {`${item.area} ${`m${"\u00B2"}`}`}</div>
                                                <div>Số lượng phòng: {item.totalRoom}</div>
                                            </Fragment>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className='d-flex justify-content-end'>
                                <button className='btn btn-danger' onClick={() => handleDeleteMyMotel(item.id)}>Hủy đăng ký trọ</button>
                            </div>
                        </Fragment>
                    ))}
                </>
            ) : (
                <div className="text-center text-dark">
                    <h4>Bạn đăng ký dãy trọ nào</h4>
                </div>
            )}
        </div>
    )
}

export default MyMotel