import React from "react";
import { ImageInput, Input, Navbar, PasswordInput, SingleMarkMap } from "../components";
import { useChangePassword, useProfileEdit } from "../hooks";

const ProfileEdit = () => {
  const {
    coords,
    address,
    email,
    nick,
    profileImg,
    validateProfileEdit
  } = useProfileEdit();

  const {
    password,
    repeatedPassword,
    validateChangePassword
  } = useChangePassword();

  const saveProfile = () => {
    const res = validateProfileEdit();
    if (res) alert("done 1");
  };

  const savePassword = () => {
    const res = validateChangePassword();
    if (res) alert("done 2");
  };

  return (
    <div className="page-wrapper profile-edit-page">
      <Navbar />
      <div className="page-content">
        <div className="card">
          <div className="card-body">
            <h6 className="text-uppercase">Profile Info</h6>
            <hr />

            <div className="row">
              <div className="profile-edit-map col-12 col-md-6">
                <SingleMarkMap
                  markerTitle="Your position"
                  changeCoords={coords.change}
                  coords={coords.value}
                />
              </div>

              <div className="profile-edit-inputs col-12 col-md-6">
                <Input
                  type="text"
                  label="Nickname"
                  value={nick.value}
                  error={nick.error}
                  placeholder="Nickname"
                  onChange={e => nick.change(e.target.value)}
                />
                <Input
                  type="text"
                  label="Email"
                  value={email.value}
                  error={email.error}
                  placeholder="email@gmail.com"
                  onChange={e => email.change(e.target.value)}
                />
                <Input
                  type="text"
                  label="Address"
                  placeholder="London Backer street"
                  value={address.value}
                  error={address.error}
                  onChange={e => address.change(e.target.value)}
                />

                <ImageInput
                  btnText="Change avatar"
                  onChange={img => profileImg.change(img)}
                  error={profileImg.error}
                />
              </div>
            </div>
            <hr />
            <div className="d-flex align-items-center">
              <div className="dropdown ms-auto">
                <button className="btn btn-primary" onClick={saveProfile}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h6 className="text-uppercase">Secure</h6>
            <hr />

            <div className="row secure-edit-inputs">
              <PasswordInput
                value={password.value}
                error={password.error}
                onChange={e => password.change(e.target.value)}
              />

              <PasswordInput
                label="Repeated password"
                value={repeatedPassword.value}
                error={repeatedPassword.error}
                onChange={e => repeatedPassword.change(e.target.value)}
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
      </div>
    </div>
  );
};

export default ProfileEdit;
