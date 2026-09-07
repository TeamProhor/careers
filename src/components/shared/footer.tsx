import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-xs text-muted-foreground sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <Image
            src="/prohor.png"
            alt="Prohor"
            width={72}
            height={24}
            className="h-4.5 w-auto object-contain"
          />
          <span>© {new Date().getFullYear()} সর্বস্বত্ব সংরক্ষিত।</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            ক্যারিয়ার
          </Link>
          <Link
            href="/privacy"
            className="hover:text-foreground transition-colors"
          >
            গোপনীয়তা নীতি
          </Link>
          <Link
            href="/terms"
            className="hover:text-foreground transition-colors"
          >
            ব্যবহারের শর্তাবলী
          </Link>
        </div>
      </div>
    </footer>
  );
}
