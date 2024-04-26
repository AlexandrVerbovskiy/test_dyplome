import DefaultPageLayout from "./DefaultPageLayout";
import DefaultAdminPageLayout from "./DefaultAdminPageLayout";
import { MainContext } from "contexts";
import { useContext } from "react";

const Layout = ({ children, pageClassName }) => {
  const { sessionUser } = useContext(MainContext);

  if (sessionUser.admin) {
    return (
      <DefaultAdminPageLayout pageClassName={pageClassName}>
        {children}
      </DefaultAdminPageLayout>
    );
  }

  return (
    <DefaultPageLayout pageClassName={pageClassName}>
      {children}
    </DefaultPageLayout>
  );
};

export default Layout;
