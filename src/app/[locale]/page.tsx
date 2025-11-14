import { NameChecker } from "@/components/name-checker";
import { SearchContainer } from "@/components/search-container";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("checker");

  return {
    title: `${t("metaTitle")} | LolNames.gg`,
    description: t("metaDescription"),
    alternates: {
      canonical: `https://lolnames.gg/${locale}`,
    },
    openGraph: {
      title: `${t("metaTitle")} | LolNames.gg`,
      description: t("metaDescription"),
      url: `https://lolnames.gg/${locale}`,
      siteName: "LolNames.gg",
      type: "website",
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("checker");

  return (
    <SearchContainer title={t("title")} activeTab="checker">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
          <div className="bg-card p-6 rounded shadow-lg flex-grow">
            <NameChecker />
          </div>

          <Card className="bg-card p-4 rounded shadow-md flex-grow">
            <CardContent>
              <h2 className="font-semibold text-lg mb-2">
                {t("nameGenerator")}
              </h2>
              <p>
                Looking for a free tagline for your dream in-game name? Try the{" "}
                <Link
                  href={`/${locale}/generator`}
                  className="text-primary hover:underline font-medium"
                >
                  Generator
                </Link>
                .
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card p-4 rounded shadow-md flex-grow">
            <CardContent>
              <h2 className="font-semibold text-lg mb-2">
                {t("accountTracker")}
              </h2>
              <p>
                Want to follow a specific account through name changes? Use the{" "}
                <Link
                  href={`/${locale}/tracker`}
                  className="text-primary hover:underline font-medium"
                >
                  Account Tracker
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          <Card className="bg-card p-4 pt-6 pb-10 rounded shadow-lg flex-grow">
            <CardContent>
              <h2 className="font-semibold text-lg mb-2">
                {t("checkGenerateTrack")}
              </h2>
              <p>{t("toolDescription")}</p>
            </CardContent>
          </Card>

          <Card className="bg-card p-4 pt-6 pb-10 rounded shadow-lg flex-grow">
            <CardContent>
              <h2 className="font-semibold text-lg mb-2">{t("howItWorks")}</h2>
              <p>{t("howItWorksDescription")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </SearchContainer>
  );
}
