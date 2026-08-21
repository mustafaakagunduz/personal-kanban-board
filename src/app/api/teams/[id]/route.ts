import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { requireAdmin } from "@/src/lib/api-auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { session, error } = await requireAdmin();
    if (error) return error;
    const { id } = await params;

    const team = await prisma.team.findFirst({ where: { id, companyId: session!.user.companyId } });
    if (!team) return NextResponse.json({ error: "Takım bulunamadı." }, { status: 404 });

    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) return NextResponse.json({ error: "Takım adı zorunludur." }, { status: 400 });

    const updated = await prisma.team.update({ where: { id }, data: { name } });
    return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { session, error } = await requireAdmin();
    if (error) return error;
    const { id } = await params;

    const team = await prisma.team.findFirst({ where: { id, companyId: session!.user.companyId } });
    if (!team) return NextResponse.json({ error: "Takım bulunamadı." }, { status: 404 });

    await prisma.team.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
