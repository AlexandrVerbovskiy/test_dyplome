export const getNotificationTitleByType = (type, body) => {};

export const getNotificationBodyByType = (type, body) => {};

export const getNotificationMainColor = (type) => {
  switch (type) {
    case "message":
      return "warning";
    case "comment":
      return "danger";
    case "job":
      return "info";
    case "proposal":
      return "danger";
    case "system":
      return "success";
    default:
      return "warning";
  }
};

export const getNotificationIcon = (type) => {
  switch (type) {
    case "message":
      return "bx-send";
    case "comment":
      return "bx-message-detail";
    case "job":
      return "bx-home-circle";
    case "proposal":
      return "bx-cart-alt";
    case "system":
      return "bx-file";
    default:
      return "bx-file";
  }
};
