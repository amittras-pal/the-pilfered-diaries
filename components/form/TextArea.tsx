import React, { ForwardedRef, forwardRef } from "react";

type TextareaProps = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;

interface Props extends TextareaProps {
  label?: string;
  error?: string;
  help?: string;
  resize?: "both" | "horizontal" | "vertical" | "none";
}

function TextArea(
  { label, error, help, className, resize = "none", ...rest }: Props,
  ref: ForwardedRef<HTMLTextAreaElement>
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
      <textarea
        {...rest}
        ref={ref}
        style={{ resize }}
        className={`textarea textarea-bordered textarea-sm ${
          error ? "textarea-error" : ""
        } `}
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

export default forwardRef<HTMLTextAreaElement, Props>(TextArea);
