"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import type { JobPosition } from "@/types";

export interface JobFormData {
  id?: string;
  title: string;
  department: string;
  location: string;
  type: string;
  responsibilities: string;
  requirements: string;
  bonus: string;
  benefits: string;
  isActive: boolean;
  displayOrder: number;
}

const DEFAULT_FORM: JobFormData = {
  title: "",
  department: "ইঞ্জিনিয়ারিং",
  location: "ঢাকা / রিমোট",
  type: "ফুল টাইম",
  responsibilities: "",
  requirements: "",
  bonus: "",
  benefits:
    "ইকুইটি সুবিধাসহ প্রতিযোগিতামূলক বেতন প্যাকেজ।\nপরিবারসহ পূর্ণাঙ্গ স্বাস্থ্যসেবা প্যাকেজ।\nস্বাচ্ছন্দ্যময় ও নমনীয় ছুটির নীতিমালা।",
  isActive: true,
  displayOrder: 0,
};

interface JobFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobToEdit?: JobPosition | null;
  totalJobsCount?: number;
  onSuccess: () => void;
}

export function JobFormDialog({
  open,
  onOpenChange,
  jobToEdit,
  totalJobsCount = 0,
  onSuccess,
}: JobFormDialogProps) {
  const [formData, setFormData] = useState<JobFormData>(DEFAULT_FORM);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (jobToEdit) {
      setFormData({
        id: jobToEdit.id,
        title: jobToEdit.title,
        department: jobToEdit.department,
        location: jobToEdit.location,
        type: jobToEdit.type,
        responsibilities: (jobToEdit.responsibilities || []).join("\n"),
        requirements: (jobToEdit.requirements || []).join("\n"),
        bonus: (jobToEdit.bonus || []).join("\n"),
        benefits: (jobToEdit.benefits || []).join("\n"),
        isActive: jobToEdit.isActive !== false,
        displayOrder: jobToEdit.displayOrder || 0,
      });
    } else {
      setFormData({ ...DEFAULT_FORM, displayOrder: totalJobsCount });
    }
  }, [jobToEdit, totalJobsCount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.department || !formData.location) {
      toast.add({ title: "শিরোনাম, বিভাগ এবং কর্মস্থল আবশ্যক", type: "error" });
      return;
    }
    setIsSaving(true);
    const payload = {
      ...formData,
      responsibilities: formData.responsibilities
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      requirements: formData.requirements
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      bonus: formData.bonus
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      benefits: formData.benefits
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    const savePromise = async () => {
      const isEdit = !!jobToEdit?.id;
      const method = isEdit ? "PUT" : "POST";
      const body = isEdit ? { ...payload, id: jobToEdit.id } : payload;
      const res = await fetch("/api/jobs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.error || "সংরক্ষণ ব্যর্থ হয়েছে");
      return data;
    };
    try {
      await toast.promise(savePromise(), {
        loading: {
          title: jobToEdit
            ? "ক্যারিয়ার আপডেট করা হচ্ছে..."
            : "নতুন পদ তৈরি করা হচ্ছে...",
        },
        success: {
          title: jobToEdit
            ? "পদটি সফলভাবে আপডেট করা হয়েছে"
            : "নতুন পদ সফলভাবে যোগ করা হয়েছে",
        },
        error: { title: "সংরক্ষণ করতে সমস্যা হয়েছে" },
      });
      onOpenChange(false);
      onSuccess();
    } catch {
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={jobToEdit ? "ক্যারিয়ার পদ সম্পাদনা" : "নতুন ক্যারিয়ার পদ তৈরি"}
      description="পদের বিস্তারিত বিবরণ, দায়িত্ব এবং যোগ্যতাসমূহ উল্লেখ করুন।"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="job-title" className="text-xs font-medium">
              পদের শিরোনাম *
            </FieldLabel>
            <Input
              id="job-title"
              required
              placeholder="যেমন: সিনিয়র সফটওয়্যার ইঞ্জিনিয়ার"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="text-xs"
            />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field>
              <FieldLabel
                htmlFor="job-department"
                className="text-xs font-medium"
              >
                বিভাগ *
              </FieldLabel>
              <Input
                id="job-department"
                required
                placeholder="যেমন: ইঞ্জিনিয়ারিং"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                className="text-xs"
              />
            </Field>
            <Field>
              <FieldLabel
                htmlFor="job-location"
                className="text-xs font-medium"
              >
                কর্মস্থল *
              </FieldLabel>
              <Input
                id="job-location"
                required
                placeholder="যেমন: ঢাকা / লন্ডন"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="text-xs"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="job-type" className="text-xs font-medium">
                কাজের ধরন *
              </FieldLabel>
              <Input
                id="job-type"
                required
                placeholder="যেমন: ফুল টাইম"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="text-xs"
              />
            </Field>
          </div>
          <Field>
            <FieldLabel
              htmlFor="job-responsibilities"
              className="text-xs font-medium"
            >
              দায়িত্বসমূহ (প্রতি লাইনে একটি)
            </FieldLabel>
            <Textarea
              id="job-responsibilities"
              rows={4}
              placeholder="উচ্চমানের ও স্কেলেবল সফটওয়্যার সমাধান তৈরি করা&#10;কোড রিভিউ ও মেন্টরিং..."
              value={formData.responsibilities}
              onChange={(e) =>
                setFormData({ ...formData, responsibilities: e.target.value })
              }
              className="text-xs font-sans"
            />
          </Field>
          <Field>
            <FieldLabel
              htmlFor="job-requirements"
              className="text-xs font-medium"
            >
              প্রয়োজনীয় যোগ্যতাসমূহ (প্রতি লাইনে একটি)
            </FieldLabel>
            <Textarea
              id="job-requirements"
              rows={4}
              placeholder="ওয়েব ডেভেলপমেন্টে ৩+ বছরের অভিজ্ঞতা&#10;TypeScript এবং React সম্পর্কে দক্ষ ধারণা..."
              value={formData.requirements}
              onChange={(e) =>
                setFormData({ ...formData, requirements: e.target.value })
              }
              className="text-xs font-sans"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="job-bonus" className="text-xs font-medium">
              অতিরিক্ত সুবিধাজনক গুণাবলী (প্রতি লাইনে একটি)
            </FieldLabel>
            <Textarea
              id="job-bonus"
              rows={3}
              placeholder="ক্লাউড আর্কিটেকচার সম্পর্কে সম্যক ধারণা..."
              value={formData.bonus}
              onChange={(e) =>
                setFormData({ ...formData, bonus: e.target.value })
              }
              className="text-xs font-sans"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="job-benefits" className="text-xs font-medium">
              সুবিধাসমূহ (প্রতি লাইনে একটি)
            </FieldLabel>
            <Textarea
              id="job-benefits"
              rows={3}
              value={formData.benefits}
              onChange={(e) =>
                setFormData({ ...formData, benefits: e.target.value })
              }
              className="text-xs font-sans"
            />
          </Field>
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-3">
            <div>
              <span className="text-xs font-medium block">
                পদটি ওয়েবসাইটে প্রদর্শন করুন
              </span>
              <span className="text-2xs text-muted-foreground">
                নিষ্ক্রিয় করলে প্রার্থীরা আর এই পদে আবেদন করতে পারবেন না।
              </span>
            </div>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked })
              }
            />
          </div>
        </FieldGroup>
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => onOpenChange(false)}
          >
            বাতিল
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isSaving}
            className="text-xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSaving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
          </Button>
        </div>
      </form>
    </ResponsiveDialog>
  );
}
