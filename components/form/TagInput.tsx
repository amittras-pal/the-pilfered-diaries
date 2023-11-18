import { IconX } from "@tabler/icons-react";
import React, { useRef } from "react";

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

interface Props
  extends Omit<InputProps, "type" | "onChange" | "value" | "ref"> {
  label: string;
  error?: string;
  help?: string;
  onChange: (values: string[]) => void;
  value: string[];
}

export default function TagInput({
  label,
  error,
  help,
  onChange,
  value,
  className,
  ...rest
}: Props) {
  const ref = useRef<HTMLInputElement>(null);

  const handleTagAdd: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const text = e.target.value;
    const newTag = text.slice(0, text.length - 1).trim();
    if (text.endsWith(",")) {
      if (!value.includes(newTag)) onChange([...value, newTag]);
      if (ref.current) ref.current.value = "";
    }
  };

  const handleTagRemove = (remove: string) => {
    onChange(value.filter((tag) => tag !== remove));
  };

  return (
    <div className={`font-body ${className}`}>
      {(label || rest.required) && (
        <label className="label">
          <span className="label-text">{label}</span>
          {rest.required && (
            <span className="label-text text-red-400 mr-auto ml-1">*</span>
          )}
        </label>
      )}
      {value.length > 0 && (
        <div className="flex gap-1 mb-2 w-full flex-wrap">
          {value.map((tag) => (
            <div className="badge badge-ghost" key={tag}>
              <span>{tag}</span>
              <span
                className="text-red-500 ml-1 cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={() => handleTagRemove(tag)}
              >
                <IconX size={12} />
              </span>
            </div>
          ))}
        </div>
      )}
      <input
        {...rest}
        ref={ref}
        type="text"
        className={`input input-bordered input-sm w-full ${
          error ? "input-error" : ""
        }`}
        onChange={handleTagAdd}
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
