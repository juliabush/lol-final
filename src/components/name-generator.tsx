"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function NameGenerator({
  defaultUsername = "",
}: {
  defaultUsername?: string;
}) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const tCommon = useTranslations("common");
  const tChecker = useTranslations("checker");
  const tGenerator = useTranslations("generator");
  const tErrors = useTranslations("errors");

  const [username, setUsername] = useState(() => {
    return (
      defaultUsername ||
      (typeof window !== "undefined"
        ? localStorage.getItem("riotUsername")
        : null) ||
      ""
    );
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const finalUsername =
      defaultUsername ||
      (typeof window !== "undefined"
        ? localStorage.getItem("riotUsername")
        : null) ||
      "";
    setUsername(finalUsername);
  }, [defaultUsername]);

  useEffect(() => {
    if (typeof window !== "undefined" && username) {
      localStorage.setItem("riotUsername", username);
    }
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    setIsLoading(true);
    setError(null);

    try {
      if (username.length < 3) {
        throw new Error(tErrors("minLength"));
      }

      router.push(`/${locale}/generator/${encodeURIComponent(username)}`);
    } catch (error) {
      if (error instanceof Error) setError(error.message);
      else setError(tCommon("error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-lg border border-border/40 bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all p-6">
          <CardContent className="pt-0">
            <div className="mb-4">
              <h2 className="text-xl font-semibold tracking-tight text-left">
                {tGenerator("title", { default: "Name Generator" })}
              </h2>
              <div className="h-1 w-24 rounded mt-2 bg-gradient-to-r from-blue-600 to-purple-600" />
              <p className="text-sm text-muted-foreground mt-8 text-center">
                {tGenerator("subtitle", {
                  default:
                    "Find unique and available Riot ID taglines instantly.",
                })}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-start">
                <div className="flex-1">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium mb-1 text-muted-foreground"
                  >
                    {tChecker("inGameName")}
                  </label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={tChecker("enterUsername")}
                    required
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="min-w-[150px] font-medium transition-all hover:scale-[1.03]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        {tCommon("loading")}
                      </>
                    ) : (
                      tGenerator("findAvailableTaglines")
                    )}
                  </Button>
                </div>
              </div>
            </form>

            {error && (
              <p className="mt-4 text-sm text-destructive text-left">{error}</p>
            )}
          </CardContent>

          <CardFooter className="pt-2">
            <p className="text-center text-xs text-muted-foreground w-full mb-4">
              {tGenerator("footerNote", {
                default:
                  "We’ll suggest fresh and available taglines for your Riot ID.",
              })}
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
