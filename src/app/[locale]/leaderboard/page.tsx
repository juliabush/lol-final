import LevelLeaderboardClient from "@/components/leaderboard";

export default function Page() {
  const leaderboardData = {};

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <LevelLeaderboardClient leaderboardData={leaderboardData} />
    </main>
  );
}
