
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Quay lại trang trước đó
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
      <h1 className="text-danger mb-4">Không có quyền truy cập</h1>
      <p className="mb-4">Bạn không có quyền truy cập vào trang này.</p>
      <button 
        className="btn btn-primary"
        onClick={goBack}
      >
        Quay lại
      </button>
    </div>
  );
};

export default Unauthorized;