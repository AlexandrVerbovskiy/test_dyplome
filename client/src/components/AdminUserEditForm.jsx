import React, { useContext } from "react";
import {
  Activator,
  ImageInput,
  Input,
  Layout,
  PasswordInput,
  SingleMarkMap,
} from ".";
import { useChangeUserPassword, useAdminUserEdit } from "../hooks";
import { MainContext } from "../contexts";

const AdminUserEditForm = ({ baseData, onSave, hasId }) => {
  const {
    coords,
    address,
    email,
    nick,
    admin,
    authorized,
    profileImg,
    validateProfileEdit,
    activityRadius,
    balance,
  } = useAdminUserEdit({ baseData });

  const main = useContext(MainContext);

  const saveProfile = async () => {
    const resValidation = validateProfileEdit();
    if (!resValidation) return;

    let avatar = null;
    if (profileImg.value) {
      if (typeof profileImg.value == "object") {
        if (profileImg.value && profileImg.value.file) {
          avatar = profileImg.value.file;
        } else {
          avatar = profileImg.value;
        }
      } else if (typeof profileImg.value == "string") {
        avatar = profileImg.value;
      }
    }

    const formData = new FormData();
    formData.append("email", email.value);
    formData.append("nick", nick.value);
    formData.append("avatar", avatar);
    formData.append("address", address.value);
    formData.append("lat", coords.value.lat);
    formData.append("lng", coords.value.lng);
    formData.append("activityRadius", activityRadius.value);
    formData.append("balance", balance.value);

    if (admin.value) {
      formData.append("admin", admin.value);
    }

    if (authorized.value) {
      formData.append("authorized", authorized.value);
    }

    try {
      await onSave(formData);
      main.setSuccess("Saved successfully");
    } catch (e) {
      main.setError(e.message);
    }
  };

  const savePassword = () => {
    const res = validateChangePassword();
    if (res) alert("done 2");
  };

  const { password, repeatedPassword, validateChangePassword } =
    useChangeUserPassword();

  return (
    <Layout pageClassName="profile-edit-page">
      <div className="page-content">
        <div className="card">
          <div className="card-body">
            <h6 className="text-uppercase">User Info</h6>
            <hr />

            <div className="row">
              <div className="profile-edit-inputs col col-md-6">
                <Input
                  type="text"
                  label="Nickname"
                  value={nick.value}
                  error={nick.error}
                  placeholder="Nickname"
                  onChange={(e) => nick.change(e.target.value)}
                />
              </div>

              <div className="profile-edit-inputs col col-md-6">
                <Input
                  type="text"
                  label="Email"
                  value={email.value}
                  error={email.error}
                  placeholder="email@gmail.com"
                  onChange={(e) => email.change(e.target.value)}
                />
              </div>

              <div
                className="profile-edit-map col col-md-12 mt-2"
                style={{ height: "400px" }}
              >
                <SingleMarkMap
                  markerTitle="Your position"
                  changeCoords={coords.change}
                  coords={coords.value}
                  needCircle={true}
                  changeRadius={activityRadius.change}
                  radius={activityRadius.value}
                />
              </div>

              <div className="profile-edit-inputs col col-md-12 mt-2">
                <Input
                  type="text"
                  label="Address"
                  placeholder="London Backer street"
                  value={address.value}
                  error={address.error}
                  onChange={(e) => address.change(e.target.value)}
                />

                <label htmlFor="#userAvatarInput" className="form-label">
                  Avatar
                </label>
                <ImageInput
                  id="userAvatarInput"
                  btnText="Change photo"
                  url={profileImg.value}
                  onChange={(img) => profileImg.change(img)}
                  error={profileImg.error}
                />

                <Input
                  type="text"
                  label="Balance"
                  placeholder="12.23"
                  value={balance.value}
                  error={balance.error}
                  onChange={(e) => balance.change(e.target.value)}
                />

                <Activator
                  value={authorized.value}
                  onChange={authorized.change}
                  label="Profile Authorized"
                />

                <Activator
                  value={admin.value}
                  onChange={admin.change}
                  label="Admin"
                />
              </div>
            </div>

            <hr />

            <div className="d-flex align-items-center">
              <div className="dropdown ms-auto">
                <button className="btn btn-primary" onClick={saveProfile}>
                  {hasId ? "Save" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {hasId && (
          <div className="card">
            <div className="card-body">
              <h6 className="text-uppercase">Secure</h6>
              <hr />

              <div className="row secure-edit-inputs">
                <PasswordInput
                  label="New password"
                  value={password.value}
                  error={password.error}
                  onChange={(e) => password.change(e.target.value)}
                />

                <PasswordInput
                  label="Repeated password"
                  value={repeatedPassword.value}
                  error={repeatedPassword.error}
                  onChange={(e) => repeatedPassword.change(e.target.value)}
                />
              </div>

              <hr />
              <div className="d-flex align-items-center">
                <div className="dropdown ms-auto">
                  <button className="btn btn-primary" onClick={savePassword}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminUserEditForm;
