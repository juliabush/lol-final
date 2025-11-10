"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { READABLE_REGIONS } from "@/lib/constants";

type Summoner = {
  name: string;
  region: string;
  level: number;
  profileIconUrl?: string;
};

const DISPLAY_OPTIONS = [25, 50, 100, 1000];

const FALLBACK_ICON =
  "https://ddragon.leagueoflegends.com/cdn/15.21.1/img/profileicon/29.png";

export default function LevelLeaderboardClient({
  leaderboardData,
}: {
  leaderboardData: Record<string, Summoner[]>;
}) {
  const [region, setRegion] = useState("na1");
  const [displayCount, setDisplayCount] = useState(25);

  const summoners = leaderboardData[region] ?? [];
  const sortedSummoners = summoners
    .slice()
    .sort((a, b) => b.level - a.level)
    .slice(0, displayCount);

  return (
    <div className="w-full p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-black">Level Leaderboard</h2>
          <div className="h-1 w-24 rounded mt-1 bg-gradient-to-r from-blue-600 to-purple-600" />
        </div>

        <div className="flex gap-4 flex-wrap items-center">
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="w-32 sm:w-auto">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              {READABLE_REGIONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={String(displayCount)}
            onValueChange={(val) => setDisplayCount(Number(val))}
          >
            <SelectTrigger className="w-32 sm:w-auto">
              <SelectValue placeholder="Top N" />
            </SelectTrigger>
            <SelectContent>
              {DISPLAY_OPTIONS.map((count) => (
                <SelectItem key={count} value={String(count)}>
                  Top {count}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="align-middle">
              <TableHead>Rank</TableHead>
              <TableHead>Summoner</TableHead>
              <TableHead>Level</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSummoners.map((s, index) => {
              const opggRegion = READABLE_REGIONS.includes(s.region)
                ? s.region
                : "na1";
              const opggName = s.name.replace("#", "-");

              return (
                <TableRow key={`${s.name}-${s.region}`}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="flex items-center gap-2 py-2">
                    <Image
                      src={s.profileIconUrl ?? FALLBACK_ICON}
                      alt={`${s.name} icon`}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="font-medium">{s.name}</span>
                  </TableCell>
                  <TableCell className="font-semibold">{s.level}</TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() =>
                        window.open(
                          `https://op.gg/lol/summoners/${opggRegion}/${opggName}`,
                          "_blank"
                        )
                      }
                      className="px-3 py-1 bg-blue-300 text-black rounded hover:bg-blue-400 transition font-semibold"
                    >
                      OP.GG ↗
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden space-y-4">
        {sortedSummoners.map((s, index) => {
          const opggRegion = READABLE_REGIONS.includes(s.region)
            ? s.region
            : "na1";
          const opggName = s.name.replace("#", "-");

          return (
            <Card
              key={`${s.name}-${s.region}`}
              className="p-4 bg-gray-900 text-gray-100 border border-gray-700 shadow-sm flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={s.profileIconUrl ?? FALLBACK_ICON}
                  alt={`${s.name} icon`}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <div className="font-bold text-lg mb-1">{`#${index + 1} ${
                    s.name
                  }`}</div>
                  <p>
                    <strong>Level:</strong> {s.level}
                  </p>
                  <p className="text-gray-400 text-sm mt-1 uppercase">
                    Region: {s.region}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 justify-end items-center">
                <button
                  onClick={() =>
                    window.open(
                      `https://op.gg/lol/summoners/${opggRegion}/${opggName}`,
                      "_blank"
                    )
                  }
                  className="px-3 py-1 bg-blue-300 text-black rounded hover:bg-blue-400 transition font-semibold"
                >
                  OP.GG ↗
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
