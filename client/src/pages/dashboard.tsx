import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

// same logo as Home/SignIn
import Logo from "@/components/assets/logo.png";

export default function Dashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to access the dashboard",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/signin";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: userGames, isLoading: gamesLoading } = useQuery({
    queryKey: ["/api/user/games"],
    enabled: !!user,
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      toast({ title: "Logged out", description: "You have been logged out successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      window.location.reload();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.reload();
        return;
      }
      toast({ title: "Error", description: "Failed to log out", variant: "destructive" });
    },
  });

  const handleLogout = () => logoutMutation.mutate();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0a0b] flex items-center justify-center">
        <Skeleton className="w-32 h-32 rounded-xl" />
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  // ------ derive fields from user.data (server source of truth) ------
  // If you have a typed shape, replace `any` with that type.
  const data: any = user.data ?? {};
  const core = data.Core ?? {};
  const gameData = data.GameData ?? {};
  const killer = gameData.Killer ?? {};
  const counselor = gameData.Counselor ?? {};

  const level = Number(core.Level ?? 0);
  const np = Number(core.NP ?? 0);
  const hoursPlayed = Number(core.HoursPlayed ?? 0);
  const gamesPlayed =
    Number(killer.GamesPlayed ?? 0) + Number(counselor.GamesPlayed ?? 0);
  const achievements: string[] = Array.isArray(data.Achievements) ? data.Achievements : [];
  const achievementsCount = achievements.length;

  const killsKiller = Number(data.Kills?.Killer ?? 0);
  const killsCounselor = Number(data.Kills?.Counselor ?? 0);
  const totalKills = killsKiller + killsCounselor;

  const killerWins = Number(killer.GamesWon ?? 0);
  const killerPlayed = Number(killer.GamesPlayed ?? 0);
  const killerWinRate = killerPlayed ? Math.round((killerWins / killerPlayed) * 100) : 0;

  const counselorWins = Number(counselor.GamesWon ?? 0);
  const counselorPlayed = Number(counselor.GamesPlayed ?? 0);
  const counselorWinRate = counselorPlayed ? Math.round((counselorWins / counselorPlayed) * 100) : 0;

  const perks: unknown[] = Array.isArray(gameData.Perks) ? gameData.Perks : [];
  const isBanned = Boolean(data.Banned);

  const createdAtMs = Number(core.createdAt ?? 0);
  const createdAt = createdAtMs ? new Date(createdAtMs) : null;

  const nextLevelNeed = Math.max(0, level * 1000 - np);
  const progressPct = Math.min(100, ((np % 1000) / 1000) * 100);

  return (
    <div className="min-h-screen bg-[#0b0a0b] text-white">
      {/* ===== Header (matches Home/SignIn) ===== */}
      <header className="sticky top-0 z-40 bg-black/50 backdrop-blur-sm border-b border-white/10">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Logo pinned to real left edge */}
          <Link href="/" aria-label="Project 1981" className="flex items-center">
            <img
              src={Logo}
              alt="Project 1981"
              className="h-10 md:h-12 w-auto object-contain select-none"
              draggable={false}
            />
          </Link>

          {/* Right nav + profile + logout */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-6 text-sm text-white/90">
              <Link href="/" className="hover:text-white">News</Link>
              <a href="/#games" className="hover:text-white">Patches</a>
              <a href="/#community" className="hover:text-white">Community</a>
              <a href="/#forums" className="hover:text-white">Forums</a>
            </nav>

            {/* Profile summary */}
            <div className="flex items-center gap-3 pl-4">
              <div className="text-right leading-tight">
                <p className="text-white font-medium">
                  {user.displayName || user.username}
                </p>
                <p className="text-xs text-white/60">Level {level}</p>
              </div>
              <img
                src={
                  user.profileImageUrl ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80"
                }
                alt="User Avatar"
                className="w-10 h-10 rounded-xl object-cover border-2 border-white/30"
              />
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white"
                title="Log out"
              >
                <i className="fas fa-sign-out-alt" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* ===== Dashboard Content ===== */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back,{" "}
            <span className="text-red-500">
              {user.displayName || user.username}
            </span>
            !
          </h2>
          <p className="text-white/70">Ready to continue your gaming adventure?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Games Played */}
          <Card className="bg-white/[0.04] rounded-2xl border border-white/10 hover:border-white/20 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-600/20 rounded-xl flex items-center justify-center">
                  <i className="fas fa-gamepad text-red-500 text-xl"></i>
                </div>
                <span className="text-sm text-white/60">Total</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{gamesPlayed}</h3>
              <p className="text-white/70 text-sm">Games Played</p>
            </CardContent>
          </Card>

          {/* Hours Played */}
          <Card className="bg-white/[0.04] rounded-2xl border border-white/10 hover:border-white/20 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <i className="fas fa-clock text-green-400 text-xl"></i>
                </div>
                <span className="text-sm text-white/60">Total</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{hoursPlayed}</h3>
              <p className="text-white/70 text-sm">Hours Played</p>
            </CardContent>
          </Card>

          {/* Friends */}
          <Card className="bg-white/[0.04] rounded-2xl border border-white/10 hover:border-white/20 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <i className="fas fa-users text-purple-400 text-xl"></i>
                </div>
                <span className="text-sm text-white/60">Active</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{user.friendsCount || 0}</h3>
              <p className="text-white/70 text-sm">Friends</p>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-white/[0.04] rounded-2xl border border-white/10 hover:border-white/20 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <i className="fas fa-trophy text-orange-400 text-xl"></i>
                </div>
                <span className="text-sm text-white/60">Earned</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{achievementsCount}</h3>
              <p className="text-white/70 text-sm">Achievements</p>
            </CardContent>
          </Card>
        </div>

        {/* Kills & JSON Data Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Combat & Match Stats */}
          <Card className="lg:col-span-2 bg-white/[0.04] rounded-2xl border border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Combat & Match Stats</h3>
                <span className="text-sm text-white/60">From your profile data</span>
              </div>

              {/* Totals */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-xl bg-black/30 border border-white/10 p-4">
                  <div className="text-sm text-white/60">Total Kills</div>
                  <div className="mt-1 text-2xl font-extrabold text-white">{totalKills}</div>
                </div>
                <div className="rounded-xl bg-black/30 border border-white/10 p-4">
                  <div className="text-sm text-white/60">Killer Kills</div>
                  <div className="mt-1 text-2xl font-extrabold text-white">{killsKiller}</div>
                </div>
                <div className="rounded-xl bg-black/30 border border-white/10 p-4">
                  <div className="text-sm text-white/60">Counselor Kills</div>
                  <div className="mt-1 text-2xl font-extrabold text-white">{killsCounselor}</div>
                </div>
                <div className="rounded-xl bg-black/30 border border-white/10 p-4">
                  <div className="text-sm text-white/60">Hours Played</div>
                  <div className="mt-1 text-2xl font-extrabold text-white">{hoursPlayed}</div>
                </div>
              </div>

              {/* Role breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="rounded-xl bg-black/30 border border-white/10 p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Killer</h4>
                    <span className="text-xs text-white/60">{killerWinRate}% win rate</span>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-2xl font-extrabold">{killerWins}</div>
                      <div className="text-xs text-white/60">Wins</div>
                    </div>
                    <div>
                      <div className="text-2xl font-extrabold">{killerPlayed}</div>
                      <div className="text-xs text-white/60">Played</div>
                    </div>
                    <div>
                      <div className="text-2xl font-extrabold">{killsKiller}</div>
                      <div className="text-xs text-white/60">Kills</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-black/30 border border-white/10 p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Counselor</h4>
                    <span className="text-xs text-white/60">{counselorWinRate}% win rate</span>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-2xl font-extrabold">{counselorWins}</div>
                      <div className="text-xs text-white/60">Wins</div>
                    </div>
                    <div>
                      <div className="text-2xl font-extrabold">{counselorPlayed}</div>
                      <div className="text-xs text-white/60">Played</div>
                    </div>
                    <div>
                      <div className="text-2xl font-extrabold">{killsCounselor}</div>
                      <div className="text-xs text-white/60">Kills</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements, Perks & Account */}
          <Card className="bg-white/[0.04] rounded-2xl border border-white/10">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Profile Data</h3>

              {/* Banned banner */}
              {isBanned && (
                <div className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 text-red-300 px-3 py-2 text-sm">
                  Account flagged: Banned
                </div>
              )}

              {/* Created at */}
              <div className="mb-4 text-sm text-white/70">
                <span className="text-white/60">Created:</span>{" "}
                {createdAt ? createdAt.toLocaleDateString() : "—"}
              </div>

              {/* Achievements */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Achievements</h4>
                  <span className="text-xs text-white/60">{achievements.length} total</span>
                </div>
                {achievements.length ? (
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-auto pr-1">
                    {achievements.slice(0, 16).map((a, i) => (
                      <span
                        key={`${a}-${i}`}
                        className="inline-block text-xs bg-black/40 border border-white/10 rounded-full px-3 py-1"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-white/60">No achievements yet.</p>
                )}
              </div>

              {/* Perks */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Perks</h4>
                  <span className="text-xs text-white/60">{perks.length} owned</span>
                </div>
                <p className="text-sm text-white/60">
                  (Perk details not displayed here—just showing a count. You can render them when you define their shape.)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Games */}
          <div className="lg:col-span-2">
            <Card className="bg-white/[0.04] rounded-2xl border border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Recent Games</h3>
                  <Button variant="ghost" className="text-white/80 hover:text-white text-sm">
                    View All
                  </Button>
                </div>

                {gamesLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-4 p-4">
                        <Skeleton className="w-16 h-16 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userGames && userGames.length > 0 ? (
                      userGames.map((session: any) => (
                        <div
                          key={session.id}
                          className="flex items-center space-x-4 p-4 bg-black/30 rounded-xl hover:bg-black/40 transition-all"
                        >
                          <img
                            src={
                              session.game?.thumbnail ||
                              "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80"
                            }
                            alt="Game Thumbnail"
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-white">
                              {session.game?.name || "Unknown Game"}
                            </h4>
                            <p className="text-sm text-white/70">
                              {session.game?.genre || "Unknown Genre"}
                            </p>
                            <p className="text-xs text-white/50">
                              Played {new Date(session.lastPlayed).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-green-400 font-medium">
                              {Math.round(((session.playtime || 0) / 60) * 10) / 10}h
                            </span>
                            <p className="text-xs text-white/60">playtime</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-white/70">
                        <i className="fas fa-gamepad text-4xl mb-4 opacity-50"></i>
                        <p>No games played yet</p>
                        <p className="text-sm">Start playing to see your game history here!</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Player Profile */}
            <Card className="bg-white/[0.04] rounded-2xl border border-white/10">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Player Profile</h3>

                <div className="text-center mb-4">
                  <img
                    src={
                      user.profileImageUrl ||
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120"
                    }
                    alt="Player Avatar"
                    className="w-20 h-20 rounded-xl object-cover mx-auto mb-3 border-2 border-white/30"
                  />
                  <h4 className="font-bold text-white">{user.displayName || user.username}</h4>
                  <p className="text-sm text-white/70">{user.title}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/70">Level</span>
                    <span className="text-white font-medium">{level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">NP</span>
                    <span className="text-white font-medium">{np}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Rank</span>
                    <span className="text-green-400 font-medium">{user.rank ?? "-"}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/70">Next Level</span>
                    <span className="text-white/70">{nextLevelNeed} NP</span>
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-red-600 to-red-800 h-2 rounded-full"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/[0.04] rounded-2xl border border-white/10">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-xl transition-all">
                    <i className="fas fa-play mr-2"></i>
                    Join Random Game
                  </Button>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-xl transition-all">
                    <i className="fas fa-users mr-2"></i>
                    Create Party
                  </Button>
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-xl transition-all">
                    <i className="fas fa-store mr-2"></i>
                    Visit Store
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
