import Select from "react-select";

const AdaptiveSelect = (props) => {
  let className = props.className ?? "";
  className += " custom-search-select";
  const parentClass =
    props.columnCounts === 0 ? "" : "col-" + (props.columnCounts ?? "12");

  return (
    <div className={parentClass}>
      {props.label && (
        <>
          <label
            htmlFor={props.id}
            className="form-label"
            style={
              props.absoluteLabel
                ? {
                    position: "absolute",
                    zIndex: 9,
                    transform: "translate(6px, -7px)",
                    padding: "0px 5px",
                    background: "white",
                  }
                : null
            }
          >
            {props.label}
          </label>
          <div
            style={{
              opacity: "0",
              transform: "translate(6px, 0)",
              height: "0",
              overflow: "hidden",
              padding: "0px 41px 0 5px",
            }}
          >
            {props.label}
          </div>
        </>
      )}
      <div className="input-group">
        <Select
          {...props}
          id={props.id}
          className={className}
          options={props.options}
          value={props.options.find((option) => option.value === props.value)}
          onChange={props.onChange}
          isSearchable={props.isSearchable ?? false}
          style={props.style ?? {}}
          name={props.name}
        />
      </div>

      {props.errorHidden !== true && (
        <div id="error-message" className="text-danger empty">
          {props.error ?? ""}
        </div>
      )}
    </div>
  );
};

export default AdaptiveSelect;
