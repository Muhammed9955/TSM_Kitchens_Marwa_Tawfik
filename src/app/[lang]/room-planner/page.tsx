import type { Metadata } from "next";
import RoomPlannerPage from "@/components/RoomPlannerPage";
import { Locale } from "@/locales/dictionaries";

export async function generateStaticParams() {
  return [{ lang: "ar" }, { lang: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }> | { lang: string };
}): Promise<Metadata> {
  const { lang } = await Promise.resolve(params);
  const locale = lang as Locale;

  if (locale === "ar") {
    return {
      title: "مخطط مساحة المطبخ التفاعلي 2D | TSM Kitchens",
      description: "صمم مطبخك بمخطط المساحة التفاعلي ثلاثي الحركة. حدد أبعاد الغرفة وشكلها واحصل على تخطيطات مخصصة ودقيقة من المهندسة مروة توفيق.",
      alternates: {
        canonical: "https://tsm.com.eg/room-planner",
        languages: {
          "ar": "https://tsm.com.eg/room-planner",
          "en": "https://tsm.com.eg/en/room-planner",
        },
      },
    };
  } else {
    return {
      title: "Interactive 2D Kitchen Room Planner | TSM Kitchens",
      description: "Plan your kitchen layout with our interactive room dimension tool. Select room shapes, define dimensions, and unlock optimal layout suggestions from Eng. Marwa Tawfik.",
      alternates: {
        canonical: "https://tsm.com.eg/en/room-planner",
        languages: {
          "ar": "https://tsm.com.eg/room-planner",
          "en": "https://tsm.com.eg/en/room-planner",
        },
      },
    };
  }
}

export default function PlannerPageRoute() {
  return <RoomPlannerPage />;
}
