"use client"
import { AlertTriangle, ArrowLeft, ShieldAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[100vh] flex-col items-center justify-center p-4 bg-black">
      <Card className="mx-auto max-w-md border-[#3BE188]/50">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center">
            <ShieldAlert className="h-12 w-12 text-[#3BE188]" />
          </div>
          <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
          <CardDescription className="text-muted-foreground">
            You don&apos;t have permission to access this page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-2 rounded-lg bg-[#3BE188]/10 p-3">
            <AlertTriangle className="h-5 w-5 text-[#3BE188]" />
            <p className="text-sm font-medium text-[#3BE188]">This area requires additional permissions</p>
          </div>
          <p className="text-sm text-muted-foreground">
            If you believe this is an error, please contact your administrator or return to the homepage.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => (window.location.href = "/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <Button
            className="w-full sm:w-auto bg-[#3BE188] hover:bg-[#3BE188]/90 text-black"
            onClick={() => (window.location.href = "/contact")}
          >
            Contact Support
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

