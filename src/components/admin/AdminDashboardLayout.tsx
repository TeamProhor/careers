"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Briefcase, CheckCircle, Sparkles } from "reicon-react";
import { AppLayout, type NavItem } from "@/components/ui/app-layout";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

export function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{
    email: string;
    name?: string;
    isAdmin?: boolean;
  } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } catch {}
  };

  const navItems: NavItem[] = [
    { title: "আবেদনসমূহ", url: "/admin", icon: Briefcase },
    { title: "ক্যারিয়ার সুযোগ", url: "/admin/jobs", icon: Sparkles },
    { title: "ওয়েবসাইট ভিউ", url: "/", icon: CheckCircle },
  ];

  return (
    <AppLayout
      brandTitle="প্রহর অ্যাডমিন"
      brandLogo={
        <Image
          src="/prohor.png"
          alt="Prohor"
          width={80}
          height={28}
          className="h-5 w-auto object-contain"
        />
      }
      brandHref="/admin"
      navItems={navItems}
      currentPath={pathname}
      user={
        user
          ? {
              name: user.name || user.email.split("@")[0],
              email: user.email,
              roleBadge: user.isAdmin ? "অ্যাডমিন" : undefined,
            }
          : null
      }
      onLogout={handleLogout}
      renderLink={({ href, className, children, onClick }) => (
        <Link href={href} className={className} onClick={onClick}>
          {children}
        </Link>
      )}
    >
      {children}
    </AppLayout>
  );
}
