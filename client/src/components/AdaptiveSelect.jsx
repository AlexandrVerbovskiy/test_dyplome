import Select from "react-select";

const AdaptiveSelect = (props) => {
  let className = props.className ?? "";
  className += " custom-search-select";
  const parentClass = "col-" + (props.columnCounts ?? "12");

  return (
    <div className={parentClass}>
      {props.label && (
        <label htmlFor={props.id} className="form-label">
          {props.label}
        </label>
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
