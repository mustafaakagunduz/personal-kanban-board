import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { requireSession, requireAdmin } from "@/src/lib/api-auth";

export async function GET() {
    const { session, error } = await requireSession();
    if (error) return error;

    const teams = await prisma.team.findMany({
        where: { companyId: session!.user.companyId },
        include: { members: { include: { user: { select: { id: true, name: true, email: true } } } } },
        orderBy: { name: "asc" },
    });

    return NextResponse.json(teams);
}

export async function POST(req: NextRequest) {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) return NextResponse.json({ error: "Takım adı zorunludur." }, { status: 400 });

    const team = await prisma.team.create({
        data: { name, companyId: session!.user.companyId },
    });

    return NextResponse.json(team, { status: 201 });
}
