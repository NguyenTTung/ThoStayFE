import "./styles/contact.scss";

export const Contact: React.FC = () => {
    return (
        <div className="contact mt-3">
            <div className="contact-container">
                <div className="contact-info rounded-3">
                    <h2>Thỏ Stay</h2>
                    <p>
                        Trang web bạn đang tìm là Thỏ Stay. Đây là một nền tảng cung cấp dịch vụ thuê trọ, giúp người dùng dễ dàng tìm kiếm và thuê phòng trọ phù hợp với nhu cầu của mình. Thỏ Stay cung cấp nhiều lựa chọn phòng trọ với các mức giá khác nhau, từ phòng trọ giá rẻ cho sinh viên đến các căn hộ dịch vụ cao cấp.
                    </p>
                    <div className="info">
                        <p>
                            <i className="fas fa-phone-alt"></i> +911234567890
                        </p>
                        <p>
                            <i className="fas fa-envelope"></i> thostay@gmail.com
                        </p>
                        <p>Tân An, Thành phố Buôn Ma Thuột, Tỉnh DakLak</p>
                    </div>
                    <div className="social-icons">
                        <a href="#">
                            <i className="fab fa-linkedin"></i>
                        </a>
                        <a href="#">
                            <i className="fab fa-facebook"></i>
                        </a>
                        <a href="#">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="#">
                            <i className="fab fa-instagram"></i>
                        </a>
                    </div>
                    <div className="circle">
                        <img src="src/assets/images/IMG-circle.png" alt="" />
                    </div>
                </div>
                <div className="contact-form">
                    <form>
                        <div className="form-group">
                            <label htmlFor="first-name">Họ</label>
                            <input
                                id="first-name"
                                name="first-name"
                                type="text"
                                className="input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="last-name">Tên</label>
                            <input
                                id="last-name"
                                name="last-name"
                                type="text"
                                className="input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input id="email" name="email" type="email" className="input" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Số điện thoại</label>
                            <input id="phone" name="phone" type="text" className="input" />
                        </div>
                        <div className="form-group full-width">
                            <label htmlFor="message">Lời nhắn</label>
                            <textarea
                                id="message"
                                name="message"
                                className="input"
                            ></textarea>
                        </div>
                        <div className="form-group button">
                            <button type="submit" className="btn-submit">
                                Gửi
                            </button>
                        </div>
                    </form>

                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3895.537547917255!2d108.0462563153547!3d12.686212924599097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31721d9a153e7291%3A0x64c25e74e89ae611!2zQsawxqFuIE1hIFRodcOqdCwgxJDhu5FuIEtow6JtLCBExINuZyBOYWkgLEjhu5MgQsOg!5e0!3m2!1sen!2s!4v1690734470000!5m2!1sen!2s"
                        width="900"
                        height="300"
                        loading="lazy"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default Contact;
