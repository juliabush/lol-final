"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AccountTracker({
  defaultUsername = "",
  defaultTagline = "",
}: {
  defaultUsername?: string;
  defaultTagline?: string;
}) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations("tracker");
  const tCommon = useTranslations("common");
  const tChecker = useTranslations("checker");

  const [username, setUsername] = useState(() => {
    return (
      defaultUsername ||
      (typeof window !== "undefined"
        ? localStorage.getItem("riotUsername")
        : null) ||
      ""
    );
  });
  const [tagline, setTagline] = useState(() => {
    return (
      defaultTagline ||
      (typeof window !== "undefined"
        ? localStorage.getItem("riotTagline")
        : null) ||
      ""
    );
  });
  const [showTooltip, setShowTooltip] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const finalUsername =
      defaultUsername ||
      (typeof window !== "undefined"
        ? localStorage.getItem("riotUsername")
        : null) ||
      "";
    const finalTagline =
      defaultTagline ||
      (typeof window !== "undefined"
        ? localStorage.getItem("riotTagline")
        : null) ||
      "";
    setUsername(finalUsername);
    setTagline(finalTagline);
  }, [defaultUsername, defaultTagline]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (username) localStorage.setItem("riotUsername", username);
      if (tagline) localStorage.setItem("riotTagline", tagline);
    }
  }, [username, tagline]);

  const handleTaglineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isValid = /^[A-Za-z0-9]*$/.test(value);

    if (!isValid && value !== "") {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
      return;
    }

    if (value.length <= 5) setTagline(value.toUpperCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !tagline) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/riot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "getAccountByRiotId",
          username,
          tagline,
        }),
      });

      if (!response.ok) throw new Error("Account not found");

      const data = await response.json();
      if (data.puuid) router.push(`/${locale}/tracker/${data.puuid}`);
    } catch (error) {
      setError(
        t("playerNotFound", {
          gameName: username,
          tagLine: tagline,
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-lg border border-border/40 bg-card/80 backdrop-blur-sm transition-all hover:shadow-xl p-6">
          {/* 🔹 Title */}
          <CardHeader className="pb-0">
            <CardTitle className="text-left text-xl font-semibold tracking-tight">
              {t("title", { default: "Account Tracker" })}
            </CardTitle>
            <div className="h-1 w-24 bg-gradient-to-r from-primary to-purple-500 rounded-full mt-2" />
          </CardHeader>

          <CardContent className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
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

                <div className="relative w-full sm:w-28">
                  <label
                    htmlFor="tagline"
                    className="block text-sm font-medium mb-1 text-muted-foreground"
                  >
                    {tChecker("tagline")}
                  </label>
                  <Input
                    id="tagline"
                    value={tagline}
                    onChange={handleTaglineChange}
                    placeholder={tChecker("tagPlaceholder")}
                    maxLength={5}
                    minLength={3}
                    required
                  />
                  <AnimatePresence>
                    {showTooltip && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full mt-2 px-2 py-1 text-xs bg-destructive text-destructive-foreground rounded-md shadow-sm whitespace-nowrap"
                      >
                        {tChecker("onlyLettersNumbers")}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex justify-center">
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
                    tCommon("track")
                  )}
                </Button>
              </div>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              {t("subtitle", {
                default:
                  "Enter your Riot ID to view your match history, performance stats, and leaderboard rank instantly.",
              })}
            </p>
          </CardContent>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <CardFooter className="bg-destructive/10 border-t border-destructive/30 mt-4 rounded-b-lg pt-2">
                  <p className="text-destructive font-medium text-center w-full">
                    {error}
                  </p>
                </CardFooter>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  );
}
