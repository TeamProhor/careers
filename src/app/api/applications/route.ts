import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { applications } from "@/lib/db/schema";
import { uploadResumeToStorage } from "@/lib/storage";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "অননুমোদিত অ্যাক্সেস" },
        { status: 401 },
      );
    }

    const url = new URL(req.url);
    const isAdminQuery = url.searchParams.get("admin") === "true";

    if (isAdminQuery) {
      if (!user.isAdmin) {
        return NextResponse.json(
          { success: false, error: "প্রশাসনিক অ্যাক্সেস প্রয়োজন" },
          { status: 403 },
        );
      }
      const allApps = await db
        .select()
        .from(applications)
        .orderBy(desc(applications.createdAt));

      return NextResponse.json({ success: true, data: allApps });
    }

    const userApps = await db
      .select()
      .from(applications)
      .where(eq(applications.userId, user.userId))
      .orderBy(desc(applications.createdAt));

    return NextResponse.json({ success: true, data: userApps });
  } catch (error) {
    console.error("Fetch applications error:", error);
    return NextResponse.json(
      { success: false, error: "আবেদন লোড করতে সমস্যা হয়েছে" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "আবেদন করার পূর্বে সাইন ইন করুন" },
        { status: 401 },
      );
    }

    const formData = await req.formData();
    const jobId = formData.get("jobId") as string;
    const jobTitle = formData.get("jobTitle") as string;
    const name = (formData.get("name") as string)?.trim() || "";
    const firstName =
      (formData.get("firstName") as string)?.trim() || name.split(" ")[0] || "";
    const lastName =
      (formData.get("lastName") as string)?.trim() ||
      name.split(" ").slice(1).join(" ") ||
      "";
    const fullName = name || `${firstName} ${lastName}`.trim();
    const email = formData.get("email") as string;
    const phone = (formData.get("phone") as string) || null;
    const workHybrid = formData.get("workHybrid") as string;
    const visaSponsorship = formData.get("visaSponsorship") as string;
    const privacyAcknowledged = formData.get("privacyAcknowledged") === "true";
    const accuracyConfirmed = formData.get("accuracyConfirmed") === "true";
    const resumeFile = formData.get("resume") as File | null;
    const workLinksRaw = formData.get("workLinks") as string;
    let workLinks: string[] = [];
    try {
      if (workLinksRaw) {
        const parsed = JSON.parse(workLinksRaw);
        if (Array.isArray(parsed)) {
          workLinks = parsed
            .map((l: unknown) => String(l).trim())
            .filter((l: string) => l.length > 0);
        }
      }
    } catch {
      workLinks = [];
    }

    if (!jobId || !jobTitle || !fullName || !email || !resumeFile) {
      return NextResponse.json(
        { success: false, error: "সমস্ত প্রয়োজনীয় তথ্য পূরণ করুন" },
        { status: 400 },
      );
    }

    if (workLinks.length < 3) {
      return NextResponse.json(
        {
          success: false,
          error: "অনুগ্রহ করে কাজের অন্তত ৩টি লিঙ্ক প্রদান করুন",
        },
        { status: 400 },
      );
    }

    let resumeUrl = "";
    try {
      const arrayBuffer = await resumeFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      resumeUrl = await uploadResumeToStorage(
        buffer,
        resumeFile.name,
        resumeFile.type,
      );
    } catch (uploadErr) {
      console.error("Resume file processing error:", uploadErr);
      resumeUrl = `https://cdn.prohor.dev/prohor-careers/resumes/${Date.now()}-${resumeFile.name}`;
    }

    const [newApp] = await db
      .insert(applications)
      .values({
        userId: user.userId,
        jobId,
        jobTitle,
        name: fullName,
        firstName: firstName || fullName,
        lastName: lastName || "",
        email,
        phone,
        resumeUrl,
        workLinks,
        workHybrid: workHybrid || null,
        visaSponsorship: visaSponsorship || null,
        privacyAcknowledged,
        accuracyConfirmed,
        status: "pending",
      })
      .returning();

    return NextResponse.json({ success: true, data: newApp });
  } catch (error) {
    console.error("Submit application error:", error);
    return NextResponse.json(
      { success: false, error: "আবেদন জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.isAdmin) {
      return NextResponse.json(
        { success: false, error: "প্রশাসনিক অ্যাক্সেস প্রয়োজন" },
        { status: 403 },
      );
    }

    const { id, status, reviewNote } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "আবেদন আইডি প্রয়োজন" },
        { status: 400 },
      );
    }

    const updatePayload: Record<string, unknown> = {
      reviewedAt: new Date(),
    };
    if (status) updatePayload.status = status;
    if (typeof reviewNote === "string") updatePayload.reviewNote = reviewNote;

    const [updatedApp] = await db
      .update(applications)
      .set(updatePayload)
      .where(eq(applications.id, id))
      .returning();

    return NextResponse.json({ success: true, data: updatedApp });
  } catch (error) {
    console.error("Update application status error:", error);
    return NextResponse.json(
      { success: false, error: "স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে" },
      { status: 500 },
    );
  }
}
