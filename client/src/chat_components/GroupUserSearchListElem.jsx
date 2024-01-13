import React from "react";
import { generateFullUserImgPath } from "../utils";
import config from "../config";

const roles = config.CHAT_ADMIN_ROLES_SELECT;

const GroupUserSearchListElem = ({
  role = null,
  email,
  nick,
  avatar,
  id,
  selected,
  onChange,
  onChangeRole = null,
}) => {
  return (
    <div className="user-to-group-row">
      <div className="user-info-section d-flex">
        <img
          src={generateFullUserImgPath(avatar)}
          width="48"
          height="48"
          className="rounded-circle cursor-pointer"
          alt={id}
          title={id}
          onClick={onChange}
        />

        <div className="user-to-group-row-info">
          <div
            className="user-to-group-row-email cursor-pointer"
            onClick={onChange}
          >
            {nick ?? email}
          </div>
          {role && (
            <div className="user-to-group-role">
              <select
                className="form-select form-select cursor-pointer"
                value={role}
                onChange={(e) => onChangeRole(e.target.value)}
              >
                {roles.map((role, i) => (
                  <option key={role.value} value={role.value}>
                    {role.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
      <div
        className="user-to-group-row-checkbox cursor-pointer"
        onClick={onChange}
      >
        <input type="checkbox" checked={selected} readOnly />
      </div>
    </div>
  );
};

export default GroupUserSearchListElem;
