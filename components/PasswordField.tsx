"use client";

import { useId, useState } from "react";

type PasswordFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  minLength?: number;
  autoComplete?: string;
  required?: boolean;
  helper?: string;
  className?: string;
  inputClassName?: string;
};

export function PasswordField({
  label,
  value,
  onChange,
  minLength = 1,
  autoComplete = "current-password",
  required = true,
  helper,
  className = "",
  inputClassName = ""
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const id = useId();

  return (
    <label htmlFor={id} className={className}>
      <span>{label}</span>
      <div className="relative mt-2">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete}
          className={`w-full pr-20 ${inputClassName}`}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute inset-y-0 right-2 my-auto h-8 rounded-lg px-3 text-[11px] font-black text-[#667773] transition hover:bg-[#f2efe8] hover:text-[#28463d]"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      {helper ? <span className="mt-2 block text-xs font-semibold leading-5 text-[#4d5d55]">{helper}</span> : null}
    </label>
  );
}
