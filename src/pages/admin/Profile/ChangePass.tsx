import { PasswordUser, postChangePassApi } from "@/services/api/HomeApi";
import Changepassform from "./Form/changepassform";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
const ChangePasswordAdmin = () => {
    const navigate = useNavigate();
    const handleSubmit = async (data: PasswordUser) => {

        const token = localStorage.getItem("token");
        if (!token) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Token không hợp lệ hoặc chưa được lưu trữ.',
            });
            return;
        }
        const response = await postChangePassApi(data, token);
        try {
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Thay đổi mật khẩu thành công',
                });
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: 'Thay đổi mật khẩu thất bại',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Có lỗi xảy ra trong quá trình đổi mật khẩu',
            });
            console.error('Lỗi thay đổi mật khẩu:', error);
        }
    }
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

                        <h1 className="my-5 fw-bold" style={{ marginLeft: '11%' }}>ĐỔI MẬT KHẨU</h1>
                        <Changepassform onSubmit={handleSubmit} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangePasswordAdmin