"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Upload, AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ImportPage() {
  const [importing, setImporting] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "creators" | "studios") => {
    const file = e.target.files?.[0]
    if (!file) return

    setImporting(true)
    setResults(null)

    try {
      const text = await file.text()
      const response = await fetch("/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvData: text, type }),
      })

      const data = await response.json()
      setResults(data)
    } catch (error: any) {
      setResults({ success: 0, errors: [{ row: 0, error: error.message }] })
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">CSV Import</h1>
          <p className="text-muted-foreground mt-2">Manually onboard creators and studios by uploading CSV files</p>
        </div>

        <Tabs defaultValue="creators" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="creators">Creators</TabsTrigger>
            <TabsTrigger value="studios">Studios</TabsTrigger>
          </TabsList>

          <TabsContent value="creators" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Import Creators</CardTitle>
                <CardDescription>Upload a CSV file with creator information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button variant="outline" asChild>
                    <a href="/templates/creators-import-template.csv" download>
                      <Download className="w-4 h-4 mr-2" />
                      Download Template
                    </a>
                  </Button>

                  <div className="flex-1">
                    <label htmlFor="creators-upload" className="cursor-pointer">
                      <Button disabled={importing} asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          {importing ? "Uploading..." : "Upload CSV"}
                        </span>
                      </Button>
                      <input
                        id="creators-upload"
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "creators")}
                      />
                    </label>
                  </div>
                </div>

                {results && (
                  <Alert variant={results.errors.length > 0 ? "destructive" : "default"}>
                    {results.errors.length === 0 ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <AlertDescription>
                      <p className="font-medium">{results.success} creators imported successfully</p>
                      {results.errors.length > 0 && (
                        <div className="mt-2 space-y-1">
                          <p className="font-medium">{results.errors.length} errors:</p>
                          {results.errors.map((err: any, i: number) => (
                            <p key={i} className="text-sm">
                              Row {err.row}: {err.error}
                            </p>
                          ))}
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="studios" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Import Studios</CardTitle>
                <CardDescription>Upload a CSV file with studio information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button variant="outline" asChild>
                    <a href="/templates/studios-import-template.csv" download>
                      <Download className="w-4 h-4 mr-2" />
                      Download Template
                    </a>
                  </Button>

                  <div className="flex-1">
                    <label htmlFor="studios-upload" className="cursor-pointer">
                      <Button disabled={importing} asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          {importing ? "Uploading..." : "Upload CSV"}
                        </span>
                      </Button>
                      <input
                        id="studios-upload"
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "studios")}
                      />
                    </label>
                  </div>
                </div>

                {results && (
                  <Alert variant={results.errors.length > 0 ? "destructive" : "default"}>
                    {results.errors.length === 0 ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <AlertDescription>
                      <p className="font-medium">{results.success} studios imported successfully</p>
                      {results.errors.length > 0 && (
                        <div className="mt-2 space-y-1">
                          <p className="font-medium">{results.errors.length} errors:</p>
                          {results.errors.map((err: any, i: number) => (
                            <p key={i} className="text-sm">
                              Row {err.row}: {err.error}
                            </p>
                          ))}
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
