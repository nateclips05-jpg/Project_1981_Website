import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Dashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: userGames, isLoading: gamesLoading } = useQuery({
    queryKey: ["/api/user/games"],
    enabled: !!user,
    retry: false,
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-slate flex items-center justify-center">
        <Skeleton className="w-32 h-32 rounded-xl" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-slate text-white">
      {/* Dashboard Header */}
      <header className="bg-card-bg/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-gaming-blue to-gaming-purple rounded-xl flex items-center justify-center">
                <i className="fas fa-cube text-white text-xl"></i>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gaming-blue to-gaming-purple bg-clip-text text-transparent">
                RoboGame Hub
              </h1>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-white font-medium">{user.displayName || user.username}</p>
                  <p className="text-sm text-gray-400">Level {user.level}</p>
                </div>
                <img 
                  src={user.profileImageUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80"} 
                  alt="User Avatar" 
                  className="w-10 h-10 rounded-xl object-cover border-2 border-gaming-blue"
                />
              </div>
              <Button 
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                <i className="fas fa-sign-out-alt"></i>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, <span className="text-gaming-blue">{user.displayName || user.username}</span>!
          </h2>
          <p className="text-gray-400">Ready to continue your gaming adventure?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Games Played */}
          <Card className="bg-card-bg rounded-2xl border border-gray-700 hover:border-gaming-blue/50 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gaming-blue/20 rounded-xl flex items-center justify-center">
                  <i className="fas fa-gamepad text-gaming-blue text-xl"></i>
                </div>
                <span className="text-sm text-gray-400">Total</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{user.gamesPlayed || 0}</h3>
              <p className="text-gray-400 text-sm">Games Played</p>
            </CardContent>
          </Card>

          {/* Hours Played */}
          <Card className="bg-card-bg rounded-2xl border border-gray-700 hover:border-gaming-green/50 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gaming-green/20 rounded-xl flex items-center justify-center">
                  <i className="fas fa-clock text-gaming-green text-xl"></i>
                </div>
                <span className="text-sm text-gray-400">Total</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{user.hoursPlayed || 0}</h3>
              <p className="text-gray-400 text-sm">Hours Played</p>
            </CardContent>
          </Card>

          {/* Friends */}
          <Card className="bg-card-bg rounded-2xl border border-gray-700 hover:border-gaming-purple/50 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gaming-purple/20 rounded-xl flex items-center justify-center">
                  <i className="fas fa-users text-gaming-purple text-xl"></i>
                </div>
                <span className="text-sm text-gray-400">Active</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{user.friendsCount || 0}</h3>
              <p className="text-gray-400 text-sm">Friends</p>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-card-bg rounded-2xl border border-gray-700 hover:border-gaming-orange/50 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gaming-orange/20 rounded-xl flex items-center justify-center">
                  <i className="fas fa-trophy text-gaming-orange text-xl"></i>
                </div>
                <span className="text-sm text-gray-400">Earned</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{user.achievements || 0}</h3>
              <p className="text-gray-400 text-sm">Achievements</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Games */}
          <div className="lg:col-span-2">
            <Card className="bg-card-bg rounded-2xl border border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Recent Games</h3>
                  <Button variant="ghost" className="text-gaming-blue hover:text-gaming-purple transition-colors text-sm">
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
                        <div key={session.id} className="flex items-center space-x-4 p-4 bg-dark-slate rounded-xl hover:bg-card-hover transition-all">
                          <img 
                            src={session.game?.thumbnail || "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80"} 
                            alt="Game Thumbnail" 
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-white">{session.game?.name || 'Unknown Game'}</h4>
                            <p className="text-sm text-gray-400">{session.game?.genre || 'Unknown Genre'}</p>
                            <p className="text-xs text-gray-500">
                              Played {new Date(session.lastPlayed).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-gaming-green font-medium">
                              {Math.round((session.playtime || 0) / 60 * 10) / 10}h
                            </span>
                            <p className="text-xs text-gray-400">playtime</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400">
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
            <Card className="bg-card-bg rounded-2xl border border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Player Profile</h3>
                
                <div className="text-center mb-4">
                  <img 
                    src={user.profileImageUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120"} 
                    alt="Player Avatar" 
                    className="w-20 h-20 rounded-xl object-cover mx-auto mb-3 border-2 border-gaming-blue"
                  />
                  <h4 className="font-bold text-white">{user.displayName || user.username}</h4>
                  <p className="text-sm text-gray-400">{user.title}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Level</span>
                    <span className="text-gaming-blue font-medium">{user.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">XP</span>
                    <span className="text-white font-medium">{user.xp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rank</span>
                    <span className="text-gaming-green font-medium">{user.rank}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Next Level</span>
                    <span className="text-gray-400">{Math.max(0, ((user.level || 1) * 1000) - (user.xp || 0))} XP</span>
                  </div>
                  <div className="w-full bg-dark-slate rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-gaming-blue to-gaming-purple h-2 rounded-full" 
                      style={{ width: `${Math.min(100, ((user.xp || 0) % 1000) / 10)}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-card-bg rounded-2xl border border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full bg-gaming-blue hover:bg-gaming-purple text-white font-medium py-3 px-4 rounded-xl transition-all">
                    <i className="fas fa-play mr-2"></i>
                    Join Random Game
                  </Button>
                  <Button className="w-full bg-gaming-green hover:bg-green-600 text-white font-medium py-3 px-4 rounded-xl transition-all">
                    <i className="fas fa-users mr-2"></i>
                    Create Party
                  </Button>
                  <Button className="w-full bg-gaming-orange hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-xl transition-all">
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
