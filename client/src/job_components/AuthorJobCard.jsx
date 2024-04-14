import React from "react";
import { Link } from "react-router-dom";

const AuthorJobCard = ({
  description,
  timeCreated,
  address,
  title,
  price,
  id,
}) => {
  const maxCharLimit = 250;
  const isLongText = description.length > maxCharLimit;

  return (
    <div className="job-card">
      <div className="job-title">
        {title} {id}
      </div>
      <div className="job-body">
        <div className="job-main-info">
          <div className="job-address">
            <b>Address: </b>
            {address}
          </div>

          <div className="job-price">
            <b>Price: ${price}</b>
          </div>
        </div>
        <div className="job-dop-info">
          <p className="job-description" style={{ marginBottom: "0" }}>
            <b>Description: </b>
            <span>
              {description.slice(0, maxCharLimit)}
              {isLongText && <>...</>}
            </span>
            {isLongText && (
              <button className="show-more-job-description">Show More</button>
            )}
          </p>
          <div className="job-created-time">{timeCreated}</div>
        </div>
      </div>
      <div className="job-actions">
        <div className="product-actions d-flex flex-column flex-sm-row">
          <Link to={`/job-edit/${id}`} className="btn btn-primary">
            Edit job
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthorJobCard;
