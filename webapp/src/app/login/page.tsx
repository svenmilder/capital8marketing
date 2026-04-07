"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-c8-app flex items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-c8-surface border-c8-border-default">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto h-12 w-12 rounded-lg bg-c8-green flex items-center justify-center">
            <span className="text-c8-app font-bold text-lg">C8</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-c8-text-primary">
              Command Center
            </h1>
            <p className="text-sm text-c8-text-secondary mt-1">
              Capital8 Marketing Engine
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="text-center space-y-2">
              <p className="text-c8-text-primary text-sm">Check your email</p>
              <p className="text-c8-text-muted text-xs">
                We sent a magic link to <strong>{email}</strong>
              </p>
              <Button
                variant="ghost"
                className="text-c8-text-secondary hover:text-c8-text-primary mt-4"
                onClick={() => setSent(false)}
              >
                Try a different email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="email"
                placeholder="you@capital8.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-c8-app border-c8-border-default text-c8-text-primary placeholder:text-c8-text-muted focus:border-c8-border-strong"
              />
              {error && (
                <p className="text-c8-red text-xs">{error}</p>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-c8-green text-c8-app font-semibold hover:bg-c8-green/90 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Sign in with magic link"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
