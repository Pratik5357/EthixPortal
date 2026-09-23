import { Label } from "@/components/ui/label";

export function FormFieldLabel({ children, required = false, hint, className = "" }) {
  return (
    <Label className={`form-label ${className}`.trim()}>
      <span>
        {children}
        {required ? <span className="text-destructive"> *</span> : null}
        {!required ? (
          <span className="font-normal text-muted-foreground"> (optional)</span>
        ) : null}
      </span>
      {hint ? (
        <span className="mt-1 block text-xs font-normal leading-relaxed text-muted-foreground">
          {hint}
        </span>
      ) : null}
    </Label>
  );
}
