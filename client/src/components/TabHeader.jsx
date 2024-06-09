const TabHeader = ({ id, title, selected = false }) => (
  <li className="nav-item" role="presentation">
    <a
      className={`nav-link ${selected ? "active" : ""}`}
      data-bs-toggle="tab"
      href={"#" + id}
      role="tab"
      aria-selected={selected ? "true" : null}
    >
      <div className="d-flex align-items-center">
        <div className="tab-title">{title}</div>
      </div>
    </a>
  </li>
);

export default TabHeader;