import Swal from 'sweetalert2';

import { FormCreate } from '@/services/Dto/ticketDto';
import '../styles/create_ticket.scss';

import { CreateTicket } from '@/services/api/ticketApi';
import TicketForm from '@/components/form/ticketForm';

const createTicket = () => {
    const handleSubmit = async (data: FormCreate, reset: Function) => {
        try {
            const res = await CreateTicket(data);
            if (res.data.code === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Thêm tichket thành công',
                });
                reset();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: 'Thêm tichket thất bại',
                });
            }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: 'Có lỗi xảy ra trong quá trình tạo tiket',
            });
            console.error('Lỗi API:', error);
        }
    };

    return (
        <div className="container-fluid create-ticket">
            <div className="row align-items-stretch">
                <div className="card w-100">
                    <div className="card-body p-4">
                        <div className="header-name-all title-main mb-3">Trợ giúp</div>
                        <TicketForm onSubmit={handleSubmit} className='col-6 block-content mx-auto' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default createTicket
