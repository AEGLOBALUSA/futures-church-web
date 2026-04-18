"use client";

import { useState, FormEvent } from "react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface EmailCaptureProps {
  source: string;
  interests?: string[];
  placeholder?: string;
  ctaText?: string;
  successMessage?: string;
  className?: string;
  variant?: "paper" | "night" | "glass";
}

export function EmailCapture({
  source,
  interests,
  placeholder = "Your email address",
  ctaText = "Subscribe",
  successMessage = "You're in. Talk soon.",
  className,
  variant = "paper",
}: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, interests, consent: true }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  const textColor =
    variant === "paper" ? "text-obsidian-900" : "text-bone";

  if (status === "success") {
    return (
      <p className={cn("font-sans text-base", textColor, className)}>
        {successMessage}
      </p>
    );
  }

  const inputShell =
    variant === "paper"
      ? "bg-bone border border-obsidian-300/40 text-obsidian-900 placeholder:text-obsidian-500/60 focus:border-violet"
      : variant === "night"
      ? "bg-obsidian-800 border border-bone/15 text-bone placeholder:text-bone/40 focus:border-lemon"
      : "bg-obsidian-900/50 border border-bone/15 text-bone placeholder:text-bone/40 focus:border-lemon backdrop-blur-md";

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col sm:flex-row gap-3", className)}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "flex-1 rounded-full px-5 py-3 font-sans text-base outline-none transition-colors",
          inputShell,
        )}
      />
      <Button type="submit" variant={variant === "paper" ? "ember" : "ember"} loading={status === "loading"} size="md">
        {ctaText}
      </Button>
      {status === "error" && (
        <p className={cn("text-sm mt-1", variant === "paper" ? "text-pink-700" : "text-pink")}>
          Something went wrong. Try again.
        </p>
      )}
    </form>
  );
}
