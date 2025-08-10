import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-dark-slate text-white">
      {/* Navigation Header */}
      <header className="bg-card-bg/50 backdrop-blur-sm border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-gaming-blue to-gaming-purple rounded-xl flex items-center justify-center">
                <i className="fas fa-cube text-white text-xl"></i>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gaming-blue to-gaming-purple bg-clip-text text-transparent">
                RoboGame Hub
              </h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-gaming-blue hover:text-gaming-purple transition-colors">Home</Link>
              <a href="#games" className="text-gray-300 hover:text-gaming-blue transition-colors">Games</a>
              <a href="#community" className="text-gray-300 hover:text-gaming-blue transition-colors">Community</a>
              <a href="#support" className="text-gray-300 hover:text-gaming-blue transition-colors">Support</a>
            </nav>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button className="bg-gaming-blue hover:bg-gaming-purple text-white px-6 py-2 rounded-xl transition-all">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/signin">
                  <Button className="bg-gaming-blue hover:bg-gaming-purple text-white px-6 py-2 rounded-xl transition-all">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gaming-blue via-gaming-purple to-gaming-green bg-clip-text text-transparent">
              Welcome to RoboGame Hub
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              The ultimate Roblox gaming platform where players connect, compete, and conquer. 
              Track your stats, join epic battles, and rise through the ranks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-gaming-blue to-gaming-purple hover:from-gaming-purple hover:to-gaming-blue text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/signin">
                  <Button className="bg-gradient-to-r from-gaming-blue to-gaming-purple hover:from-gaming-purple hover:to-gaming-blue text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105">
                    Start Playing Now
                  </Button>
                </Link>
              )}
              <Button variant="outline" className="border-gaming-blue text-gaming-blue hover:bg-gaming-blue hover:text-white py-4 px-8 rounded-xl text-lg transition-all">
                <i className="fas fa-play mr-2"></i>
                Watch Trailer
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="games" className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">
            Epic Gaming Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="bg-card-bg rounded-2xl border border-gray-700 hover:border-gaming-blue/50 transition-all group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gaming-blue/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gaming-blue/30 transition-all">
                  <i className="fas fa-trophy text-gaming-blue text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Competitive Rankings</h3>
                <p className="text-gray-400 leading-relaxed">
                  Climb the leaderboards and compete with players worldwide. Earn ranks, unlock achievements, and show off your skills.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-card-bg rounded-2xl border border-gray-700 hover:border-gaming-purple/50 transition-all group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gaming-purple/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gaming-purple/30 transition-all">
                  <i className="fas fa-users text-gaming-purple text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Team Play</h3>
                <p className="text-gray-400 leading-relaxed">
                  Join friends, create parties, and dominate together. Build your squad and take on epic challenges as a team.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-card-bg rounded-2xl border border-gray-700 hover:border-gaming-green/50 transition-all group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gaming-green/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gaming-green/30 transition-all">
                  <i className="fas fa-chart-line text-gaming-green text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Progress Tracking</h3>
                <p className="text-gray-400 leading-relaxed">
                  Monitor your gameplay statistics, track improvement over time, and analyze your performance across different game modes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-card-bg/30">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">
            Platform Statistics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-gaming-blue mb-2">50K+</div>
              <div className="text-gray-400">Active Players</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gaming-purple mb-2">100+</div>
              <div className="text-gray-400">Game Modes</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gaming-green mb-2">1M+</div>
              <div className="text-gray-400">Matches Played</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gaming-orange mb-2">24/7</div>
              <div className="text-gray-400">Server Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card-bg border-t border-gray-700 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-gaming-blue to-gaming-purple rounded-lg flex items-center justify-center">
                  <i className="fas fa-cube text-white"></i>
                </div>
                <h3 className="text-xl font-bold text-white">RoboGame Hub</h3>
              </div>
              <p className="text-gray-400">The premier Roblox gaming platform for competitive players.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Games</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-gaming-blue transition-colors">Battle Royale</a></li>
                <li><a href="#" className="hover:text-gaming-blue transition-colors">Racing</a></li>
                <li><a href="#" className="hover:text-gaming-blue transition-colors">Adventure</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-gaming-blue transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-gaming-blue transition-colors">Forums</a></li>
                <li><a href="#" className="hover:text-gaming-blue transition-colors">Events</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-gaming-blue transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-gaming-blue transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-gaming-blue transition-colors">Bug Reports</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 RoboGame Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}