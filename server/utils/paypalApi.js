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
  const accessToken = await getToken();
  const url = `${base}/v2/checkout/orders`;
  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: "10000.00",
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

  const jsonResponse = await response.json();

  if (jsonResponse.status.toLowerCase() === "completed") {
    let newBalance = 0;
    const purchaseUnits = jsonResponse.purchase_units;

    purchaseUnits.forEach((unit) => {
      unit.payments.captures.forEach((capture) => {
        const gotMoney = Number(
          capture.seller_receivable_breakdown.net_amount.value
        );
        newBalance += gotMoney;
        console.log(gotMoney);
      });
    });

    return {
      jsonResponse: { newBalance },
      httpStatusCode: response.status,
    };
  } else {
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  }
};

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

  const response = await fetch(
    "https://api-m.sandbox.paypal.com/v1/payments/payouts",
    requestOptions
  );
  const data = await response.json();

  if (data.message) {
    return { error: data.message };
  } else {
    return { error: false };
  }
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
  sendMoneyToEmail,
};
