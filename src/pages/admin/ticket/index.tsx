import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import "./styles/styleticket.scss"
import { getTickets } from "@/services/api/ticketApi";
import { ParamsPage, Data } from "@/services/Dto/ticketDto";
import { Link } from "react-router-dom";

export const TicketPage: React.FC = () => {

  const [tickets, setTikets] = useState<Data>();

  const [activeStatus, setActiveStatus] = useState<number | undefined>(undefined);
  const [keySearch, setKeysearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const fetchTickets = async (param: ParamsPage = {}) => {
    try {
      setActiveStatus(param.status || undefined);
      const token = localStorage.getItem('token');
      if (token) {
        const res = await getTickets({ ...param, token });
        setTikets(res.data.data);
      }
    } catch (error) {
      console.error('Lỗi lấy dữ liệu api:', error);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setDebouncedSearch(keySearch);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [keySearch]);

  useEffect(() => {
    fetchTickets({ search: debouncedSearch });
  }, [debouncedSearch]);

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="container-fluid ticket">
      <div className="row align-items-stretch  mt-3">
        <div className="card w-100">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="header-name-all">Quản lý ticket</h2>
              </div>
              <div>
                {" "}
                <div className="">
                  {/* button thêm */}
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between my-4 block-filter">
              <div className="d-flex flex-wrap block-filter__button">
                <button
                  onClick={() => fetchTickets({
                    search: keySearch
                  })}
                  className={`btn btn-filter btn-sm px-3 py-2 mx-2 mb-3 btn-transform-y2 ${activeStatus === undefined ? 'block-filter__button--active' : ''}`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => fetchTickets({
                    search: keySearch,
                    status: 3
                  })}
                  className={`btn btn-filter btn-sm px-3 py-2 mx-2 mb-3 btn-transform-y2 ${activeStatus === 3 ? 'block-filter__button--active' : ''}`}
                >
                  Hoàn thành
                </button>
                <button
                  onClick={() => fetchTickets({
                    search: keySearch,
                    status: 1
                  })}
                  className={`btn btn-filter btn-sm px-3 py-2 mx-2 mb-3 btn-transform-y2 ${activeStatus === 1 ? 'block-filter__button--active' : ''}`}
                >
                  Tiếp nhận
                </button>
                <button
                  onClick={() => fetchTickets({
                    search: keySearch,
                    status: 2
                  })}
                  className={`btn btn-filter btn-sm px-3 py-2 mx-2 mb-3 btn-transform-y2 ${activeStatus === 2 ? 'block-filter__button--active' : ''}`}
                >
                  Xử lý
                </button>
              </div>
              <div className="form-group has-search position-relative">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    fetchTickets({ search: keySearch });
                  }}
                  className="d-flex align-items-center border border-secondary-subtle ps-3 rounded"
                >
                  <span className="fa fa-search form-control-feedback"></span>
                  <input
                    type="search"
                    className="form-control border-0"
                    placeholder="Tìm kiếm tiêu đề"
                    value={keySearch}
                    onChange={(e) => setKeysearch(e.target.value)}
                  />
                </form>
              </div>
            </div>
            <div className="table-responsive" data-simplebar>
              <table className="table-ticket table table-borderless align-middle text-nowrap">
                <thead>
                  <tr className="brg-table-tro rounded-pill">
                    <th scope="col">STT</th>
                    <th scope="col">Loại</th>
                    <th scope="col">Tiêu đề</th>
                    <th scope="col">Nội dung</th>
                    <th scope="col">Tiến trình</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {tickets?.items && tickets.items.length > 0 &&
                    tickets.items.map((item, index) => (
                      <tr key={item.id}>
                        <td>
                          <p className="fs-3 fw-normal mb-0">{index + 1}</p>
                        </td>
                        <td>
                          <p className="fs-3 fw-normal mb-0">
                            {/* type: 0:mặc định, 1:lỗi hệ thống, 2:yêu cầu, 3:tố cáo, 4:trợ giúp
                          status: 0:mặc định, 1:tiếp nhận, 2:đang xử lý, 3:đã hoàn thành */}
                            {
                              item.type === 1 ? "Lỗi hệ thống" : item.type === 2 ? "Yêu cầu" : item.type === 3 ? "Tố cáo" : item.type === 4 ? "Trợ giúp" : "Chưa có"
                            }
                          </p>
                        </td>
                        <td>
                          <p className="fs-3 fw-normal mb-0 text-overflow-ticket-tieude">
                            {
                              item.title
                            }
                          </p>
                        </td>
                        <td>
                          <p className="fs-3 fw-normal mb-0 text-overflow-ticket">
                            {
                              item.content
                            }
                          </p>
                        </td>
                        <td>
                          <p className="fs-3 fw-normal mb-0">
                            {
                              item.status === 1 ? "Tiếp nhận" : item.status === 2 ? "Đang xử lý" : item.status === 3 ? "Hoàn thành" : "Chưa có"
                            }
                          </p>
                        </td>
                        <td>
                          <Link to={`/admin/ticket/${item.id}`}>
                          <i className="fa-solid fa-ellipsis icon-table-motel fa-xl"></i>
                          </Link>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
            {tickets && tickets?.totalPages > 1 && (
              <div className="w-100 d-flex justify-content-center mt-3">
                <nav aria-label="Page navigation example">
                  <ul className="pagination">
                    <li className="page-item block-page-item">
                      <button
                        onClick={() => {
                          if (tickets.pageNumber > 1) {
                            fetchTickets({
                              search: keySearch,
                              pageNumber: tickets.pageNumber - 1,
                              status: activeStatus
                            })
                          }
                        }}
                        className={`page-link btn-filter ${tickets.pageNumber === 1 ? 'block-page-item__block-page-link--disabled' : ''}`}>
                        <span aria-hidden="true">&laquo;</span>
                      </button>
                    </li>
                    {tickets && tickets.totalPages &&
                      Array.from({ length: tickets.totalPages }, (_, index) => (
                        <li key={index} className="page-item block-page-item">
                          <button
                            onClick={() => {
                              if (tickets.pageNumber !== index + 1) {
                                fetchTickets({
                                  search: keySearch,
                                  pageNumber: index + 1,
                                  status: activeStatus
                                })
                              }
                            }}
                            className={`page-link btn-filter ${tickets.pageNumber == index + 1 ? 'block-page-item__block-page-link--active' : ''}`}>
                            {index + 1}
                          </button>
                        </li>
                      ))}
                    <li className="page-item block-page-item">
                      <button
                        onClick={() => {
                          if (tickets.pageNumber < tickets.totalPages) {
                            fetchTickets({
                              search: keySearch,
                              pageNumber: tickets.pageNumber + 1,
                              status: activeStatus
                            })
                          }
                        }}
                        className={`page-link btn-filter ${tickets.pageNumber === tickets.totalPages ? 'block-page-item__block-page-link--disabled' : ''}`}>
                        <span aria-hidden="true">&raquo;</span>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
