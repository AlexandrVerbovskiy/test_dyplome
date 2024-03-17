const YesNoSpan = ({ active, onClick = null }) => {
  const text = active ? "YES" : "NO";
  let dopClass = active
    ? "btn btn-success text-white"
    : "btn btn-danger text-white";

  return (
    <div
      onClick={() => (onClick ? onClick() : null)}
      className={`${
        onClick ? "cursor-pointer " : ""
      }yes-no-span d-inline-flex fw-bolder ${dopClass} rounded-pill text-center px-2 py-1`}
    >
      <span className="overflow-separate">{text}</span>
    </div>
  );
};

export default YesNoSpan;
