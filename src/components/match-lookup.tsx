"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { READABLE_REGIONS } from "@/lib/constants";

export default function ActiveGameForm() {
  const [summonerId, setSummonerId] = useState("");
  const [tag, setTag] = useState("");
  const [region, setRegion] = useState("na1");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await fetch(
        `/api/active-game?summonerId=${encodeURIComponent(
          summonerId
        )}&region=${region}`
      );
      const result = await res.json();
      console.log(res.status, await res.text());
      if (res.ok) setData(result);
      else setError(result.error || "Failed to find summoner");
    } catch {
      setError("Failed to find summoner");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl"
      >
        <Card className="shadow-lg border border-border/40 bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all p-6">
          <CardContent className="pt-0">
            <div className="mb-4">
              <h2 className="text-2xl font-bold tracking-tight text-left">
                Active Game Lookup
              </h2>
              <div className="h-1 w-24 rounded mt-2 bg-gradient-to-r from-blue-600 to-purple-600" />
              <p className="text-sm text-muted-foreground mt-3 text-center">
                Search for an active match by summoner ID and region.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-end justify-between">
                <div className="flex-[1.5]">
                  <label className="block text-sm font-medium mb-1 text-muted-foreground">
                    Summoner ID
                  </label>
                  <Input
                    value={summonerId}
                    onChange={(e) => setSummonerId(e.target.value)}
                    placeholder="Enter Summoner ID..."
                    required
                    className="w-full"
                  />
                </div>
                <div className="flex-[1]">
                  <label className="block text-sm font-medium mb-1 text-muted-foreground">
                    Tag
                  </label>
                  <Input
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="TAG"
                    required
                    className="w-full"
                  />
                </div>
                <div className="flex-[0.7]">
                  <label className="block text-sm font-medium mb-1 text-muted-foreground">
                    Region
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full border border-border/40 rounded px-2 py-1.5 mt-1 h-9 text-sm bg-background"
                  >
                    {READABLE_REGIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="min-w-[150px] h-10 font-medium transition-all hover:scale-[1.03]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        Loading...
                      </>
                    ) : (
                      "Lookup Match"
                    )}
                  </Button>
                </div>
              </div>
            </form>

            {error && (
              <p className="mt-4 text-sm text-destructive text-left">{error}</p>
            )}

            {data && (
              <div className="mt-4 border-t pt-4">
                <h3 className="font-bold mb-2">Active Game Info</h3>
                <p>Game Name: {data.gameName || "N/A"}</p>
                <p>Tag: {data.tag || "N/A"}</p>
                <p>Region: {region}</p>
              </div>
            )}
          </CardContent>

          <CardFooter className="pt-2">
            <p className="text-center text-xs text-muted-foreground w-full">
              Enter a valid summoner ID and region to find the current active
              game.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
