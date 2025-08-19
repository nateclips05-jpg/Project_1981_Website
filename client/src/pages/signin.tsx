import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { loginSchema, type LoginCredentials } from "@shared/schema";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

// same logo as Home
import Logo from "@/components/assets/logo.png";

export default function SignIn() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading } = useAuth();

  // eye toggle state
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      window.location.href = "/dashboard";
    }
  }, [isAuthenticated, isLoading]);

  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      await apiRequest("POST", "/api/auth/login", credentials);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Logged in successfully!" });
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

  const onSubmit = (data: LoginCredentials) => loginMutation.mutate(data);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0a0b] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/60" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0a0b] text-white">
      {/* ===== Header (matches Home) ===== */}
      <header className="sticky top-0 z-40 bg-black/50 backdrop-blur-sm border-b border-white/10">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Logo pinned left */}
          <Link href="/" aria-label="Project 1981" className="flex items-center">
            <img
              src={Logo}
              alt="Project 1981"
              className="h-10 md:h-12 w-auto object-contain select-none"
              draggable={false}
            />
          </Link>

          {/* Right nav + auth-aware CTA */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/90">
            <Link href="/" className="hover:text-white">
              News
            </Link>
            <a href="/#games" className="hover:text-white">
              Patches
            </a>
            <a href="/#community" className="hover:text-white">
              Community
            </a>
            <a href="/#forums" className="hover:text-white">
              Forums
            </a>

            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button className="bg-red-600 hover:bg-red-700 rounded-full px-4 py-1 font-bold">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/signin">
                <Button className="bg-red-600 hover:bg-red-700 rounded-full px-4 py-1 font-bold">
                  Sign In
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* ===== Main ===== */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="bg-black/40 rounded-2xl shadow-2xl border border-white/10 p-8">
            <CardContent className="p-0">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-user text-white text-2xl" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
                <p className="text-white/70">Enter your credentials to continue</p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Username */}
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Username</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            autoComplete="username"
                            placeholder="Enter your username"
                            className="bg-black/30 border-white/20 text-white placeholder-white/40 focus:border-white/40"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  {/* Password with eye toggle */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              autoComplete="current-password"
                              placeholder="Enter your password"
                              className="bg-black/30 border-white/20 text-white placeholder-white/40 focus:border-white/40 pr-10"
                            />
                            <button
                              type="button"
                              aria-label={showPassword ? "Hide password" : "Show password"}
                              onClick={() => setShowPassword((s) => !s)}
                              className="absolute inset-y-0 right-0 px-3 flex items-center text-white/60 hover:text-white"
                            >
                              <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 focus:ring-2 focus:ring-white/30 disabled:opacity-60"
                  >
                    {loginMutation.isPending ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center">
                <p className="text-white/60 text-sm">
                  Don&apos;t have an account? Contact your game administrator.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <Link href="/">
              <Button variant="ghost" className="text-white/70 hover:text-white">
                <i className="fas fa-arrow-left mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
