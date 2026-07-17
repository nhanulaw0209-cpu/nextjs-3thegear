export function BracketHead({ title, subtitle, dark }: { title: string; subtitle?: string; dark?: boolean }) {
  return (
    <div className="text-center mb-14">
      <h2 className={`font-jost text-[1.9rem] font-bold ${dark ? "text-white" : "text-ink"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3.5 text-lg max-w-xl mx-auto leading-relaxed ${dark ? "text-[#b8b8bd]" : "text-text"}`}>{subtitle}</p>
      )}
    </div>
  );
}
