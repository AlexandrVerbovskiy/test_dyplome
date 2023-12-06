export const login = {
  url: () => "login",
  type: "post",
  convertRes: (res) => {
    const token = res.headers.authorization.split(" ")[1];
    return { token, userId: res.data.userId };
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
    return { token, userId: res.data.userId };
  },
};

export const getUsersToChatting = {
  url: () => "users-to-chatting",
  type: "post",
  convertRes: (res) => res.data.users,
};

export const getChatMessages = {
  url: () => "get-chat-messages",
  type: "post",
  convertRes: (res) => res.data.messages,
};

export const selectChat = {
  url: () => "select-chat",
  type: "post",
  convertData: (chatId) => ({ chatId }),
  convertRes: (res) => res.data.messages,
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
  convertData: (disputeId) => {
    disputeId;
  },
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
  convertRes: (res) => res.data ?? [],
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
