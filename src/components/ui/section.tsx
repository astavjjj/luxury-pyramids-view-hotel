import { cn } from "@/lib/utils";

export function Section({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("relative", className)}>
      <div className="mx-auto max-w-6xl px-6">{children}</div>
    </section>
  );
}

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("mx-auto max-w-6xl px-6", className)}>{children}</div>;
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("eyebrow mb-4", className)}>{children}</p>;
}

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = "left",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2
        className={cn(
          "font-display text-4xl md:text-5xl leading-tight text-balance",
          light ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn("mt-4 text-base leading-relaxed", light ? "text-white/70" : "text-muted")}>
          {subtitle}
        </p>
      )}
    </div>
  );
}