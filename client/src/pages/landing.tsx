import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-dark-slate text-white">
      {/* Header */}
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
              <a href="#" className="text-gray-300 hover:text-gaming-blue transition-colors">Home</a>
              <a href="#" className="text-gray-300 hover:text-gaming-blue transition-colors">Games</a>
              <a href="#" className="text-gray-300 hover:text-gaming-blue transition-colors">Community</a>
              <a href="#" className="text-gray-300 hover:text-gaming-blue transition-colors">Support</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <Card className="bg-card-bg rounded-2xl shadow-2xl border border-gray-700 p-8">
            <CardContent className="p-0">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-gaming-blue to-gaming-purple rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-gamepad text-white text-2xl"></i>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-gray-400">Sign in to your gaming account</p>
              </div>

              <Button 
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-gaming-blue to-gaming-purple hover:from-gaming-purple hover:to-gaming-blue text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-gaming-blue/50"
              >
                Sign In with Replit
              </Button>

              <div className="mt-8 text-center">
                <p className="text-gray-400 text-sm">
                  Don't have an account? 
                  <a href="/api/login" className="text-gaming-blue hover:text-gaming-purple transition-colors font-medium ml-1">
                    Create Account
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <div className="mt-6 bg-gaming-green/10 border border-gaming-green/20 rounded-xl p-4">
            <div className="flex items-center mb-2">
              <i className="fas fa-info-circle text-gaming-green mr-2"></i>
              <span className="text-gaming-green font-medium">Gaming Platform</span>
            </div>
            <div className="text-sm text-gray-300">
              <p>Connect with your Replit account to access your gaming profile and track your progress.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
