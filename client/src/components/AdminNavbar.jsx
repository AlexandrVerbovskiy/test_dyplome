import { MainContext } from "contexts";
import React, { useContext } from "react";

const AdminNavbar = ({ setHovered, setActive }) => {
  const { sessionUser, logout } = useContext(MainContext);

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
                      <h4 className="logo-text">Graduate</h4>
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
                      href="/chat"
                      className={`${
                        window.location.pathname.includes("/chat")
                          ? "active"
                          : ""
                      }`}
                    >
                      <div className="parent-icon">
                        <i className="bx bx-message-alt-detail"></i>
                      </div>
                      <div className="menu-title">Chat</div>
                    </a>
                  </li>

                  <li style={{ height: "43px" }}>
                    <a
                      href="/users"
                      className={`${
                        window.location.pathname.includes("/users")
                          ? "active"
                          : ""
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
                      href="/jobs"
                      className={`${
                        window.location.pathname.includes("/jobs")
                          ? "active"
                          : ""
                      }`}
                    >
                      <div className="parent-icon">
                        <i className="bx bx-briefcase"></i>
                      </div>
                      <div className="menu-title">Jobs</div>
                    </a>
                  </li>

                  <li style={{ height: "43px" }}>
                    <a
                      href="/disputes"
                      className={`${
                        window.location.pathname.includes("/disputes")
                          ? "active"
                          : ""
                      }`}
                    >
                      <div className="parent-icon">
                        <i className="lni lni-handshake"></i>
                      </div>
                      <div className="menu-title">Disputes</div>
                    </a>
                  </li>

                  <li style={{ height: "43px" }}>
                    <a
                      href="/transactions"
                      className={`${
                        window.location.pathname.includes("/transactions")
                          ? "active"
                          : ""
                      }`}
                    >
                      <div className="parent-icon">
                        <i className="bx bx-credit-card"></i>
                      </div>
                      <div className="menu-title">Transactions</div>
                    </a>
                  </li>

                  <li style={{ height: "43px" }}>
                    <a
                      href="/get-money-requests"
                      className={`${
                        window.location.pathname.includes("/get-money-requests")
                          ? "active"
                          : ""
                      }`}
                    >
                      <div className="parent-icon">
                        <i className="lni lni-money-protection"></i>
                      </div>
                      <div className="menu-title">Get Money Requests</div>
                    </a>
                  </li>

                  <li style={{ height: "43px" }}>
                    <a
                      href="/server-transactions"
                      className={`${
                        window.location.pathname.includes(
                          "/server-transactions"
                        )
                          ? "active"
                          : ""
                      }`}
                    >
                      <div className="parent-icon">
                        <i className="bx bxl-mastercard"></i>
                      </div>
                      <div className="menu-title">Server Transactions</div>
                    </a>
                  </li>

                  <li style={{ height: "43px" }}>
                    <a
                      href="/system"
                      className={`${
                        window.location.pathname == "/system" ? "active" : ""
                      }`}
                    >
                      <div className="parent-icon">
                        <i className="bx bx-server"></i>
                      </div>
                      <div className="menu-title">System Options</div>
                    </a>
                  </li>

                  <li style={{ height: "43px" }}>
                    <a
                      href="/profile-edit"
                      className={`${
                        window.location.pathname.includes("/profile-edit")
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
                      href="/"
                      onClick={(e) => {
                        e.preventDefault();
                        logout();
                      }}
                    >
                      <div className="parent-icon">
                        <i className="bx bx-log-out-circle"></i>
                      </div>

                      <div className="menu-title">Logout</div>
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
