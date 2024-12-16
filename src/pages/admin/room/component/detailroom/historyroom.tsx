import { GetHistoryByRoomIdApi } from '@/services/api/MotelApi';
import {HistoryPaginationResponse } from '@/services/Dto/MotelDto';
import React, { useCallback, useEffect, useState } from 'react';
import { formatDateTime } from './billroom';

export interface HistoryQueryDto {
	search: string;
	pageNumber: number;
	pageSize: number;
}

const Historyroom = ({ roomId }: { roomId: number }) => {
	const [history, setHistory] = useState<HistoryPaginationResponse>();
	const [query, setQuery] = useState<HistoryQueryDto>({
		search: '',
		pageNumber: 1,
		pageSize: 5,
	});
	const [pageactive, setPageactive] = useState<number>(query.pageNumber);
	
	const fetchData = useCallback(async (query: HistoryQueryDto) => {
		const response = await GetHistoryByRoomIdApi(roomId, query);
		if (response.code === 200) {
			setHistory(response.data);
		}
	}, [roomId]);
	
	useEffect(() => {
		fetchData(query);
	}, [query, fetchData]);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuery({ ...query, search: e.target.value });
	};

	const HandlePage = async (pageNumber: number) => {
		const newQuery = {
			...query,
			pageNumber: pageNumber,
		};
		setQuery(newQuery);
		setPageactive(pageNumber);
		await fetchData(newQuery);
	};

	const CheckStatus = (status: number) => {
		if (status === 1) {
			return <span className='tt-dangthue bg-light-success rounded-pill p-2 fs-2'>Đang thuê</span>;
		} else if (status === 2) {
			return <span className='tt-choduyet badge bg-light-warning rounded-pill p-2 fs-2'>Ngừng thuê</span>;
		} else if (status === 3) {
			return <span className='tt-khoa badge bg-light-danger rounded-pill p-2 fs-2'>Bảo trì</span>;
		}
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

	return (
		<div>
			<div className='d-flex justify-content-start mt-3'>
				<form className='d-flex align-items-center border border-secondary-subtle ps-3 rounded'>
					<span className='fa fa-search form-control-feedback'></span>
					<input
						type='search'
						className='form-control border-0'
						placeholder='Tìm kiếm'
						onChange={handleSearch}
					/>
				</form>
			</div>
			<div
				className='table-responsive mt-3'
				data-simplebar>
				<table className='test-table table table-borderless align-middle text-nowrap'>
					<thead className=''>
						<tr className=' brg-table-tro'>
							<th scope='col'>hình ảnh</th>
							<th scope='col'>Họ tên</th>
							<th scope='col'>Số điện thoại</th>
							<th scope='col'>Email</th>
							<th scope='col'>Ngày thuê</th>
							<th scope='col'>Ngày ra</th>
							<th scope='col'>Trạng thái</th>
						</tr>
					</thead>
					<tbody className='table-room-info-history'>
						{history?.items?.map((item) => (
							<tr>
								<td>
									<img
										src={item?.user?.avatar ?? ''}
										width='50'
										height='50'
										className='rounded-circle'
										alt=''
									/>
								</td>
								<td>{highlightText(item?.user?.fullName, query.search)}</td>
								<td>{highlightText(item?.user?.phone, query.search)}</td>
								<td>{highlightText(item?.user?.email, query.search)}</td>
								<td>
									{formatDateTime(item?.createDate)}
								</td>
								<td>{formatDateTime(item?.endDate ?? '')}</td>
								<td>{CheckStatus(item?.status)}</td>
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
								className='page-link btn-filter'
								aria-label='Previous'>
								<span aria-hidden='true'>&laquo;</span>
							</a>
						</li>
						{Array.from({ length: history?.totalPages ?? 0 }, (_, index) => (
							<li
								className='page-item'
								key={index}
								onClick={() => HandlePage(index + 1)}>
								<a className={`page-link btn-filter ${pageactive === index + 1 ? 'active-filter-motel' : ''}`}>{index + 1}</a>
							</li>
						))}
						<li className='page-item'>
							<a
								className='page-link btn-filter'
								aria-label='Next'>
								<span aria-hidden='true'>&raquo;</span>
							</a>
						</li>
					</ul>
				</nav>
			</div>
		</div>
	);
};

export default Historyroom;
