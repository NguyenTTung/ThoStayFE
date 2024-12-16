

export const OwnerIndexNoti: React.FC = () => {
  return (
    <div className="container-fluid noti-container">
      <div className="row align-items-stretch">
        <div className="card w-100">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between mb-4">
              <div className="d-flex flex-wrap">
                <a
                  href="#"
                  className="btn btn-filter btn-sm px-3 py-2 mx-2 mb-3 btn-transform-y2 d-flex align-items-center"
                >
                  Dãy trọ
                </a>
                <a
                  href="#"
                  className="btn btn-filter btn-sm px-3 py-2 mx-2 mb-3 btn-transform-y2 d-flex align-items-center"
                >
                  Phòng trọ
                </a>
                <a
                  href="#"
                  className="btn btn-filter btn-sm px-3 py-2 mx-2 mb-3 btn-transform-y2 d-flex align-items-center"
                >
                  Người thuê{" "}
                </a>
              </div>
              <div className=""></div>
            </div>

            <div className="table-responsive" data-simplebar>
              <table className="table table-borderless align-middle text-nowrap">
                <thead>
                  <tr className="brg-table-tro rounded-pill">
                    <th scope="col">STT</th>
                    <th scope="col">Tên chủ trọ</th>
                    <th scope="col">Địa chỉ</th>
                    <th scope="col">Số phòng</th>
                    <th scope="col">Giá điện</th>
                    <th scope="col">Giá nước</th>
                    <th scope="col">Giá khác</th>
                    <th scope="col">Trạng thái</th>
                    <th scope="col">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="d-flex align-items-center">
                        <div>
                          <h6 className="mb-1 fw-bolder">123</h6>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className="fs-3 fw-normal mb-0">123</p>
                    </td>
                    <td>
                      <p className="fs-3 fw-normal mb-0">123333333333333333333333</p>
                    </td>
                    <td>
                      <p className="fs-3 fw-normal mb-0">123</p>
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
        </div>
      </div>
    </div>
  );
};
