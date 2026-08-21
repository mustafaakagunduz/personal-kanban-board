import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";

export async function requireSession() {
    const session = await auth();
    if (!session?.user) {
        return { session: null, error: NextResponse.json({ error: "Yetkisiz." }, { status: 401 }) };
    }
    return { session, error: null };
}

export async function requireAdmin() {
    const { session, error } = await requireSession();
    if (error) return { session: null, error };
    if (session!.user.role !== "ADMIN") {
        return { session: null, error: NextResponse.json({ error: "Sadece admin yapabilir." }, { status: 403 }) };
    }
    return { session, error: null };
}
