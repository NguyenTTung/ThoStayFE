import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetRentalRoomHistoryAPI } from '@/services/api/HomeApi';

interface RentalRoomHistory {
    roomId: number;
    motelName: string;
    roomNumber: string;
    price: number;
    createDate: string;
    endDate: string;
    adress: string;
}

const History = () => {
    const navigate = useNavigate();
    const [historyData, setHistoryData] = useState<RentalRoomHistory[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const pageSize = 10;

    const handleClickRoom = (roomId: number) => {
        navigate(`/user/history/${roomId}`);
    };

    const fetchHistoryData = async (page: number, search: string = '') => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await GetRentalRoomHistoryAPI(token, page, pageSize, search);
                const { items, totalItems } = response.data;

                setHistoryData(items);
                const calculatedTotalPages = Math.max(1, Math.ceil(totalItems / pageSize));
                setTotalPages(calculatedTotalPages);
            }
        } catch (error) {
            console.error('Failed to fetch history:', error);
            setHistoryData([]);
            setTotalPages(1);
        }
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        fetchHistoryData(1, value); // Gọi API ngay khi thay đổi giá trị tìm kiếm
        setCurrentPage(1); // Đặt lại về trang 1
    };

    useEffect(() => {
        fetchHistoryData(currentPage, searchTerm);
    }, [currentPage]);

    const formatDate = (date: string) => {
        const formattedDate = new Date(date);
        return formattedDate.toLocaleDateString('vi-VN');
    };

    return (
        <div className="history p-3">
            <div className="mb-3 d-flex align-items-center">
                <input
                    type="text"
                    className="form-control me-2"
                    style={{ width: '250px' }}
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">STT</th>
                        <th scope="col">Dãy trọ</th>
                        <th scope="col">Địa chỉ</th>
                        <th scope="col">Số phòng</th>
                        <th scope="col">Giá</th>
                        <th scope="col">Ngày thuê</th>
                        <th scope="col">Ngày trả</th>
                    </tr>
                </thead>
                <tbody>
                    {historyData.length > 0 ? (
                        historyData.map((item, index) => (
                            <tr key={item.roomId} onClick={() => handleClickRoom(item.roomId)}>
                                <th scope="row">{(currentPage - 1) * pageSize + index + 1}</th>
                                <td>{item.motelName}</td>
                                <td>{item.adress}</td>
                                <td>{item.roomNumber}</td>
                                <td>{item.price.toLocaleString()} VND</td>
                                <td>{formatDate(item.createDate)}</td>
                                <td>{item.endDate ? new Date(item.endDate).toLocaleDateString() : 'Chưa trả'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="text-center">Không có lịch sử thuê phòng</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {/* Phân trang */}
            <div className="w-100 d-flex justify-content-center mt-3">
                <nav aria-label="Page navigation">
                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                &laquo;
                            </button>
                        </li>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <li
                                key={index + 1}
                                className={`page-item`}
                            >
                                <button
                                    className={`page-link ${currentPage === index + 1 ? 'active-filter-motel' : ''}`}
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                &raquo;
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default History;
