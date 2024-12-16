import { useState } from 'react';
import "./styles/ForgotPW.scss";
import { NewPassword, postNewPWApi } from '@/services/api/authApi';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import avaimg from '@/assets/images/imgforgotPW/Forgotpw_3_1.png'
const NewPW = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [passwordCf, setPasswordCf] = useState('');
  const [showPasswordCf, setShowPasswordCf] = useState(false);
  const [error, setError] = useState('');
  const [errorcf, setErrorcf] = useState('');

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Kiểm tra khi nhập
    if (!newPassword) {
      setError('Bạn chưa nhập mật khẩu mới');
    } else if (newPassword.length < 8 || !/[!@#$%^&*]/.test(newPassword) || !/\d/.test(newPassword)) {
      setError('Mật khẩu phải có ít nhất 8 ký tự, chứa ký tự đặc biệt và số');
    } else {
      setError(''); // Xóa lỗi khi mật khẩu hợp lệ
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password) {
      setErrorcf('');
      setError('Bạn chưa nhập mật khẩu mới');
    } else if (password.length < 8 || !/[!@#$%^&*]/.test(password) || !/\d/.test(password)) {
      setErrorcf('');
      setError('Mật khẩu phải có ít nhất 8 ký tự, chứa ký tự đặc biệt và số');
    } else if (password !== passwordCf) {
      setError('');
      setErrorcf('Mật khẩu xác thực không giống với mật khẩu');
    } else {
      setError('');
      setErrorcf('');
      // Xử lý code khi 2 mật khẩu giống nhau ở đây
    }

    try {
      const data: NewPassword = {
        password: password,
        confimPassWord: passwordCf,
      }

      const response = await postNewPWApi(data);
      console.log(response);
      // const response = await axios.post('https://localhost:7299/changePassword', data)
      if (response.data === true) {
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Đổi mật khẩu thành công',
        });
        navigate('/Login');
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Mật khẩu và xác nhận mật khẩu chưa trùng nhau!!',
        });
      }

    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Đổi mật khẩu thất bại',
      });
    }
  };
  return (
    <div className="formverifyfw container-fluid">
      <div className="row align-items-center w-100 align-items-center h-forgotpw">
        <div className="col-lg-6 col-12 ">
          <div className='w-100  d-flex flex-column align-items-center'>
            <h2 className='h2-QMK'>Mật khẩu mới</h2>
            <form className="w-75 mt-4" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="password" className="form-label color-sdt">Mật khẩu mới: </label>
                <input
                  type="password"
                  id="password"
                  autoComplete="off"
                  placeholder='Gồm 8 ký tự, có chứa ký tự đặc biệt và ký tự số'
                  className='form-control rounded-pill heightinput-60 boder-color color-pla'
                  value={password}
                  onChange={handlePasswordChange}
                />

                {error && <div className="text-danger mt-1">{error}</div>}
              </div>
              <div className="mb-4">
                <label htmlFor="passwordcf" className="form-label color-sdt">Xác nhận mật khẩu: </label>
                <div className='d-flex align-items-center justify-content-end'>
                  <input
                    type={showPasswordCf ? "text" : "password"}
                    id="passwordcf"
                    autoComplete="off"
                    placeholder='Vui lòng nhập lại mật khẩu'
                    className='form-control rounded-pill heightinput-60 boder-color color-pla'
                    value={passwordCf}
                    onChange={(e) => setPasswordCf(e.target.value)}
                  />
                  <i
                    className={`fa-solid ${showPasswordCf ? 'fa-eye-slash' : 'fa-eye'} icon-password`}
                    onClick={() => setShowPasswordCf(!showPasswordCf)}
                  ></i>
                </div>
                {errorcf && <div className="text-danger mt-1">{errorcf}</div>}
              </div>

              <button type="submit" className="btn heightinput-60 btn-color w-100 mb-3 rounded-pill text-white mt-4">Xác nhận</button>
            </form>
          </div>

        </div>

        <div className="col-lg-6 col-12 d-flex justify-content-center align-items-center">
          <img
            src={avaimg}
            alt="Responsive"
            className="img-fluid image-verify"
          />
        </div>
      </div>
    </div>

  );
};

export default NewPW;
