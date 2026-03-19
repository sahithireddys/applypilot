"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto grid min-h-[85vh] max-w-6xl items-center gap-8 lg:grid-cols-2">
        <div className="hidden rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-10 text-white shadow-sm lg:block">
          <div className="inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
            <div className="rounded-xl bg-white/10 p-2">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">ApplyPilot</h1>
              <p className="text-sm text-slate-300">Job search workspace</p>
            </div>
          </div>

          <div className="mt-16 max-w-xl">
            <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-slate-200">
              Create your workspace
            </p>
            <h2 className="mt-5 text-4xl font-semibold leading-tight">
              Start tracking applications and interviews with more structure.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-300">
              ApplyPilot helps job seekers keep opportunities, timelines, and follow-ups
              organized in one clean dashboard.
            </p>
          </div>
        </div>

        <Card className="mx-auto w-full max-w-md rounded-3xl border-0 shadow-sm">
          <CardHeader className="space-y-2 pb-2">
            <div className="flex items-center gap-3 lg:hidden">
              <div className="rounded-2xl bg-slate-900 p-2 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">ApplyPilot</h1>
                <p className="text-sm text-slate-500">Job search workspace</p>
              </div>
            </div>

            <CardTitle className="pt-2 text-3xl">Create account</CardTitle>
            <p className="text-sm text-slate-500">
              Set up your workspace to track roles, interviews, and next steps.
            </p>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Full name</label>
                <Input
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-2xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-2xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <Input
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-2xl"
                  required
                />
              </div>

              <Button type="submit" className="w-full rounded-2xl bg-slate-900 hover:bg-slate-800">
                Create Account
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-slate-900 underline underline-offset-4">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}