import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { requireSession } from "@/src/lib/api-auth";

export async function POST(req: NextRequest) {
    const { session, error } = await requireSession();
    if (error) return error;

    const body = await req.json();
    const ids: string[] = Array.isArray(body.ids) ? body.ids : [];
    if (!ids.length) return NextResponse.json({ error: "ids zorunludur." }, { status: 400 });

    const boards = await prisma.board.findMany({
        where: { id: { in: ids }, companyId: session!.user.companyId },
        select: { id: true },
    });
    const validIds = new Set(boards.map((b) => b.id));

    await prisma.$transaction(
        ids
            .filter((id) => validIds.has(id))
            .map((id, index) =>
                prisma.board.update({ where: { id }, data: { order: index } })
            )
    );

    return NextResponse.json({ success: true });
}
