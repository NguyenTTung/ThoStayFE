import React, { useEffect, useState } from 'react';
import { GetPriceByRoomTypeDTO, GetRoomTypeByAddElicWaterDTO, GetRoomTypeDTO_Room, SendElicWaterDTO } from '@/services/Dto/MotelDto';
import { GetPriceByRoomTypeApi, GetRoomTypeByAddElicWaterApi, SendElicWaterApi } from '@/services/api/MotelApi';
import { formatCurrency } from './detailroom/billroom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

interface BillCalculation {
	totalElectric: string;
	totalWater: string;
	totalOther: string;
	totalRoom: string;
	total: string;
}

const AddElicWater: React.FC<{ roomTypeId: number; onClose: () => void }> = ({ roomTypeId, onClose }) => {
	const [isConfirm, setIsConfirm] = useState(false);
	const [price, setPrice] = useState<GetPriceByRoomTypeDTO>({
		roomTypeId: 0,
		price: 0,
		price_Electric: 0,
		price_Water: 0,
	});

	const [billDetails, setBillDetails] = useState<BillCalculation>({
		totalElectric: '',
		totalWater: '',
		totalOther: '',
		totalRoom: '',
		total: '',
	});

	const handSaveclick = async () => {
		setErrors({});
		let hasError = false;

		// Kiểm tra các trường cơ bản
		const fieldsToValidate = {
			electric: sendElicWaterDTO.electric,
			water: sendElicWaterDTO.water,
			other: sendElicWaterDTO.other,
		};

		// Kiểm tra từng trường
		Object.entries(fieldsToValidate).forEach(([key, value]) => {
			if (!validateField(key, String(value || ''))) {
				hasError = true;
			}
		});
		if (hasError) {
			return;
		}

		const repository = await GetPriceByRoomTypeApi(roomTypeId);
		const priceData = repository.data;

		console.log(priceData);

		const newTotalElectric = priceData.price_Electric * (Number(sendElicWaterDTO.electric) - electricity);
		const newTotalWater = priceData.price_Water * (Number(sendElicWaterDTO.water) - water);
		const newTotalOther = sendElicWaterDTO.other;
		const newTotalRoom = priceData.price;

		const newBillDetails = {
			totalElectric: String(newTotalElectric),
			totalWater: String(newTotalWater),
			totalOther: String(newTotalOther),
			totalRoom: String(newTotalRoom),
			total: (Number(newTotalElectric) + Number(newTotalWater) + Number(newTotalOther) + Number(newTotalRoom)).toString(),
		};

		await setBillDetails(newBillDetails);
		setTimeout(() => {
			setIsConfirm(true);
		}, 0);
	};

	const handleCloseClick = () => {
		setIsConfirm(false);
	};

	const [sendElicWaterDTO, setSendElicWaterDTO] = useState<SendElicWaterDTO>({
		roomId: 0,
		water: '',
		electric: '',
		other: '',
	});

	const [data, setData] = useState<GetRoomTypeByAddElicWaterDTO[]>([]);
	useEffect(() => {
		const LoadData = async () => {
			const res = await GetRoomTypeByAddElicWaterApi(roomTypeId);
			setData(res.data);
			if (res.data && res.data.length > 0) {
				setActiveRoom(res.data[0].id);
				setRoomId(res.data[0].id);
				setWater(res.data[0].consumption?.water || 0);
				setElectricity(res.data[0].consumption?.electricity || 0);
				setRoomNumber(res.data[0].roomNumber || 0);
			} else {
				toast.warning("Không có phòng trọ nào cần xuất hóa đơn!")
			}
		};
		LoadData();
	}, []);

	const [roomId, setRoomId] = useState<number>(0);

	const [roomNumber, setRoomNumber] = useState<number>(0);

	const [activeRoom, setActiveRoom] = useState<number | null>(null);

	const handleRoomNumber = async (roomId: number) => {
		setActiveRoom(roomId);

		setSendElicWaterDTO({
			roomId: 0,
			water: '',
			electric: '',
			other: '',
		});

		setIsConfirm(false);

		setRoomId(roomId);
		const res = data.find((item) => item.id === roomId);
		setWater(res?.consumption?.water || 0);
		setElectricity(res?.consumption?.electricity || 0);
		setRoomNumber(res?.roomNumber || 0);
	};

	const [water, setWater] = useState<number>(0);
	const [electricity, setElectricity] = useState<number>(0);

	const HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setIsConfirm(false);
		setSendElicWaterDTO({ ...sendElicWaterDTO, [name]: value });
		validateField(name, value);
	};

	const [errors, setErrors] = useState<{ [key: string]: string }>({});

	// Thêm hàm validate
	const validateField = (name: string, value: string) => {
		if (value.trim() === '' && name !== 'other') {
			setErrors((prev) => ({
				...prev,
				[name]: 'Trường này không được để trống',
			}));
			return false;
		}

		if (name === 'electric') {
			if (Number(value) <= electricity || isNaN(Number(value))) {
				setErrors((prev) => ({
					...prev,
					[name]: 'Giá trị phải lớn hơn số điện cũ',
				}));
				return false;
			}
		}

		if (name === 'water') {
			if (Number(value) <= water || isNaN(Number(value))) {
				setErrors((prev) => ({ ...prev, [name]: 'Giá trị phải lớn hơn số nước cũ' }));
				return false;
			}
		}

		if (name === 'other') {
			// Chỉ kiểm tra khi có giá trị nhập vào
			if (value && value.trim() !== '') {
				if (Number(value) <= 1000 || isNaN(Number(value))) {
					setErrors((prev) => ({ ...prev, [name]: 'Giá trị phải lớn hơn 1.000 VNĐ' }));
					return false;
				}
			}
			// Xóa lỗi nếu trường input trống
			setErrors((prev) => ({ ...prev, [name]: '' }));
		}

		setErrors((prev) => ({ ...prev, [name]: '' }));
		return true;
	};

	const handSubmit = async () => {
		try {
			setErrors({});
			let hasError = false;

			// Kiểm tra các trường cơ bản
			const fieldsToValidate = {
				electric: sendElicWaterDTO.electric,
				water: sendElicWaterDTO.water,
				other: sendElicWaterDTO.other,
			};

			// Kiểm tra từng trường
			Object.entries(fieldsToValidate).forEach(([key, value]) => {
				if (!validateField(key, String(value || ''))) {
					hasError = true;
				}
			});

			if (hasError) {
				return;
			}
			sendElicWaterDTO.roomId = roomId;

			const res = await SendElicWaterApi(sendElicWaterDTO);
			if (res.code === 200) {
				Swal.fire({
					icon: "success",
					title: "Thành công",
					text: "thêm số điện, nước thành công!",
				  }).then(() => {
					// Lưu trạng thái thông báo vào localStorage
					localStorage.setItem("showNotification", "true");
					onClose();
					location.reload();
				  });
			}
		} catch (error) {
			Swal.fire({
				icon: "error",
				title: "Thất bại!",
				text: "thêm số điện, nước thất bại!",
			  });
			console.log(error);
		}
	};

	return (
		<>
			<div className='modal-overlay-admin'>
				<div className='modal-content-admin position-relative w50resposi'>
					<div className=''>
						<h2 className='h2-modal-admin'>Thêm số điện, nước</h2>
					</div>
					<form className='form-admin-modal position-relative'>
						<div className='d-flex flex-wrap justify-content-center'>
							{data.map((item) => (
								<a
									key={item.id}
									className={`btn btn-filter btn-sm px-3 py-2 mx-3 mb-3 btn-transform-y2 ${activeRoom === item.id ? 'active-filter-motel' : ''}`}
									onClick={() => handleRoomNumber(item.id)}>
									Phòng {item.roomNumber}
								</a>
							))}
						</div>
						<div className='row form-group mt-3'>
							<div className='col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 col-xxl-4'>
								<label
									htmlFor='description'
									className=''>
									Số điện
								</label>
								<input
									type='text'
									id='title'
									className='form-control mt-2'
									placeholder='Số điện'
									value={electricity}
									disabled
								/>
							</div>
							<div className='col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 col-xxl-4'>
								<label
									htmlFor='description'
									className=''>
									Số điện mới
								</label>
								<input
									type='text'
									id='title'
									className='form-control mt-2'
									placeholder='Số điện mới'
									onChange={HandleChange}
									name='electric'
									value={sendElicWaterDTO?.electric}
								/>
								{errors.electric && <p className='text-danger'>{errors.electric}</p>}
							</div>
						</div>
						<div className='row form-group mt-3'>
							<div className='col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 col-xxl-4'>
								<label
									htmlFor='description'
									className=''>
									Số nước
								</label>
								<input
									type='text'
									id='title'
									className='form-control mt-2'
									placeholder='Số nước'
									value={water}
									disabled
								/>
							</div>
							<div className='col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 col-xxl-4'>
								<label
									htmlFor='description'
									className=''>
									Số nước mới
								</label>
								<input
									type='text'
									id='title'
									className='form-control mt-2'
									placeholder='Số điện mới'
									onChange={HandleChange}
									name='water'
									value={sendElicWaterDTO?.water}
								/>
								{errors.water && <p className='text-danger'>{errors.water}</p>}
							</div>
							<div className='col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4 col-xxl-4'>
								<label
									htmlFor='description'
									className=''>
									Chi phí khác (VND)
								</label>
								<input
									type='text'
									id='title'
									className='form-control mt-2'
									placeholder='Chi phí khác'
									onChange={HandleChange}
									name='other'
									value={sendElicWaterDTO?.other}
								/>
								{errors.other && <p className='text-danger'>{errors.other}</p>}
							</div>
						</div>
						<div></div>
						{isConfirm && billDetails && (
							<div className='form-group mt-3'>
								<div className='text-info-bill'>
									<p>
										Phòng số: <span>{roomNumber}</span>
									</p>
								</div>
								<div className='border-bottom-info-bill mt-3'></div>
								<div className='text-info-bill mt-2'>
									<p className='d-flex justify-content-between'>
										Tiền điện: <span> {formatCurrency(Number(billDetails.totalElectric))}</span>{' '}
									</p>
									<p className='d-flex justify-content-between'>
										Tiền nước: <span> {formatCurrency(Number(billDetails.totalWater))}</span>
									</p>
									<p className='d-flex justify-content-between'>
										Tiền thuê trọ: <span> {formatCurrency(Number(billDetails.totalRoom))}</span>
									</p>
								</div>
								<div className='border-bottom-info-bill mt-3'></div>
								<div className='text-info-bill mt-2'>
									<p className='d-flex justify-content-between'>
										Chi phi khác: <span> {formatCurrency(Number(billDetails.totalOther))}</span>
									</p>
								</div>
								<div className='border-bottom-info-bill mt-3'></div>
								<div className='text-info-bill mt-2'>
									<p className='d-flex justify-content-between'>
										Thành tiền: <span> {formatCurrency(Number(billDetails.total))}</span>{' '}
									</p>
								</div>
							</div>
						)}

						{!isConfirm ? (
							<div className='d-flex justify-content-between mt-4'>
								<button
									type='button'
									className='btn-trove-all btn-style btn-transform-y2'
									onClick={onClose}>
									Trở về
								</button>
								<button
									type='button'
									className='btn-luu-all btn-style btn-transform-y2'
									onClick={handSaveclick}>
									Lưu
								</button>
							</div>
						) : (
							<div className='d-flex justify-content-between mt-4'>
								<button
									type='button'
									className='btn-trove-all btn-style btn-transform-y2'
									onClick={!isConfirm ? onClose : handleCloseClick}>
									Trở về
								</button>
								<button
									type='button'
									className='btn-luu-all btn-style btn-transform-y2'
									onClick={handSubmit}>
									Xác nhận
								</button>
							</div>
						)}
					</form>
				</div>
			</div>
		</>
	);
};

export default AddElicWater;
