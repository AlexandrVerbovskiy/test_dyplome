export const login = {
  url: () => "login",
  type: "post",
  convertRes: (res) => {
    const token = res.headers.authorization.split(" ")[1];
    return { token, user: { ...res.data.user } };
  },
};

export const registration = {
  url: () => "register",
  type: "post",
  convertRes: (res) => res.data.validated,
};

export const validateToken = {
  url: () => "check-token",
  type: "post",
  convertData: (token) => ({ token }),
  convertRes: (res) => {
    const validated = res.data.validated;

    if (!validated) return null;

    const token = res.headers.authorization.split(" ")[1];
    return { token, user: { ...res.data.user } };
  },
};

export const getUsersToChatting = {
  url: () => "users-to-chatting",
  convertData: (lastChatId, limit, searchString) => ({
    lastChatId,
    limit,
    searchString,
  }),
  type: "post",
  convertRes: (res) => res.data.chats,
};

export const getAdminChats = {
  url: () => "admin-chats",
  convertData: (lastChatId, limit, searchString) => ({
    lastChatId,
    limit,
    searchString,
  }),
  type: "post",
  convertRes: (res) => res.data.chats,
};

export const getChatMessages = {
  url: () => "get-chat-messages",
  convertData: (chatId, lastId, count) => ({ chatId, lastId, count }),
  type: "post",
  convertRes: (res) => res.data.messages,
};

export const selectChat = {
  url: () => "select-chat",
  type: "post",
  convertData: (chatId) => ({ chatId }),
  convertRes: (res) => ({
    messages: res.data.messages,
    statistic: res.data.statistic,
    users: res.data.users,
    userRole: res.data.userRole,
  }),
};

export const updateProfile = {
  url: () => "update-profile",
  type: "post",
  convertRes: (res) => res.data,
};

export const updateJob = {
  url: () => "edit-job",
  type: "post",
  convertRes: (res) => res.data,
};

export const getProfileInfo = {
  url: () => "get-profile",
  type: "get",
  convertRes: (res) => res.data,
};

export const getJobInfo = {
  url: (id) => `get-job/${id}`,
  type: "get",
  convertRes: (res) => res.data.job,
};

export const getJobsByLocation = {
  url: () => `get-jobs-by-location`,
  type: "post",
  convertRes: (res) => res.data.jobs ?? [],
};

export const getUsersChat = {
  url: () => `get-users-chat`,
  type: "post",
  convertData: (userId) => ({ userId }),
  convertRes: (res) => res.data ?? {},
};

export const sendJobProposal = {
  url: () => `send-job-proposal`,
  type: "post",
  convertRes: (res) => res.data ?? {},
};

export const getJobProposalInfo = {
  url: (id) => `get-job-proposal/${id}`,
  type: "get",
  convertRes: (res) => res.data.proposal ?? {},
};

export const getMyProposals = {
  url: () => `get-my-proposals`,
  type: "post",
  convertRes: (res) => res.data.proposals ?? [],
};

export const getProposalsOnMyJobs = {
  url: () => `get-proposals-for-me`,
  type: "post",
  convertRes: (res) => res.data.proposals ?? [],
};

export const createDispute = {
  url: () => `create-dispute`,
  type: "post",
  convertRes: (res) => res.data ?? [],
};

export const getAdminDisputes = {
  url: (status = "pending") => `get-admin-disputes/${status}`,
  type: "post",
  convertRes: (res) => res.data.disputes ?? [],
};

export const adminAssignDispute = {
  url: () => `assign-dispute`,
  type: "post",
  convertData: (disputeId) => ({
    disputeId,
  }),
  convertRes: (res) => res.data ?? {},
};

export const getJobDisputeInfo = {
  url: (id) => `get-job-dispute/${id}`,
  type: "get",
  convertRes: (res) => res.data.dispute ?? {},
};

export const getChatMessagesByAdmin = {
  url: () => `get-full-chat-messages`,
  type: "post",
  convertRes: (res) => res.data.messages ?? [],
};

export const getChatInfoByAdmin = {
  url: (id) => `get-chat-user-infos/${id}`,
  type: "post",
  convertRes: (res) => res.data.users ?? [],
};

export const getUserStatistic = {
  url: (id) => `get-user-statistic/${id}`,
  type: "get",
  convertRes: (res) => res.data ?? {},
};

export const createComment = {
  url: (type) => `create-comment/${type}`,
  type: "post",
  convertRes: (res) => res.data ?? {},
};

export const getComments = {
  url: (type) => `get-comments-by-entity/${type}`,
  type: "post",
  convertRes: (res) => res.data ?? {},
};

export const getNotifications = {
  url: () => `get-notifications`,
  type: "post",
  convertRes: (res) => res.data.notifications ?? [],
};

const __changeProposalStatus = (url) => ({
  url: () => url,
  type: "post",
  convertData: (proposalId) => ({ id: proposalId }),
  convertRes: (res) => res.data ?? {},
});

export const acceptJobProposal = __changeProposalStatus("proposal-accept");

export const rejectJobProposal = __changeProposalStatus("proposal-reject");

export const cancelJobProposal = __changeProposalStatus("proposal-cancel");

export const acceptCancelJobProposal = __changeProposalStatus(
  "proposal-accept-cancel"
);

export const completeJobProposal = __changeProposalStatus("proposal-complete");

export const acceptCompleteJobProposal = __changeProposalStatus(
  "proposal-accept-complete"
);

export const test = {
  url: () => "test",
  type: "post",
};

export const getUsersToGroup = {
  url: () => `get-users-to-group`,
  type: "post",
  convertData: (lastId = 0, ignoreIds = [], filter = "") => ({
    ignoreIds,
    lastId,
    filter,
  }),
  convertRes: (res) => res.data.users ?? [],
};

export const getUsersToGroupToJoin = {
  url: () => `get-users-to-group-to-join`,
  type: "post",
  convertData: (chatId, lastId = 0, ignoreIds = [], filter = "") => ({
    ignoreIds,
    lastId,
    filter,
    chatId,
  }),
  convertRes: (res) => res.data.users ?? [],
};

export const createGroupChat = {
  url: () => `create-group-chat`,
  type: "post",
  convertRes: (res) => ({
    avatar: res.data.avatar,
    chatId: res.data.chatId,
    name: res.data.name,
    message: res.data.chatMessage,
  }),
};

export const leftChat = {
  url: () => `left-chat`,
  type: "post",
  convertData: (chatId) => ({ chatId }),
  convertRes: (res) => ({
    ...res.data,
  }),
};

export const kickChatUser = {
  url: () => `kick-chat-user`,
  type: "post",
  convertData: (chatId, userId) => ({ chatId, userId }),
  convertRes: (res) => ({
    ...res.data,
  }),
};

export const addChatUsers = {
  url: () => `add-chat-users`,
  type: "post",
  convertData: (chatId, users) => ({ chatId, users }),
  convertRes: (res) => ({
    chatId: res.data.chatId,
    messages: res.data.messages,
  }),
};
