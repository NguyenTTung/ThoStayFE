import { MyChart, ChartProps } from "./components/chart";
import tk from '@/assets/images/backgrounds/img-login.png'
import { Room, getAvailableRoomApi, Revenue, getRevenueStatisticApi, Percentage, getPercentageApi } from '@/services/api/authApi'
import { useEffect, useState } from 'react';
import { getRoleFromToken } from '@/services/apiConfig';
import { GetRevenueAdmin, RevenueAdmin, CountAccount, GetCountAccount } from '@/services/api/revenueAdmin';


export const Dashboard = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [revenueData, setRevenueData] = useState<ChartProps | null>(null);
    const [percentageData, setPercentageData] = useState<Percentage[]>([]);
    //check role 
    const token = localStorage.getItem('token');
    //get role from token
    const roleFromToken = getRoleFromToken(token || '');


    useEffect(() => {
        const fetchRooms = async (data: Room) => {
            try {
                const response = await getAvailableRoomApi(data);
                if (response.status === 200) {
                    setRooms(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching available rooms:", error);
            }
        };

        fetchRooms({ motelName: "", address: "", emptyRoomsCount: 0, status: 0 });
    }, []);

    //get revenue data of motel owner


    useEffect(() => {
        if (roleFromToken.toUpperCase() === 'OWNER') {
            const fetchRevenue = async (data: Revenue) => {
                try {
                    const response = await getRevenueStatisticApi(data);
                    if (response.status === 200) {
                        const formattedData = {
                            data: {
                                options: {
                                    chart: {
                                        id: 'revenueChart',
                                        toolbar: {
                                            show: false,
                                        },
                                    },
                                    xaxis: {
                                        categories: response.data.map((item: { month: string }) => `${item.month}`),
                                    },
                                },
                                series: [
                                    {
                                        name: 'Doanh thu',
                                        data: response.data.map((item: { revenue: number }) => item.revenue),
                                    },
                                ],
                                type: 'bar' as 'bar',
                                id: 'revenue',
                            },
                        };
                        setRevenueData(formattedData);
                    }
                } catch (error) {
                    console.error("Error fetching revenue data:", error);
                }
            };
            fetchRevenue({ month: "", revenue: 0, year: 0 });
        }
        if (roleFromToken?.toUpperCase() === 'ADMIN') {
            const fetchRevenue = async (item: RevenueAdmin) => {
                try {
                    const response = await GetRevenueAdmin(item);  // Gọi API

                    if (response.status === 200) {
                        const formattedData: ChartProps = {
                            data: {
                                options: {
                                    chart: {
                                        id: "revenueChart",
                                        toolbar: { show: false },
                                    },
                                    xaxis: {
                                        categories: response.data.data.map((item: any) => `${item.month}/${item.year}`),  // Chuyển dữ liệu thành các tháng (nếu cần)
                                    },
                                },
                                series: [
                                    {
                                        name: "Doanh thu",
                                        data: response.data.data.map((item: any) => item.totalRevenue),  // Dữ liệu doanh thu
                                    },
                                ],
                                type: "bar",
                            },
                        };
                        setRevenueData(formattedData);  // Cập nhật dữ liệu biểu đồ
                    }
                } catch (error) {
                    console.error("Error fetching revenue data:", error);
                }
            };

            // Đảm bảo truyền đúng token
            fetchRevenue({ token: token || "" });
        }
    }, []);



    useEffect(() => {
        const fetchPercentage = async (data: Percentage) => {
            try {
                const response = await getPercentageApi(data);
                if (response.data.code === 200) {
                    setPercentageData(response.data.data)
                }
            } catch (error) {
                console.error("Error fetching percentage:", error);
            }
        };
        fetchPercentage({ name: "", percentage: 0 });
    }, []);

    //count account for admin
    const [earningData, setEarningData] = useState<ChartProps | null>(null);
    const [customerEarningData, setCustomerEarningData] = useState<ChartProps | null>(null);
    useEffect(() => {
        if (roleFromToken?.toUpperCase() === 'ADMIN') {
            const fetchAccountCounts = async (item: CountAccount) => {
                try {
                    const response = await GetCountAccount(item);
                    if (response.data.code === 200) {
                        // Xử lý dữ liệu để cập nhật biểu đồ
                        const formattedData: ChartProps = {
                            data: {
                                options: {
                                    chart: {
                                        id: 'accountChart',
                                        toolbar: {
                                            show: false,
                                        },
                                        background: 'transparent',
                                    },
                                    xaxis: {
                                        categories: response.data.data.map((item: any) => `${item.month}/${item.year}`),
                                        axisBorder: {
                                            show: false,
                                        },
                                        axisTicks: {
                                            show: false,
                                        },
                                    },
                                    yaxis: {
                                        labels: {
                                            show: false,
                                        },
                                    },
                                    stroke: {
                                        curve: 'smooth',
                                        width: 2,
                                    },
                                    grid: {
                                        show: false,
                                    },
                                },
                                series: [
                                    {
                                        name: 'Số tài khoản',
                                        data: response.data.data.map((item: any) => item.totalAccount),
                                    },
                                ],
                                type: 'area',
                            },
                        };
                        setEarningData(formattedData); // Cập nhật dữ liệu biểu đồ
                    }
                } catch (error) {
                    console.error("Error fetching account counts:", error);
                }
            }; const fetchCustomerAccounts = async (item: CountAccount) => {
                try {
                    const response = await GetCountAccount({ token: token || "", role: "CUSTOMER" });
                    if (response.data.code === 200) {
                        // Xử lý dữ liệu để cập nhật biểu đồ
                        const formattedData: ChartProps = {
                            data: {
                                options: {
                                    chart: {
                                        id: 'customerAccountChart',
                                        toolbar: { show: false },
                                        background: 'transparent',
                                    },
                                    xaxis: {
                                        categories: response.data.data.map((item: any) => `${item.month}/${item.year}`),
                                        axisBorder: { show: false },
                                        axisTicks: { show: false },
                                    },
                                    yaxis: {
                                        labels: { show: false },
                                    },
                                    stroke: {
                                        curve: 'smooth',
                                        width: 2,
                                    },
                                    grid: { show: false },
                                },
                                series: [
                                    {
                                        name: 'Số tài khoản',
                                        data: response.data.data.map((item: any) => item.totalAccount),
                                    },
                                ],
                                type: 'area',
                            },
                        };
                        setCustomerEarningData(formattedData); // Cập nhật dữ liệu biểu đồ
                    }
                } catch (error) {
                    console.error("Error fetching customer account counts:", error);
                }
            };
            fetchCustomerAccounts({ token: token || "", role: "CUSTOMER" });


            fetchAccountCounts({ token: token || "", role: "OWNER" });
        }
    }, []);



    return (
        <div className="container-fluid">
            {/* <!--  Row 1 --> */}
            <div className="row  mt-3">
                <div className={`${roleFromToken?.toUpperCase() == 'ADMIN' ? 'col-lg-8 ' : 'col-lg-12 '} d-flex align-items-strech`}>
                    <div className="card w-100">
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between mb-10">
                                <div className="">
                                    <h5 className="card-title fw-semibold">Doanh thu</h5>
                                </div>
                                <div className="dropdown">
                                    <button
                                        id="dropdownMenuButton1"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        className="rounded-circle btn-transparent rounded-circle btn-sm px-1 btn shadow-none"
                                    >
                                        <i className="ti ti-dots-vertical fs-7 d-block"></i>
                                    </button>
                                    <ul
                                        className="dropdown-menu dropdown-menu-end"
                                        aria-labelledby="dropdownMenuButton1"
                                    >
                                        <li><a className="dropdown-item" href="#">Action</a></li>
                                        <li>
                                            <a className="dropdown-item" href="#">Another action</a>
                                        </li>
                                        <li>
                                            <a className="dropdown-item" href="#"
                                            >Something else here</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            {revenueData && <MyChart data={revenueData.data} />}
                        </div>
                    </div>
                </div>
                {roleFromToken?.toUpperCase() == 'ADMIN' && (
                    <div className="col-lg-4">
                        <div className="row">
                            <div className="col-lg-12 col-sm-6">
                                {/* <!-- Yearly Breakup --> */}
                                {/* <div className="card overflow-hidden">
                                <div className="card-body p-4">
                                    <h5 className="card-title mb-10 fw-semibold">Dịch vụ</h5>
                                    <div className="row">
                                        <div className="d-flex justify-content-center">
                                            <MyChart data={grade.data} />
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            </div>
                            <div className="col-lg-12 col-sm-6">
                                {/* <!-- Monthly Earnings --> */}
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row alig n-items-start">
                                            <div className="col-12">
                                                <h5 className="card-title mb-10 fw-semibold">Tổng tài khoản chủ trọ</h5>

                                            </div>
                                            {earningData && <MyChart data={earningData.data} />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12 col-sm-6 mt-4">
                                {/* <!-- Customer Accounts --> */}
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row align-items-start">
                                            <div className="col-12">
                                                <h5 className="card-title mb-10 fw-semibold">Tổng tài khoản khách hàng</h5>

                                            </div>
                                            {customerEarningData && <MyChart data={customerEarningData.data} />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {roleFromToken?.toUpperCase() == 'OWNER' && (
                <div className="row align-items-stretch">
                    <div className="card w-100">
                        <div className="card-body p-4">
                            <div
                                className="d-flex mb-4 justify-content-between align-items-center"
                            >
                                <h5 className="mb-0 fw-bold">Các trọ còn trống</h5>

                                <div className="dropdown">
                                    <button
                                        id="dropdownMenuButton1"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        className="rounded-circle btn-transparent rounded-circle btn-sm px-1 btn shadow-none"
                                    >
                                        <i className="ti ti-dots-vertical fs-7 d-block"></i>
                                    </button>
                                    <ul
                                        className="dropdown-menu dropdown-menu-end"
                                        aria-labelledby="dropdownMenuButton1"
                                    >
                                        <li><a className="dropdown-item" href="#">Action</a></li>
                                        <li>
                                            <a className="dropdown-item" href="#">Another action</a>
                                        </li>
                                        <li>
                                            <a className="dropdown-item" href="#"
                                            >Something else here</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="table-responsive" data-simplebar>
                                <table
                                    className="table table-borderless align-middle text-nowrap"
                                >
                                    <thead>
                                        <tr>
                                            <th scope="col">Trọ</th>
                                            <th scope="col">Địa chỉ</th>
                                            <th scope="col">Phòng trống</th>
                                            <th scope="col">Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rooms.map((rooms, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="me-4">
                                                            <img
                                                                src={tk}
                                                                width="50"
                                                                className="rounded-circle"
                                                                alt=""
                                                            />
                                                        </div>

                                                        <div>
                                                            <h6 className="mb-1 fw-bolder">ID12345</h6>
                                                            <p className="fs-3 mb-0">{rooms.motelName}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <p className="fs-3 fw-normal mb-0">{rooms.address}</p>
                                                </td>
                                                <td>
                                                    <p className="fs-3 fw-normal mb-0 text-success">
                                                        {rooms.emptyRoomsCount}
                                                    </p>
                                                </td>
                                                <td>
                                                    {rooms.status === 1 && (
                                                        <span className="badge bg-light-success rounded-pill text-success px-3 py-2 fs-3">Hoạt động</span>
                                                    )}
                                                    {rooms.status === 2 && (
                                                        <span className="badge bg-light-primary rounded-pill text-primary px-3 py-2 fs-3">Chưa biết ghi gì</span>
                                                    )}
                                                    {rooms.status === 3 && (
                                                        <span className="badge bg-light-danger rounded-pill text-danger px-3 py-2 fs-3">Khóa</span>
                                                    )}
                                                    {rooms.status === 4 && (
                                                        <span className="badge bg-light-warning rounded-pill text-warning px-3 py-2 fs-3">Đang sửa</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}