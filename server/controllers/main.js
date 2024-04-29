const Controller = require("./controller");

class Main extends Controller {
  getFeeInfo = (req, res) =>
    this.errorWrapper(res, async () => {
      const options = await this.systemOptionModel.getFeeInfo();
      this.sendResponseSuccess(res, "Fee info got success", options);
    });

  setFeeInfo = (req, res) =>
    this.errorWrapper(res, async () => {
      const { type, fixedValue, percentValue } = req.body;
      const options = await this.systemOptionModel.setFeeInfo({
        type,
        fixedValue,
        percentValue,
      });
      this.sendResponseSuccess(res, "Fee updated success", options);
    });

  getGroupedUsersInfo = (req, res) =>
    this.errorWrapper(res, async () => {
      const type = req.body.type;
      const params = req.body.params ?? {};
      const newUsers = await this.userModel.groupedCountNewUsersByDuration(
        type,
        params
      );
      const visitedUsers =
        await this.userModel.groupedCountVisitedUsersByDuration(type, params);
      this.sendResponseSuccess(res, "Got data successfully", {
        newUsers,
        visitedUsers,
      });
    });

  getGroupedNewUsersInfo = (req, res) =>
    this.errorWrapper(res, async () => {
      const type = req.body.type;
      const params = req.body.params ?? {};
      const newUsers = await this.userModel.groupedCountNewUsersByDuration(
        type,
        params
      );
      this.sendResponseSuccess(res, "Got data successfully", {
        newUsers,
      });
    });

  getGroupedVisitedUsersInfo = (req, res) =>
    this.errorWrapper(res, async () => {
      const type = req.body.type;
      const params = req.body.params ?? {};
      const visitedUsers =
        await this.userModel.groupedCountVisitedUsersByDuration(type, params);
      this.sendResponseSuccess(res, "Got data successfully", {
        visitedUsers,
      });
    });

  getGroupedDisputesInfo = (req, res) =>
    this.errorWrapper(res, async () => {
      const type = req.body.type;
      const params = req.body.params ?? {};
      const newDisputes =
        await this.disputeModel.groupedCountNewDisputesByDuration(type, params);
      const finishedDisputes =
        await this.disputeModel.groupedCountFinishedDisputesByDuration(
          type,
          params
        );
      this.sendResponseSuccess(res, "Got data successfully", {
        newDisputes,
        finishedDisputes,
      });
    });

  getGroupedJobRequestsInfo = (req, res) =>
    this.errorWrapper(res, async () => {
      const type = req.body.type;
      const params = req.body.params ?? {};

      const newProposals =
        await this.jobProposalModel.groupedCountNewProposalsByDuration(
          type,
          params
        );
      const finishedProposals =
        await this.jobProposalModel.groupedCountFinishedProposalsByDuration(
          type,
          params
        );
      const cancelledProposals =
        await this.jobProposalModel.groupedCountCancelledProposalsByDuration(
          type,
          params
        );
      const rejectedProposals =
        await this.jobProposalModel.groupedCountRejectedProposalsByDuration(
          type,
          params
        );

      this.sendResponseSuccess(res, "Got data successfully", {
        newProposals,
        finishedProposals,
        cancelledProposals,
        rejectedProposals,
      });
    });
}

module.exports = Main;
