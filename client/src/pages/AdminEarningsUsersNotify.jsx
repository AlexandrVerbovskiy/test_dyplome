import { Layout, UserByPriceNotifyItem, UserNotifyCampaign } from "components";
import { MainContext } from "contexts";
import { useContext, useEffect, useState } from "react";
import { getTopJobsCompleted } from "requests";

const AdminEarningsUsersNotify = () => {
  const [topEarners, setTopEarnings] = useState([]);
  const { request } = useContext(MainContext);

  useEffect(() => {
    (async () => {
      const newEarnings = await request({
        url: getTopJobsCompleted.url(),
        type: getTopJobsCompleted.type,
        convertRes: getTopJobsCompleted.convertRes,
      });
      setTopEarnings(newEarnings);
    })();
  }, []);

  return (
    <Layout pageClassName="default-table-page">
      <UserNotifyCampaign
        title="CAMPAIGN FOR TOP COMPLETING JOBS"
        description="This campaign is for users with the highest job-completing level in the last 30 days."
        data={topEarners}
        ItemComponent={UserByPriceNotifyItem}
      />
    </Layout>
  );
};

export default AdminEarningsUsersNotify;
