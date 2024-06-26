import React from "react";
import { Link } from "react-router-dom";
import JobProposalViewStatus from "./JobProposalViewStatus";
import { fullTimeFormat, timeNormalConverter } from "utils";

const ProposalCard = ({
  description,
  timeCreated,
  address,
  title,
  author,
  price,
  status,
  id,
  userId,
  userType = "Author",
  writeBtnText = "Write to author",
  executionTime,
}) => {
  const maxCharLimit = 250;
  const isLongText = description.length > maxCharLimit;

  return (
    <div className="job-card d-flex flex-column justify-content-between">
      <div className="job-title">{title}</div>
      <div>
        <div className="job-body">
          <div className="job-main-info">
            <div className="job-author">
              <b>{userType}: </b>
              {author}
            </div>
            <div className="job-address">
              <b>Address: </b>
              {address}
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <b>Status: </b>
              <JobProposalViewStatus status={status} />
            </div>
            <div className="job-price">
              <b>Price per hour:</b> ${price.toFixed(2)}
            </div>
            <div className="job-price">
              <b>Need time:</b> {executionTime}
            </div>
            <div className="job-price">
              <b>Total price:</b> ${(price * executionTime).toFixed(2)}
            </div>
            <div className="job-created-time">
              <b>Offer started at:</b> {fullTimeFormat(timeCreated)}
            </div>
          </div>
          <div className="job-dop-info">
            <div className="job-description">
              {description.slice(0, maxCharLimit)}
              {isLongText && (
                <>
                  ...
                  <a href={`/job-proposal/${id}`} className="show-more-job-description">
                    Show More
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="job-actions">
          <div className="product-actions d-flex flex-column flex-sm-row">
            <Link
              to={`/job-proposal/${id}`}
              className="btn btn-primary w-md-50"
            >
              View proposal
            </Link>

            <a
              href={"/chat/personal/" + userId}
              className="btn btn-success w-md-50"
            >
              {writeBtnText}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalCard;
