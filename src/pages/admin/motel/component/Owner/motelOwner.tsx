import { Link } from 'react-router-dom';
import CardRoom from './CardRoom';
const MotelOwner = (props: { motel: any }) => {
	return (
		<>
			<div className='table-motel-index row mt-3 px-0 mx-0'>
				<div className='col-5 col-sm-5 col-md-3 col-lg-2 col-xl-2 col-xxl-2 d-flex justify-content-center flex-column justify-content-between px-4 py-2'>
					<div className='text-table-index-motel-owner'>Địa chỉ: {props.motel.address}</div>
					<div className='w-100 mt-2'>
						<div className='row justify-content-between mx-0'>
							<Link
								to='EditModelOwner'
								type='button'
								className='btn-sua-index-motel-owner btn btn-sm px-3 py-2 mb-3 btn-transform-y2 col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-5'>
								Sửa
							</Link>
							<button
								type='button'
								className='btn-xoa-index-motel-owner btn btn-sm px-3 py-2 mb-3 btn-transform-y2  col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-5'>
								Xóa
							</button>
						</div>
						<div>
							<button
								type='button'
								className='btn-yeucauduyet-index-motel-owner btn btn-sm px-3 py-2 mb-3 btn-transform-y2 w-100'>
								Yêu cầu duyệt
							</button>
						</div>
						<div className='w-100'></div>
					</div>
				</div>
				<div className='phong-table-motel-owner col-7 col-sm-7 col-md-9 col-lg-10 col-xl-10 col-xxl-10 row'>
					{props.motel.rooms.map((room) => (
						<CardRoom room={room} />
					))}
					<button type='button' className='btn btn-primary w-10 h-10'>Thêm phòng</button>
				</div>
			</div>
		</>
	);
};

export default MotelOwner;
