/**
 * Brand logo from /public/images/logo.png.
 * The image sits in a fixed square box with object-contain, so any image size or shape is scaled
 * to fit and can never stretch the navbar or push other content around.
 */
export default function Logo({ size = 40, showText = true }: { size?: number; showText?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg
        role="img"
        aria-label="GitHub logo"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className="shrink-0 text-neutral-900 dark:text-white"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 .297a12 12 0 0 0-3.793 23.4c.6.111.82-.261.82-.577v-2.234c-3.338.726-4.043-1.416-4.043-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.604-2.665-.3-5.466-1.334-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.5 11.5 0 0 1 6.008 0c2.292-1.552 3.298-1.23 3.298-1.23.655 1.652.243 2.873.12 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.805 5.628-5.475 5.921.43.372.814 1.102.814 2.222v3.293c0 .319.216.694.825.576A12.001 12.001 0 0 0 12 .297" />
      </svg>
      {showText && (
        <span className="text-base font-black leading-tight tracking-tight text-amber-500 md:text-lg">
         
        </span>
      )}
    </span>
  );
}