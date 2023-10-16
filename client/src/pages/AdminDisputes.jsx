import React from "react";
import { Navbar } from "../components";
import { useAdminDisputes } from "../hooks";

const AdminDisputes = () => {
  const {
    disputes,
    getMoreDisputes,
    disputesIds,
    disputesFilter,
    disputesFilterChange,
  } = useAdminDisputes();

  return (
    <div className="page-wrapper job-edit-page">
      <Navbar />
      <div className="page-content">
        {Object.keys(disputes).map((disputeKey) => {
          const dispute = disputes[disputeKey];
          return (
            <div className="card" key={disputeKey}>
              <div className="card-body">
                <h6 className="text-uppercase">{dispute["title"]}</h6>
                <hr />
                <div>
                  <p>Dispute description: {dispute["description"]}</p>
                  <p>Address: {dispute["address"]}</p>
                  <p>Admin id: {dispute["admin_id"]}</p>
                  <p>Author id: {dispute["author_id"]}</p>
                  <p>Dispute created at: {dispute["created_at"]}</p>

                  <p>Dispute status: {dispute["status"]}</p>
                  <p>Offer status: {dispute["job_status"]}</p>
                </div>

                <hr />

                <div className="d-flex align-items-center">
                  <div className="dropdown ms-auto">
                    <button className="btn btn-primary" onClick={() => {}}>
                      Take for solution
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDisputes;
