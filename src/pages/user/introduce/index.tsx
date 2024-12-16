import './styles/introduce.scss'

export const Introduce: React.FC = () => {
  return (
      <div className="introduce-page">
        <div className="container">
          <div className="articles-section">
            <h1>Articles</h1>
            <p>View the latest news on Blogger</p>
            <div className="articles">
              <div className="article-item">
                <img
                  src="https://th.bing.com/th/id/OIP.FGE2PQ5tRX2FyNNsauOKMwHaE7?rs=1&pid=ImgDetMain"
                  alt="Article Image"
                />
                <div className="article-content">
                  <span className="tag">Travel</span>
                  <h2>Five Things You Need to Know to Start Your Day</h2>
                  <p>
                    By Mary Astor <span>October 19, 2020 - 2 min</span>
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                    diam nonumy.
                  </p>
                  <a href="#">Read More</a>
                </div>
              </div>
              <div className="article-item">
                <img
                  src="https://th.bing.com/th/id/OIP.FGE2PQ5tRX2FyNNsauOKMwHaE7?rs=1&pid=ImgDetMain"
                  alt="Article Image"
                />
                <div className="article-content">
                  <span className="tag">Travel</span>
                  <h2>Five Things You Need to Know to Start Your Day</h2>
                  <p>
                    By Mary Astor <span>October 19, 2020 - 2 min</span>
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                    diam nonumy.
                  </p>
                  <a href="#">Read More</a>
                </div>
              </div>
            </div>
          </div>
          <div className="trending-section">
            <h2>Trending Post</h2>
            <div className="trending-items">
              <div className="trending-item">
                <img
                  src="https://th.bing.com/th/id/OIP.FGE2PQ5tRX2FyNNsauOKMwHaE7?rs=1&pid=ImgDetMain"
                  alt="Trending Image"
                />
                <div className="trending-content">
                  <h3>Five Things You Need to Know to Start Your Day</h3>
                  <p>October 19, 2020 - 2 min</p>
                </div>
              </div>
              <div className="trending-item">
                <img
                  src="https://th.bing.com/th/id/OIP.FGE2PQ5tRX2FyNNsauOKMwHaE7?rs=1&pid=ImgDetMain"
                  alt="Trending Image"
                />
                <div className="trending-content">
                  <h3>Five Things You Need to Know to Start Your Day</h3>
                  <p>October 19, 2020 - 2 min</p>
                </div>
              </div>
              <div className="trending-item">
                <img
                  src="https://th.bing.com/th/id/OIP.FGE2PQ5tRX2FyNNsauOKMwHaE7?rs=1&pid=ImgDetMain"
                  alt="Trending Image"
                />
                <div className="trending-content">
                  <h3>Five Things You Need to Know to Start Your Day</h3>
                  <p>October 19, 2020 - 2 min</p>
                </div>
              </div>
              <div className="trending-item">
                <img
                  src="https://th.bing.com/th/id/OIP.FGE2PQ5tRX2FyNNsauOKMwHaE7?rs=1&pid=ImgDetMain"
                  alt="Trending Image"
                />
                <div className="trending-content">
                  <h3>Five Things You Need to Know to Start Your Day</h3>
                  <p>October 19, 2020 - 2 min</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Introduce;
