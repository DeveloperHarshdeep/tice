"use client";

import { useEffect } from "react";
import { PublicShell } from "@/components/layout/PublicShell";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PublicShell>
      <Container className="py-20 md:py-28 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-danger border border-red-200 shadow-2xs">
          <AlertCircle className="h-7 w-7" aria-hidden />
        </div>

        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-danger">
          System Notice
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          An Unexpected Error Occurred
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-slate-600 leading-relaxed">
          We encountered an unexpected processing issue while rendering this page. You can try refreshing the request or return to the homepage.
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <Button
            size="md"
            variant="primary"
            onClick={() => reset()}
          >
            <RefreshCw className="h-4 w-4" aria-hidden />
            Try Again
          </Button>
          <Button href="/" size="md" variant="secondary">
            <Home className="h-4 w-4" aria-hidden />
            Return to Homepage
          </Button>
        </div>
      </Container>
    </PublicShell>
  );
}
