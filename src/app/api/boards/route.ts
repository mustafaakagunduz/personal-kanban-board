import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { requireSession } from "@/src/lib/api-auth";

export async function GET() {
    const { session, error } = await requireSession();
    if (error) return error;

    const boards = await prisma.board.findMany({
        where: { companyId: session!.user.companyId },
        orderBy: { order: "asc" },
    });

    return NextResponse.json(boards);
}

export async function POST(req: NextRequest) {
    const { session, error } = await requireSession();
    if (error) return error;

    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const teamId = typeof body.teamId === "string" && body.teamId ? body.teamId : null;
    if (!name) return NextResponse.json({ error: "Pano adı zorunludur." }, { status: 400 });

    if (teamId) {
        const team = await prisma.team.findFirst({ where: { id: teamId, companyId: session!.user.companyId } });
        if (!team) return NextResponse.json({ error: "Takım bulunamadı." }, { status: 404 });
    }

    const maxOrder = await prisma.board.aggregate({
        where: { companyId: session!.user.companyId },
        _max: { order: true },
    });

    const board = await prisma.board.create({
        data: {
            name,
            teamId,
            companyId: session!.user.companyId,
            order: (maxOrder._max.order ?? -1) + 1,
        },
    });

    return NextResponse.json(board, { status: 201 });
}
