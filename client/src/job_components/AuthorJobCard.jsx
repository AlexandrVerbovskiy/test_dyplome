import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { MainContext } from "../contexts";
import { jobChangeActive } from "../requests";

const AuthorJobCard = ({
  description,
  timeCreated,
  address,
  title,
  price,
  id,
  active: baseActive,
}) => {
  const [active, setActive] = useState(baseActive);
  const maxCharLimit = 250;
  const isLongText = description.length > maxCharLimit;
  const { request, setSuccess, setError } = useContext(MainContext);

  const handleChangeActive = async () => {
    try {
      const { active: newActive } = await request({
        url: jobChangeActive.url(),
        type: jobChangeActive.type,
        data: jobChangeActive.convertData(id),
        convertRes: jobChangeActive.convertRes,
      });
      setActive(newActive);
      setSuccess(
        newActive ? "Job activated successfully" : "Job dectivated successfully"
      );
    } catch (e) {
      setError(e.message);
    }
  };

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
        <div className="product-actions d-flex flex-column flex-md-row">
          <Link to={`/job-view/${id}`} className="btn btn-primary">
            View job
          </Link>

          <Link to={`/job-edit/${id}`} className="btn btn-success">
            Edit job
          </Link>
        </div>

        <div className="product-actions d-flex flex-column flex-md-row mt-2">
          <button
            type="button"
            className={`w-md-50 btn btn-${active ? "danger" : "success"}`}
            onClick={handleChangeActive}
          >
            {active ? "Deactivate" : "Activate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthorJobCard;
