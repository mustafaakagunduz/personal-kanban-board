import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { requireSession } from "@/src/lib/api-auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { session, error } = await requireSession();
    if (error) return error;
    const { id } = await params;

    const board = await prisma.board.findFirst({ where: { id, companyId: session!.user.companyId } });
    if (!board) return NextResponse.json({ error: "Pano bulunamadı." }, { status: 404 });

    const body = await req.json();
    const data: {
        name?: string;
        teamId?: string | null;
        bgColorStart?: string;
        bgColorEnd?: string;
        order?: number;
    } = {};

    if (typeof body.name === "string" && body.name.trim()) data.name = body.name.trim();
    if (body.teamId === null || typeof body.teamId === "string") data.teamId = body.teamId || null;
    if (typeof body.bgColorStart === "string") data.bgColorStart = body.bgColorStart;
    if (typeof body.bgColorEnd === "string") data.bgColorEnd = body.bgColorEnd;
    if (typeof body.order === "number") data.order = body.order;

    const updated = await prisma.board.update({ where: { id }, data });
    return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { session, error } = await requireSession();
    if (error) return error;
    const { id } = await params;

    const board = await prisma.board.findFirst({ where: { id, companyId: session!.user.companyId } });
    if (!board) return NextResponse.json({ error: "Pano bulunamadı." }, { status: 404 });

    const count = await prisma.board.count({ where: { companyId: session!.user.companyId } });
    if (count <= 1) {
        return NextResponse.json({ error: "Son pano silinemez." }, { status: 400 });
    }

    await prisma.board.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
