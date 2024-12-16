import '../styles/management.scss'
import { Link, Outlet, useLocation } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

const Layout = () => {
    const location = useLocation();
    const { user, myMotel } = useSelector((state: RootState) => state.user);
    const isExactActive = (path: string) => location.pathname === path;

    const isPartialActive = (path: string) => location.pathname.includes(path);

    return (
        <div className="container mt-5 management">
            <div className="row">
                <div className="col-3">
                    <ul className="shadow-sm m-0 bg-body rounded">
                        <li className='menu-item'>
                            <div className='px-2 py-3 d-flex align-items-center account'>
                                <img src={user?.avatar} className='rounded-circle account__avatar' alt="avatar" />
                                <div className='text-dark ms-2 content'>
                                    <p className='m-0 content__name'>{user?.fullName}</p>
                                    <p className='m-0 content_phone-number'>{user?.phone}</p>
                                </div>
                            </div>
                        </li>
                        <li className='menu-item'>
                            <Link to='/user' className={`text-dark px-2 py-3 d-block ${isExactActive('/user') ? 'menu-item__link--active' : 'menu-item__link'}`}>Thông tin cá nhân</Link>
                        </li>
                        <li className='menu-item'>
                            <Link to="/user/motel" className={`text-dark px-2 py-3 d-block ${isPartialActive('/motel') ? 'menu-item__link--active' : 'menu-item__link'}`}>Trọ của tôi</Link>
                        </li>
                        {myMotel ? (
                            <li className='menu-item'>
                                <Link to="/user/my-motel" className={`text-dark px-2 py-3 d-block ${isPartialActive('/my-motel') ? 'menu-item__link--active' : 'menu-item__link'}`}>Thông tin đăng ký trọ</Link>
                            </li>
                        ) : ''}
                        <li className='menu-item'>
                            <Link to="/user/noti" className={`text-dark px-2 py-3 d-block ${isPartialActive('/noti') ? 'menu-item__link--active' : 'menu-item__link'}`}>Thông báo</Link>
                        </li>
                        <li className='menu-item'>
                            <Link to="/user/history" className={`text-dark px-2 py-3 d-block ${isPartialActive('/history') ? 'menu-item__link--active' : 'menu-item__link'}`}>Lịch sử thuê</Link>
                        </li>
                        <li className='menu-item'>
                            <Link to="/user/change-password" className={`text-dark px-2 py-3 d-block ${isPartialActive('/change-password') ? 'menu-item__link--active' : 'menu-item__link'}`}>Đổi mật khẩu</Link>
                        </li>
                        <li className='menu-item'>
                            <Link to="/user/ticket" className={`text-dark px-2 py-3 d-block ${isPartialActive('/ticket') ? 'menu-item__link--active' : 'menu-item__link'}`}>Trợ giúp</Link>
                        </li>
                        <li className='menu-item'>
                            <div
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    window.location.href = '/';
                                }}
                                className="text-dark px-2 py-3 d-block menu-item__link cursor-pointer"
                            >
                                Đăng xuất
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="col-9">
                    <div className="shadow-sm m-0 bg-body rounded">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Layout