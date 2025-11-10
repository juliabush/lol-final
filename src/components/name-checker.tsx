"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function NameChecker({
  defaultUsername = "",
  defaultTagline = "",
}: {
  defaultUsername?: string;
  defaultTagline?: string;
}) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const tCommon = useTranslations("common");
  const tChecker = useTranslations("checker");
  const t = useTranslations("generator");

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
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

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
    try {
      router.push(`/${locale}/${encodeURIComponent(username)}/${tagline}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border border-border/40 bg-card/80 backdrop-blur-sm transition-all hover:shadow-xl p-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-left text-2xl font-semibold">
          Name Checker
        </CardTitle>
        <div className="h-1 w-20 bg-gradient-to-r from-primary to-purple-500 rounded-full mt-2" />
      </CardHeader>

      <CardContent>
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
              className="min-w-[120px] font-medium transition-all hover:scale-[1.03]"
            >
              {isLoading ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              ) : (
                tCommon("check")
              )}
            </Button>
          </div>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Enter your Riot ID and tagline to check name availability instantly.
        </p>
      </CardContent>
    </Card>
  );
}
