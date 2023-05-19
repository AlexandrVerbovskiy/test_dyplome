const ChatMessageActions = ({ onDeleteClick, onEditClick }) => {
  return (
    <div className="card message-action">
      <div onClick={onDeleteClick} className="card-body">
        Delete
      </div>
      <div onClick={onEditClick} className="card-body">
        Edit
      </div>
    </div>
  );
};

export default ChatMessageActions;
