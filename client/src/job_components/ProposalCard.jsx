import { Link } from "react-router-dom";

const ProposalCard = ({
  description,
  timeCreated,
  address,
  title,
  author,
  price,
  id,
  userId,
  userType = "Author",
  writeBtnText = "Write to author",
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
          <div className="job-author">
            <b>{userType}: </b>
            {author}
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
          <div className="job-description">
            {description.slice(0, maxCharLimit)}
            {isLongText && (
              <>
                ...
                <button className="show-more-job-description">Show More</button>
              </>
            )}
          </div>
          <div className="job-created-time">{timeCreated}</div>
        </div>
      </div>
      <div className="job-actions">
        <div className="product-actions d-flex flex-column flex-sm-row">
          <Link to={`/job-proposal/${id}`} className="btn btn-primary">
            View proposal
          </Link>
        </div>
        <a
          href={"/chat/personal/" + userId}
          className="btn btn-link write-to-author"
        >{writeBtnText}</a>
      </div>
    </div>
  );
};

export default ProposalCard;
