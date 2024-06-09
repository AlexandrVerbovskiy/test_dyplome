import { useContext, useEffect, useState } from "react";
import { Layout, Select, Input } from "components";
import { MainContext } from "contexts";
import { getFeeInfo, setFeeInfo } from "requests";

const feeTypeOptions = [
  { value: "percent", label: "By percent of withdraw" },
  { value: "fixed", label: "By fixed fee" },
];

const baseType = feeTypeOptions[0]["value"];

const SystemOptions = () => {
  const [feeType, setFeeType] = useState(baseType);
  const [feeFixedValue, setFeeFixedValue] = useState("");
  const [feeFixedError, setFeeFixedError] = useState(null);
  const [feePercentValue, setFeePercentValue] = useState("");
  const [feePercentError, setFeePercentError] = useState(null);
  const [loading, setLoading] = useState(false);
  const main = useContext(MainContext);

  const feeFixedChange = (value) => {
    setFeeFixedValue(value);
    setFeeFixedError(null);
  };

  const feePercentChange = (value) => {
    setFeePercentValue(value);
    setFeePercentError(null);
  };

  const updateStates = (body) => {
    const { feeType, fixedFee, percentFee } = body;
    setFeeType(feeType);
    setFeeFixedValue(fixedFee);
    setFeePercentValue(percentFee);
  };

  const init = async () => {
    const res = await main.request({
      url: getFeeInfo.url(),
      type: getFeeInfo.type,
      convertRes: getFeeInfo.convertRes,
    });
    updateStates(res);
  };

  useEffect(() => {
    init();
  }, []);

  const handleSaveClick = async () => {
    let error = false;

    if (!feeFixedValue || isNaN(Number(feeFixedValue))) {
      setFeeFixedError("Invalid field");
      error = true;
    }

    if (
      !feePercentValue ||
      isNaN(Number(feePercentValue)) ||
      Number(feePercentValue) >= 100
    ) {
      setFeePercentError("Invalid field");
      error = true;
    }

    if (error) return;

    try {
      setLoading(true);

      const res = await main.request({
        url: setFeeInfo.url(),
        data: setFeeInfo.convertData(
          feeType,
          feeFixedValue,
          feePercentValue
        ),
        type: setFeeInfo.type,
        convertRes: setFeeInfo.convertRes,
      });

      main.setSuccess("Updated success");
      updateStates(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout pageClassName="system-options-page">
      <div className="page-content">
        <div className="card">
          <div className="card-body">
            <h6 className="text-uppercase">Fee</h6>
            <hr />

            <div className="row">
              <div className="col col-12">
                <Select
                  value={feeType}
                  onChange={(event) => setFeeType(event.value)}
                  options={feeTypeOptions}
                  label="Select a fee type"
                  className="w-100"
                />
              </div>

              <div className="col col-12">
                <Input
                  type="text"
                  label="Fixed Value"
                  value={feeFixedValue}
                  error={feeFixedError}
                  placeholder="Fixed Value"
                  onChange={(e) => feeFixedChange(e.target.value)}
                />
              </div>

              <div className="col col-12">
                <Input
                  type="text"
                  label="Percent Value"
                  value={feePercentValue}
                  error={feePercentError}
                  placeholder="Percent Value"
                  onChange={(e) => feePercentChange(e.target.value)}
                />
              </div>

              <div className="col col-12 mb-4 mt-2">
                <button
                  className="w-100 btn btn-primary"
                  type="button"
                  disabled={loading}
                  onClick={handleSaveClick}
                >
                  {loading ? "Loading..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SystemOptions;
