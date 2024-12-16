import Footer from "@/components/footer"
import Header from "@/components/header"

const Index = () => {
    return (
        <>
        <Header/>
            <div className="container mt-3">
                <div className="row">
                    <div className="col-12 col-lg-7"><img src="../src/assets/images/backgrounds/404-Error-pana.png" className="img-fluid" /></div>
                    <div className="col-12 col-lg-5 d-flex align-items-center justify-content-center">
                        <div className="text-center ">
                            <h1 className="text-danger ">Đã có lỗi xảy ra.</h1>
                            <h2 className="text-danger ">Vui lòng thử lại sau.</h2>
                            <a className=" btn font-weight-bold mt-2" href="/">Về trang chủ</a>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    )
}

export default Index