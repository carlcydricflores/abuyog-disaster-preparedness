/**
 * Brand logo from /public/images/logo.png.
 * The image sits in a fixed square box with object-contain, so any image size or shape is scaled
 * to fit and can never stretch the navbar or push other content around.
 */
export default function Logo({ size = 40, showText = true }: { size?: number; showText?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <img
        src="/images/logo.png"
        alt="Abuyog Disaster Preparedness System logo"
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="shrink-0 object-contain"
      />
      {showText && (
        <span className="text-base font-black leading-tight tracking-tight text-amber-500 md:text-lg">
         
        </span>
      )}
    </span>
  );
}