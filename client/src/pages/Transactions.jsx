import React, { useState } from "react";
import { Layout } from "../components";

const Transactions = () => {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      money: "123",
      status: "replenished",
      type: "balance_replenished",
      date: "2017-21-02 12:34",
      data: {
        message: "user test",
      },
    },
    {
      id: 2,
      money: "123",
      status: "spent",
      type: "contract end",
      date: "2017-21-02 12:34",
      data: {
        message: "user test 2",
      },
    },
  ]);

  return (
    <Layout pageClassName="default-view-page table-page">
      <div className="page-content">
        <div className="card">
          <div className="card-body">
            <h6 className="text-uppercase">Job Info</h6>
            <hr />

            <div className="row">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="table">
                    <tr>
                      <th>
                        Transaction ID<i class="bx bx-up-arrow-alt"></i>
                      </th>
                      <th>Status</th>
                      <th>Message</th>
                      <th>Money</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => {
                      return (
                        <tr>
                          <td>
                            <b>#{transaction.id}</b>
                          </td>
                          <td>
                            {transaction.status == "replenished" && (
                              <span className="badge bg-gradient-quepal text-white shadow-sm w-100">
                                Replenished
                              </span>
                            )}

                            {transaction.status == "spent" && (
                              <span className="badge bg-gradient-bloody text-white shadow-sm w-100">
                                Spent
                              </span>
                            )}
                          </td>
                          <td>{transaction.data.message}</td>
                          <td>
                            {transaction.status == "replenished" && (
                              <span className="font-weight-bold text-success">
                                +${transaction.money}
                              </span>
                            )}
                            {transaction.status == "spent" && (
                              <span className="font-weight-bold text-danger">
                                -${transaction.money}
                              </span>
                            )}
                          </td>
                          <td>
                            <b>{transaction.date}</b>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Transactions;
