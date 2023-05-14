const ChatMessageActions = ({ onDeleteClick, onEditClick }) => {
  return (
    <div className="card message-action">
      <div onClick={onEditClick} className="card-body">
        Edit
      </div>
      <div onClick={onDeleteClick} className="card-body">
        Delete
      </div>
    </div>
  );
};

export default ChatMessageActions;
