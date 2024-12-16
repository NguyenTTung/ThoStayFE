import MyAccount from "../Profile/Form/MyAccount";
import { RootState, userAppDispatch } from '@/redux/store';
import { postDetaiUserApi, UserDetail, postAvatarApi } from '@/services/api/HomeApi';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { fetchAccount } from '@/components/header/redux/action';
import './adminprofile.scss'
import { useNavigate } from 'react-router-dom';
import { fetchPackage } from "@/components/header/redux/action";
import { useEffect} from "react";

const AdminProfile = () => {
    const navigate = useNavigate();
    const dispatch = userAppDispatch();

    const { user } = useSelector((state: RootState) => state.user);
    const { myPackage } = useSelector((state: RootState) => state.user);
    useEffect(() => {
        dispatch(fetchPackage());
    }, [dispatch]);

    const handleSubmit = async (data: UserDetail) => {
        const token = localStorage.getItem('token');
        if (!token) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Token không hợp lệ hoặc chưa được lưu trữ.',
            });
            return;
        }

        try {
            const response = await postDetaiUserApi(data, token);
            if (response.status === 200) {
                dispatch(fetchAccount());
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Cập nhật thông tin thành công',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: 'Cập nhật thông tin thất bại',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Có lỗi xảy ra trong quá trình cập nhật',
            });
            console.error('Lỗi cập nhật thông tin người dùng:', error);
        }
    };

    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const token = localStorage.getItem('token');
            if (!token) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: 'Token không hợp lệ hoặc chưa được lưu trữ.',
                });
                return;
            }

            try {
                const response = await postAvatarApi(file, token);
                if (response.status === 200) {
                    dispatch(fetchAccount());
                    Swal.fire({
                        icon: 'success',
                        title: 'Thành công',
                        text: 'Cập nhật avatar thành công',
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi!',
                        text: 'Cập nhật avatar thất bại',
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: 'Có lỗi xảy ra trong quá trình cập nhật',
                });
                console.error('Lỗi cập nhật avatar:', error);
            }
        }
    };


    const handleButtonClick = () => {
        const fileInput = document.getElementById('avatarInput') as HTMLInputElement;
        fileInput?.click();
    };

    return (
        <div className="container-fluid adminprofile">


            <div className="row align-items-stretch mt-3">

                <div className="card w-100">
                    <button
                        className="position-absolute fw-bold btn-cancel"
                        onClick={() => navigate('/admin')}
                    >
                        X
                    </button>
                    <div className="card-body p-4 mb-5">

                        <h1 className="my-5 fw-bold" style={{ marginLeft: '13%' }}>THÔNG TIN TÀI KHOẢN</h1>
                        <div className="row">
                            {/* Avatar Section */}
                            <div className="col-md-5 d-flex flex-column align-items-center">
                                <img
                                    src={user?.avatar}
                                    className="avatar rounded-circle mb-2"
                                    alt="avatar"
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            'https://firebasestorage.googleapis.com/v0/b/nha-tro-t7m.appspot.com/o/images%2Fc68b44ba-41f4-4985-a339-f9378b7fec37.png?alt=media';
                                    }}
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="avatarInput"
                                    style={{ display: 'none' }}
                                    onChange={handleAvatarChange}
                                />

                                <div className="form-group mx-2" style={{ minHeight: '80px' }}>
                                    <br />
                                    <div className="d-flex align-items-center">
                                        {/* Hình tròn màu xanh lá cây */}
                                        <span
                                            className="rounded-circle"
                                            style={{
                                                backgroundColor: 'green',
                                                width: '12px',
                                                height: '12px',
                                                display: 'inline-block',
                                                marginRight: '10px',
                                            }}
                                        ></span>
                                        <label htmlFor="" className="mb-0 d-flex">Đang hoạt động | <div className="package-name rounded-2 px-2"><p className="mb-0">{myPackage ? myPackage?.name : 'VIP 0'}</p></div></label>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-create-notification btn-transform-y2"
                                    onClick={handleButtonClick}
                                >
                                    Cập nhật avatar
                                </button>
                            </div>
                            <div className="col-md-7">
                                <MyAccount onSubmit={handleSubmit} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default AdminProfile;