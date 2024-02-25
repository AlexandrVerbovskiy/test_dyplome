import React, { useState, useEffect } from "react";
import { generateFullUserImgPath } from "../utils";
import config from "../config";

const GroupUserSearchListElem = ({
  role = null,
  email,
  nick,
  avatar,
  id,
  selected,
  onChange,
  currentUserRole = null,
  onChangeRole = null,
}) => {
  const [roles, setRoles] = useState(config.CHAT_OWNER_ROLES_SELECT);

  useEffect(() => {
    if (currentUserRole == "admin") {
      setRoles(config.CHAT_ADMIN_ROLES_SELECT);
    } else {
      setRoles(config.CHAT_OWNER_ROLES_SELECT);
    }
  }, [currentUserRole]);

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
