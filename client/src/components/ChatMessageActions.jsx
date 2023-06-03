const ChatMessageActions = ({ onDeleteClick, onEditClick, canEdit }) => {
  return (
    <div className="card message-action">
      {canEdit &&
        <div onClick={onEditClick} className="card-body">
          Edit
        </div>}
        
      <div onClick={onDeleteClick} className="card-body">
        Delete
      </div>
    </div>
  );
};

export default ChatMessageActions;
