const JobCard = ({
  description,
  timeCreated,
  address,
  title,
  author,
  price,
  id,
  author_id,
  activateProposalForm
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
            <b>Author: </b>{author}
          </div>
          <div className="job-address">
            <b>Address: </b>{address}
          </div>
          <div className="job-price">
            <b>Price: ${price}</b>
          </div>
        </div>
        <div className="job-dop-info">
          <div className="job-description">
            {description.slice(0, maxCharLimit)}
            {isLongText &&
              <>...<button className="show-more-job-description">Show More</button></>}
          </div>
          <div className="job-created-time">
            {timeCreated}
          </div>
        </div>
      </div>
      <div className="job-actions">
        <div>
          <button>
            View product
          </button>

          <button onClick={activateProposalForm}>
            Send proposal
          </button>
        </div>
        <a href={"/chat/personal/"+author_id} className="btn btn-link write-to-author">
            Write to author
          </a>
      </div>
    </div>
  );
};

export default JobCard;
