const fetch = require("node-fetch");

const { PAYPAL_CLIENT_ID, PAYPAL_SECRET_KEY } = process.env;
const base = "https://api-m.sandbox.paypal.com";

async function getToken() {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const tokenInfo = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET_KEY}`
  ).toString("base64");
  myHeaders.append("Authorization", `Basic ${tokenInfo}`);

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");
  urlencoded.append("ignoreCache", "true");
  urlencoded.append("return_authn_schemes", "true");
  urlencoded.append("return_client_metadata", "true");
  urlencoded.append("return_unconsented_scopes", "true");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  };

  const res = await fetch(
    "https://api-m.sandbox.paypal.com/v1/oauth2/token",
    requestOptions
  );

  const data = await res.json();
  return data.access_token;
}

const createOrder = async (cart) => {
  console.log(
    "shopping cart information passed from the frontend createOrder() callback:",
    cart
  );

  const accessToken = await getToken();
  console.log(accessToken);

  const url = `${base}/v2/checkout/orders`;
  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: "100.00",
        },
      },
    ],
  };

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

const captureOrder = async (orderID) => {
  const accessToken = await getToken();
  const url = `${base}/v2/checkout/orders/${orderID}/capture`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(response);
};

async function getBalance() {
  try {
    const token = await getToken();
    console.log(token);

    const infoRes = await fetch(
      "https://api-m.sandbox.paypal.com/v1/reporting/balances",
      {
        headers: {
          "Content-Type": "application/scim+json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const info = await infoRes.json();

    const usdInfo = info.balances.find(
      (elem) => elem.currency.toLowerCase() === "usd"
    );

    console.log(usdInfo);

    console.log(usdInfo.total_balance.value);
  } catch (e) {
    console.log(e.message);
  }
}

async function sendMoneyToEmail(type, getter, amount, currency) {
  const token = await getToken();

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("PayPal-Request-Id", "5ace1e04-e3cb-4d3d-bffa-cadebc98e93c");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const raw = JSON.stringify({
    sender_batch_header: {
      sender_batch_id: "batch_" + Math.random().toString(36).substring(9),
      email_subject: "You have a payout!",
    },
    items: [
      {
        recipient_type: type,
        amount: {
          value: amount,
          currency: currency,
        },
        note: "Thank you.",
        receiver: getter,
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("https://api-m.sandbox.paypal.com/v1/payments/payouts", requestOptions)
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

async function handleResponse(response) {
  try {
    const jsonResponse = await response.json();
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}

module.exports = {
  captureOrder,
  createOrder,
  getBalance,
  sendMoneyToEmail,
};
