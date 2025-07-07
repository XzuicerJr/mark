import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <section className="space-y-4 text-center">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login to your {process.env.NEXT_PUBLIC_APP_NAME} account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
      <p className="text-muted-foreground text-sm">
        Don&apos;t have an account?{" "}
        <Button variant="link" className="p-0 font-medium" asChild>
          <Link href="/signup">Signup</Link>
        </Button>
      </p>
    </section>
  );
}
