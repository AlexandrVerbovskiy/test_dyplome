const SignForm = ({
  children,
  title,
  submitText,
  onSubmit,
  relocateLinkInfo
}) => {
  return (
    <div className="wrapper sign-page">
      <div className="d-flex align-items-center justify-content-center my-5 my-lg-0">
        <div className="container">
          <div className="row row-cols-1 row-cols-lg-2 row-cols-xl-2">
            <div className="col mx-auto">
              <div className="my-4 text-center">
                <img src="assets/images/logo-img.png" width="180" alt="" />
              </div>
              <div className="card">
                <div className="card-body">
                  <div className="border p-4 rounded">
                    <div className="text-center mb-8">
                      <h3 className="">
                        {title}
                      </h3>
                      <p>
                        {relocateLinkInfo.question + " "}
                        <a href={relocateLinkInfo.link}>
                          {relocateLinkInfo.title}
                        </a>
                      </p>
                    </div>

                    <div className="form-body">
                      <form className="row g-3" onSubmit={onSubmit}>
                        {children}

                        <div className="col-12">
                          <div className="d-grid">
                            <button type="submit" className="btn btn-primary">
                              <i className="bx bx-user" />
                              {submitText}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignForm;
