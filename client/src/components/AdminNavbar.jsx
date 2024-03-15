import React from "react";

const AdminNavbar = ({ setHovered, setActive }) => {
  return (
    <div className={`sidebar-wrapper`} data-simplebar="init">
      <div
        className="simplebar-wrapper"
        style={{ margin: "0px" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="simplebar-mask">
          <div
            className="simplebar-offset"
            style={{ right: "0px", bottom: "0px" }}
          >
            <div
              className="simplebar-content-wrapper"
              style={{ height: "100%", overflow: "hidden" }}
            >
              <div className="simplebar-content" style={{ padding: "0px" }}>
                <div className="sidebar-header">
                  <a href="/" style={{ display: "flex" }}>
                    <div>
                      <img
                        src="/assets/images/logo-icon.png"
                        className="logo-icon"
                        alt="logo icon"
                      />
                    </div>
                    <div>
                      <h4 className="logo-text">Rocker</h4>
                    </div>
                  </a>
                  <div
                    className="toggle-icon ms-auto"
                    onClick={() => setActive(false)}
                  >
                    <i className="bx bx-arrow-to-left"></i>
                  </div>
                </div>
                <ul className="metismenu" id="menu">
                  <li style={{ height: "43px" }}>
                    <a
                      href="/"
                      className={`${
                        window.location.pathname == "/" ? "active" : ""
                      }`}
                    >
                      <div className="parent-icon">
                        <i className="bx bx-home-alt"></i>
                      </div>
                      <div className="menu-title">Home</div>
                    </a>
                  </li>

                  <li style={{ height: "43px" }}>
                    <a
                      href="/profile-edit"
                      className={`${
                        window.location.pathname == "/profile-edit"
                          ? "active"
                          : ""
                      }`}
                    >
                      <div className="parent-icon">
                        <i className="bx bx-edit"></i>
                      </div>
                      <div className="menu-title">Profile edit</div>
                    </a>
                  </li>

                  <li style={{ height: "43px" }}>
                    <a
                      href="/users"
                      className={`${
                        window.location.pathname == "/users" ? "active" : ""
                      }`}
                    >
                      <div className="parent-icon">
                        <i className="lni lni-users"></i>
                      </div>
                      <div className="menu-title">Users</div>
                    </a>
                  </li>

                  <li style={{ height: "43px" }}>
                    <a
                      href="/disputes"
                      className={`${
                        window.location.pathname == "/disputes" ? "active" : ""
                      }`}
                    >
                      <div className="parent-icon">
                        <i className="bx bxs-book-open"></i>
                      </div>
                      <div className="menu-title">Disputes</div>
                    </a>
                  </li>

                  <li style={{ height: "43px" }}>
                    <a
                      href="/"
                      onClick={(e) => {
                        e.preventDefault();
                        e.target.closest("form").submit();
                      }}
                    >
                      <div className="parent-icon">
                        <i className="lni lni-exit"></i>
                      </div>
                      <form method="POST" action="/">
                        <div className="menu-title">Logout</div>
                      </form>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
