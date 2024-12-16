import { useEffect, useState } from 'react';
import '../styles/billDetail.scss'
import { useParams } from 'react-router-dom';
import { getBillDetailApi } from '@/services/api/HomeApi';
interface BillDetailData {
    motelName: string;
    address: string;
    roomNumber: string;
    billId: number;
    createDate: string;
    status: number;
    fullName: string;
    electric: number;
    water: number;
    roomPrice: number;
    waterName: string;
    electricName: string;
    waterPrice: number;
    electricPrice: number;
    otherService: { name: string; price: number }[];
}

const BillDetail = () => {
    const { billId } = useParams<{ billId: string }>();
    const [billData, setBillData] = useState<BillDetailData | null>(null);

    useEffect(() => {
        const fetchBillDetails = async () => {
            if (billId) {
                try {
                    const response = await getBillDetailApi(Number(billId));
                    setBillData(response.data);
                } catch (error) {
                    console.error('Failed to fetch bill details:', error);
                }
            }
        };
        fetchBillDetails();
    }, [billId]);
    const formatDate = (date: string) => {
        const formattedDate = new Date(date);
        return formattedDate.toLocaleDateString('vi-VN'); // Định dạng ngày theo kiểu Việt Nam (Ngày/Tháng/Năm)
    };
    console.log(billData);
    return (
        <div className="bill-detail py-4 px-5">
            <div className="title text-dark mb-3 ">
                <h1>Thông tin hóa đơn</h1>
            </div>
            <div className="infomation container">
                <div className="row">
                    <div className="col-8">
                        <div className="motel-description mb-4">
                            <div className="text-dark motel-description__name">
                                Tên dãy trọ: {billData?.motelName}
                            </div>
                            <div className="text-dark motel-description__address">
                                Phòng: {billData?.roomNumber}
                            </div>
                            <div className="text-dark motel-description__room-name">
                                {billData?.address}
                            </div>
                        </div>
                        <div className="user-name text-dark">
                            Khách hàng: {billData?.fullName}
                        </div>
                    </div>
                    <div className="col-4 text-end">
                        <div className='bill-description'>
                            <div className='bill-description__number text-dark'>
                                Số: {billData?.billId}
                            </div>
                            <div className='bill-description__create-date text-dark'>
                                Ngày tạo: {billData?.createDate ? formatDate(billData.createDate) : ''}
                            </div>
                            <div className='bill-description__status text-dark'>
                                Trạng thái: {billData?.status === 0 ? 'Chưa thanh toán' : 'Đã thanh toán'}
                            </div>
                        </div>
                    </div>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Tên</th>
                            <th scope="col">Giá</th>
                            <th scope="col">Số (điện, nước)</th>
                            <th scope="col">Tổng</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">1</th>
                            <td>Điện</td>
                            <td>{billData?.electricPrice} vnđ</td>
                            <td>{billData?.electric}</td>
                            <td>{(billData?.electric && billData?.electricPrice
                                ? (billData.electric * billData.electricPrice).toLocaleString()
                                : '')} vnđ</td>
                        </tr>
                        <tr>
                            <th scope="row">2</th>
                            <td>Nước</td>

                            <td>{billData?.waterPrice} vnđ</td>
                            <td>{billData?.water}</td>
                            <td>{(billData?.water && billData?.waterPrice)
                                ? (billData?.water * billData?.waterPrice).toLocaleString()
                                : ''} vnđ</td>
                        </tr>
                        {billData?.otherService.map((service, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 3}</th>
                                <td>{service.name}</td>
                                <td>{service.price.toLocaleString()} vnđ</td>
                                <td>Không có</td>
                                <td>{service.price.toLocaleString()} vnđ</td>
                            </tr>
                        ))}
                        <tr>
                            <th scope="row">3</th>
                            <td>Giá phòng</td>
                            <td>{billData?.roomPrice.toLocaleString()} vnđ</td>
                            <td>Không có</td>
                            <td>{billData?.roomPrice.toLocaleString()} vnđ</td>
                        </tr>
                        <tr className='fs-5'>
                            <th colSpan={4}>Thành tiền</th>
                            <td>{billData
                                ? (
                                    (billData.roomPrice || 0) +
                                    (billData.water || 0) * (billData.waterPrice || 0) +
                                    (billData.electric || 0) * (billData.electricPrice || 0) +
                                    (billData.otherService?.reduce((sum, service) => sum + (service.price || 0), 0) || 0)
                                ).toLocaleString()
                                : '0'}{' '}
                                vnđ</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default BillDetail