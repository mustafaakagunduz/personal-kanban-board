import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/src/lib/prisma";
import { requireSession, requireAdmin } from "@/src/lib/api-auth";

export async function GET() {
    const { session, error } = await requireSession();
    if (error) return error;

    const users = await prisma.user.findMany({
        where: { companyId: session!.user.companyId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            teamMemberships: { select: { teamId: true } },
        },
        orderBy: { name: "asc" },
    });

    return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const role = body.role === "ADMIN" ? "ADMIN" : "MEMBER";

    if (!name || !email || !password) {
        return NextResponse.json({ error: "Tüm alanlar zorunludur." }, { status: 400 });
    }
    if (password.length < 8) {
        return NextResponse.json({ error: "Şifre en az 8 karakter olmalıdır." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        return NextResponse.json({ error: "Bu e-posta zaten kullanılıyor." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            passwordHash,
            role,
            companyId: session!.user.companyId,
        },
        select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json(user, { status: 201 });
}
