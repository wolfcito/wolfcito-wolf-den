import { getTranslations } from "next-intl/server";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { requireProfile } from "@/lib/accessGuards";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await requireProfile({ locale, nextPath: "/settings" });
  const t = await getTranslations({ locale, namespace: "SettingsPage" });

  return (
    <div className="space-y-6 text-wolf-foreground">
      <section className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {t("appearance.title")}
          </h3>
          <p className="mt-2 text-sm text-white/70">
            {t("appearance.description")}
          </p>
          <div className="mt-4">
            <ThemeToggle />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white">
            {t("language.title")}
          </h3>
          <p className="mt-2 text-sm text-white/70">
            {t("language.description")}
          </p>
          <div className="mt-4">
            <LanguageSwitcher />
          </div>
        </div>
      </section>
    </div>
  );
}
