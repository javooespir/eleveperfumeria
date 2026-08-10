import Link from "next/link";
import Image from "next/image";

export function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <Link href="/" aria-label="ÉLEVÉ — inicio" className="shrink-0">
      <Image
        src="/images/logo-crop.png"
        alt="ÉLEVÉ"
        width={673}
        height={291}
        priority
        className={className}
      />
    </Link>
  );
}
