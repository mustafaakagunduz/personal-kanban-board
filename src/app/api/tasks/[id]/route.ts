import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { requireSession } from "@/src/lib/api-auth";

const STATUSES = ["TODO", "IN_PROGRESS", "DONE"];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { session, error } = await requireSession();
    if (error) return error;
    const { id } = await params;

    const task = await prisma.task.findFirst({
        where: { id, board: { companyId: session!.user.companyId } },
    });
    if (!task) return NextResponse.json({ error: "Görev bulunamadı." }, { status: 404 });

    const body = await req.json();
    const data: {
        title?: string;
        description?: string;
        status?: "TODO" | "IN_PROGRESS" | "DONE";
        assigneeId?: string | null;
        duration?: string | null;
        notes?: string | null;
        dueDate?: Date | null;
        color?: string | null;
        progress?: number | null;
        order?: number;
        completedAt?: Date | null;
    } = {};

    if (typeof body.title === "string" && body.title.trim()) data.title = body.title.trim();
    if (typeof body.description === "string") data.description = body.description;
    if (typeof body.duration === "string" || body.duration === null) data.duration = body.duration;
    if (typeof body.notes === "string" || body.notes === null) data.notes = body.notes;
    if (typeof body.dueDate === "string") data.dueDate = new Date(body.dueDate);
    else if (body.dueDate === null) data.dueDate = null;
    if (typeof body.color === "string" || body.color === null) data.color = body.color;
    if (typeof body.progress === "number" || body.progress === null) data.progress = body.progress;

    if (body.assigneeId === null || typeof body.assigneeId === "string") {
        if (body.assigneeId) {
            const assignee = await prisma.user.findFirst({
                where: { id: body.assigneeId, companyId: session!.user.companyId },
            });
            if (!assignee) return NextResponse.json({ error: "Atanan kullanıcı bulunamadı." }, { status: 404 });
        }
        data.assigneeId = body.assigneeId || null;
    }

    if (typeof body.status === "string" && STATUSES.includes(body.status) && body.status !== task.status) {
        data.status = body.status as "TODO" | "IN_PROGRESS" | "DONE";
        const maxOrder = await prisma.task.aggregate({
            where: { boardId: task.boardId, status: data.status },
            _max: { order: true },
        });
        data.order = (maxOrder._max.order ?? -1) + 1;
        data.completedAt = data.status === "DONE" ? new Date() : null;
    }

    const updated = await prisma.task.update({
        where: { id },
        data,
        include: { assignee: { select: { id: true, name: true, email: true } } },
    });

    return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { session, error } = await requireSession();
    if (error) return error;
    const { id } = await params;

    const task = await prisma.task.findFirst({
        where: { id, board: { companyId: session!.user.companyId } },
    });
    if (!task) return NextResponse.json({ error: "Görev bulunamadı." }, { status: 404 });

    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
