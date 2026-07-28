"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAdminStore } from "@/store/useAdminStore";
import type { Role } from "@/store/useAdminStore";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      setErrorMsg(error?.message ?? "Invalid credentials. Please try again.");
      setIsLoading(false);
      return;
    }

    const meta = data.user.user_metadata ?? {};
    useAdminStore.getState().setCurrentUser(
      meta.userId ?? data.user.id,
      meta.name ?? email.split("@")[0],
      email,
      (meta.role as Role) ?? "rhu_physician",
      meta.prcLicense ?? ""
    );

    router.push("/");
  };

  return (
    <div className="min-h-screen bg-sidebar flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-sidebar-primary/20 rounded-xl flex items-center justify-center text-sidebar-primary font-bold text-3xl mx-auto mb-6">
            A
          </div>
          <h1 className="text-3xl font-bold text-sidebar-foreground tracking-tight">AImhotech</h1>
          <p className="text-xs tracking-widest text-sidebar-foreground/60 mt-2 uppercase font-mono">
            Web Admin Platform
          </p>
        </div>

        <Card className="shadow-lg border-border/50">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center">Sign in</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="a.reyes@rhu.gov.ph"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {errorMsg && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {errorMsg}
                </div>
              )}

              <div className="text-xs text-muted-foreground pt-1 bg-muted/30 rounded-lg p-3 border border-border/50">
                <p className="font-semibold mb-1">Demo accounts:</p>
                <p>Physician: <code>a.reyes@rhu.gov.ph</code> · <code>AimhoDemo2026!</code></p>
                <p>DOH: <code>r.villareal@doh.gov.ph</code> · <code>AimhoDemo2026!</code></p>
                <p>Admin: <code>c.mendoza@hardyco.ph</code> · <code>AimhoDemo2026!</code></p>
              </div>

              <Button
                type="submit"
                className="w-full mt-6 bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Signing in…
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
