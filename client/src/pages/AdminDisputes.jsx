import React, { useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { JobStatus, DefaultPageLayout } from "../components";
import { useAdminDisputes } from "../hooks";
import { CardWrapper, MainFilter } from "../job_components";
import { UploadTrigger } from "../components";
import { fullTimeFormat } from "../utils";
import { adminAssignDispute } from "../requests";
import { MainContext } from "../contexts";
import DefaultAdminPageLayout from "../components/DefaultAdminPageLayout";

const AdminDisputes = ({ status = "pending" }) => {
  const {
    disputes,
    getMoreDisputes,
    disputesFilter,
    disputesFilterChange,
    disputesReset,
  } = useAdminDisputes({ disputesStatus: status });

  const { request } = useContext(MainContext);
  const navigate = useNavigate();

  useEffect(() => {
    disputesReset();
  }, [status]);

  const handleAcceptDispute = async (id) => {
    try {
      await request({
        url: adminAssignDispute.url(),
        type: adminAssignDispute.type,
        data: adminAssignDispute.convertData(id),
        convertRes: adminAssignDispute.convertRes,
      });

      navigate(`/dispute/${id}`);
    } catch (e) {}
  };

  return (
    <DefaultAdminPageLayout pageClassName="default-edit-page">
      <CardWrapper>
        <MainFilter value={disputesFilter} onClick={disputesFilterChange} />
        <div className="submenu-under-filter">
          <div>
            <Link to="/disputes/pending">Need Acceptance</Link>
          </div>
          <div>
            <Link to="/disputes/in-progress">In progress</Link>
          </div>
          <div>
            <Link to="/disputes/resolved">Done</Link>
          </div>
        </div>
      </CardWrapper>
      <CardWrapper cardClass="jobs-card-section" bodyClass="job-list row">
        {Object.keys(disputes).map((disputeKey) => {
          const dispute = disputes[disputeKey];
          let cardAction = <></>;

          if (status != "resolved") {
            cardAction = (
              <>
                <hr />
                <div className="d-flex align-items-center">
                  <div className="dropdown ms-auto">
                    {status == "pending" && (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleAcceptDispute(dispute["id"])}
                      >
                        Take for solution
                      </button>
                    )}

                    {status == "in-progress" && (
                      <Link
                        className="btn btn-primary"
                        to={`/admin-dispute/${dispute["id"]}`}
                      >
                        View Dispute
                      </Link>
                    )}
                  </div>
                </div>
              </>
            );
          }

          return (
            <div className="card" key={disputeKey}>
              <div className="card-body">
                <h6 className="text-uppercase card-title">
                  <div className="card-label">{dispute["title"]}</div>
                  <div className="card-sublabel">
                    {fullTimeFormat(dispute["created_at"])}
                  </div>
                </h6>

                <hr />

                <div className="card-field">
                  <div className="card-field-label">Offer status:</div>
                  <div className="card-field-value">
                    <JobStatus
                      needWrapper={false}
                      actualStatus={dispute["job_status"]}
                    />
                  </div>
                </div>

                <div className="card-field">
                  <div className="card-field-label">Job price:</div>
                  <div className="card-field-value">{dispute["price"]}</div>
                </div>

                <div className="card-field">
                  <div className="card-field-label">Job Execution Time:</div>
                  <div className="card-field-value">
                    {dispute["execution_time"]}
                  </div>
                </div>

                <div>
                  <div className="card-field">
                    <div className="card-field-label">Address:</div>
                    {dispute["address"]}
                  </div>
                </div>

                <div className="card-field">
                  <div className="card-field-label">Dispute description:</div>
                  <div className="card-field-text">
                    {dispute["description"]}
                  </div>
                </div>

                {cardAction}
              </div>
            </div>
          );
        })}
        <UploadTrigger onTriggerShown={getMoreDisputes} />
      </CardWrapper>
    </DefaultAdminPageLayout>
  );
};

export default AdminDisputes;
