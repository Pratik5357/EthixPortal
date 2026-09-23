export default function Footer() {
  return (
    <footer className="mt-8 border-t border-border/60 px-5 py-5 sm:px-6 md:px-8 lg:px-10">
      <div className="content-shell flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} EthixPortal. Institutional use only.</p>
        <p className="uppercase tracking-[0.1em]">IEC workflow · audit trail enabled</p>
      </div>
    </footer>
  );
}
