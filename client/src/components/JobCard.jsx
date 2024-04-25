import React from "react";
import { Link } from "react-router-dom";

const JobCard = ({
  description,
  timeCreated,
  address,
  title,
  authorNick,
  authorEmail,
  price,
  id,
  authorId,
  activateProposalForm,
}) => {
  const maxCharLimit = 250;
  const isLongText = description.length > maxCharLimit;

  return (
    <div className="job-card d-flex flex-column justify-content-between">
      <div className="job-title">
        {title}
      </div>

      <div>
        <div className="job-body">
          <div className="job-main-info">
            <div className="job-author">
              <b>Author: </b>
              <a href={`/users/${authorId}`}>{authorNick ?? authorEmail}</a>
            </div>
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
              <span>
                {description.slice(0, maxCharLimit)}
                {isLongText && <>...</>}
              </span>
              {isLongText && (
                <button className="show-more-job-description">Show More</button>
              )}
            </p>
            {/*<div className="job-created-time">{timeCreated}</div>*/}
          </div>
        </div>
        <div className="job-actions">
          <div className="product-actions d-flex flex-column flex-sm-row">
            <Link to={`/job-view/${id}`} className="btn btn-primary">
              View job
            </Link>

            <button className="btn btn-success" onClick={activateProposalForm}>
              Send proposal
            </button>
          </div>
          <a
            href={`/chat/personal/${authorId}`}
            className="btn btn-link write-to-author"
          >
            Write to author
          </a>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
