const JobProposalForm = ({ send, price, time, setTime, setPrice }) => {
    const handleInputPrice = (e) => setTime(e.target.value);
    const handleInputTime = (e) => setPrice(e.target.value);

    return <>
        <div className="modal-body row g-3">
            <div className="col-12">
                <label htmlFor="price" className="form-label">Price, $</label>
                <div className="input-group"> <span className="input-group-text bg-transparent text-primary"><i className="bx bx-dollar-circle me-1 font-22"></i></span>
                    <input value={price} onInput={handleInputPrice} type="number" step="0.01" className="form-control border-start-0" id="price" placeholder="Price" />
                </div>
            </div>
            <div className="col-12">
                <label htmlFor="time" className="form-label">Time, h</label>
                <div className="input-group"> <span className="input-group-text bg-transparent text-primary"><i className="bx bx-calendar-check  me-1 font-22"></i></span>
                    <input value={time} onInput={handleInputTime} type="number" step="1" className="form-control border-start-0" id="time" placeholder="Time" />
                </div>
            </div>
        </div>
        <div className="modal-footer">
            <button type="button" className="btn btn-primary px-5" onClick={send}>Send</button>
        </div>
    </>
}

export default JobProposalForm;