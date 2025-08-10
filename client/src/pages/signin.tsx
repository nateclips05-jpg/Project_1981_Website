import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { loginSchema, type LoginCredentials } from "@shared/schema";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

export default function SignIn() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading } = useAuth();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      window.location.href = "/dashboard";
    }
  }, [isAuthenticated, isLoading]);
  
  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      await apiRequest("/api/auth/login", "POST", credentials);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      window.location.href = "/dashboard";
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginCredentials) => {
    loginMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-slate flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gaming-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-slate text-white">
      {/* Header */}
      <header className="bg-card-bg/50 backdrop-blur-sm border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-r from-gaming-blue to-gaming-purple rounded-xl flex items-center justify-center">
                  <i className="fas fa-cube text-white text-xl"></i>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gaming-blue to-gaming-purple bg-clip-text text-transparent">
                  RoboGame Hub
                </h1>
              </div>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-gray-300 hover:text-gaming-blue transition-colors">Home</Link>
              <a href="/#games" className="text-gray-300 hover:text-gaming-blue transition-colors">Games</a>
              <a href="/#community" className="text-gray-300 hover:text-gaming-blue transition-colors">Community</a>
              <a href="/#support" className="text-gray-300 hover:text-gaming-blue transition-colors">Support</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Sign In Card */}
          <Card className="bg-card-bg rounded-2xl shadow-2xl border border-gray-700 p-8">
            <CardContent className="p-0">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-gaming-blue to-gaming-purple rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-gamepad text-white text-2xl"></i>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
                <p className="text-gray-400">Enter your Roblox credentials to continue</p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Roblox Username</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Enter your Roblox username"
                            className="bg-dark-slate border-gray-600 text-white placeholder-gray-400 focus:border-gaming-blue"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Enter your password"
                            className="bg-dark-slate border-gray-600 text-white placeholder-gray-400 focus:border-gaming-blue"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="w-full bg-gradient-to-r from-gaming-blue to-gaming-purple hover:from-gaming-purple hover:to-gaming-blue text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-gaming-blue/50 disabled:opacity-50 disabled:transform-none"
                  >
                    {loginMutation.isPending ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  Don't have an account? Contact your game administrator.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <div className="mt-6 bg-gaming-green/10 border border-gaming-green/20 rounded-xl p-4">
            <div className="flex items-center mb-2">
              <i className="fas fa-info-circle text-gaming-green mr-2"></i>
              <span className="text-gaming-green font-medium">Demo Accounts</span>
            </div>
            <div className="text-sm text-gray-300 space-y-1">
              <p><strong>Username:</strong> testuser | <strong>Password:</strong> 12345</p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link href="/">
              <Button variant="ghost" className="text-gray-400 hover:text-gaming-blue transition-colors">
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}