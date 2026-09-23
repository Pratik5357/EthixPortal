export default function PageHeader({ title, description, actions }) {
  return (
    <header
      className="flex flex-col gap-5 border-b border-border/70 pb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:pb-7"
    >
      <div className="max-w-2xl">
        <h1>{title}</h1>
        {description && (
          <p className="mt-2.5 max-w-prose text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      )}
    </header>
  );
}
