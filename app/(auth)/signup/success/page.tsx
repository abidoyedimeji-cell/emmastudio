import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Mail } from "lucide-react"

export const metadata = {
  title: "Check Your Email | EMMA STUDIOS",
  description: "Please check your email to confirm your account",
}

export default function SignupSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <span className="text-[28px] font-semibold tracking-tight">EMMA STUDIOS</span>
          </Link>
        </div>

        <Card className="border-border/40">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Check your email</CardTitle>
            <CardDescription>We've sent you a confirmation link</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <Mail className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                Please check your email inbox and click the confirmation link to activate your account.
              </p>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              Didn't receive an email? Check your spam folder or{" "}
              <Link href="/signup" className="text-primary hover:underline">
                try signing up again
              </Link>
            </p>

            <div className="pt-4">
              <Link href="/login">
                <Button variant="outline" className="w-full rounded-lg bg-transparent">
                  Back to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
