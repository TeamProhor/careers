import { asc, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { jobs } from "@/lib/db/schema";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const all = url.searchParams.get("all") === "true";

    if (all) {
      const user = await getCurrentUser();
      if (!user?.isAdmin) {
        return NextResponse.json(
          { success: false, error: "প্রশাসনিক অ্যাক্সেস প্রয়োজন" },
          { status: 403 },
        );
      }
      const allJobs = await db
        .select()
        .from(jobs)
        .orderBy(asc(jobs.displayOrder), desc(jobs.createdAt));
      return NextResponse.json({ success: true, data: allJobs });
    }

    const activeJobs = await db
      .select()
      .from(jobs)
      .where(eq(jobs.isActive, true))
      .orderBy(asc(jobs.displayOrder), desc(jobs.createdAt));

    return NextResponse.json({ success: true, data: activeJobs });
  } catch (error) {
    console.error("Fetch jobs error:", error);
    return NextResponse.json(
      { success: false, error: "ক্যারিয়ার সুযোগ লোড করতে সমস্যা হয়েছে" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.isAdmin) {
      return NextResponse.json(
        { success: false, error: "প্রশাসনিক অ্যাক্সেস প্রয়োজন" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const {
      title,
      department,
      location,
      type,
      responsibilities,
      requirements,
      bonus,
      benefits,
      displayOrder,
      isActive,
    } = body;

    if (!title || !department || !location || !type) {
      return NextResponse.json(
        { success: false, error: "সকল প্রয়োজনীয় তথ্য পূরণ করুন" },
        { status: 400 },
      );
    }

    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const uniqueSlug = `${baseSlug || "job"}-${Date.now().toString().slice(-6)}`;
    const href = `/careers/${uniqueSlug}`;

    const [newJob] = await db
      .insert(jobs)
      .values({
        id: uniqueSlug,
        title,
        department,
        location,
        type,
        href,
        responsibilities: Array.isArray(responsibilities)
          ? responsibilities
          : [],
        requirements: Array.isArray(requirements) ? requirements : [],
        bonus: Array.isArray(bonus) ? bonus : [],
        benefits: Array.isArray(benefits) ? benefits : [],
        displayOrder: typeof displayOrder === "number" ? displayOrder : 0,
        isActive: isActive !== false,
      })
      .returning();

    return NextResponse.json({ success: true, data: newJob });
  } catch (error) {
    console.error("Create job error:", error);
    return NextResponse.json(
      { success: false, error: "ক্যারিয়ার তৈরি করতে সমস্যা হয়েছে" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.isAdmin) {
      return NextResponse.json(
        { success: false, error: "প্রশাসনিক অ্যাক্সেস প্রয়োজন" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const {
      id,
      title,
      department,
      location,
      type,
      responsibilities,
      requirements,
      bonus,
      benefits,
      displayOrder,
      isActive,
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ক্যারিয়ার আইডি প্রয়োজন" },
        { status: 400 },
      );
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };
    if (title !== undefined) updateData.title = title;
    if (department !== undefined) updateData.department = department;
    if (location !== undefined) updateData.location = location;
    if (type !== undefined) updateData.type = type;
    if (responsibilities !== undefined)
      updateData.responsibilities = responsibilities;
    if (requirements !== undefined) updateData.requirements = requirements;
    if (bonus !== undefined) updateData.bonus = bonus;
    if (benefits !== undefined) updateData.benefits = benefits;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    if (isActive !== undefined) updateData.isActive = isActive;

    const [updatedJob] = await db
      .update(jobs)
      .set(updateData)
      .where(eq(jobs.id, id))
      .returning();

    return NextResponse.json({ success: true, data: updatedJob });
  } catch (error) {
    console.error("Update job error:", error);
    return NextResponse.json(
      { success: false, error: "ক্যারিয়ার সম্পাদনা করতে সমস্যা হয়েছে" },
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

    const { orders } = await req.json();
    if (!Array.isArray(orders)) {
      return NextResponse.json(
        { success: false, error: "ভুল তথ্য বিন্যাস" },
        { status: 400 },
      );
    }

    for (const item of orders) {
      await db
        .update(jobs)
        .set({ displayOrder: item.displayOrder, updatedAt: new Date() })
        .where(eq(jobs.id, item.id));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reorder jobs error:", error);
    return NextResponse.json(
      { success: false, error: "ক্রম পরিবর্তন করতে সমস্যা হয়েছে" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.isAdmin) {
      return NextResponse.json(
        { success: false, error: "প্রশাসনিক অ্যাক্সেস প্রয়োজন" },
        { status: 403 },
      );
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ক্যারিয়ার আইডি প্রয়োজন" },
        { status: 400 },
      );
    }

    await db.delete(jobs).where(eq(jobs.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete job error:", error);
    return NextResponse.json(
      { success: false, error: "ক্যারিয়ার মুছে ফেলতে সমস্যা হয়েছে" },
      { status: 500 },
    );
  }
}
