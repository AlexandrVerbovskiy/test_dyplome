import { useState } from "react";
import { sendJobProposal } from "../requests";

const usePopupController = ({ onSuccess, onError }) => {
    const [jobProposalForm, setJobProposalForm] = useState({
        jobId: null,
        active: false,
        price: 0,
        time: 0
    });

    const jobProposalFormActivate = () => setJobProposalForm(prev => ({ ...prev, active: true }));
    const jobProposalFormHide = () => setJobProposalForm(prev => ({ jobId: null, price: 0, time: 0, active: false }));
    const jobProposalSetJobId = (jobId) => setJobProposalForm(prev => ({ ...prev, jobId, active: true }));
    const jobProposalSetPrice = (price) => setJobProposalForm(prev => ({ ...prev, price, active: true }));
    const jobProposalSetTime = (time) => setJobProposalForm(prev => ({ ...prev, time, active: true }));

    const sendJobProposalForm = () => {
        sendJobProposal({
            jobId: jobProposalForm.jobId,
            price: jobProposalForm.price,
            time: jobProposalForm.time
        }, () => {
            jobProposalFormHide();
            onSuccess("Proposal sended success!");
        }, (err) => {
            jobProposalFormHide();
            onError(err);
        });
    }

    return {
        jobProposalForm: {
            active: jobProposalForm.active,
            activate: jobProposalFormActivate,
            hide: jobProposalFormHide,
            data: jobProposalForm,
            setJobId: jobProposalSetJobId,
            setPrice: jobProposalSetPrice,
            setTime: jobProposalSetTime,
            sendProposal: sendJobProposalForm
        }
    }
}

export default usePopupController;