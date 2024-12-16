import { AddUserRoomApi, FindUser } from '@/services/api/MotelApi';
import { AddUserRoomDTO, RoomUserDTO } from '@/services/Dto/MotelDto';
import React, { useState } from 'react';
import Swal from 'sweetalert2';

interface AddUserRoomProps {
	onClose: () => void;
	roomId: number;
}

const AddUserRoom: React.FC<AddUserRoomProps> = ({ onClose, roomId }) => {
	const [listUser, setListUser] = useState<RoomUserDTO[]>([]);
	const [search, setSearch] = useState('');

	const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const newSearch = e.target.value;
		setSearch(newSearch);

		if (newSearch.trim() !== '') {
			// Chỉ tìm kiếm khi có giá trị nhập vào
			const response = await FindUser(newSearch);
			if (response.code === 200) {
				setListUser(response.data);
			}
		} else {
			setListUser([]); // Reset danh sách khi input trống
		}
	};

	const handleAddUserRoom = async (userId: number) => {
		const data: AddUserRoomDTO = {
			roomId: roomId,
			userId: userId,
		};
		const response = await AddUserRoomApi(data);
		if (response.code === 200) {
			Swal.fire({
				icon: "success",
				title: "Thành công",
				text: "Thêm người thuê thành công",
			  }).then(() => {
				// Lưu trạng thái thông báo vào localStorage
				localStorage.setItem("showNotification", "true");
				onClose();
				location.reload();
			});
		} else{
			Swal.fire({
                icon: "error",
                title: "Thất bại!",
                text: "Thêm người thuê thất bại!",
              });
		}
	};

	return (
		<>
			<div className='modal-overlay-admin add-user-room'>
				<div className='modal-content-admin position-relative'>
					<div className=''>
						<h2 className='h2-modal-admin'>Thêm người thuê</h2>
					</div>
					<form className='form-admin-modal'>
						<div className='row form-group mt-3'>
							<div className='col-12 position-relative'>
								<label
									htmlFor='description'
									className=''>
									Tìm kiếm người dùng
								</label>
								<input
									type='text'
									id='title'
									className='form-control mt-2'
									placeholder='Họ và tên'
									name='search'
									value={search}
									onChange={handleChange}
								/>

								{Array.isArray(listUser) && listUser.length > 0 ? (
										<div className='dropdown-list-add-user-room'>
											<div className='list-add-user-room'>
												{listUser?.map((user) => (
													<div
														key={user.id}
														className='item-add-user-room d-flex justify-content-between align-items-center'>
														<div className='nav-link nav-icon-hover d-flex'>
															<img
																src={user?.avatar || 'https://firebasestorage.googleapis.com/v0/b/nha-tro-t7m.appspot.com/o/images%2Fc68b44ba-41f4-4985-a339-f9378b7fec37.png?alt=media'} // Thêm ảnh mặc định
																alt={user?.fullName}
																width='35'
																height='35'
																className='rounded-circle'
															/>
															<div className='ps-2'>
																<h5 className='mb-0'>{user?.fullName}</h5>
																<h6 className='mb-0'>{user?.email}</h6>
															</div>
														</div>
														<div>
															<button type='button' className='btn-add-user-room'
																onClick={() => handleAddUserRoom(user.id)}>
																{' '}
																{/* Thêm type="button" */}
																<i className='fa-regular fa-user-plus fa-xl'></i>
															</button>
														</div>
													</div>
												))}
											</div>
									</div>
								) : (
									// <div className='text-center p-2'>Không tìm thấy người dùng</div>
									<div></div>
								)}
							</div>
						</div>
						<div className='d-flex justify-content-center mt-4'>
							<button
								type='button'
								className='btn-trove-all btn-style btn-transform-y2'
								onClick={onClose}>
								Trở về
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

export default AddUserRoom;
