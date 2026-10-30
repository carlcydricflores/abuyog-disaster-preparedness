export default function Logo({ size = 40, showText = true }: { size?: number; showText?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <img
        src="/images/logo.png"
        alt="Abuyog Disaster Preparedness System logo"
        width={size}
        height={size}
        style={{ width: size, height: size, filter: 'hue-rotate(180deg) saturate(1.1)' }}
        className="shrink-0 rounded-full object-contain"
      />
      {showText && <span className="text-base font-black leading-tight text-brand md:text-lg">Abuyog</span>}
    </span>
  );
}