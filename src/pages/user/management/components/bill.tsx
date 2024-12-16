import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBillUserApi } from '@/services/api/HomeApi';

interface BillData {
    id: number;
    priceRoom: number;
    total: number;
    status: number;
    createdDate: string;
}

const Bill = () => {
    const navigate = useNavigate();
    const { roomId } = useParams<{ roomId: string }>();
    const [bills, setBills] = useState<BillData[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const pageSize = 10;

    const handleClickBill = (billId: number) => {
        navigate(`/user/history/${roomId}/${billId}`);
    };

    const fetchBills = async (page: number, search: string = '') => {
        try {
            if (roomId) {
                const response = await getBillUserApi(Number(roomId), page, pageSize, search);
                const { items, totalItems } = response.data;

                setBills(items);
                const calculatedTotalPages = Math.max(1, Math.ceil(totalItems / pageSize)); // Tính tổng số trang
                setTotalPages(calculatedTotalPages);
            }
        } catch (error) {
            console.error('Failed to fetch bills:', error);
            setBills([]);
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
        fetchBills(1, value);
        setCurrentPage(1);
    };

    useEffect(() => {
        fetchBills(currentPage, searchTerm);
    }, [currentPage]);

    const formatDate = (date: string) => {
        const formattedDate = new Date(date);
        return formattedDate.toLocaleDateString('vi-VN'); // Định dạng ngày theo kiểu Việt Nam (Ngày/Tháng/Năm)
    };
    return (
        <div className="bill p-3">
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
                        <th scope="col">Giá phòng</th>
                        <th scope="col">Tổng tiền</th>
                        <th scope="col">Ngày tạo</th>
                        <th scope="col">Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {bills.length > 0 ? (
                        bills.map((item, index) => (
                            <tr key={item.id} onClick={() => handleClickBill(item.id)}>
                                <th scope="row">{(currentPage - 1) * pageSize + index + 1}</th>
                                <td>{item.priceRoom.toLocaleString()} VND</td>
                                <td>{item.total.toLocaleString()} VND</td>
                                <td>{formatDate(item.createdDate)}</td>
                                <td>{item.status === 0 ? 'Chưa thanh toán' : 'Đã thanh toán'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-center">Không có hóa đơn</td>
                        </tr>
                    )}
                </tbody>
            </table>
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
                                className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                            >
                                <button
                                    className="page-link"
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

export default Bill;
