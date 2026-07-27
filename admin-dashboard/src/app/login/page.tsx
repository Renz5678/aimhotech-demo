"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("rhu-physician");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth check
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
                <Input id="email" type="email" placeholder="m.ocampo@doh.gov.ph" required defaultValue="demo@aimhotech.io" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required defaultValue="password123" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Simulate Role</Label>
                <Select value={role} onValueChange={(val) => val && setRole(val)}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rhu-physician">RHU Physician</SelectItem>
                    <SelectItem value="doh-officer">DOH Regional Officer</SelectItem>
                    <SelectItem value="super-admin">Super Admin</SelectItem>
                    <SelectItem value="bhw">Barangay Health Worker</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground pt-1">
                  Role selection is exposed here for demo purposes.
                </p>
              </div>
              <Button type="submit" className="w-full mt-6 bg-primary hover:bg-primary/90">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
