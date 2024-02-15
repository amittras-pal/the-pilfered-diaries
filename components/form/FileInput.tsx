import { IconExclamationMark } from "@tabler/icons-react";
import React, { useRef } from "react";

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

interface Props extends Omit<InputProps, "type" | "ref"> {
  label: string;
  error?: string;
  help?: string;
  files?: any;
}

// TODO: ForwardRef required.
export default function FileInput({
  label,
  error,
  help,
  files,
  ...rest
}: Props) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div
      onClick={() => ref.current?.click()}
      className={`w-100 rounded-xl flex flex-col justify-center items-center py-4 cursor-pointer border ${
        error ? "border-red-400" : "border-gray-700"
      }`}
    >
      <p className="text-lg text-gray-200">
        {label ?? "Choose File"}{" "}
        {rest.required && <span className="text-red-400"> *</span>}
      </p>
      {help && <p className="text-sm">{help}</p>}
      <input {...rest} type="file" className="hidden" ref={ref} />
      {(files as FileList)?.length > 0 && (
        <p className={`text-sm text-${error ? "red" : "green"}-400`}>
          {(files as FileList)?.[0].name}
        </p>
      )}
      {error && (
        <p className="text-sm mt-3 text-red-400 flex items-center">
          <IconExclamationMark size={18} /> {error}
        </p>
      )}
    </div>
  );
}
