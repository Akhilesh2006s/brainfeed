// Session management for Next.js API routes using cookies
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const SECRET = process.env.SESSION_SECRET || "brainfeed-secret-key-change-in-production";

export interface SessionData {
  userId: number;
  username: string;
  role: string;
}

function sign(data: string): string {
  const hmac = createHmac("sha256", SECRET);
  hmac.update(data);
  return hmac.digest("hex");
}

function verify(data: string, signature: string): boolean {
  const expected = sign(data);
  if (expected.length !== signature.length) {
    return false;
  }
  return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function createSession(data: SessionData): Promise<string> {
  const payload = JSON.stringify(data);
  const encoded = Buffer.from(payload).toString("base64url");
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const [encoded, signature] = sessionCookie.value.split(".");
    if (!encoded || !signature || !verify(encoded, signature)) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf-8"));
    return payload as SessionData;
  } catch {
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

