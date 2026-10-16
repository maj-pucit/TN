import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import s from "./field.module.css";
import { Text } from "../primitives/Text";
import { Icon } from "../Icon";

/* <Field> — a label (12.5, strong) 8px over its control. */
export function Field({ label, required, help, error, children, group }: {
  label: string; required?: boolean; help?: ReactNode; error?: ReactNode; children: ReactNode;
  /* A field holding several controls (a chip picker, an option list) is a
     plain group, not a <label> — a label forwards a click on its words to
     its first control. */
  group?: boolean;
}) {
  const Tag = group ? "div" : "label";
  return (
    <Tag className={s.f} role={group ? "group" : undefined}>
      <Text role="label" as="span">{label}{required && <span className={s.req}>*</span>}</Text>
      {children}
      {error ? <Text role="caption" as="span" className={s.err}>{error}</Text>
        : help && <Text role="caption" as="span" className={s.help}>{help}</Text>}
    </Tag>
  );
}

export const Input = (p: InputHTMLAttributes<HTMLInputElement>) => <input {...p} className={s.inp} />;
export const TextArea = (p: TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...p} className={s.inp} />;

/* <Form> stacks fields 32 apart; <FormRow> puts two side by side from 600px. */
export const Form = ({ children }: { children: ReactNode }) => <div className={s.form}>{children}</div>;
export const FormRow = ({ children }: { children: ReactNode }) => <div className={s.row2}>{children}</div>;

/* <Search> — the toolbar search, with a clear (X) while it holds text. */
export function Search({ value, onChange, placeholder = "Search" }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className={s.srch}>
      <Icon name="search" />
      <input className={s.inp} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      {value && (
        <button type="button" className={s.srchX} aria-label="Clear search" onClick={() => onChange("")}>
          <Icon name="close" />
        </button>
      )}
    </div>
  );
}

/* <Toolbar> — a list page's toolbar: `search` on the left, `filters` on the right. */
export function Toolbar({ search, filters }: { search?: ReactNode; filters?: ReactNode }) {
  return (
    <div className={s.tools}>
      {search}
      {filters && <div className={s.filters}>{filters}</div>}
    </div>
  );
}
