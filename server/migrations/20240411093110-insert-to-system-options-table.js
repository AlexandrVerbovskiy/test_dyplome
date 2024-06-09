"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = async function (db) {
  const data = [
    { name: "fee_type", value: "fixed" },
    { name: "fixed_fee", value: "40" },
    { name: "percent_fee", value: "10" },
  ];

  for (const row of data) {
    await db.insert("system_options", row);
  }
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  version: 1,
};
