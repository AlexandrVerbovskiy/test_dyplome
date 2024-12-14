import { Layout } from "components";

const AdminDashboard = () => {
  return (
    <Layout pageClassName="default-table-page">
      <div className="page-content">
        <iframe
          title="cursova1(2)"
          width="1140"
          height="541.25"
          src="https://app.powerbi.com/reportEmbed?reportId=6ecf639f-4eff-438a-9cba-e846d5d330a3&autoAuth=true&ctid=d84995f6-c5b5-422d-b123-c1243b2f5125"
          frameborder="0"
          allowFullScreen="true"
        ></iframe>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
