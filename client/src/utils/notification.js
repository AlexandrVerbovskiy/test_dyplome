function getUserByBody(body) {
  return body.authorNick ?? body.authorEmail ?? "Unknown user";
}

export const getNotificationTitleByType = (type, body) => {
  switch (type) {
    case "message":
      return `User ${getUserByBody(body)} sent a message`;
    case "comment":
      return `User ${getUserByBody(body)} created a comment on your ${
        body.parentType
      }`;
    case "proposal":
      return `User ${getUserByBody(body)} sent a proposal on your job '${
        body.jobTitle
      }'`;
    case "dispute":
      if (body.type == "created")
        return `Dispute for job '${body.jobTitle}' created by ${getUserByBody(
          body
        )}`;

      if (body.type == "resolved")
        return `Dispute for job '${body.jobTitle}' resolved by admin`;
    case "system":
      return "System message";
    default:
      return "Unknown notification";
  }
};

export const getNotificationBodyByType = (type, body) => {
  switch (type) {
    case "message":
      if (body.type == "video") return "Video message";
      if (body.type == "audio") return "Voice message";
      if (body.type == "file") return "File message";
      return body.messageBody;
    case "comment":
      return body.commentBody;
    case "proposal":
      return `User want ${body.pricePerHour} per hour and ${body.needHours} hours`;
    case "dispute":
      return body.message;
    case "system":
      return body.message;
    default:
      return "Report this to the administrator";
  }
};

export const getNotificationMainColor = (type) => {
  switch (type) {
    case "message":
      return "warning";
    case "comment":
      return "danger";
    case "proposal":
      return "info";
    case "dispute":
      return "danger";
    case "system":
      return "success";
    default:
      return "danger";
  }
};

export const getNotificationIcon = (type) => {
  switch (type) {
    case "message":
      return "bx-send";
    case "comment":
      return "bx-message-detail";
    case "proposal":
      return "bx-home-circle";
    case "dispute":
      return "bx-cart-alt";
    case "system":
      return "bx-file";
    default:
      return "bx-file";
  }
};
