import Swal from 'sweetalert2';
import { CreateTicket } from '@/services/api/ticketApi';
import { FormCreate } from '@/services/Dto/ticketDto';
import TicketForm from '@/components/form/ticketForm';

const createTicket = () => {
    const handleSubmit = async (data: FormCreate, reset: Function) => {
        try {
            const res = await CreateTicket(data);
            if (res.data.code === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Thành công',
                });
                reset();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi!',
                    text: 'Thất bại',
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
        <div className="container create-ticket py-3">
            <TicketForm onSubmit={handleSubmit} className='col-7 block-content mx-auto' />
        </div>
    );
};

export default createTicket
