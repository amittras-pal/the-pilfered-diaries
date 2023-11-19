import React, { ForwardedRef, forwardRef } from "react";

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

interface Props extends InputProps {
  label?: string;
  error?: string;
  help?: string;
}

function Input(
  { label, error, help, className, ...rest }: Props,
  ref: ForwardedRef<HTMLInputElement>
) {
  return (
    <div className={`form-control w-full font-body ${className}`}>
      {(label || rest.required) && (
        <label className="label">
          <span className="label-text">{label}</span>
          {rest.required && (
            <span className="label-text text-red-400 mr-auto ml-1">*</span>
          )}
        </label>
      )}
      <input
        autoComplete="off"
        {...rest}
        ref={ref}
        className={`input input-bordered input-sm w-full ${
          error ? "input-error" : ""
        }`}
      />
      {help && !error && (
        <label className="label">
          <span className="label-text-alt text-gray-400">{help}</span>
        </label>
      )}
      {error && (
        <label className="label">
          <span className="label-text-alt text-red-400">{error}</span>
        </label>
      )}
    </div>
  );
}

export default forwardRef<HTMLInputElement, Props>(Input);
