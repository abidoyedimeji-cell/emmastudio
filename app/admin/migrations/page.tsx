"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, ExternalLink, AlertTriangle } from "lucide-react"

const PROJECT_ID = "wutvjarbzrajhsisswec"

const migrations = [
  {
    name: "1. Drop Everything (Reset)",
    file: "RESET_001_drop_all.sql",
    description: "Drops all existing tables, functions, triggers, and enums. Run this first if the database has partial data from a failed migration.",
  },
  {
    name: "2. Foundation Tables",
    file: "RESET_002_foundation.sql",
    description: "Core tables: profiles, emma_profiles, studios, creators, packages, bookings, reviews, notifications, conversations, messages + auth triggers + RLS policies + helper functions",
  },
  {
    name: "3. Seed Data (20 Studios + 20 Creators, South/East London)",
    file: "seed_south_east_london_20x20.sql",
    description: "20 studios (Deptford, Peckham, Brixton, Hackney, etc.) + 20 creators (photographers, videographers, audio engineers, editors) + 3 packages each + 2 services each + 14 days of availability",
  },
  {
    name: "4. Marketplace Schema",
    file: "RESET_004_marketplace.sql",
    description: "Marketplace tables: marketplace_bookings, booking_parties, addons, mp_conversations, calendar, change_requests, payments + enums + RLS",
  },
  {
    name: "5. Marketplace RPCs",
    file: "RESET_005_rpcs.sql",
    description: "RPC functions: create_request_booking, accept/decline, payment handling, change requests, admin overrides, expiry management",
  },
]

export default function MigrationsPage() {
  const [completed, setCompleted] = useState<Set<number>>(new Set())

  function markDone(index: number) {
    setCompleted((prev) => {
      const next = new Set(prev)
      next.add(index)
      return next
    })
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Database Migration Guide</h1>
        <p className="text-muted-foreground mt-1">
          Run these SQL scripts in order in the Supabase SQL Editor.
        </p>
      </div>

      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-foreground">How to run migrations</p>
              <ol className="text-sm text-muted-foreground mt-2 space-y-2 list-decimal list-inside">
                <li>Download the project ZIP (click three dots at top right of chat, then &quot;Download ZIP&quot;)</li>
                <li>Unzip and find the <code className="bg-muted px-1 rounded text-xs">scripts/</code> folder</li>
                <li>Open each file in a text editor, select all, and copy</li>
                <li>Paste into the Supabase SQL Editor and click &quot;Run&quot;</li>
                <li>Run them in order: 1 through 5</li>
              </ol>
              <Button variant="outline" size="sm" className="mt-3" asChild>
                <a
                  href={`https://supabase.com/dashboard/project/${PROJECT_ID}/sql/new`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open SQL Editor
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {migrations.map((m, i) => (
          <Card key={i} className={completed.has(i) ? "border-green-500/30 bg-green-500/5" : ""}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      completed.has(i)
                        ? "bg-green-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {completed.has(i) ? <Check className="h-4 w-4" /> : i + 1}
                  </div>
                  <div>
                    <CardTitle className="text-base">{m.name}</CardTitle>
                    <CardDescription className="text-xs mt-0.5 font-mono">{m.file}</CardDescription>
                  </div>
                </div>
                <Badge variant={completed.has(i) ? "default" : "secondary"}>
                  {completed.has(i) ? "Done" : "pending"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{m.description}</p>
              <Button
                size="sm"
                variant={completed.has(i) ? "secondary" : "default"}
                onClick={() => markDone(i)}
                disabled={completed.has(i)}
              >
                {completed.has(i) ? "Completed" : "Mark as Done"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            Progress: {completed.size} / {migrations.length} migrations completed
          </p>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div
              className="bg-primary rounded-full h-2 transition-all"
              style={{ width: `${(completed.size / migrations.length) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-2">
          <p className="font-medium text-foreground text-sm">Diagnostic API</p>
          <p className="text-xs text-muted-foreground">
            After running migrations, visit <code className="bg-muted px-1 rounded">/api/db-check</code> to verify tables exist and contain data.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
