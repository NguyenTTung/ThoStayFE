import logo from "@/assets/ThoStay.svg";
import { GetBillById,SentBillToEmail } from "@/services/api/MotelApi";
import { BillByIdDTO } from "@/services/Dto/MotelDto";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
interface Props {
  onClose: () => void;
  onUpdate: () => void;
  billId: number | null;
}

export const InfoBill: React.FC<Props> = ({ onClose,onUpdate, billId }) => {
  const [bill, setBill] = useState<BillByIdDTO | null>(null);

  useEffect(() => {
    const billById = async () => {
      if (billId) {
        try {
          const response = await GetBillById(billId);
          setBill(response.data);
        } catch (err) {
          console.error(err, "Lỗi khi lấy API");
        }
      }
    };
    billById();
   
  }, [billId]);

  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [message, setMessage] = useState(""); // Message state for feedback
  console.log(message);
  const handleSendEmail = async () => {
    
    if (!billId) return;
    setIsLoading(true);
    setMessage("");

    try {
      const sentBill= await SentBillToEmail(billId);
    
      if(sentBill.data == true ){
        Swal.fire({
          icon: "success",
          title : "Thành công",
          text: "Đã gửi hóa đơn về email của khách hàng.",
        });
        onClose();
        onUpdate();
      }
      else{
        Swal.fire({
          icon: "error",
          title : "Lỗi",
          text: "Lỗi khi gửi hóa đơn, vui lòng thử lại.",
        }
        );
      }
      
    } catch (error) {
      Swal.fire({
        icon: "error",
        title : "Lỗi",
        text: "Lỗi khi gửi hóa đơn, vui lòng thử lại.",
      });
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="modal-overlay-admin">
        <div className="modal-content-admin position-relative">
          <div className="">
            <h2 className="h2-modal-admin">Hóa đơn</h2>
          </div>
          <form className="form-admin-modal position-relative">
            <div className="d-flex align-items-center justify-content-center mt-4">
              <div className="text-nowrap logo-img ms-0 ms-md-1 d-flex">
                <img src={logo} height="40" alt="" />
                <h1>Thỏ Stay</h1>
              </div>
            </div>
            <div className="form-group mt-3">
              <div className="text-info-bill">
                <p>
                  Phòng số: <span className="ms-1"> {bill?.room.roomNumber}</span>
                </p>
                <p>
                  Ngày tạo: <span className="ms-1">
                    {bill?.createdDate
                      ? new Date(bill.createdDate).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                      : "N/A"}
                  </span>
                </p>
                <p>
                  Người thuê: <span className="ms-1">{bill?.user?.fullName}</span>
                </p>
              </div>
              <div className="border-bottom-info-bill mt-3"></div>
              <div className="text-info-bill mt-2">
                <div className="text-info-bill mt-2">
                  {bill?.serviceBills?.map((service, index) => (
                    <p className="d-flex justify-content-between" key={index}>
                      {service.name}
                      <span className="ms-1">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(service.quantity * service.price_Service)}
                      </span>
                    </p>
                  ))}
                </div>
                <p className="d-flex justify-content-between">
                  Tiền thuê trọ:{" "}
                  <span className="ms-1">
                    {" "}
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(bill?.priceRoom || 0)}
                  </span>
                </p>
              </div>
              <div className="border-bottom-info-bill mt-3"></div>
              <div className="text-info-bill mt-2">
                <p className="d-flex justify-content-between">
                  Thành tiền: <span className="ms-1">                     {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(bill?.total || 0)}</span>{" "}
                </p>
              </div>
            </div>
            <div className="d-flex justify-content-between mt-4">
              <button
                type="button"
                className="btn-trove-all btn-style btn-transform-y2"
                onClick={onClose}
              >
                Trở về
              </button>
              {
                bill?.status == 1 ? (
                  <button
                type="button"
                className="btn-luu-all btn-style btn-transform-y2"
                onClick={handleSendEmail}
                disabled={isLoading}

              >
                 {isLoading ? "Đang xử lý..." : "Xác nhận đã thanh toán"}
              </button>
                ) : (
                  <button
                type="button"
                className="btn-luu-all btn-style btn-transform-y2"
                disabled={true}

              >
                Đã thanh toán
              </button>
                )
              }
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default InfoBill;
