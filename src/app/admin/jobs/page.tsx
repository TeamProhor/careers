"use client";

import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Eye,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { JobDeleteDialog } from "@/components/admin/JobDeleteDialog";
import { JobFormDialog } from "@/components/admin/JobFormDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ListCard } from "@/components/ui/list-card";
import { toast } from "@/components/ui/toast";
import type { JobPosition } from "@/types";

export default function AdminJobsManagementPage() {
  const [user, setUser] = useState<{
    email: string;
    name?: string;
    isAdmin?: boolean;
  } | null>(null);
  const [jobsList, setJobsList] = useState<JobPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosition | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingJob, setDeletingJob] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const loadJobs = useCallback(() => {
    fetch("/api/jobs?all=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) setJobsList(data.data);
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
          if (authData.user.isAdmin) loadJobs();
          else setLoading(false);
        } else setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [loadJobs]);

  const filteredJobs = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return jobsList.filter(
      (j) =>
        !q ||
        j.title.toLowerCase().includes(q) ||
        j.department.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q),
    );
  }, [jobsList, searchQuery]);

  const handleMove = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= jobsList.length) return;
    const updated = [...jobsList];
    const temp = updated[index];
    const target = updated[newIndex];
    if (!temp || !target) return;
    updated[index] = target;
    updated[newIndex] = temp;
    const orders = updated.map((item, idx) => ({
      id: item.id,
      displayOrder: idx,
    }));
    setJobsList(updated.map((item, idx) => ({ ...item, displayOrder: idx })));
    try {
      await fetch("/api/jobs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orders }),
      });
      toast.add({ title: "পদের প্রদর্শনী ক্রম হালনাগাদ হয়েছে", type: "success" });
    } catch {
      loadJobs();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            ক্যারিয়ার সুযোগ ব্যবস্থাপনা
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            ওয়েবসাইটে প্রদর্শিত উন্মুক্ত পদসমূহ যোগ, সম্পাদনা, প্রদর্শন ক্রম পরিবর্তন ও মুছে
            ফেলুন।
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-xs"
            render={<Link href="/admin" />}
          >
            আবেদনকারীদের তালিকা
          </Button>
          <Button
            size="sm"
            className="rounded-full text-xs bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
            onClick={() => {
              setEditingJob(null);
              setIsFormOpen(true);
            }}
          >
            <Plus size={14} />
            <span>নতুন পদ যুক্ত করুন</span>
          </Button>
        </div>
      </div>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 size={24} className="animate-spin text-muted-foreground" />
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
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                এই পেজটি দেখার জন্য আপনার অ্যাডমিন অ্যাক্সেস প্রয়োজন।
              </p>
            </div>
            <Button
              size="sm"
              className="text-xs rounded-full"
              render={<Link href="/login" />}
            >
              লগইন করুন
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="পদের নাম বা বিভাগ খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>
                মোট পদ: {jobsList.length}টি | সক্রিয়:{" "}
                {jobsList.filter((j) => j.isActive !== false).length}টি
              </span>
            </div>
          </div>
          {filteredJobs.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground rounded-xl border border-border bg-card">
              কোনো পদ পাওয়া যায়নি।
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredJobs.map((job) => {
                const originalIndex = jobsList.findIndex(
                  (j) => j.id === job.id,
                );
                return (
                  <ListCard
                    key={job.id}
                    id={job.id}
                    title={job.title}
                    badges={[
                      {
                        label: job.isActive !== false ? "সক্রিয়" : "নিষ্ক্রিয়",
                        variant:
                          job.isActive !== false ? "default" : "secondary",
                      },
                    ]}
                    subtitle={`ID: ${job.id}`}
                    metaItems={[
                      { label: "বিভাগ:", value: job.department },
                      { label: "কর্মস্থল:", value: job.location },
                      { label: "ধরন:", value: job.type },
                    ]}
                    footerNote={
                      <span className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">
                          ক্রম পরিবর্তন:
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={originalIndex === 0}
                          className="h-6 w-6 p-0 disabled:opacity-30 rounded-md"
                          onClick={() => handleMove(originalIndex, "up")}
                        >
                          <ChevronUp size={12} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={originalIndex === jobsList.length - 1}
                          className="h-6 w-6 p-0 disabled:opacity-30 rounded-md"
                          onClick={() => handleMove(originalIndex, "down")}
                        >
                          <ChevronDown size={12} />
                        </Button>
                      </span>
                    }
                    actions={[
                      {
                        id: "view",
                        label: "পেজ দেখুন",
                        icon: <Eye size={13} />,
                        variant: "outline",
                        href: `/careers/${job.id}`,
                        target: "_blank",
                      },
                      {
                        id: "edit",
                        label: "সম্পাদনা",
                        icon: <Pencil size={13} />,
                        variant: "outline",
                        onClick: () => {
                          setEditingJob(job);
                          setIsFormOpen(true);
                        },
                      },
                      {
                        id: "delete",
                        label: "মুছুন",
                        icon: <Trash2 size={13} />,
                        variant: "ghost",
                        className: "text-destructive hover:bg-destructive/10",
                        onClick: () => {
                          setDeletingJob({ id: job.id, title: job.title });
                          setIsDeleteOpen(true);
                        },
                      },
                    ]}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
      <JobFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        jobToEdit={editingJob}
        totalJobsCount={jobsList.length}
        onSuccess={loadJobs}
      />
      <JobDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        jobId={deletingJob?.id || null}
        jobTitle={deletingJob?.title}
        onSuccess={loadJobs}
      />
    </div>
  );
}
