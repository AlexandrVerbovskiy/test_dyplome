import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { MainContext } from "../contexts";
import { MapMarker, Map, JobProposalForm, Navbar, ViewInput, PopupWrapper } from "../components";
import { getJobInfo } from "../requests";
import { usePopupController } from "../hooks";

const JobView = () => {
    let { id } = useParams();
    const [job, setJob] = useState(null);

    useEffect(() => {
        getJobInfo(id, (res) => setJob(res), err => console.log(err));
    }, [id]);

    const { setSuccess, setError } = useContext(MainContext);
    const { jobProposalForm } = usePopupController({ onSuccess: setSuccess, onError: setError });

    if (!job) return;

    return (
        <div className="page-wrapper job-view-page">
            <Navbar />
            <div className="page-content">
                <div className="card">
                    <div className="card-body">
                        <h6 className="text-uppercase">Job Info</h6>
                        <hr />

                        <div className="row">
                            <div className="job-edit-map col-12 col-md-6">
                                <Map>
                                    <MapMarker title={job.title} lat={job.lat} lng={job.lng} />
                                </Map>
                            </div>

                            <div className="col-12 col-md-6 job-edit-inputs">
                                <ViewInput
                                    label="Job title"
                                    value={job.title}
                                />

                                <ViewInput
                                    label="Job price"
                                    value={job.price}
                                />

                                <ViewInput
                                    label="Job address"
                                    value={job.address}
                                />

                                <ViewInput
                                    label="Job description"
                                    className="view-job-description"
                                    value={job.description}
                                />
                            </div>
                        </div>

                        <hr />

                        <div className="d-flex align-items-center">
                            <div className="dropdown ms-auto">
                                <a href={"/chat/personal/" + job.author_id} className="btn btn-primary">
                                    Write to author
                                </a>

                                <button className="btn btn-success" onClick={() => jobProposalForm.setJobId(id)}>
                                    Send proposal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PopupWrapper onClose={jobProposalForm.hide} activeTrigger={jobProposalForm.active} title="Send proposal" id="send_proposal">
                <JobProposalForm send={jobProposalForm.sendProposal}
                    price={jobProposalForm.price}
                    time={jobProposalForm.time}
                    setTime={jobProposalForm.setTime}
                    setPrice={jobProposalForm.setPrice} />
            </PopupWrapper>
        </div>
    );
};

export default JobView;
