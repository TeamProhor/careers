"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { toast } from "@/components/ui/toast";

interface JobDeleteDialogProps {
  jobId: string | null;
  jobTitle?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function JobDeleteDialog({
  jobId,
  jobTitle,
  open,
  onOpenChange,
  onSuccess,
}: JobDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!jobId) return;
    setIsDeleting(true);
    const deletePromise = async () => {
      const res = await fetch(`/api/jobs?id=${encodeURIComponent(jobId)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success)
        throw new Error(data.error || "মুছে ফেলা ব্যর্থ হয়েছে");
      return data;
    };
    try {
      await toast.promise(deletePromise(), {
        loading: { title: "পদটি মুছে ফেলা হচ্ছে..." },
        success: { title: "পদটি সফলভাবে মুছে ফেলা হয়েছে" },
        error: { title: "মুছে ফেলতে সমস্যা হয়েছে" },
      });
      onOpenChange(false);
      onSuccess();
    } catch {
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="পদটি মুছে ফেলতে চান?"
      description={
        jobTitle
          ? `"${jobTitle}" পদটি মুছে ফেললে এটি আর ওয়েবসাইটে প্রদর্শিত হবে না। এই পদক্ষেপটি অপরিবর্তনযোগ্য।`
          : "এই পদটি মুছে ফেললে এটি আর ওয়েবসাইটে প্রদর্শিত হবে না। এই পদক্ষেপটি অপরিবর্তনযোগ্য।"
      }
    >
      <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => onOpenChange(false)}
          disabled={isDeleting}
        >
          বাতিল
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="text-xs"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? "মুছে ফেলা হচ্ছে..." : "হ্যাঁ, মুছে ফেলুন"}
        </Button>
      </div>
    </ResponsiveDialog>
  );
}
