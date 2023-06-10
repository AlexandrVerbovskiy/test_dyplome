import { useState } from "react";
import { ImageInput, Input, Navbar, PasswordInput } from "../components";
import { SingleMarkMap } from "../profile_components";
import {
  fullAddressToString,
  getAddressByCoords,
  getCoordsByAddress
} from "../utils";

const ProfileEdit = () => {
  const [coords, setCoords] = useState(null);
  const [address, setAddress] = useState("");
  const [nick, setNick] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");

  const changeCoords = async coords => {
    setCoords(coords);
    const address = await getAddressByCoords(coords);
    const strAddress = fullAddressToString(address);
    address(strAddress);
  };

  const changeAddress = async address => {
    setAddress(address);
    const res = await getCoordsByAddress(address);
    setCoords(res);
  };

  const changeEmail = email => {
    setEmail(email);
  };

  const changeNick = nick => {
    setNick(nick);
  };

  const changePassword = password => {
    setPassword(password);
  };

  const changeRepeatedPassword = password => {
    setRepeatedPassword(password);
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
                  error={null}
                  changeCoords={changeCoords}
                  coords={coords}
                />
              </div>

              <div className="profile-edit-inputs col-12 col-md-6">
                <Input
                  type="text"
                  label="Nickname"
                  value={nick}
                  placeholder="Nickname"
                  onChange={e => changeNick(e.target.value)}
                />
                <Input
                  type="text"
                  label="Email"
                  value={email}
                  placeholder="email@gmail.com"
                  onChange={e => changeEmail(e.target.value)}
                />
                <Input
                  type="text"
                  label="Address"
                  placeholder="London Backer street"
                  value={address}
                  onChange={e => changeAddress(e.target.value)}
                />

                <ImageInput
                  btnText="Change avatar"
                  onChange={img => console.log(img)}
                  error={null}
                />
              </div>
            </div>
            <hr />
            <div className="d-flex align-items-center">
              <div className="dropdown ms-auto">
                <button className="btn btn-primary">Save</button>
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
                value={password}
                onChange={e => changePassword(e.target.value)}
              />

              <PasswordInput
                label="Repeated password"
                value={repeatedPassword}
                onChange={e => changeRepeatedPassword(e.target.value)}
              />
            </div>
            
            <hr />
            <div className="d-flex align-items-center">
              <div className="dropdown ms-auto">
                <button className="btn btn-primary">Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
