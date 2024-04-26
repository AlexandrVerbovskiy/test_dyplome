import React from "react";
import { Layout } from "components";

const NoChats = () => {
  return (
    <Layout pageClassName="default-view-page">
      <div className="no-chats-page d-flex align-items-center justify-content-center">
        <div className="card p-5">
          <div className="card-body p-4">
            <h2 className="font-weight-bold display-4">
              No chats with other users
            </h2>
            <p>
              It looks like you have no chats with other users.
              <br />
              This means that you have not yet had any proposition discussions.
              <br />
              Neither as a performer nor as a seller.
              <br />
              For chats to appear on this page, start an proposition discussion.
            </p>
            <div className="mt-5">
              <a href="#" className="btn btn-primary btn-lg px-md-5 radius-30">
                Go Home
              </a>
              <a
                href="#"
                className="btn btn-outline-dark btn-lg ms-3 px-md-5 radius-30"
              >
                Go to propositions
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NoChats;
