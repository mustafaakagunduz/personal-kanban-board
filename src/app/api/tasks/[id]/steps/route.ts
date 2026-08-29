import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { requireSession } from "@/src/lib/api-auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { session, error } = await requireSession();
    if (error) return error;
    const { id: taskId } = await params;

    const task = await prisma.task.findFirst({
        where: { id: taskId, board: { companyId: session!.user.companyId } },
    });
    if (!task) return NextResponse.json({ error: "Görev bulunamadı." }, { status: 404 });

    const body = await req.json();
    const text = typeof body.text === "string" ? body.text.trim() : "";
    if (!text) return NextResponse.json({ error: "Adım metni zorunludur." }, { status: 400 });

    const step = await prisma.taskStep.create({
        data: { text, taskId },
    });

    return NextResponse.json(step, { status: 201 });
}
