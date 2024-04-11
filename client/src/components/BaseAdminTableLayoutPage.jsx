import React from "react";
import { Layout } from "../components";
import BaseAdminTable from "./BaseAdminTable";

const BaseAdminTableLayoutPage = (props) => {
  return (
    <Layout pageClassName="default-table-page">
      <div className="page-content">
        <BaseAdminTable {...props} />
      </div>
    </Layout>
  );
};

export default BaseAdminTableLayoutPage;
