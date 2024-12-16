import { Link } from "react-router-dom";
import ModalThaotac from "./component/ModalThaotac";
import { useEffect, useState } from "react";
import { MotelDTO } from "@/services/Dto/MotelDto";
import {
  ApproveMotelApi,
  getMotelByAdminApi,
  LockMotelApi,
  RejectMotelApi,
  UnLockMotelApi,
} from "@/services/api/MotelApi";
import Swal from "sweetalert2";
export interface FilterProps {
  status: number | null;
  pageNumber: number;
  pageSize: number;
  search: string | null;
}

export interface PageDTO {
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

export const Motel: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // Thêm state để xác định loại modal
  const [dataMotel, setDataMotel] = useState<MotelDTO[]>([]);
  const [query, setQuery] = useState<FilterProps>({
    status: null,
    pageNumber: 1,
    pageSize: 5,
    search: null,
  });
  const [page, setPage] = useState<PageDTO>({
    totalPages: 0,
    pageNumber: 0,
    pageSize: 0,
  });

  const [activeFilter, setActiveFilter] = useState<number | null>(null);
  const [pageactive, setPageactive] = useState<number>(query.pageNumber);

  useEffect(() => {
    LoadData(query);
  }, [query]);

  const LoadData = async (query: FilterProps) => {
    const response = await getMotelByAdminApi(query);
    setDataMotel(await response.items);
    setPage({
      totalPages: await response.totalPages,
      pageNumber: await response.pageNumber,
      pageSize: await response.pageSize,
    });
    console.log(response);
  };

  const HandlePage = async (pageNumber: number) => {
    const newQuery = {
      ...query,
      pageNumber: pageNumber,
    };
    setQuery(newQuery);
    setPageactive(pageNumber)
    await LoadData(newQuery);
  };

  // const handleOpenModal = (type: string) => {
  //   setModalType(type); // Xác định loại modal cần hiển thị
  //   setShowModal(true);
  // };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalType("");
  };

  const CheckStatus = (status: number) => {
    if (status === 1) {
      return (
        <span className="tt-choduyet badge bg-light-warning rounded-pill px-3 py-2 fs-3">
          Chờ duyệt
        </span>
      );
    } else if (status === 2) {
      return (
        <span className="tt-dangthue badge bg-light-success rounded-pill px-3 py-2 fs-3">
          Đang hoạt động
        </span>
      );
    } else if (status === 3) {
      return (
        <span className="tt-khoa badge bg-light-danger rounded-pill px-3 py-2 fs-3">
          Ngừng hoạt động
        </span>
      );
    } else if (status === 4) {
      return (
        <span className="tt-khoa badge bg-light-danger rounded-pill px-3 py-2 fs-3">
          Từ chối
        </span>
      );
    } else if (status === 5) {
      return (
        <span className="tt-khoa badge bg-light-danger rounded-pill px-3 py-2 fs-3">
          Đã xoá
        </span>
      );
    }
  };

  const HandleSearch = async (search: string) => {
    const newQuery = {
      ...query,
      search: search,
    };
    setQuery(newQuery);
    //delay 1s
    setTimeout(async () => {
      await LoadData(newQuery);
    }, 1000);
  };

  const HandleApprove = async (id: number) => {
    const response = await ApproveMotelApi(id);
    if (response.code === 200) {
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Duyệt dãy trọ thành công",
      });
      await LoadData(query);
    }
  };

  const HandleReject = async (id: number) => {
    const response = await RejectMotelApi(id);
    if (response.code === 200) {
      Swal.fire({
        icon: "warning",
        title: "Từ chối!",
        text: "Từ chối dãy trọ thành công",
      });
      await LoadData(query);
    }
  };

  const HandleLock = async (id: number) => {
    const response = await LockMotelApi(id);
    if (response.code === 200) {
      Swal.fire({
        icon: "error",
        title: "Khóa!",
        text: "Khóa dãy trọ thành công",
      });
      await LoadData(query);
    }
  };

  const HandleUnLock = async (id: number) => {
    const response = await UnLockMotelApi(id);
    if (response.code === 200) {
      Swal.fire({
        icon: "success",
        title: "Mở khóa!",
        text: "Mở khóa dãy trọ thành công",
      });
      await LoadData(query);
    }
  };

  const CheckStatus_ThaoTac = (status: number, id: number) => {
    if (status === 1) {
      return (
        <>
          <a className=" px-2 py-1 mx-1 btn-transform-y2">
            {/* onClick={() => handleOpenModal('khoa')}> */}
            <i
              className="fa-regular fa-square-check icon-table-motel fa-xl"
              onClick={() => HandleApprove(id)}
            ></i>
          </a>
          <a className=" px-2 py-1 mx-1 btn-transform-y2">
            {/* onClick={() => handleOpenModal('khoa')}> */}
            <i
              className="fa-regular fa-rectangle-xmark icon-table-motel fa-xl"
              onClick={() => HandleReject(id)}
            ></i>
          </a>
        </>
      );
    } else if (status === 2) {
      return (
        <>
          <a className=" px-2 py-1 mx-1 btn-transform-y2">
            <i
              className="fa-regular fa-lock icon-table-motel fa-xl"
              onClick={() => HandleLock(id)}
            ></i>
          </a>
        </>
      );
    } else if (status === 3) {
      return (
        <>
          <a className=" px-2 py-1 mx-1 btn-transform-y2">
            <i
              className="fa-regular fa-unlock icon-table-motel fa-xl"
              onClick={() => HandleUnLock(id)}
            ></i>
          </a>
        </>
      );
    }
  };

  //đinh dạng ngày tháng
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const HandleFilter = (status: number | null) => {
    const newQuery = {
      ...query,
      status: status,
    };
    setActiveFilter(status);
    setQuery(newQuery);
  };

  return (
    <div className="container-fluid">
      <div className="row align-items-stretch">
        <div className="card w-100">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="header-name-all">Quản lý dãy trọ</h2>
              </div>
              <div></div>
            </div>
            <div className="d-flex justify-content-lg-between justify-content-xl-between  justify-content-xxl-between  mt-4">
              <div className="d-flex mb-4 flex-wrap ">
                <a
                  className={`btn btn-filter btn-sm px-3 py-2 mx-2 mb-3 btn-transform-y2 ${
                    activeFilter === null ? "active-filter-motel" : ""
                  }`}
                  onClick={() => HandleFilter(null)}
                >
                  Tất cả
                </a>
                <a
                  href="#"
                  className={`btn btn-filter btn-sm px-3 py-2 mx-2 mb-3 btn-transform-y2 ${
                    activeFilter === 1 ? "active-filter-motel" : ""
                  }`}
                  onClick={() => HandleFilter(1)}
                >
                  Chờ duyệt
                </a>
                <a
                  href="#"
                  className={`btn btn-filter btn-sm px-3 py-2 mx-2 mb-3 btn-transform-y2 ${
                    activeFilter === 2 ? "active-filter-motel" : ""
                  }`}
                  onClick={() => HandleFilter(2)}
                >
                  Đang hoạt động
                </a>
                <a
                  href="#"
                  className={`btn btn-filter btn-sm px-3 py-2 mx-2 mb-3 btn-transform-y2 ${
                    activeFilter === 3 ? "active-filter-motel" : ""
                  }`}
                  onClick={() => HandleFilter(3)}
                >
                  Ngừng hoạt động
                </a>
                <a
                  href="#"
                  className={`btn btn-filter btn-sm px-3 py-2 mx-2 mb-3 btn-transform-y2 ${
                    activeFilter === 4 ? "active-filter-motel" : ""
                  }`}
                  onClick={() => HandleFilter(4)}
                >
                  Từ chối
                </a>
                <a
                  href="#"
                  className={`btn btn-filter btn-sm px-3 py-2 mx-2 mb-3 btn-transform-y2 ${
                    activeFilter === 5 ? "active-filter-motel" : ""
                  }`}
                  onClick={() => HandleFilter(5)}
                >
                  Đã xoá
                </a>
              </div>
              <div className="">
                <div className="d-flex justify-content-start justify-content-lg-end justify-content-xl-end justify-content-xxl-end">
                  <div>
                    <div className="form-group has-search position-relative">
                      <form className="d-flex align-items-center border border-secondary-subtle ps-3 rounded">
                        <span className="fa fa-search form-control-feedback"></span>
                        <input
                          type="search"
                          className="form-control border-0"
                          placeholder="Tìm kiếm trọ"
                        />
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="table-responsive mt-3" data-simplebar>
              <table className="test-table table table-borderless align-middle text-nowrap">
                <thead className="">
                  <tr className=" brg-table-tro">
                    <th scope="col">ID</th>
                    <th scope="col">Tên chủ trọ</th>
                    <th scope="col">Địa chỉ</th>
                    <th scope="col">Số phòng</th>
                    <th scope="col">Đánh giá</th>
                    <th scope="col">Số người thuê</th>
                    <th scope="col">Ngày tạo</th>
                    <th scope="col">Mô tả</th>
                    <th scope="col">Trạng thái</th>
                    <th scope="col">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="table-motel">
                  {dataMotel.map((motel) => (
                    <tr key={motel.id}>
                      <td>{motel.id}</td>
                      <td>{motel.owner.fullName}</td>
                      <td className="text-overflow-motel">{motel.address}</td>
                      <td>{motel.totalRoom}</td>
                      <td>{motel.rating.toFixed(1)}</td>
                      <td>{motel.totalRoom}</td>
                      <td>{formatDate(motel.createDate)}</td>
                      <td
                        className="motel-diachi"
                        dangerouslySetInnerHTML={{
                          __html: motel?.description || "",
                        }}
                      ></td>
                      <td>{CheckStatus(motel.status)}</td>
                      <td>
                        <Link
                          to={`/admin/roomtest/${motel.id}`}
                          className=" px-2 py-1 mx-1 btn-transform-y2"
                        >
                          <i className="fa-solid fa-ellipsis icon-table-motel fa-xl"></i>
                        </Link>
                        {CheckStatus_ThaoTac(motel.status, motel.id)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="w-100 d-flex justify-content-center mt-3">
              <nav aria-label="Page navigation example">
                <ul className="pagination">
                  <li className="page-item">
                    <a className="page-link  btn-filter" aria-label="Previous">
                      <span aria-hidden="true">&laquo;</span>
                    </a>
                  </li>
                  {/* render page number */}
                  {Array.from({ length: page.totalPages }, (_, index) => (
                    <li
                      className="page-item"
                      key={index}
                      onClick={() => HandlePage(index + 1)}
                    >
                      <a
                        className={`page-link  btn-filter  ${
                          pageactive === index + 1 ? "active-filter-motel" : ""
                        }`}
                      >
                        {index + 1}
                      </a>
                    </li>
                  ))}
                  <li className="page-item">
                    <a className="page-link  btn-filter" aria-label="Next">
                      <span aria-hidden="true">&raquo;</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <ModalThaotac onClose={handleCloseModal} modalType={modalType} />
      )}
    </div>
  );
};
