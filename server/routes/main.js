const path = require("path");
const multer = require("multer");
const fs = require("fs");
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const paypal = require("@paypal/checkout-server-sdk");
const axios = require("axios");

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_SECRET_KEY;
const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

async function createPayPalPayment(amount) {
  const request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: amount.toString(),
        },
      },
    ],
  });

  try {
    const response = await client.execute(request);
    return response.result;
  } catch (error) {
    throw error;
  }
}

async function capturePayPalPayment(orderId) {
  const request = new paypal.orders.OrdersCaptureRequest(orderId);

  try {
    const response = await client.execute(request);
    return response.result;
  } catch (error) {
    throw error;
  }
}

/*stripe.customers.createSource(
  "cus_Prt5cml2ePXtNw",
  {
    source: 'tok_visa',
  },
  function(err, card) {
    // Обробляємо результати
    if (err) {
      console.error(err);
    } else {
      console.log('Card added successfully:', card);
    }
  }
);

stripe.customers.listSources(
  "cus_Prt5cml2ePXtNw",
  { object: "card", limit: 10 },
  function (err, cards) {
    // Обробляємо результати
    if (err) {
      console.error(err);
    } else {
      console.log(cards.data);
    }
  }
);*/

const {
  User,
  Chat,
  Job,
  JobProposal,
  Dispute,
  Comment,
  Transactions,
} = require("../controllers");

const {
  generateIsAdmin,
  generateIsAuth,
  generateIsNotAuth,
} = require("../middlewares");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = "files/temp";

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, {
        recursive: true,
      });
    }

    cb(null, folder);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

function route(app, db, io) {
  const userController = new User(db);
  const chatController = new Chat(db);
  const jobController = new Job(db);
  const jobProposalController = new JobProposal(db);
  const disputeController = new Dispute(db);
  const commentController = new Comment(db);
  const transactionsController = new Transactions(db);

  chatController.setIo(io);

  const isAdmin = generateIsAdmin(db);
  const isAuth = generateIsAuth();
  const isNotAuth = generateIsNotAuth();

  app.post("/register", isNotAuth, userController.registration);
  app.post("/login", isNotAuth, userController.login);
  app.post("/forgot-password", isNotAuth, userController.resetPasswordRequest);
  app.post(
    "/reset-password-forgotten-password",
    isNotAuth,
    userController.updateForgottenPassword
  );
  app.post("/check-token", isAuth, userController.validateToken);
  app.post(
    "/update-profile",
    isAuth,
    upload.single("avatar"),
    userController.updateUserProfile
  );

  app.post(
    "/admin-update-user",
    isAdmin,
    upload.single("avatar"),
    userController.adminUpdateUser
  );

  app.post(
    "/admin-create-user",
    isAdmin,
    upload.single("avatar"),
    userController.adminCreateUser
  );

  app.post("/get-user-profile", userController.getUserById);
  app.get("/get-profile", isAuth, userController.getPersonalProfile);
  app.post("/get-full-user-info", isAuth, userController.getFullUserById);
  app.post("/reset-password", isAuth, userController.resetPassword);

  app.post("/users-to-chatting", isAuth, chatController.getUsersToChatting);
  app.post("/admin-chats", isAdmin, chatController.getAdminChats);
  app.post(
    "/admin-user-system-chats",
    isAdmin,
    chatController.getUserSystemChats
  );

  app.post("/admin-get-users", isAdmin, userController.getFullUsers);

  app.post("/get-chat-messages", isAuth, chatController.getChatMessages);
  app.post(
    "/admin-get-system-chat-messages",
    isAdmin,
    chatController.getSystemChatMessages
  );
  app.post("/select-chat", isAuth, chatController.selectChat);
  app.post(
    "/admin-select-system-chat",
    isAdmin,
    chatController.selectSystemChatByAdmin
  );
  app.post("/get-users-chat", isAuth, chatController.getUsersChat);

  app.get("/get-job/:id", isAuth, jobController.getById);
  app.post("/get-jobs-by-location", isAuth, jobController.getByDistance);
  app.post("/edit-job", isAuth, jobController.edit);
  app.post("/admin-edit-job", isAuth, jobController.editByAdmin);

  app.post(
    "/get-my-proposals",
    isAuth,
    jobProposalController.getForProposalAuthor
  );
  app.post(
    "/get-proposals-for-me",
    isAuth,
    jobProposalController.getForJobAuthor
  );

  app.get("/get-job-proposal/:id", isAuth, jobProposalController.getById);
  app.post("/send-job-proposal", isAuth, jobProposalController.create);

  app.post("/proposal-accept", isAuth, jobProposalController.accept);
  app.post("/proposal-reject", isAuth, jobProposalController.reject);
  app.post("/proposal-cancel", isAuth, jobProposalController.requestToCancel);
  app.post(
    "/proposal-accept-cancel",
    isAuth,
    jobProposalController.acceptCancelled
  );
  app.post(
    "/proposal-complete",
    isAuth,
    jobProposalController.requestToComplete
  );
  app.post(
    "/proposal-accept-complete",
    isAuth,
    jobProposalController.acceptCompleted
  );

  app.post("/create-dispute", isAuth, disputeController.create);

  app.post(
    "/get-admin-disputes/:status?",
    isAdmin,
    disputeController.getAllByStatus
  );

  app.post("/assign-dispute", isAdmin, disputeController.assignAdminToDispute);

  app.get("/get-job-dispute/:disputeId", isAdmin, disputeController.getById);

  app.get(
    "/get-chat-user-infos/:chatId",
    isAdmin,
    chatController.getChatUserInfos
  );

  app.post(
    "/get-full-chat-messages",
    isAdmin,
    chatController.getChatMessagesFullContents
  );

  app.use("/files", express.static(path.join(__dirname, "..", "files")));

  app.get(
    "/get-user-statistic/:userId",
    isAuth,
    userController.getUserStatistic
  );

  app.post("/create-comment/:type?", isAuth, commentController.create);

  app.post(
    "/get-notifications",
    isAuth,
    userController.getPersonalNotifications
  );

  app.post(
    "/get-comments-by-entity/:type?",
    isAuth,
    commentController.getAllByEntityId
  );

  app.post("/get-users-to-new-group", isAdmin, userController.getAdminsToGroup);
  app.post(
    "/get-users-to-group-to-join",
    isAdmin,
    userController.getAdminsToGroupToJoin
  );

  app.post(
    "/create-group-chat",
    isAdmin,
    upload.single("avatar"),
    chatController.createGroupChat
  );

  app.post("/left-chat", isAdmin, chatController.leftChat);
  app.post("/kick-chat-user", isAdmin, chatController.kickUser);
  app.post("/add-chat-users", isAdmin, chatController.addUsers);

  app.post("/admin-update-user-admin", isAdmin, userController.changeUserRole);
  app.post(
    "/admin-update-user-authorized",
    isAdmin,
    userController.changeUserAuthorized
  );
  app.post("/admin-delete-user", isAdmin, userController.deleteUser);

  app.post(
    "/admin-server-payments",
    isAdmin,
    transactionsController.getServerTransactions
  );
  app.post(
    "/admin-user-payments",
    isAdmin,
    transactionsController.getPaymentTransactions
  );
  app.post(
    "/user-payments",
    isAuth,
    transactionsController.getUserPaymentTransactions
  );

  app.post("/user-name-id-list", isAuth, userController.userNameIdList);

  app.post("/admin-job-list", isAdmin, jobController.getAllJobs);

  app.post("/admin-dispute-list", isAdmin, disputeController.getAllDisputes);

  app.post("/stripe-charge", async (req, res) => {
    try {
      const { amount, token } = req.body;
      const charge = await stripe.charges.create({
        amount: amount,
        currency: "usd",
        source: token.id,
        description: "Example Charge",
      });

      res.json({ charge });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/stripe-balance", async (req, res) => {
    const result = await stripe.balance.retrieve();
    const available = result["available"][0]["amount"];
    const pending = result["pending"][0]["amount"];
    res.json({ pending, available });
  });

  app.get("/stripe-transaction-test", async (req, res) => {
    try {
      const result = await stripe.transfers.create({
        amount: 100,
        currency: "usd",
        destination: "acct_1K1DDB2YSfjEr5Wy",
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/paypal-charge", async (req, res) => {
    try {
      const { orderID, paymentID } = req.body;

      try {
        const request = new paypal.orders.OrdersGetRequest(orderID);
        const response = await client.execute(request);
        console.log(response);
      } catch (e) {
        console.log(e.message);
      }
      res.status(200).send("OK");
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  const tokenUrl = "https://api.sandbox.paypal.com/v1/oauth2/token";

  const balanceUrl = "https://api.sandbox.paypal.com/v1/balance/";

  async function getToken() {
    const response = await axios.post(
      tokenUrl,
      `grant_type=client_credentials`,
      {
        auth: {
          username: clientId,
          password: clientSecret,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data.access_token;
  }

  async function getBalance() {
    const token = await getToken();
    console.log(token);

    try {
      const response = await axios.get(balanceUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (e) {
      console.log(e.message);
    }
  }

  app.get("/paypal-balance", async (req, res) => {
    getBalance();
    res.status(200).send("OK");
  });
}
module.exports = route;
