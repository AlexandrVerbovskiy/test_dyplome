import { Plus } from "react-bootstrap-icons";

const CreateLink = ({ link }) => {
  return (
    <a
      className="btn btn-primary"
      href={link}
      style={{ display: "flex", alignItems: "flex-end" }}
    >
      Create <Plus size="20px" />
    </a>
  );
};

export default CreateLink;
