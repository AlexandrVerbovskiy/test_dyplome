import { useContext, useEffect, useState } from "react";
import { MainContext } from "../contexts";
import { useParams } from "react-router-dom";
import { acceptGetMoneyRequest, getGetMoneyRequestById } from "../requests";
import { Layout } from "../components";
import { Paypal, Stripe } from "react-bootstrap-icons";
import { fullTimeFormat, generateFullUserImgPath } from "../utils";

const labelWidth = 150;

const AdminGetMoneyRequest = () => {
  let { id } = useParams();
  const [requestInfo, setRequestInfo] = useState({});
  const [acceptDisabled, setAcceptDisabled] = useState(false);
  const { setSuccess, setError, request } = useContext(MainContext);

  useEffect(() => {
    (async () => {
      try {
        const res = await request({
          url: getGetMoneyRequestById.url(id),
          type: getGetMoneyRequestById.type,
          convertRes: getGetMoneyRequestById.convertRes,
        });

        setRequestInfo({
          ...res,
        });
      } catch (e) {}
    })();
  }, [id]);

  const handleAcceptClick = async () => {
    try {
      if (acceptDisabled) {
        return;
      }

      setAcceptDisabled(true);

      const res = await request({
        url: acceptGetMoneyRequest.url(),
        type: acceptGetMoneyRequest.type,
        convertRes: acceptGetMoneyRequest.convertRes,
        data: acceptGetMoneyRequest.convertData(id),
      });

      console.log(res);

      setRequestInfo({
        ...res,
      });

      setSuccess("Done success");
    } catch (e) {
    } finally {
      setAcceptDisabled(false);
    }
  };

  return (
    <Layout pageClassName="default-edit-page">
      <div className="page-content">
        <div className="card">
          <div className="card-body">
            <h6 className="text-uppercase">Get Money Request</h6>

            <hr />

            <div className="row mb-4">
              <div className="col-12 d-flex mb-3">
                <label
                  className="form-label form-label-view mb-0 text-nowrap"
                  style={{ width: `${labelWidth}px` }}
                >
                  User:{" "}
                </label>
                <div className="input-group">
                  <a href={`/users/${requestInfo.user_id}`}>
                    {requestInfo.user_nick ?? requestInfo.user_email}
                    <img
                      src={generateFullUserImgPath(requestInfo.user_avatar)}
                      alt={requestInfo.user_email}
                      height="20px"
                      width="20px"
                      style={{
                        height: "20px",
                        width: "20px",
                        borderRadius: "50%",
                        marginLeft: "4px",
                      }}
                      className="base-img"
                    />
                  </a>
                </div>
              </div>

              <div className="col-12 d-flex mb-3">
                <label
                  className="form-label form-label-view mb-0 text-nowrap"
                  style={{ width: `${labelWidth}px` }}
                >
                  Platfrom:{" "}
                </label>
                <div className="input-group">
                  {requestInfo.platform == "paypal" ? (
                    <div className="d-flex align-items-center">
                      <Paypal size={14} />
                      <span className="ms-1 platform-name">PayPal</span>
                    </div>
                  ) : (
                    <div className="d-flex align-items-center">
                      <Stripe size={14} />
                      <span className="ms-1 platform-name">Stripe</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-12 d-flex mb-3">
                <label
                  className="form-label form-label-view mb-0 text-nowrap"
                  style={{ width: `${labelWidth}px` }}
                >
                  Money:{" "}
                </label>
                <div className="input-group">${requestInfo.money}</div>
              </div>

              <div className="col-12 d-flex mb-3">
                <label
                  className="form-label form-label-view mb-0 text-nowrap"
                  style={{ width: `${labelWidth}px` }}
                >
                  Created at:{" "}
                </label>
                <div className="input-group">
                  {fullTimeFormat(requestInfo.created_at)}
                </div>
              </div>

              <div className="col-12 d-flex mb-3">
                <label
                  className="form-label form-label-view mb-0 text-nowrap"
                  style={{ width: `${labelWidth}px` }}
                >
                  Status:{" "}
                </label>
                <div className="input-group">
                  {requestInfo.status == "success" && (
                    <span
                      className="badge bg-gradient-quepal text-white shadow-sm"
                      style={{ width: "90px" }}
                    >
                      Success
                    </span>
                  )}

                  {requestInfo.status == "in_process" && (
                    <span
                      className="badge bg-gradient-blooker text-white shadow-sm"
                      style={{ width: "90px" }}
                    >
                      In process
                    </span>
                  )}

                  {requestInfo.status == "error" && (
                    <span
                      className="badge bg-gradient-bloody text-white shadow-sm"
                      style={{ width: "90px" }}
                    >
                      Failed
                    </span>
                  )}
                </div>
              </div>

              <div className="col-12 d-flex">
                <label
                  className="form-label form-label-view mb-0 text-nowrap"
                  style={{ width: `${labelWidth}px` }}
                >
                  Done at:{" "}
                </label>
                <div className="input-group">
                  {requestInfo.done_at
                    ? fullTimeFormat(requestInfo.done_at)
                    : "-"}
                </div>
              </div>
            </div>

            <hr />

            {requestInfo.status !== "success" && (
              <div className="d-flex align-items-center">
                <div className="dropdown ms-auto">
                  <button
                    className="btn btn-primary"
                    onClick={handleAcceptClick}
                    disabled={acceptDisabled}
                  >
                    Approve
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminGetMoneyRequest;
