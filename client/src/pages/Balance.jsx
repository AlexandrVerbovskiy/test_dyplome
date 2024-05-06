import React, { useState, useContext, useEffect } from "react";
import {
  BaseAdminTable,
  GetMoneyByPaypal,
  GetMoneyByStripe,
  Layout,
  PaypalPaymentForm,
  StripePaymentForm,
  TabHeader,
} from "components";
import { Paypal, Stripe } from "react-bootstrap-icons";
import { MainContext } from "contexts";
import { getFeeInfo, getPaymentTransactions } from "requests";
import { usePagination } from "hooks";
import { fullTimeFormat } from "utils";

const paypalType = "paypal";
const stripeType = "stripe";

const headers = [
  {
    value: "id",
    title: "Id",
    width: "10%",
    canChange: true,
  },
  {
    value: "status",
    title: "Type",
    width: "15%",
  },
  {
    value: "money",
    title: "Money",
    width: "15%",
    canChange: true,
  },
  {
    value: "description",
    title: "Description",
    width: "50%",
  },
  {
    value: "created_at",
    title: "Date",
    width: "10%",
    canChange: true,
  },
];

const TransactionRow = ({
  id,
  money,
  operationType,
  balanceChangeType,
  createdAt,
  transactionData,
}) => {
  transactionData = JSON.parse(transactionData);
  let description = transactionData.description;
  let status = "success";

  if (operationType == "withdrawal_by_paypal") {
    status = transactionData.status;
  }

  return (
    <tr>
      <td className="fw-bolder">#{id}</td>
      <td>
        {status == "success" && (
          <span className="badge bg-gradient-quepal text-white shadow-sm w-100">
            Success
          </span>
        )}

        {status == "in_process" && (
          <span className="badge bg-gradient-blooker text-white shadow-sm w-100">
            In process
          </span>
        )}
      </td>
      <td>
        {balanceChangeType == "topped_up" && (
          <span className="font-weight-bold text-success">+${money}</span>
        )}
        {balanceChangeType == "reduced" && (
          <span className="font-weight-bold text-danger">-${money}</span>
        )}
      </td>
      <td><div style={{textWrap:"wrap"}}>{description}</div></td>
      <td className="fw-bolder">{fullTimeFormat(createdAt)}</td>
    </tr>
  );
};

const PaypalStripeSwap = ({ platform, handleSetPlatform }) => {
  const handleSetPaypalType = () => handleSetPlatform(paypalType);
  const handleSetStripeType = () => handleSetPlatform(stripeType);

  return (
    <div className="card-title balance-payment-type-select mb-4">
      <div className="row">
        <h6
          onClick={handleSetPaypalType}
          className={`col ${platform == paypalType ? "active" : ""}`}
        >
          <Paypal
            size={14}
            className={`platform-icon ${
              platform === paypalType ? "active" : ""
            }`}
          />
          <span className="ms-1 platform-name">PayPal</span>
        </h6>
        <h6
          onClick={handleSetStripeType}
          className={`col ${platform == stripeType ? "active" : ""}`}
        >
          <Stripe
            size={14}
            className={`platform-icon ${
              platform === stripeType ? "active" : ""
            }`}
          />
          <span className="ms-1 platform-name">Stripe</span>
        </h6>
      </div>
    </div>
  );
};

const PaymentForm = () => {
  const [paymentPlatform, setPaymentPlatform] = useState(paypalType);
  const [withdrawalPlatform, setWithdrawalPlatform] = useState(paypalType);
  const [feeInfo, setFeeInfo] = useState({});
  const main = useContext(MainContext);

  const {
    moveToPage,
    changeFilter,
    filter,
    order,
    orderType,
    handleChangeOrder,
    canMoveNextPage,
    canMovePrevPage,
    items: transactions,
    currentTo,
    currentFrom,
    page,
    countPages,
    countItems,
    rebuild,
    setItemFields,
    options,
  } = usePagination({
    getItemsFunc: (props) =>
      main.request({
        url: getPaymentTransactions.url(),
        data: getPaymentTransactions.convertData(props),
        type: getPaymentTransactions.type,
        convertRes: getPaymentTransactions.convertRes,
      }),
  });

  const init = async () => {
    const res = await main.request({
      url: getFeeInfo.url(),
      type: getFeeInfo.type,
      convertRes: getFeeInfo.convertRes,
    });

    setFeeInfo(res);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Layout pageClassName="default-view-page table-page">
      <div className="page-content">
        <div className="card">
          <div className="card-body balance-tabs">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="text-uppercase mb-0">Balance</h6>
            </div>

            <hr />

            <div className="balance-tabs-body">
              <ul className="nav nav-tabs nav-primary" role="tablist">
                <TabHeader
                  title="Current Balance"
                  id="balance"
                  selected={true}
                />
                <TabHeader title="Replenishment" id="replenishment" />
                <TabHeader title="Withdrawal" id="withdrawal" />
              </ul>
              <div className="tab-content">
                <div
                  className="tab-pane fade active show"
                  id="balance"
                  role="tabpanel"
                >
                  <div className="d-flex justify-content-center payment-form">
                    <div className="row w-100 mb-3">
                      <div className="col-12 balance-info-parent">
                        <div className="balance-info">
                          ${main.sessionUser.balance}
                        </div>
                        <div className="d-none d-sm-block balance-info-icon bx bx-money"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="tab-pane fade card-header-type-select"
                  id="replenishment"
                  role="tabpanel"
                >
                  <PaypalStripeSwap
                    platform={paymentPlatform}
                    handleSetPlatform={setPaymentPlatform}
                  />

                  <div className="d-flex justify-content-center payment-form">
                    {paymentPlatform === "paypal" ? (
                      <PaypalPaymentForm onComplete={() => rebuild()} />
                    ) : (
                      <StripePaymentForm onComplete={() => rebuild()} />
                    )}
                  </div>
                </div>

                <div
                  className="tab-pane fade card-header-type-select"
                  id="withdrawal"
                  role="tabpanel"
                >
                  <PaypalStripeSwap
                    platform={withdrawalPlatform}
                    handleSetPlatform={setWithdrawalPlatform}
                  />

                  <div className="d-flex justify-content-center withdrawal-form">
                    {withdrawalPlatform === "paypal" ? (
                      <GetMoneyByPaypal
                        feeInfo={feeInfo}
                        onComplete={() => rebuild()}
                      />
                    ) : (
                      <GetMoneyByStripe
                        feeInfo={feeInfo}
                        onComplete={() => rebuild()}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <BaseAdminTable
          title="Transactions"
          changeOrder={handleChangeOrder}
          order={order}
          orderType={orderType}
          items={transactions}
          headers={headers}
          RowElem={TransactionRow}
          paginationInfo={{
            page,
            countPages,
            moveToPage,
            canMoveNextPage,
            canMovePrevPage,
          }}
        />
      </div>
    </Layout>
  );
};

export default PaymentForm;
