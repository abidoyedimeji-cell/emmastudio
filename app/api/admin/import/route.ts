import { type NextRequest, NextResponse } from "next/server"
import { importCreatorsFromCSV, importStudiosFromCSV, parseCSV } from "@/lib/csv-import"

export async function POST(req: NextRequest) {
  try {
    const { csvData, type } = await req.json()

    const rows = parseCSV(csvData)

    let results
    if (type === "creators") {
      results = await importCreatorsFromCSV(rows)
    } else if (type === "studios") {
      results = await importStudiosFromCSV(rows)
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }

    return NextResponse.json(results)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
