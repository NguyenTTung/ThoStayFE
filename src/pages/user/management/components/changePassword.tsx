import { PasswordUser, postChangePassApi } from "@/services/api/HomeApi";
import ChangePasswordForm from "./form/changePasswordForm";
import Swal from 'sweetalert2';

const ChangePassword = () => {
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
        <div className="change-password col-7 mx-auto p-5">
            <ChangePasswordForm onSubmit={handleSubmit} />
        </div>
    )
}

export default ChangePassword