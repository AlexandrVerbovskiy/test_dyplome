import { Layout, UserNotifyCampaign, UserNotifyItem } from "components";
import { MainContext } from "contexts";
import { useContext, useEffect, useState } from "react";
import { getInactiveUsers } from "requests";

const AdminInactiveUsersNotify = () => {
  const [users, setUsers] = useState([]);
  const { request } = useContext(MainContext);

  useEffect(() => {
    (async () => {
      const newUsers = await request({
        url: getInactiveUsers.url(),
        type: getInactiveUsers.type,
        convertRes: getInactiveUsers.convertRes,
      });
      setUsers(newUsers);
    })();
  }, []);

  return (
    <Layout pageClassName="default-table-page">
      <UserNotifyCampaign
        title="CAMPAIGN FOR INACTIVE USERS"
        description="This campaign is for users who have been inactive for more than 30 days."
        data={users}
        ItemComponent={UserNotifyItem}
      />
    </Layout>
  );
};

export default AdminInactiveUsersNotify;
