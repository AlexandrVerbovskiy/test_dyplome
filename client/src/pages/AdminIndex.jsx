import React from "react";
import { Layout } from "components";
import {
  NewUserLineChart,
  VisitedUserLineChart,
  PaymentBarChart,
  JobDisputeLineChart,
  JobProposalLineChart,
} from "charts";

const AdminIndex = () => {
  return (
    <Layout>
      <div className="page-content">
        <PaymentBarChart />
        <VisitedUserLineChart />
        <NewUserLineChart />
        <JobDisputeLineChart />
        <JobProposalLineChart />
      </div>
    </Layout>
  );
};

export default AdminIndex;
