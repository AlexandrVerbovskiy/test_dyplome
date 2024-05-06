const EmptyList = ({ text }) => {
  return (
    <div
      className="card mb-0"
      style={{
        minHeight: "200px",
        height: "calc(100vh - 180px - 4.9rem)",
        width: "100%",
      }}
    >
      <div
        className="card-body"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {text}
      </div>
    </div>
  );
};

export default EmptyList;
