import { NextResponse } from "next/server";
import { z } from "zod";

// Strict input validation schema (server-side)
const DiagnosticSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/),
  email: z.string().email().max(200),
  business: z.string().min(2).max(200),
  revenue: z.enum(["0-1k", "1k-5k", "5k-20k", "20k-100k", "100k+"]),
  challenge: z.string().min(10).max(1000),
});

// Simple in-memory rate limiting (replace with Redis in production)
const rateLimit = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 3;

  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
}

export async function POST(request: Request) {
  try {
    // Get IP for rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

    // Rate limit check
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Inténtalo en 1 minuto." },
        { status: 429 }
      );
    }

    // Parse and validate body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Solicitud inválida" },
        { status: 400 }
      );
    }

    const result = DiagnosticSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          details: result.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const data = result.data;

    // Sanitize data (strip any HTML)
    const sanitized = {
      name: data.name.trim().replace(/<[^>]*>/g, ""),
      email: data.email.trim().toLowerCase(),
      business: data.business.trim().replace(/<[^>]*>/g, ""),
      revenue: data.revenue,
      challenge: data.challenge.trim().replace(/<[^>]*>/g, ""),
      submittedAt: new Date().toISOString(),
      ip,
    };

    // TODO: Store in Supabase with RLS
    // const { error } = await supabase.from('diagnostics').insert(sanitized);

    // TODO: Send notification email
    // await sendNotificationEmail(sanitized);

    console.log("[SCALEVO DIAGNOSTIC]", {
      name: sanitized.name,
      email: sanitized.email,
      revenue: sanitized.revenue,
      submittedAt: sanitized.submittedAt,
    });

    return NextResponse.json(
      { success: true, message: "Diagnóstico recibido. Te contactaremos pronto." },
      { status: 200 }
    );
  } catch (err) {
    console.error("[DIAGNOSTIC API ERROR]", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// Method not allowed for other methods
export async function GET() {
  return NextResponse.json({ error: "Método no permitido" }, { status: 405 });
}
