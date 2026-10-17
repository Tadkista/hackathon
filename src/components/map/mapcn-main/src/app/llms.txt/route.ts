import { NextResponse } from "next/server";

import { createLlmIndexMarkdown } from "@/lib/llm-content";

export const revalidate = false;
export const dynamic = "force-static";

export function GET() {
  return new NextResponse(createLlmIndexMarkdown(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
