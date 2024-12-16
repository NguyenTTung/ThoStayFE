import { useState } from "react";
import InfoBill from "./component/infoBill";

export const Bill: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  function handleUpdate(): void {
    // gọi lại danh sách
  }

  return (
    <div className="container-fluid noti-container">
      <div className="row align-items-stretch  mt-3">
        <div className="card w-100">
          <div className="card-body p-4">
            <div className="d-flex justify-content-end mb-4">
              <div className="">
              <form className="d-flex align-items-center border border-secondary-subtle ps-3 rounded">
                  <span className="fa fa-search form-control-feedback"></span>
                  <input
                    type="search"
                    className="form-control border-0"
                    placeholder="Tìm kiếm hóa đơn"
                  />
                </form>
              </div>
            </div>

            <div className="table-responsive" data-simplebar>
              <table className="table table-borderless align-middle text-nowrap">
                <thead>
                  <tr className="brg-table-tro rounded-pill">
                    <th scope="col"></th>
                    <th scope="col">Số phòng</th>
                    <th scope="col">Địa chỉ</th>
                    <th scope="col">Tiền điện</th>
                    <th scope="col">Tiền nước</th>
                    <th scope="col">Tiền thuê trọ</th>
                    <th scope="col">Chi phí khác</th>
                    <th scope="col">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr onClick={handleOpenModal}>
                    <td
                      className="cangiua checkbox-bill"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input type="checkbox" name="" id="" />
                    </td>
                    <td>
                      <p className="fs-3 fw-normal mb-0">12</p>
                    </td>
                    <td>
                      <p className="fs-3 fw-normal mb-0">123 Phan chu trinh</p>
                    </td>
                    <td>
                      <p className="fs-3 fw-normal mb-0">123,123đ</p>
                    </td>
                    <td>
                      <p className="fs-3 fw-normal mb-0">45,456đ</p>
                    </td>
                    <td>
                      <p className="fs-3 fw-normal mb-0">1,200,000đ</p>
                    </td>
                    <td>
                      <p className="fs-3 fw-normal mb-0">12,123đ</p>
                    </td>
                    <td>
                      <p className="fs-3 fw-normal mb-0">x,xxx,xxxđ</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="w-100 d-flex justify-content-center mt-3">
              <nav aria-label="Page navigation example">
                <ul className="pagination">
                  <li className="page-item">
                    <a
                      className="page-link  btn-filter"
                      href="#"
                      aria-label="Previous"
                    >
                      <span aria-hidden="true">&laquo;</span>
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link  btn-filter" href="#">
                      1
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link  btn-filter" href="#">
                      2
                    </a>
                  </li>
                  <li className="page-item">
                    <a className="page-link  btn-filter" href="#">
                      3
                    </a>
                  </li>
                  <li className="page-item">
                    <a
                      className="page-link  btn-filter"
                      href="#"
                      aria-label="Next"
                    >
                      <span aria-hidden="true">&raquo;</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          {showModal && (
            <InfoBill
              onClose={handleCloseModal}
              onUpdate={handleUpdate}
              billId={1}
            />
          )}
        </div>
      </div>
    </div>
  );
};
