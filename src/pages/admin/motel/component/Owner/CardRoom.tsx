import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const CardRoom = (props: { room: any }) => {

    const CheckStatus = (status: number) => {
        if (status === 1) {
            return 'border-dangtrong';
        } else if (status === 2) {
            return 'border-dangsudung';
        } else if (status === 3) {
            return 'border-dangbaotri';
        }
         
    }
	return (
		<>
			<div className='phong-table-motel-owner-2 col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 col-xxl-3 py-2 px-2'>
				<div className={`${CheckStatus(props.room.status)} phong-table-motel-owner-3 d-flex flex-column justify-content-between px-2 py-2`}>
					<div className='w-100 text-phong-table-motel-owner'>{props.room.roomNumber}</div>
                    <div className='w-100'>{props.room.area} m2</div>
					<div className='w-100 d-flex justify-content-between'>
                    <div>
							{props.room.price.toLocaleString('vi-VN', {
								style: 'currency',
								currency: 'VND'
							})}
						</div>
						<div>
							<FontAwesomeIcon
								icon={faUser}
								size='sm'
								className='icon-index-owner-motel-help-sudung px-1'
							/>
							{props.room.status === 1 ? 'Đang thuê' : 'Trống'}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default CardRoom;
