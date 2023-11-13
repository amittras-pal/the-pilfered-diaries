import React, { ForwardedRef, forwardRef } from "react";

type TextareaProps = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;

interface Props extends TextareaProps {
  label?: string;
  error?: string;
  help?: string;
}

// Error States
function TextArea(
  { label, error, help, className, ...rest }: Props,
  ref: ForwardedRef<HTMLTextAreaElement>
) {
  return (
    <div className={`form-control w-full ${className}`}>
      <label className="label">
        <span className="label-text">{label}</span>
        {rest.required && (
          <span className="label-text text-red-400 mr-auto ml-1">*</span>
        )}
      </label>
      <textarea
        {...rest}
        ref={ref}
        className={`textarea textarea-bordered textarea-sm ${
          error ? "textarea-error" : ""
        }`}
      />
      {error && (
        <label className="label">
          <span className="label-text-alt text-red-400">{error}</span>
        </label>
      )}
    </div>
  );
}

export default forwardRef<HTMLTextAreaElement, Props>(TextArea);
