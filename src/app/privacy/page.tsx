import type { Metadata } from "next";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";

export const metadata: Metadata = {
  title: "গোপনীয়তা নীতি | Prohor",
  description: "Prohor প্ল্যাটফর্মে আপনার ব্যক্তিগত তথ্যের গোপনীয়তা ও সুরক্ষার নীতিমালা।",
};

export default function PrivacyPage() {
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
            গোপনীয়তা নীতি
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            সর্বশেষ হালনাগাদ: মার্চ ২০২৬ • Prohor
          </p>
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none space-y-8 pt-8 text-sm leading-relaxed text-muted-foreground">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              ১. ভূমিকা ও প্রতিশ্রুতি
            </h2>
            <p>
              Prohor চাকরিপ্রার্থী ও ব্যবহারকারীদের ব্যক্তিগত তথ্যের গোপনীয়তা এবং সুরক্ষাকে
              সর্বোচ্চ গুরুত্ব দেয়। এই গোপনীয়তা নীতিতে বিস্তারিত ব্যাখ্যা করা হয়েছে যে আমরা
              কীভাবে আপনার তথ্য সংগ্রহ, সংরক্ষণ, প্রক্রিয়াকরণ ও সুরক্ষা প্রদান করি।
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              ২. আমরা কী ধরনের তথ্য সংগ্রহ করি
            </h2>
            <p>চাকরির আবেদন প্রক্রিয়া চলাকালীন আমরা নিম্নলিখিত তথ্য সংগ্রহ করে থাকি:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>আপনার নাম, ইমেইল ঠিকানা ও ফোন নম্বর।</li>
              <li>আপলোডকৃত রেজুমে বা সিভি (পিডিএফ ফাইল)।</li>
              <li>
                প্রার্থীর পূর্বের কাজের লিঙ্কসমূহ (যেমন: GitHub, পোর্টফোলিও, Behance
                ইত্যাদি)।
              </li>
              <li>লগইন এবং অ্যাকাউন্ট সংক্রান্ত মৌলিক প্রমাণীকরণ তথ্য।</li>
            </ul>
          </section>
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              ৩. তথ্যের ব্যবহার
            </h2>
            <p>সংগৃহীত তথ্যসমূহ শুধুমাত্র নিম্নলিখিত উদ্দেশ্যসমূহে ব্যবহৃত হয়:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>নির্দিষ্ট পদের জন্য প্রার্থীর যোগ্যতা মূল্যায়ন ও সাক্ষাৎকার প্রক্রিয়াকরণ।</li>
              <li>আবেদনের অগ্রগতি বা সিদ্ধান্ত সম্পর্কিত ইমেইল যোগাযোগ।</li>
              <li>ভবিষ্যতের সম্ভাব্য উপযুক্ত পদের জন্য ট্যালেন্ট পুলে তথ্য সংরক্ষণ।</li>
            </ul>
          </section>
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              ৪. তথ্য সুরক্ষা ও সংরক্ষণ
            </h2>
            <p>
              আপনার আপলোডকৃত রেজুমে এবং সংবেদনশীল তথ্যসমূহ সুরক্ষিত ক্লাউড স্টোরেজ ও
              এনক্রিপ্টেড ডেটাবেসে সংরক্ষণ করা হয়। শুধুমাত্র Prohor-এর অনুমোদিত অভ্যন্তরীণ
              রিক্রুটমেন্ট টিম এই তথ্য পর্যালোচনার সুযোগ পান। কোনো তৃতীয় পক্ষের কাছে প্রার্থীর
              তথ্য বাণিজ্যিকভাবে বিক্রি বা শেয়ার করা হয় না।
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              ৫. প্রার্থীর অধিকার
            </h2>
            <p>
              আপনার তথ্যে প্রবেশাধিকার, সংশোধন বা আমাদের ডেটাবেস থেকে আবেদন মুছে ফেলার
              অনুরোধ জানানোর পূর্ণ অধিকার আপনার রয়েছে। যেকোনো সময় এ সংক্রান্ত অনুরোধ জানাতে
              আমাদের সাথে যোগাযোগ করুন।
            </p>
          </section>
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">৬. যোগাযোগ</h2>
            <p>
              গোপনীয়তা সম্পর্কিত যেকোনো জিজ্ঞাসায় আমাদের ইমেইল করুন: <br />
              <span className="font-mono text-xs text-foreground">
                privacy@prohor.dev
              </span>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
