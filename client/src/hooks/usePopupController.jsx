import React, { useState, useEffect, useContext } from "react";
import { sendJobProposal } from "requests";
import { MainContext } from "contexts";

const usePopupController = ({ onSuccess, onError }) => {
  const main = useContext(MainContext);

  const [jobProposalForm, setJobProposalForm] = useState({
    jobId: null,
    active: false,
    price: 0,
    time: 0,
  });

  const [acceptJobDisputeForm, setAcceptJobDisputeForm] = useState({
    proposalId: null,
    description: "",
    active: false,
  });

  const jobProposalFormActivate = () =>
    setJobProposalForm((prev) => ({ ...prev, active: true }));
  const jobProposalFormHide = () =>
    setJobProposalForm((prev) => ({
      jobId: null,
      price: 0,
      time: 0,
      active: false,
    }));

  const jobProposalSetJobId = (jobId) =>
    setJobProposalForm((prev) => ({ ...prev, jobId, active: true }));
  const jobProposalSetPrice = (price) =>
    setJobProposalForm((prev) => ({ ...prev, price, active: true }));
  const jobProposalSetTime = (time) =>
    setJobProposalForm((prev) => ({ ...prev, time, active: true }));

  const sendJobProposalForm = async () => {
    try {
      await main.request({
        url: sendJobProposal.url(),
        type: sendJobProposal.type,
        data: {
          jobId: jobProposalForm.jobId,
          price: jobProposalForm.price,
          time: jobProposalForm.time,
        },
        convertRes: jobProposalForm.convertRes,
      });

      jobProposalFormHide();
      onSuccess("Proposal sended success!");
    } catch (e) {
      jobProposalFormHide();
    }
  };

  const acceptJobDisputeFormHide = () =>
    setAcceptJobDisputeForm((prev) => ({
      jobId: null,
      active: false,
    }));

  const acceptJobDisputeFormHideSetProposalId = (proposalId) =>
    setAcceptJobDisputeForm((prev) => ({ ...prev, proposalId, active: true }));

  const acceptJobDisputeFormActivate = () =>
    setAcceptJobDisputeForm((prev) => ({ ...prev, active: true }));

  const jobDisputeFormSetDescription = (description) =>
    setAcceptJobDisputeForm((prev) => ({ ...prev, description, active: true }));

  return {
    jobProposalFormState: {
      active: jobProposalForm.active,
      activate: jobProposalFormActivate,
      hide: jobProposalFormHide,
      data: jobProposalForm,
      setJobId: jobProposalSetJobId,
      setPrice: jobProposalSetPrice,
      setTime: jobProposalSetTime,
      sendProposal: sendJobProposalForm,
    },
    acceptJobDisputeForm: {
      active: acceptJobDisputeForm.active,
      data: acceptJobDisputeForm,
      activate: acceptJobDisputeFormActivate,
      hide: acceptJobDisputeFormHide,
      setProposalId: acceptJobDisputeFormHideSetProposalId,
      setDescription: jobDisputeFormSetDescription,
    },
  };
};

export default usePopupController;
