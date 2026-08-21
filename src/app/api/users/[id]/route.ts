import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { requireAdmin } from "@/src/lib/api-auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { session, error } = await requireAdmin();
    if (error) return error;
    const { id } = await params;

    const target = await prisma.user.findFirst({ where: { id, companyId: session!.user.companyId } });
    if (!target) return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });

    const body = await req.json();
    const data: { name?: string; role?: "ADMIN" | "MEMBER" } = {};
    if (typeof body.name === "string" && body.name.trim()) data.name = body.name.trim();
    if (body.role === "ADMIN" || body.role === "MEMBER") data.role = body.role;

    const updated = await prisma.user.update({
        where: { id },
        data,
        select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { session, error } = await requireAdmin();
    if (error) return error;
    const { id } = await params;

    if (id === session!.user.id) {
        return NextResponse.json({ error: "Kendi hesabınızı silemezsiniz." }, { status: 400 });
    }

    const target = await prisma.user.findFirst({ where: { id, companyId: session!.user.companyId } });
    if (!target) return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
