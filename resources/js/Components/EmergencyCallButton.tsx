import { Link } from '@inertiajs/react';
import { btn } from '@/Components/ui';

/** Always-visible shortcut: calls 911 in one tap, with a link to the full hotline list. Hidden when printing. */
export default function EmergencyCallButton() {
  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2 print:hidden">
      <Link href={route('hotlines')} className="rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur hover:bg-black/75 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus">
        All hotlines
      </Link>
      <a href="tel:911" aria-label="Call 911, the national emergency hotline" className={`${btn} px-5 py-3 text-base shadow-lg`}>
        Call 911
      </a>
    </div>
  );
}