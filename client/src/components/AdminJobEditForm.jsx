import React, { useContext } from "react";
import { useAdminJobEdit } from "../hooks";
import { MainContext } from "../contexts";

const AdminJobEditForm = ({ baseData, onSave, hasId }) => {
  const { coords, address, title, price, description, validateJobEdit } =
    useAdminJobEdit({ baseData });

  const main = useContext(MainContext);

  const saveJob = async () => {
    const resValidation = validateJobEdit();
    if (!resValidation) return;

    const jobData = {
      price: price.value,
      title: title.value,
      description: description.value,
      address: address.value,
      lat: coords.value.lat,
      lng: coords.value.lng,
      jobId: jobId.value,
    };

    try {
      await onSave(jobData);
      main.setSuccess("Saved successfully");
    } catch (e) {
      main.setError(e.message);
    }
  };

  return (
    <Layout pageClassName="default-edit-page">
      <div className="page-content">
        <div className="card">
          <div className="card-body">
            <h6 className="text-uppercase">Job Info</h6>
            <hr />

            <div className="row">
              <div className="job-edit-map col-12 col-md-6">
                <SingleMarkMap
                  markerTitle="Job position"
                  coords={coords.value}
                  changeCoords={coords.change}
                  error={coords.error}
                />
              </div>

              <div className="col-12 col-md-6 job-edit-inputs">
                <Input
                  type="text"
                  label="Job title"
                  placeholder="title"
                  value={title.value}
                  onChange={(e) => title.change(e.target.value)}
                  error={title.error}
                />

                <Input
                  type="number"
                  label="Job price"
                  placeholder="12.00"
                  value={price.value}
                  onChange={(e) => price.change(e.target.value)}
                  error={price.error}
                />

                <Input
                  type="text"
                  label="Job address"
                  placeholder="London Backer street"
                  value={address.value}
                  onChange={(e) => address.change(e.target.value)}
                  error={address.error}
                />

                <Textarea
                  title="Job description"
                  value={description.value}
                  placeholder="Description..."
                  onChange={(e) => description.change(e.target.value)}
                  error={description.error}
                />
              </div>
            </div>

            <hr />
            <div className="d-flex align-items-center">
              <div className="dropdown ms-auto">
                <button className="btn btn-primary" onClick={saveJob}>
                  {hasId ? "Save" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminJobEditForm;
