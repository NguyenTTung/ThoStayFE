import InfoBill from '@/pages/admin/BillOwner/component/infoBill';
import { GetBill, SentBillToEmail } from '@/services/api/MotelApi';
import { BillDTO, BillPaginationResponse } from '@/services/Dto/MotelDto';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
	}).format(amount);
};

export const formatDateTime = (dateString: string): string => {
	if (!dateString) return '';

	return new Date(dateString)
		.toLocaleString('vi-VN', {
			hour: '2-digit',
			minute: '2-digit',
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		})
		.replace(',', '');
};

export interface BillQueryDto {
	search: string;
	pageNumber: number;
	pageSize: number;
}

export const Billroom: React.FC<{ roomId: number }> = ({ roomId }) => {
	const [showModal, setShowModal] = useState(false);
	const [selectedBillId, setSelectedBillId] = useState<number | null>(null);
	const handleOpenModal = (id: number) => {
		setSelectedBillId(id);
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	const [bill, setBill] = useState<BillPaginationResponse>();
	const [query, setQuery] = useState<BillQueryDto>({
		search: '',
		pageNumber: 1,
		pageSize: 5,
	});

	const [pageactive, setPageactive] = useState<number>(query.pageNumber);

	useEffect(() => {
		fetchBill(query);
	}, [query]);

	const fetchBill = async (query: BillQueryDto) => {
		const response = await GetBill(roomId, query);
		setBill(response.data);
	};

	const calculateServiceCost = (service: BillDTO, serviceName: string) => {
		const serviceItem = service.serviceBills.find((s) => s.name === serviceName);
		return serviceItem ? serviceItem.price_Service * serviceItem.quantity : 0;
	};

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuery({ ...query, search: e.target.value });
	};

	const highlightText = (text: string, query: string): JSX.Element => {
		if (!query || !text) return <>{text}</>;

		// Chuyển đổi text về dạng không có dấu chấm để tìm vị trí
		const normalizedText = text.toString().replace(/\./g, '');
		const normalizedQuery = query.replace(/\./g, '');

		// Nếu text đã chuẩn hóa không chứa query đã chuẩn hóa thì trả về text gốc
		if (!normalizedText.toLowerCase().includes(normalizedQuery.toLowerCase())) {
			return <>{text}</>;
		}

		// Tìm vị trí của query trong text đã chuẩn hóa
		const startIndex = normalizedText.toLowerCase().indexOf(normalizedQuery.toLowerCase());

		// Đếm số dấu chấm từ đầu đến vị trí startIndex trong text gốc
		const dotsBeforeStart = (text.slice(0, startIndex + query.length).match(/\./g) || []).length;

		// Điều chỉnh độ dài highlight để bao gồm cả dấu chấm
		const highlightLength = query.length + dotsBeforeStart;

		// Cắt text gốc thành các phần
		const originalStart = text.slice(0, startIndex);
		const originalHighlight = text.slice(startIndex, startIndex + highlightLength);
		const originalEnd = text.slice(startIndex + highlightLength);

		return (
			<>
				{originalStart}
				<span
					className='highlight-text'
					style={{ backgroundColor: '#fff3cd' }}>
					{originalHighlight}
				</span>
				{originalEnd}
			</>
		);
	};

	const buttonConfirm = (status: number, billId: number) => {
		return <>{status == 1 ? <span className='tt-khoa badge bg-light-danger rounded-pill p-2 fs-2'>Chưa thanh toán</span> : <span className='tt-dangthue bg-light-success rounded-pill p-2 fs-2'>Đã thanh toán</span>}</>;
	};
	const handleUpdate = () => {
		const fetchBill = async () => {
			const response = await GetBill(roomId, query);
			setBill(response.data);
		};
		fetchBill();
	};

	const HandlePage = async (pageNumber: number) => {
		const newQuery = {
			...query,
			pageNumber: pageNumber,
		};
		setQuery(newQuery);
		setPageactive(pageNumber);
		await fetchBill(newQuery);
	};

	return (
		<>
			<div className='d-flex justify-content-start mt-3'>
				<form className='d-flex align-items-center border border-secondary-subtle ps-3 rounded'>
					<span className='fa fa-search form-control-feedback'></span>
					<input
						type='search'
						className='form-control border-0'
						placeholder='Tìm kiếm hóa đơn'
						onChange={handleSearch}
					/>
				</form>
			</div>

			<div
				className='table-responsive mt-3'
				data-simplebar>
				<table className='table table-borderless align-middle text-nowrap'>
					<thead>
						<tr className='brg-table-tro rounded-pill'>
							{/* <th scope="col"></th> */}
							<th scope='col'>Số phòng</th>
							<th scope='col'>Ngày tạo</th>
							<th scope='col'>Ngày thanh toán</th>
							<th scope='col'>Tiền điện</th>
							<th scope='col'>Tiền nước</th>
							<th scope='col'>Chi phí khác</th>
							<th scope='col'>Tiền thuê trọ</th>
							<th scope='col'>Thành tiền</th>
							<th scope='col'>Trạng thái</th>
						</tr>
					</thead>
					<tbody>
						{bill?.items?.map((service) => (
							<tr
								onClick={() => handleOpenModal(service.id)}
								key={service.id}>
								{' '}
								{/* <td
                  className="cangiua checkbox-bill"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input type="checkbox" name="" id="" />
                </td> */}
								<td>
									<p className='fs-3 fw-normal mb-0'>{highlightText(service?.room.roomNumber.toString(), query.search)}</p>
								</td>
								<td>
									<p className='fs-3 fw-normal mb-0'>{highlightText(formatDateTime(service?.createdDate), query.search)}</p>
								</td>
								<td>
									<p className='fs-3 fw-normal mb-0'>{highlightText(formatDateTime(service?.paymentDate), query.search)}</p>
								</td>
								<td>
									<p className='fs-3 fw-normal mb-0'>{highlightText(formatCurrency(calculateServiceCost(service, 'Điện')).toString(), query.search)}</p>
								</td>
								<td>
									<p className='fs-3 fw-normal mb-0'>{highlightText(formatCurrency(calculateServiceCost(service, 'Nước')).toString(), query.search)}</p>
								</td>
								<td>
									<p className='fs-3 fw-normal mb-0'>{highlightText(formatCurrency(calculateServiceCost(service, 'Khác')).toString(), query.search)}</p>
								</td>
								<td>
									<p className='fs-3 fw-normal mb-0'>{highlightText(formatCurrency(service?.priceRoom).toString(), query.search)}</p>
								</td>
								<td>
									<p className='fs-3 fw-normal mb-0'>{highlightText(formatCurrency(service?.total).toString(), query.search)}</p>
								</td>
								<td>{buttonConfirm(service?.status, service?.id)}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className='w-100 d-flex justify-content-center mt-3'>
				<nav aria-label='Page navigation example'>
					<ul className='pagination'>
						<li className='page-item'>
							<a
								className='page-link  btn-filter'
								aria-label='Previous'>
								<span aria-hidden='true'>&laquo;</span>
							</a>
						</li>
						{Array.from({ length: bill?.totalPages ?? 0 }, (_, index) => (
							<li
								className='page-item'
								key={index}
								onClick={() => HandlePage(index + 1)}>
								<a className={`page-link  btn-filter  ${pageactive === index + 1 ? 'active-filter-motel' : ''}`}>{index + 1}</a>
							</li>
						))}
						<li className='page-item'>
							<a
								className='page-link  btn-filter'
								aria-label='Next'>
								<span aria-hidden='true'>&raquo;</span>
							</a>
						</li>
					</ul>
				</nav>
			</div>
			{showModal && (
				<InfoBill
					onClose={handleCloseModal}
					onUpdate={handleUpdate}
					billId={selectedBillId}
				/>
			)}
		</>
	);
};
