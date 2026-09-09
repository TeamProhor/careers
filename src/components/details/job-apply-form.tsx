"use client";

import { useState } from "react";
import { CheckCircle, Loader, X } from "reicon-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { formatApplicationMessage, sendTelegramMessage } from "@/lib/telegram";

interface WorkLink {
  id: string;
  url: string;
}

interface WorkLinksFieldProps {
  links: WorkLink[];
  onChange: (id: string, value: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

function WorkLinksField({
  links,
  onChange,
  onAdd,
  onRemove,
}: WorkLinksFieldProps) {
  return (
    <FieldSet>
      <div className="flex items-center justify-between">
        <FieldLegend variant="label" className="text-xs font-medium">
          আপনার পূর্বের কাজের লিঙ্কসমূহ (কমপক্ষে ৩টি বাধ্যতামূলক) *
        </FieldLegend>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-xs text-primary hover:bg-primary/10 h-7 px-2"
          onClick={onAdd}
        >
          + আরও লিঙ্ক যোগ করুন
        </Button>
      </div>
      <FieldGroup className="gap-2.5 mt-2">
        {links.map((item, idx) => (
          <div key={item.id} className="flex items-center gap-2">
            <Input
              type="url"
              required={idx < 3}
              placeholder={
                idx === 0
                  ? "https://github.com/... বা কাজের লিংক ১"
                  : idx === 1
                    ? "https://dribbble.com/... বা কাজের লিংক ২"
                    : idx === 2
                      ? "https://your-portfolio.com/... বা কাজের লিংক ৩"
                      : `কাজের লিংক ${idx + 1}`
              }
              value={item.url}
              onChange={(e) => onChange(item.id, e.target.value)}
              className="text-xs"
            />
            {links.length > 3 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                onClick={() => onRemove(item.id)}
              >
                <X size={14} />
              </Button>
            )}
          </div>
        ))}
      </FieldGroup>
    </FieldSet>
  );
}

interface ApplicationSuccessProps {
  onReset: () => void;
}

function ApplicationSuccess({ onReset }: ApplicationSuccessProps) {
  return (
    <div id="apply" className="scroll-mt-20 lg:col-span-5">
      <Card className="sticky top-20 border border-border bg-card shadow-sm">
        <CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">
              আবেদন সফলভাবে গৃহীত হয়েছে
            </h3>
            <p className="text-xs text-muted-foreground max-w-xs">
              আবেদন করার জন্য ধন্যবাদ। আমাদের টিম আপনার প্রোফাইল পর্যালোচনা করে যোগাযোগ
              করবে।
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={onReset}
          >
            পুনরায় আরেকটি আবেদন জমা দিন
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

interface JobApplyFormProps {
  jobTitle: string;
  jobId?: string;
}

export function JobApplyForm({
  jobTitle,
  jobId = "general",
}: JobApplyFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    workLinks: [
      { id: "link-1", url: "" },
      { id: "link-2", url: "" },
      { id: "link-3", url: "" },
    ],
    privacyAcknowledged: false,
    accuracyConfirmed: false,
  });

  const handleWorkLinkChange = (id: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      workLinks: prev.workLinks.map((item) =>
        item.id === id ? { ...item, url: value } : item,
      ),
    }));
  };

  const handleAddWorkLink = () => {
    setFormData((prev) => ({
      ...prev,
      workLinks: [
        ...prev.workLinks,
        { id: `link-${Date.now()}-${prev.workLinks.length}`, url: "" },
      ],
    }));
  };

  const handleRemoveWorkLink = (id: string) => {
    if (formData.workLinks.length <= 3) return;
    setFormData((prev) => ({
      ...prev,
      workLinks: prev.workLinks.filter((item) => item.id !== id),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validLinks: string[] = [];
    for (const item of formData.workLinks) {
      const url = item.url.trim();
      if (url.length > 0) validLinks.push(url);
    }

    if (validLinks.length < 3) {
      toast.error("অনুগ্রহ করে কাজের অন্তত ৩টি লিঙ্ক প্রদান করুন");
      return;
    }

    if (!formData.privacyAcknowledged || !formData.accuracyConfirmed) {
      toast.error("শর্তাবলী এবং তথ্যের সত্যতা নিশ্চিত করুন");
      return;
    }

    setIsSubmitting(true);

    const submitPromise = async () => {
      const msg = formatApplicationMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        jobTitle,
        jobId,
        workLinks: validLinks,
      });

      const sent = await sendTelegramMessage(msg);
      if (!sent) {
        throw new Error("আবেদন জমা দিতে ব্যর্থ হয়েছে");
      }
    };

    try {
      await toast.promise(submitPromise(), {
        loading: "আবেদন জমা দেওয়া হচ্ছে...",
        success: "আবেদন সফলভাবে গৃহীত হয়েছে",
        error: "আবেদন জমা দিতে ব্যর্থ হয়েছে",
      });
      setIsSubmitted(true);
    } catch {
      // toast.promise already handles error display
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return <ApplicationSuccess onReset={() => setIsSubmitted(false)} />;
  }

  return (
    <div id="apply" className="scroll-mt-20 lg:col-span-5">
      <Card className="sticky top-20 border border-border bg-card shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold tracking-tight text-foreground">
            এই পদে আবেদন করুন
          </CardTitle>
          <CardDescription className="text-xs">
            {jobTitle} পদের জন্য আপনার তথ্য প্রদান করুন।
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name" className="text-xs font-medium">
                  আপনার পুরো নাম *
                </FieldLabel>
                <Input
                  id="name"
                  required
                  type="text"
                  placeholder="আপনার নাম লিখুন"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email" className="text-xs font-medium">
                  ইমেইল ঠিকানা *
                </FieldLabel>
                <Input
                  id="email"
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="phone" className="text-xs font-medium">
                  ফোন নম্বর
                </FieldLabel>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+৮৮০ ১..."
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </Field>

              <WorkLinksField
                links={formData.workLinks}
                onChange={handleWorkLinkChange}
                onAdd={handleAddWorkLink}
                onRemove={handleRemoveWorkLink}
              />

              <FieldSet>
                <FieldLegend variant="label" className="text-xs font-medium">
                  স্বীকৃতি ও সম্মতিসমূহ *
                </FieldLegend>
                <FieldGroup className="gap-3">
                  <Field className="flex-row items-start gap-3">
                    <Checkbox
                      id="privacy"
                      required
                      checked={formData.privacyAcknowledged}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          privacyAcknowledged: checked === true,
                        })
                      }
                    />
                    <FieldLabel
                      htmlFor="privacy"
                      className="text-xs text-muted-foreground cursor-pointer font-normal leading-relaxed"
                    >
                      আমি নিশ্চিত করছি যে আমি চাকরিপ্রার্থী গোপনীয়তা নীতি পড়েছি এবং
                      তাতে সম্মতি জানাচ্ছি।
                    </FieldLabel>
                  </Field>
                  <Field className="flex-row items-start gap-3">
                    <Checkbox
                      id="accuracy"
                      required
                      checked={formData.accuracyConfirmed}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          accuracyConfirmed: checked === true,
                        })
                      }
                    />
                    <FieldLabel
                      htmlFor="accuracy"
                      className="text-xs text-muted-foreground cursor-pointer font-normal leading-relaxed"
                    >
                      আমি প্রত্যয়ন করছি যে প্রদত্ত সমস্ত তথ্য সঠিক ও সম্পূর্ণ।
                    </FieldLabel>
                  </Field>
                </FieldGroup>
              </FieldSet>
            </FieldGroup>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader size={14} className="animate-spin" />
                  জমা দেওয়া হচ্ছে...
                </span>
              ) : (
                "আবেদন জমা দিন"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
