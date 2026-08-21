import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/src/lib/prisma";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const companyName = typeof body.companyName === "string" ? body.companyName.trim() : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!companyName || !name || !email || !password) {
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

    await prisma.company.create({
        data: {
            name: companyName,
            users: {
                create: {
                    name,
                    email,
                    passwordHash,
                    role: "ADMIN",
                },
            },
            boards: {
                create: {
                    name: "Panom",
                    order: 0,
                },
            },
        },
    });

    return NextResponse.json({ success: true });
}
