"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Link2 } from "reicon-react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { toast } from "@/components/ui/toast";
import type { ApplicationItem } from "@/types";

interface ApplicationReviewDialogProps {
  application: ApplicationItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (updatedApp: ApplicationItem) => void;
}

const STATUS_OPTIONS = [
  { label: "জমা হয়েছে", value: "pending" },
  { label: "পর্যালোচনাধীন", value: "reviewing" },
  { label: "শর্টলিস্টেড", value: "shortlisted" },
  { label: "গৃহীত", value: "accepted" },
  { label: "অননুমোদিত", value: "rejected" },
];

export function ApplicationReviewDialog({
  application,
  open,
  onOpenChange,
  onSuccess,
}: ApplicationReviewDialogProps) {
  const [status, setStatus] = useState<string>("pending");
  const [reviewNote, setReviewNote] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (application) {
      setStatus(application.status || "pending");
      setReviewNote(application.reviewNote || "");
    }
  }, [application]);

  const handleSave = async () => {
    if (!application) return;
    setIsUpdating(true);
    const updatePromise = async () => {
      const res = await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: application.id, status, reviewNote }),
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.error || "আপডেট ব্যর্থ হয়েছে");
      return data;
    };
    try {
      await toast.promise(updatePromise(), {
        loading: { title: "স্ট্যাটাস আপডেট করা হচ্ছে..." },
        success: { title: "আবেদনের স্থিতি সফলভাবে সংরক্ষিত হয়েছে" },
        error: { title: "আপডেট সংরক্ষণ ব্যর্থ হয়েছে" },
      });
      onOpenChange(false);
      onSuccess({ ...application, status, reviewNote, reviewedAt: new Date() });
    } catch {
    } finally {
      setIsUpdating(false);
    }
  };

  if (!application) return null;

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="আবেদন পর্যালোচনা"
      description={`${application.name || `${application.firstName ?? ""} ${application.lastName ?? ""}`.trim()} - ${application.jobTitle}`}
    >
      <div className="space-y-4 py-2">
        <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-muted-foreground">ইমেইল:</span>
            <span className="font-mono text-foreground">
              {application.email}
            </span>
          </div>
          {application.phone && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">ফোন:</span>
              <span className="font-mono text-foreground">
                {application.phone}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">রেজুমে লিঙ্ক:</span>
            <a
              href={application.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary underline underline-offset-4"
            >
              <span>ওপেন করুন</span>
              <ArrowUpRight size={12} />
            </a>
          </div>
          {application.workLinks && application.workLinks.length > 0 && (
            <div className="flex flex-col gap-1 pt-1 border-t border-border/50">
              <span className="text-muted-foreground">কাজের লিঙ্কসমূহ:</span>
              <div className="flex flex-col gap-0.5">
                {application.workLinks.map((link) => (
                  <a
                    key={link}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary underline underline-offset-4 truncate block hover:opacity-80"
                  >
                    <Link2 size={12} className="shrink-0" />
                    <span className="truncate">{link}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        <FieldGroup>
          <Field>
            <FieldLabel className="text-xs font-medium">
              বর্তমান স্ট্যাটাস পরিবর্তন করুন
            </FieldLabel>
            <div className="grid grid-cols-3 gap-2">
              {STATUS_OPTIONS.map((s) => (
                <Button
                  key={s.value}
                  type="button"
                  variant={status === s.value ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-8"
                  onClick={() => setStatus(s.value)}
                >
                  {s.label}
                </Button>
              ))}
            </div>
          </Field>
          <Field>
            <FieldLabel
              htmlFor="dialogReviewNote"
              className="text-xs font-medium"
            >
              পর্যালোচনার মন্তব্য বা নোট
            </FieldLabel>
            <Input
              id="dialogReviewNote"
              placeholder="যেমন: টেকনিক্যাল ইন্টারভিউয়ের জন্য নির্বাচিত..."
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              className="text-xs"
            />
          </Field>
        </FieldGroup>
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            বাতিল
          </Button>
          <Button
            size="sm"
            disabled={isUpdating}
            className="text-xs bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleSave}
          >
            {isUpdating ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
          </Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
}
