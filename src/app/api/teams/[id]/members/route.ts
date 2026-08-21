import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { requireAdmin } from "@/src/lib/api-auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { session, error } = await requireAdmin();
    if (error) return error;
    const { id: teamId } = await params;

    const team = await prisma.team.findFirst({ where: { id: teamId, companyId: session!.user.companyId } });
    if (!team) return NextResponse.json({ error: "Takım bulunamadı." }, { status: 404 });

    const body = await req.json();
    const userId = typeof body.userId === "string" ? body.userId : "";
    if (!userId) return NextResponse.json({ error: "Kullanıcı zorunludur." }, { status: 400 });

    const user = await prisma.user.findFirst({ where: { id: userId, companyId: session!.user.companyId } });
    if (!user) return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });

    const member = await prisma.teamMember.upsert({
        where: { teamId_userId: { teamId, userId } },
        create: { teamId, userId },
        update: {},
    });

    return NextResponse.json(member, { status: 201 });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { session, error } = await requireAdmin();
    if (error) return error;
    const { id: teamId } = await params;

    const team = await prisma.team.findFirst({ where: { id: teamId, companyId: session!.user.companyId } });
    if (!team) return NextResponse.json({ error: "Takım bulunamadı." }, { status: 404 });

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) return NextResponse.json({ error: "Kullanıcı zorunludur." }, { status: 400 });

    await prisma.teamMember.deleteMany({ where: { teamId, userId } });
    return NextResponse.json({ success: true });
}
