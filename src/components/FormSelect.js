// components/ReactSelectField.jsx

import React from "react";
import { Controller } from "react-hook-form";
import Select from "react-select";

const ReactSelectField = ({
  name,
  label,
  control,
  errors = {},
  options = [],
  required = false,
  placeholder = "Select...",
  className = "mb-3",
  isClearable = true,
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="col-form-label">
          {label}{" "}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `${label || name} is required!` : false,
        }}
        render={({ field }) => (
          <Select
            {...field}
            options={options}
            placeholder={placeholder}
            classNamePrefix="react-select"
            isClearable={isClearable}
            onChange={(selectedOption) =>
              field.onChange(selectedOption ? selectedOption.value : null)
            }
            value={options.find(
              (option) => option.value === field.value
            )}
          />
        )}
      />

      {errors?.[name] && (
        <small className="text-danger">{errors[name]?.message}</small>
      )}
    </div>
  );
};

export default ReactSelectField;
