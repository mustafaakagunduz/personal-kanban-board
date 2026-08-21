import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { requireSession } from "@/src/lib/api-auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { session, error } = await requireSession();
    if (error) return error;
    const { id: boardId } = await params;

    const board = await prisma.board.findFirst({ where: { id: boardId, companyId: session!.user.companyId } });
    if (!board) return NextResponse.json({ error: "Pano bulunamadı." }, { status: 404 });

    const tasks = await prisma.task.findMany({
        where: { boardId },
        include: { assignee: { select: { id: true, name: true, email: true } } },
        orderBy: { order: "asc" },
    });

    return NextResponse.json(tasks);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { session, error } = await requireSession();
    if (error) return error;
    const { id: boardId } = await params;

    const board = await prisma.board.findFirst({ where: { id: boardId, companyId: session!.user.companyId } });
    if (!board) return NextResponse.json({ error: "Pano bulunamadı." }, { status: 404 });

    const body = await req.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) return NextResponse.json({ error: "Başlık zorunludur." }, { status: 400 });

    const assigneeId = typeof body.assigneeId === "string" && body.assigneeId ? body.assigneeId : null;
    if (assigneeId) {
        const assignee = await prisma.user.findFirst({
            where: { id: assigneeId, companyId: session!.user.companyId },
        });
        if (!assignee) return NextResponse.json({ error: "Atanan kullanıcı bulunamadı." }, { status: 404 });
    }

    const maxOrder = await prisma.task.aggregate({
        where: { boardId, status: "TODO" },
        _max: { order: true },
    });

    const task = await prisma.task.create({
        data: {
            title,
            description: typeof body.description === "string" ? body.description : "",
            color: typeof body.color === "string" ? body.color : undefined,
            assigneeId,
            boardId,
            status: "TODO",
            order: (maxOrder._max.order ?? -1) + 1,
        },
        include: { assignee: { select: { id: true, name: true, email: true } } },
    });

    return NextResponse.json(task, { status: 201 });
}
