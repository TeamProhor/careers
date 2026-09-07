import type { Metadata } from "next";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";

export const metadata: Metadata = {
  title: "ব্যবহারের শর্তাবলী | Prohor",
  description: "Prohor প্ল্যাটফর্ম এবং ক্যারিয়ার পোর্টাল ব্যবহারের নীতিমালা ও শর্তাবলী।",
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans selection:bg-muted selection:text-foreground">
      <Header
        backHref="/"
        backLabel="সকল উন্মুক্ত পদসমূহ"
        actionHref="/#positions"
        actionLabel="উন্মুক্ত পদসমূহ"
      />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6 md:py-16">
        <div className="space-y-4 border-b border-border pb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl text-foreground">
            ব্যবহারের শর্তাবলী
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            সর্বশেষ হালনাগাদ: মার্চ ২০২৬ • Prohor
          </p>
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none space-y-8 pt-8 text-sm leading-relaxed text-muted-foreground">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              ১. সাধারণ শর্তাবলী
            </h2>
            <p>
              Prohor ক্যারিয়ার পোর্টাল এবং সংশ্লিষ্ট সেবাসমূহ ব্যবহার করার মাধ্যমে আপনি এই
              ব্যবহারের শর্তাবলীর সাথে সম্পূর্ণরূপে সম্মত হচ্ছেন। আপনি যদি এই শর্তাবলীর কোনো
              অংশের সাথে একমত না হন, তবে অনুগ্রহ করে আমাদের সেবা গ্রহণ থেকে বিরত থাকুন।
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              ২. চাকরির আবেদন ও প্রার্থীর তথ্য
            </h2>
            <p>
              Prohor-এ যেকোনো উন্মুক্ত পদের জন্য আবেদন করার সময় প্রার্থীকে অবশ্যই নির্ভুল,
              সম্পূর্ণ ও সত্য তথ্য প্রদান করতে হবে। কোনো অসত্য তথ্য বা বিভ্রান্তিকর বিবরণ
              প্রদান করা হলে যে কোনো পর্যায়ে আবেদন বাতিল করার পূর্ণ অধিকার Prohor সংরক্ষণ
              করে।
            </p>
            <p>
              আবেদনের সাথে সংযুক্ত রেজুমে (সিভি) এবং প্রার্থীর পূর্ববর্তী কাজের লিঙ্কসমূহ
              (GitHub, পোর্টফোলিও ইত্যাদি) প্রার্থী কর্তৃক বৈধ ও সর্বজনীনভাবে প্রবেশযোগ্য
              হতে হবে।
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              ৩. মেধা সম্পত্তি ও স্বত্বাধিকার
            </h2>
            <p>
              Prohor ওয়েবসাইটের যাবতীয় কনটেন্ট, ডিজাইন, সফটওয়্যার কোড, ট্রেডমার্ক ও লোগো
              Prohor-এর নিজস্ব মেধা সম্পত্তি। লিখিত অনুমতি ব্যতীত এগুলো অনুলিপি, পুনরুৎপাদন
              বা বাণিজ্যিক উদ্দেশ্যে ব্যবহার করা আইনত নিষিদ্ধ।
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              ৪. ব্যবহারকারীর আচরণ ও নিষিদ্ধ কার্যকলাপ
            </h2>
            <p>আমাদের পোর্টাল ব্যবহারের সময় নিম্নোক্ত কার্যকলাপগুলো কঠোরভাবে নিষিদ্ধ:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>সিস্টেমে ক্ষতিকারক কোড, ভাইরাস বা অননুমোদিত স্ক্রিপ্ট আপলোড করা।</li>
              <li>অন্য কোনো ব্যক্তির পরিচয় ধারণ করে আবেদন জমা দেওয়া।</li>
              <li>পোর্টালের সার্ভার বা নেটওয়ার্ক অবকাঠামোতে অযাচিত চাপ সৃষ্টি করা।</li>
            </ul>
          </section>
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              ৫. দায়মুক্তি ও অধিকার সংরক্ষণ
            </h2>
            <p>
              Prohor যেকোনো সময় পূর্ব নোটিশ ব্যতিরেকে কোনো পদের নিয়োগ কার্যক্রম স্থগিত,
              বাতিল বা পরিবর্তন করার পূর্ণ অধিকার সংরক্ষণ করে। কোনো পদে আবেদন করলেই তা
              নিয়োগের নিশ্চয়তা প্রদান করে না।
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">৬. যোগাযোগ</h2>
            <p>
              শর্তাবলী সংক্রান্ত যেকোনো প্রশ্ন বা ব্যাখ্যার জন্য অনুগ্রহ করে আমাদের সাথে যোগাযোগ
              করুন: <br />
              <span className="font-mono text-xs text-foreground">
                careers@prohor.dev
              </span>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
