"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { Google } from "@/components/icons";
import Link from "next/link";

export default function SignupPage() {
  return (
    <section className="space-y-4 text-center">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome</CardTitle>
          <CardDescription>Signup with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => signIn("google")}
          >
            <Google />
            Signup with Google
          </Button>
        </CardContent>
      </Card>
      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <Button variant="link" className="p-0 font-medium" asChild>
          <Link href="/login">Login</Link>
        </Button>
      </p>
    </section>
  );
}
