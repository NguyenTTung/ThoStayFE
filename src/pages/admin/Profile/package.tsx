import { useState, useEffect, useRef } from 'react';
import { getAllPackage, registerPackage, checkPackage } from "@/services/api/package";
import { postVnpayApi, VnPay } from "@/services/api/HomeApi";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";


const Package = () => {
  interface PackageType {
    id: number;
    name: string;
    description: string;
    price: number;
    createDate: string;
    limitMotel: number;
    limitRoom: number;
    status: boolean;
  }

  const navigate = useNavigate();
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("token");
  const selectedPackageId = Number(sessionStorage.getItem("selectedPackageId"));
  const isPaymentStatusHandled = useRef(false);
  //tạo fucntion gọi vnpay
  const handleVnPay = async (id: number, price: number) => {
    const vnpayPayload: VnPay = {
      orderId: id.toString(),
      amount: price,
      returnUrl: window.location.href,
    };
    const response = await postVnpayApi(vnpayPayload);
    if (response?.status === 200 && response?.data) {
      window.location.href = response.data;

    } else {
      Swal.fire(
        "Lỗi",
        "Không thể khởi tạo giao dịch thanh toán. Vui lòng thử lại.",
        "error"
      );
    }
  }
  const registerPackageFunction = async () => {
    const registerResponse = await registerPackage({
      token,
      IdPackage: selectedPackageId,
    });
    sessionStorage.removeItem("selectedPackageId");
    if (registerResponse.status === 200) {
      Swal.fire(
        "Thành công",
        "Thanh toán và đăng ký gói thành công!",
        "success"
      ).then(() => navigate("/admin/package"));
      //reload
      window.location.reload();


    } else {
      Swal.fire(
        "Cảnh báo",
        "Thanh toán thành công nhưng đăng ký gói thất bại. Vui lòng liên hệ hỗ trợ.",
        "warning"
      );
    }
  }
  const handlePaymentStatus = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const responseCode = urlParams.get("vnp_ResponseCode");
    const transactionStatus = urlParams.get("vnp_TransactionStatus");
    if (responseCode === "00" && transactionStatus === "00") {
      try {
        registerPackageFunction();
        console.log("Thanh toán thành công");
      } catch (err) {
        Swal.fire(
          "Lỗi",
          "Thanh toán thành công nhưng xảy ra lỗi khi đăng ký gói. Vui lòng thử lại.",
          "error"
        ).then(() => navigate("/admin/package"));
      }
    } else if (responseCode) {
      Swal.fire(
        "Thất bại",
        "Thanh toán không thành công. Vui lòng thử lại.",
        "error"
      ).then(() => navigate("/admin/package"));
    }
  };

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await getAllPackage({ token });
        setPackages(response.data.data);
        setLoading(false);
        if (!isPaymentStatusHandled.current) {
          handlePaymentStatus();
          isPaymentStatusHandled.current = true;
        }
      } catch (err) {
        setError("Không thể tải dữ liệu gói cước. Vui lòng thử lại sau.");
        setLoading(false);
      }

    };
    fetchPackages();

  }, [isPaymentStatusHandled]); // Only call when navigate, token or selectedPackageId changes

  const handleBuyPackage = async (id: number, price: number) => {
    try {
      sessionStorage.setItem("selectedPackageId", id.toString());
      const check = await checkPackage({ token });
      if (check?.data?.data) {
        Swal.fire({
          title: "Bạn đã mua gói cước rồi",
          text: "Bạn có muốn chọn gói cước khác không?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Có",
          cancelButtonText: "Không",
        }).then(async (result) => {
          if (result.isConfirmed) {
            handleVnPay(id, price);
          } else {
            navigate("/admin/package");
          }
        });
        return;
      } else {
        handleVnPay(id, price);
      }
    } catch (err) {
      console.error("Payment Error:", err);
      Swal.fire(
        "Lỗi",
        "Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.",
        "error"
      );
    }
  };
  if (loading) {

    return <p>Đang tải dữ liệu...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container-fluid package-owner">
      <div className="row align-items-stretch">
        <div className="w-100 p-4">
          <div className="package-header">
            <h2 className="h2-package-user-owner">Tài khoản Vip</h2>
            <p className="p-package-user-owner">
              Tài khoản Vip dành riêng cho các chủ trọ muốn tối ưu hóa hiệu quả
              quản lý bất động sản. Với tài khoản Vip, bạn sẽ được tăng giới hạn
              số lượng phòng trọ và dãy trọ tối đa, giúp bạn mở rộng quy mô kinh
              doanh một cách linh hoạt và tiện lợi hơn. Nâng cấp ngay để trải
              nghiệm các lợi ích vượt trội!
            </p>
          </div>
          <div className="package-body">
            <div className="d-flex flex-wrap gap-3">
              {packages.map((packagemap) => (
                <div key={packagemap.id} className="package-body-item shadow-sm">
                  <div className="package-body-header">
                    <div className="package-body-name">
                      <i className="fa-light fa-crown fa-lg me-2"></i>
                      <h3 className="package-body-name-h3">{packagemap.name}</h3>
                    </div>
                    <div className="package-body-room">
                      <i className="fa-regular fa-building fa-sm"></i>
                      <p>Tối đa {packagemap.limitRoom} phòng</p>
                    </div>
                    <div className="package-body-room">
                      <i className="fa-light fa-synagogue fa-sm"></i>
                      <p>Tối đa {packagemap.limitMotel} dãy</p>
                    </div>
                    <div className="package-body-price">
                      <h3>{Number(packagemap.price).toLocaleString("vi-VN")} đ</h3>
                    </div>
                    <div className="package-body-time">30 ngày</div>
                    <div>
                      <button
                        className="btn btn-create-notification btn-transform-y2 mt-3"
                        onClick={() =>
                          handleBuyPackage(packagemap.id, packagemap.price)
                        }
                      >
                        Mua ngay
                      </button>
                    </div>
                  </div>
                  <div className="package-gach"></div>
                  <div className="package-body-footer">
                    <div className="package-body-description">
                      <p>{packagemap.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Package;