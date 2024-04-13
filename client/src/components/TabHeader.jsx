const TabHeader = ({ id, title, selected = false }) => (
  <li class="nav-item" role="presentation">
    <a
      class={`nav-link ${selected ? "active" : ""}`}
      data-bs-toggle="tab"
      href={"#" + id}
      role="tab"
      aria-selected={selected ? "true" : null}
    >
      <div class="d-flex align-items-center">
        <div class="tab-title">{title}</div>
      </div>
    </a>
  </li>
);

export default TabHeader;