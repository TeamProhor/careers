"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  CheckCircle,
  Edit,
  Loader,
  Search,
} from "reicon-react";
import { ApplicationReviewDialog } from "@/components/admin/ApplicationReviewDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ListCard } from "@/components/ui/list-card";
import type { ApplicationItem } from "@/types";

const STATUS_MAP: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  pending: { label: "জমা হয়েছে", variant: "secondary" },
  reviewing: { label: "পর্যালোচনাধীন", variant: "outline" },
  shortlisted: { label: "শর্টলিস্টেড", variant: "default" },
  accepted: { label: "গৃহীত", variant: "default" },
  rejected: { label: "অননুমোদিত", variant: "destructive" },
};

export default function AdminApplicationsPage() {
  const [user, setUser] = useState<{
    email: string;
    name?: string;
    isAdmin?: boolean;
  } | null>(null);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);

  const loadApplications = useCallback(() => {
    fetch("/api/applications?admin=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) setApplications(data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((authData) => {
        if (authData.authenticated && authData.user) {
          setUser(authData.user);
          if (authData.user.isAdmin) loadApplications();
          else setLoading(false);
        } else setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [loadApplications]);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesStatus =
        filterStatus === "all" || (app.status || "pending") === filterStatus;
      const q = searchQuery.toLowerCase();
      const appName =
        app.name || `${app.firstName ?? ""} ${app.lastName ?? ""}`.trim();
      const matchesSearch =
        !q ||
        app.jobTitle.toLowerCase().includes(q) ||
        appName.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q) ||
        app.phone?.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [applications, filterStatus, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            আবেদনকারীদের পোর্টাল
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            সকল পদের জন্য প্রাপ্ত আবেদন পর্যালোচনা করুন এবং স্ট্যাটাস নির্ধারণ করুন।
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-xs"
            render={<Link href="/admin/jobs" />}
          >
            ক্যারিয়ার পদ ব্যবস্থাপনা
          </Button>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <CheckCircle size={14} />
            অ্যাডমিন মোড
          </span>
        </div>
      </div>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader size={24} className="animate-spin text-muted-foreground" />
          <p className="text-xs text-muted-foreground">তথ্য লোড হচ্ছে...</p>
        </div>
      ) : !user?.isAdmin ? (
        <Card className="border border-border bg-card p-6 sm:p-10 text-center">
          <div className="mx-auto flex max-w-md flex-col items-center gap-4">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertTriangle size={24} className="text-destructive" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-medium text-foreground">
                অ্যাক্সেস অস্বীকৃত
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                এই পাতাটি শুধুমাত্র প্রহর অ্যাডমিনিস্ট্রেটরদের জন্য সংরক্ষিত।
              </p>
            </div>
            <Button
              className="rounded-full px-6 text-xs mt-2 w-full sm:w-auto"
              render={<Link href="/login" />}
            >
              লগইন করুন
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
            {[
              {
                label: "মোট আবেদন",
                value: applications.length,
                highlight: false,
              },
              {
                label: "পর্যালোচনাধীন",
                value: applications.filter(
                  (a) => a.status === "reviewing" || a.status === "pending",
                ).length,
                highlight: false,
              },
              {
                label: "শর্টলিস্টেড",
                value: applications.filter((a) => a.status === "shortlisted")
                  .length,
                highlight: true,
              },
              {
                label: "গৃহীত",
                value: applications.filter((a) => a.status === "accepted")
                  .length,
                highlight: false,
              },
            ].map((stat) => (
              <Card
                key={stat.label}
                className="border border-border bg-card p-3.5 sm:p-4"
              >
                <span className="text-2xs sm:text-xs text-muted-foreground">
                  {stat.label}
                </span>
                <p
                  className={`text-xl sm:text-2xl font-semibold mt-0.5 sm:mt-1 ${stat.highlight ? "text-primary" : "text-foreground"}`}
                >
                  {stat.value}
                </p>
              </Card>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="নাম, ইমেইল বা পদের নাম খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>
            <div className="flex overflow-x-auto pb-1 sm:pb-0 gap-1.5 scrollbar-none">
              {[
                { label: "সকল", value: "all" },
                { label: "জমা হয়েছে", value: "pending" },
                { label: "পর্যালোচনাধীন", value: "reviewing" },
                { label: "শর্টলিস্টেড", value: "shortlisted" },
                { label: "গৃহীত", value: "accepted" },
                { label: "অননুমোদিত", value: "rejected" },
              ].map((item) => (
                <Button
                  key={item.value}
                  size="sm"
                  variant={filterStatus === item.value ? "default" : "outline"}
                  className="text-xs rounded-full h-8 px-3 shrink-0"
                  onClick={() => setFilterStatus(item.value)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
          {filteredApplications.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground rounded-xl border border-border bg-card">
              কোনো আবেদন পাওয়া যায়নি।
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredApplications.map((app) => {
                const statusInfo = STATUS_MAP[app.status || "pending"] ?? {
                  label: "জমা হয়েছে",
                  variant: "secondary" as const,
                };
                const createdDate = app.createdAt
                  ? new Date(app.createdAt).toLocaleDateString("bn-BD", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "—";
                return (
                  <ListCard
                    key={app.id}
                    id={app.id}
                    title={
                      app.name ||
                      `${app.firstName ?? ""} ${app.lastName ?? ""}`.trim()
                    }
                    badges={[
                      { label: statusInfo.label, variant: statusInfo.variant },
                    ]}
                    subtitle={app.jobTitle}
                    metaItems={[
                      { label: "ইমেইল:", value: app.email },
                      ...(app.phone
                        ? [{ label: "ফোন:", value: app.phone }]
                        : []),
                      { label: "তারিখ:", value: createdDate },
                      {
                        label: "কাজের লিংক:",
                        value: `${app.workLinks?.length ?? 0}টি`,
                      },
                    ]}
                    actions={[
                      {
                        id: "resume",
                        label: "রেজুমে PDF",
                        icon: <ArrowDown size={13} />,
                        variant: "outline",
                        href: (() => {
                          const match = app.resumeUrl.match(
                            /\/prohor-careers\/(resumes\/.+)$/,
                          );
                          return match?.[1]
                            ? `/api/resume?key=${encodeURIComponent(String(match[1]))}`
                            : app.resumeUrl;
                        })(),
                        target: "_blank",
                      },
                      {
                        id: "review",
                        label: "রিভিউ ও আপডেট",
                        icon: <Edit size={13} />,
                        variant: "default",
                        onClick: () => setSelectedApp(app),
                      },
                    ]}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
      <ApplicationReviewDialog
        application={selectedApp}
        open={!!selectedApp}
        onOpenChange={(open) => {
          if (!open) setSelectedApp(null);
        }}
        onSuccess={(updatedApp) => {
          setApplications((prev) =>
            prev.map((a) => (a.id === updatedApp.id ? updatedApp : a)),
          );
          setSelectedApp(null);
        }}
      />
    </div>
  );
}
