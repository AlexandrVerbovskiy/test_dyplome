import { MainContext } from "contexts";
import { useContext } from "react";
import { Plus } from "react-bootstrap-icons";

const CreateLink = ({ link, access = null, accessDeniedMessage = null }) => {
  const { setError, sessionUser } = useContext(MainContext);

  const handleClick = (e) => {
    if (access && !access() && !sessionUser.admin) {
      e.preventDefault();
      setError(accessDeniedMessage);
    }
  };

  return (
    <a
      className="btn btn-primary"
      href={link}
      style={{ display: "flex", alignItems: "flex-end", lineHeight: "23px" }}
      onClick={handleClick}
    >
      Create <Plus size="20px" />
    </a>
  );
};

export default CreateLink;
