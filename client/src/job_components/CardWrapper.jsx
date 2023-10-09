const CardWrapper = ({ children, contentClass="", cardClass="", bodyClass="" }) => {
  return (
    <div className={`page-content ${contentClass}`}>
      <div className={`card ${cardClass}`}>
        <div className={`card-body ${bodyClass}`}>{children}</div>
      </div>
    </div>
  );
};

export default CardWrapper;
