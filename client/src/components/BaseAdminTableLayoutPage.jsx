import React, { useState } from "react";
import { Layout } from "../components";
import Pagination from "./Pagination";

const BaseAdminTableLayoutPage = ({
  headers,
  title,
  order = null,
  orderType = "desc",
  changeOrder = () => {},
  RowElem,
  items,
  DopFilterElem = null,
  paginationInfo,
}) => {
  return (
    <Layout pageClassName="default-table-page">
      <div className="page-content">
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <h6 className="text-uppercase">{title}</h6>
              {DopFilterElem && <DopFilterElem />}
            </div>
            <hr />
            <div className="row">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="table">
                    <tr>
                      {headers.map((header) => (
                        <th
                          key={header.value}
                          className={`${
                            order && header.value == order
                              ? orderType == "asc"
                                ? "bx bx-up-arrow-alt"
                                : "bx bx-down-arrow-alt"
                              : ""
                          } ${header.canChange ? "cursor-pointer" : ""}`}
                          onClick={
                            header.canChange
                              ? () => changeOrder(header.value)
                              : null
                          }
                          style={header.width ? { width: header.width } : {}}
                        >
                          {header.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <RowElem key={item.id} {...item} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {items.length > 0 ? (
              <Pagination
                page={paginationInfo.page}
                countPages={paginationInfo.countPages}
                move={paginationInfo.moveToPage}
                canNext={paginationInfo.canMoveNextPage}
                canPrev={paginationInfo.canMovePrevPage}
              />
            ) : (
              <div className="empty-table">There are no entries yet</div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BaseAdminTableLayoutPage;
