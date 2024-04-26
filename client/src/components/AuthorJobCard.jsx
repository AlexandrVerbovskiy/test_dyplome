import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { MainContext } from "contexts";
import { jobChangeActive } from "requests";
import { timeNormalConverter } from "utils";

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
    <div className="job-card d-flex flex-column justify-content-between">
      <div className="job-title">
        {title}
      </div>
      <div>
        <div className="job-body">
          <div className="job-main-info">
            <div className="job-address">
              <b>Address: </b>
              {address}
            </div>

            <div className="job-price">
              <b>Price: ${price}</b>
            </div>

            <div className="job-created-time">
              <b>Created at:</b> {timeNormalConverter(timeCreated)}
            </div>
          </div>
          <div className="job-dop-info">
            <p className="job-description" style={{ marginBottom: "0" }}>
              {description.slice(0, maxCharLimit)}
              {isLongText && (
                <>
                  ...
                  <button className="show-more-job-description">
                    Show More
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
        <div className="job-actions">
          <div className="product-actions d-flex flex-column flex-md-row">
            <Link to={`/job-view/${id}`} className="btn btn-primary w-md-50">
              View job
            </Link>

            <Link to={`/job-edit/${id}`} className="btn btn-success w-md-50">
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
    </div>
  );
};

export default AuthorJobCard;
