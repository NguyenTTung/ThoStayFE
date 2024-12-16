import { useNavigate } from 'react-router-dom';
import LoginForm from './components/loginForm';
import { AccountDto, getLoginApi } from '@/services/api/authApi';
import './styles/login.scss';
import bg from '@/assets/images/backgrounds/img-login.png';
import search from '@/assets/icon/search.png';
import digitize from '@/assets/icon/digitize.png';
import information from '@/assets/icon/information.png';
import location from '@/assets/icon/location.png';
import proceeds from '@/assets/icon/proceeds.png';
import Swal from 'sweetalert2';
import { useEffect} from 'react';
import { getRouteFromToken } from '@/services/apiConfig';

// interface TokenPayload {
// 	role: string;
// 	'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
// }

const Login = () => {
	const navigate = useNavigate();
	const token = localStorage.getItem('token');

	useEffect(() => {
		
		if (token) {
			//xoá token
			localStorage.removeItem('token');
		}
	}, [token]);


	// ... existing code ...

	const handleLogin = async (data: AccountDto) => {
		try {
		  const response = await getLoginApi(data);
		  const { success, token, message } = response.data;
	  
		  if (!success) {
			Swal.fire({
			  icon: 'warning',
			  title: 'Thông báo',
			  text: message || 'Đăng nhập không thành công',
			});
			return;
		  }
	  
		  localStorage.setItem('token', token);
		  const route = getRouteFromToken(token);
		  navigate(route);
	  
		} catch (error) {
		  console.error('Lỗi đăng nhập:', error);
		  Swal.fire({
			icon: 'error',
			title: 'Lỗi',
			text: 'Đăng nhập không thành công',
		  });
		}
	  };

	// ... rest of the code ...

	return (
		<div className='container-fluid'>
			<div className='login row'>
				<div className='login-left col d-flex flex-column justify-content-center align-items-center'>
					<LoginForm onSubmit={handleLogin} />
					<div className='divider-wrapper col-10 col-sm-8 col-md-8 col-xxl-6 mb-3 px-5'>
						<span className='divider'><a href='/' className='login-header-name'>Trang chủ</a></span>
					</div>
					{/* <div className='scan d-flex justify-content-center align-items-center mb-4'>
						<img
							src={QR}
							className='img-fluid'
							alt='qr'
						/>
					</div> */}
					<p>
						Bạn không có tài khoản?{' '}
						<a
							href='/register'
							className='link text-decoration-none'>
							Đăng ký
						</a>
					</p>
				</div>
				<div className='login-right col d-none d-lg-flex justify-content-center align-items-center'>
					<div className='login-right-container row flex-column'>
						<div className='top-right col position-relative d-flex justify-content-center align-items-center'>
							<div className='container-absolute position-absolute'>
								<div className='keyword search d-flex position-absolute'>
									<div className='icon rounded-circle me-1 d-flex justify-content-center align-items-center'>
										<img
											src={search}
											className='img-fluid'
											alt='search'
										/>
									</div>
									<div className='content px-4 rounded-pill d-flex justify-content-center align-items-center'>Tìm kiếm dễ dàng</div>
								</div>
								<div className='keyword location d-flex position-absolute'>
									<div className='icon rounded-circle me-1 d-flex justify-content-center align-items-center'>
										<img
											src={location}
											className='img-fluid'
											alt='location'
										/>
									</div>
									<div className='content px-4 rounded-pill d-flex justify-content-center align-items-center'>Hiển thị trực quan</div>
								</div>
								<div className='keyword digitize d-flex position-absolute'>
									<div className='icon rounded-circle me-1 d-flex justify-content-center align-items-center'>
										<img
											src={digitize}
											className='img-fluid'
											alt='digitize'
										/>
									</div>
									<div className='content px-4 rounded-pill d-flex justify-content-center align-items-center'>Số hóa quy trình</div>
								</div>
								<div className='keyword proceeds d-flex position-absolute'>
									<div className='icon rounded-circle me-1 d-flex justify-content-center align-items-center'>
										<img
											src={proceeds}
											className='img-fluid'
											alt='proceeds'
										/>
									</div>
									<div className='content px-4 rounded-pill d-flex justify-content-center align-items-center'>Trực quan doanh thu</div>
								</div>
								<div className='keyword information d-flex position-absolute'>
									<div className='icon rounded-circle me-1 d-flex justify-content-center align-items-center'>
										<img
											src={information}
											className='img-fluid'
											alt='information'
										/>
									</div>
									<div className='content px-4 rounded-pill d-flex justify-content-center align-items-center'>Minh bạch về giá</div>
								</div>
							</div>
						</div>
						<div className='bottom-right col'>
							<img
								src={bg}
								className='img-fluid'
								alt='background'
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
