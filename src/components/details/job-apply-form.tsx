"use client";

import { CheckCircle, Info, Loader2, Upload, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

interface JobApplyFormProps {
  jobTitle: string;
  jobId?: string;
}

export function JobApplyForm({
  jobTitle,
  jobId = "general",
}: JobApplyFormProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<{ email: string; name?: string } | null>(
    null,
  );
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    resume: null as File | null,
    workLinks: [
      { id: "link-1", url: "" },
      { id: "link-2", url: "" },
      { id: "link-3", url: "" },
    ],
    privacyAcknowledged: false,
    accuracyConfirmed: false,
  });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
          setFormData((prev) => ({
            ...prev,
            email: data.user.email || "",
            name: data.user.name || prev.name,
          }));
        }
      })
      .catch(() => {})
      .finally(() => setIsCheckingAuth(false));
  }, []);

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

    if (!formData.resume) {
      toast.error("অনুগ্রহ করে আপনার রেজুমে PDF আপলোড করুন");
      return;
    }

    const validLinks = formData.workLinks
      .map((item) => item.url.trim())
      .filter((url) => url.length > 0);

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
      const body = new FormData();
      body.append("jobId", jobId);
      body.append("jobTitle", jobTitle);
      body.append("name", formData.name);
      body.append("email", formData.email);
      if (formData.phone) body.append("phone", formData.phone);
      body.append("resume", formData.resume as Blob);
      body.append("workLinks", JSON.stringify(validLinks));
      body.append("privacyAcknowledged", String(formData.privacyAcknowledged));
      body.append("accuracyConfirmed", String(formData.accuracyConfirmed));

      const res = await fetch("/api/applications", {
        method: "POST",
        body,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "আবেদন ব্যর্থ হয়েছে");
      }
      return data;
    };

    try {
      await toast.promise(submitPromise(), {
        loading: "আবেদন জমা দেওয়া হচ্ছে...",
        success: "আবেদন সফলভাবে গৃহীত হয়েছে",
        error: "আবেদন জমা দিতে ব্যর্থ হয়েছে",
      });
      setIsSubmitted(true);
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div id="apply" className="scroll-mt-20 lg:col-span-5">
        <Card className="sticky top-20 border border-border bg-card p-12 text-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <Loader2 size={20} className="animate-spin text-muted-foreground" />
            <p className="text-xs text-muted-foreground">যাচাই করা হচ্ছে...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div id="apply" className="scroll-mt-20 lg:col-span-5">
        <Card className="sticky top-20 border border-border bg-card shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold tracking-tight text-foreground">
              এই পদে আবেদন করুন
            </CardTitle>
            <CardDescription className="text-xs">
              {jobTitle} পদের জন্য আবেদন জমা দিতে সাইন ইন আবশ্যক।
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            <div className="rounded-xl border border-border bg-muted/30 p-4 text-xs text-muted-foreground flex items-start gap-3">
              <Info size={18} className="text-primary shrink-0 mt-0.5" />
              <span>
                আপনার তথ্য ও আবেদনের অগ্রগতি সুরক্ষিত রাখতে অনুগ্রহ করে প্রথমে সাইন ইন
                করুন।
              </span>
            </div>

            <Link
              href={`/login?redirect=${encodeURIComponent(pathname)}`}
              className="inline-flex w-full items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium h-10 gap-1.5 px-2.5"
            >
              সাইন ইন করে আবেদন করুন
            </Link>
          </CardContent>
        </Card>
      </div>
    );
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
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckCircle size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-foreground">
                  আবেদন সফলভাবে গৃহীত হয়েছে
                </h3>
                <p className="text-xs text-muted-foreground max-w-xs">
                  আবেদন করার জন্য ধন্যবাদ। আমাদের ট্যালেন্ট টিম আপনার প্রোফাইল পর্যালোচনা করে
                  ইমেইলে যোগাযোগ করবে।
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setIsSubmitted(false)}
              >
                পুনরায় আরেকটি আবেদন জমা দিন
              </Button>
            </div>
          ) : (
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

                <Field>
                  <FieldLabel
                    htmlFor="resume-upload"
                    className="text-xs font-medium"
                  >
                    জীবনবৃত্তান্ত বা সিভি (PDF, ৩.৫ মেগাবাইটের নিচে) *
                  </FieldLabel>
                  <label
                    htmlFor="resume-upload"
                    className="flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-background/60 transition-colors hover:bg-muted/40 p-4"
                  >
                    <Upload size={20} className="text-muted-foreground" />
                    <span className="mt-1.5 text-xs text-muted-foreground font-medium truncate max-w-xs">
                      {formData.resume
                        ? formData.resume.name
                        : "ফাইল ড্রপ করুন বা ব্রাউজ করুন"}
                    </span>
                    <span className="text-2xs text-muted-foreground/80">
                      শুধুমাত্র PDF ফরম্যাট গ্রহণযোগ্য
                    </span>
                    <input
                      id="resume-upload"
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      required
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          resume: e.target.files?.[0] || null,
                        })
                      }
                    />
                  </label>
                </Field>

                <FieldSet>
                  <div className="flex items-center justify-between">
                    <FieldLegend
                      variant="label"
                      className="text-xs font-medium"
                    >
                      আপনার পূর্বের কাজের লিঙ্কসমূহ (কমপক্ষে ৩টি বাধ্যতামূলক) *
                    </FieldLegend>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-xs text-primary hover:bg-primary/10 h-7 px-2"
                      onClick={handleAddWorkLink}
                    >
                      + আরও লিঙ্ক যোগ করুন
                    </Button>
                  </div>
                  <FieldGroup className="gap-2.5 mt-2">
                    {formData.workLinks.map((item, idx) => (
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
                          onChange={(e) =>
                            handleWorkLinkChange(item.id, e.target.value)
                          }
                          className="text-xs"
                        />
                        {formData.workLinks.length > 3 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                            onClick={() => handleRemoveWorkLink(item.id)}
                          >
                            <X size={14} />
                          </Button>
                        )}
                      </div>
                    ))}
                  </FieldGroup>
                </FieldSet>

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
                {isSubmitting ? "জমা দেওয়া হচ্ছে..." : "আবেদন জমা দিন"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
