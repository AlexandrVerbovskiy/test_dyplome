import { Textarea, Input, Navbar, SingleMarkMap } from "../components";
import { useJobEdit } from "../hooks";

const JobEdit = () => {
  const {
    coords,
    address,
    title,
    price,
    description,
    validateJobEdit
  } = useJobEdit();

  const saveJob = () => {
    const res = validateJobEdit();
    if (res) alert("done 1");
  };

  return (
    <div className="page-wrapper job-edit-page">
      <Navbar />
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
                  onChange={e => title.change(e.target.value)}
                  error={title.error}
                />

                <Input
                  type="number"
                  label="Job price"
                  placeholder="12.00"
                  value={price.value}
                  onChange={e => price.change(e.target.value)}
                  error={price.error}
                />

                <Input
                  type="text"
                  label="Job address"
                  placeholder="London Backer street"
                  value={address.value}
                  onChange={e => address.change(e.target.value)}
                  error={address.error}
                />

                <Textarea
                  title="Job description"
                  value={description.value}
                  placeholder="Description..."
                  onChange={e => description.change(e.target.value)}
                  error={description.error}
                />
              </div>
            </div>

            <hr />
            <div className="d-flex align-items-center">
              <div className="dropdown ms-auto">
                <button className="btn btn-primary" onClick={saveJob}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobEdit;
