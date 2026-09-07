"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Briefcase, Information, Loader } from "reicon-react";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

export default function CandidateDashboardPage() {
  const [user, setUser] = useState<{ email: string; name?: string } | null>(
    null,
  );
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((authData) => {
        if (authData.authenticated && authData.user) {
          setUser(authData.user);
          fetch("/api/applications")
            .then((res) => res.json())
            .then((appData) => {
              if (appData.success && appData.data)
                setApplications(appData.data);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans selection:bg-muted selection:text-foreground">
      <Header backHref="/" backLabel="মূল পাতায় ফিরুন" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 md:py-14">
        <div className="mb-6 sm:mb-8 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span>ড্যাশবোর্ড</span>
            <span>/</span>
            <span className="text-foreground">আমার আবেদনসমূহ</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            আবেদনের বর্তমান স্থিতি
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            প্রহর-এ আপনার জমা দেওয়া আবেদনসমূহের হালনাগাদ অগ্রগতি দেখুন।
          </p>
        </div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader size={24} className="animate-spin text-muted-foreground" />
            <p className="text-xs text-muted-foreground">তথ্য লোড হচ্ছে...</p>
          </div>
        ) : !user ? (
          <Card className="border border-border bg-card p-6 sm:p-10 text-center">
            <div className="mx-auto flex max-w-md flex-col items-center gap-4">
              <div className="rounded-full bg-muted/60 p-3">
                <Information size={24} className="text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-medium text-foreground">
                  লগইন আবশ্যক
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  আপনার আবেদনের স্থিতি দেখতে অনুগ্রহ করে সাইন ইন করুন।
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
        ) : applications.length === 0 ? (
          <Card className="border border-border bg-card p-6 sm:p-10 text-center">
            <div className="mx-auto flex max-w-md flex-col items-center gap-4">
              <div className="rounded-full bg-muted/60 p-3">
                <Briefcase size={24} className="text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-medium text-foreground">
                  এখনও কোনো আবেদন জমা দেওয়া হয়নি
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  আমাদের উন্মুক্ত পদগুলো দেখুন এবং আপনার পছন্দের পদে আবেদন করুন।
                </p>
              </div>
              <Button
                className="rounded-full px-6 text-xs mt-2 w-full sm:w-auto"
                render={<Link href="/#positions" />}
              >
                পদসমূহ দেখুন
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {applications.map((app) => {
                const statusInformation = STATUS_MAP[
                  app.status || "pending"
                ] ?? {
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
                  <Card
                    key={app.id}
                    className="border border-border bg-card p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium text-sm text-foreground">
                          {app.jobTitle}
                        </h3>
                        <span className="text-2xs text-muted-foreground font-mono">
                          ID: {app.jobId}
                        </span>
                      </div>
                      <Badge variant={statusInformation.variant}>
                        {statusInformation.label}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs border-t border-border/60 pt-2 text-muted-foreground">
                      <div>
                        <span className="text-2xs text-muted-foreground/80 block">
                          তারিখ:
                        </span>
                        <span>{createdDate}</span>
                      </div>
                      <div>
                        <span className="text-2xs text-muted-foreground/80 block">
                          পদ্ধতি:
                        </span>
                        <span>
                          {app.workHybrid === "yes" ? "হাইব্রিড" : "অন-সাইট"}
                        </span>
                      </div>
                    </div>
                    {app.reviewNote && (
                      <div className="rounded-md bg-muted/40 p-2.5 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground block text-2xs mb-0.5">
                          মতামত:
                        </span>
                        {app.reviewNote}
                      </div>
                    )}
                    <div className="pt-1 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 rounded-full"
                        render={
                          <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          />
                        }
                      >
                        রেজুমে PDF দেখুন
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
            <Card className="hidden md:block border border-border bg-card shadow-sm overflow-hidden">
              <CardHeader className="border-b border-border bg-muted/20 py-4 px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">
                      জমা দেওয়া আবেদনের তালিকা
                    </CardTitle>
                    <CardDescription className="text-xs">
                      মোট {applications.length}টি আবেদন পাওয়া গেছে
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs"
                    render={<Link href="/#positions" />}
                  >
                    নতুন পদসমূহ দেখুন
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[30%]">পদের নাম</TableHead>
                      <TableHead>আবেদনের তারিখ</TableHead>
                      <TableHead>কাজের ধরন</TableHead>
                      <TableHead>বর্তমান স্থিতি</TableHead>
                      <TableHead>রেজুমে</TableHead>
                      <TableHead className="text-right">মন্তব্য</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app) => {
                      const statusInformation = STATUS_MAP[
                        app.status || "pending"
                      ] ?? { label: "জমা হয়েছে", variant: "secondary" as const };
                      const createdDate = app.createdAt
                        ? new Date(app.createdAt).toLocaleDateString("bn-BD", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "—";
                      return (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium text-foreground">
                            <div>
                              <span>{app.jobTitle}</span>
                              <span className="block text-2xs text-muted-foreground font-mono">
                                ID: {app.jobId}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {createdDate}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {app.workHybrid === "yes"
                              ? "হাইব্রিড (৩ দিন)"
                              : "অন-সাইট"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusInformation.variant}>
                              {statusInformation.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <a
                              href={app.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary underline underline-offset-4 hover:opacity-80"
                            >
                              PDF দেখুন
                            </a>
                          </TableCell>
                          <TableCell className="text-right text-xs text-muted-foreground max-w-[200px] truncate">
                            {app.reviewNote || "কোনো মন্তব্য নেই"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
