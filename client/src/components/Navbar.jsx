const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white rounded fixed-top rounded-0 shadow-sm">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent1"
          aria-controls="navbarSupportedContent1"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent1">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">
                <i className="bx bx-home-alt me-1" />Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="bx bx-user me-1" />About
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="bx bx-category-alt me-1" />Features
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="bx bx-microphone me-1" />Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
