import { NextResponse } from "next/server";
import { creditPackages } from "@/lib/pix";

export async function GET() {
  return NextResponse.json({ packages: creditPackages });
}
