import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { requireSession } from "@/src/lib/api-auth";

export async function GET() {
    const { session, error } = await requireSession();
    if (error) return error;

    const company = await prisma.company.findUnique({
        where: { id: session!.user.companyId },
        select: { id: true, bgColorStart: true, bgColorEnd: true },
    });
    if (!company) return NextResponse.json({ error: "Şirket bulunamadı." }, { status: 404 });

    return NextResponse.json(company);
}

export async function PATCH(req: NextRequest) {
    const { session, error } = await requireSession();
    if (error) return error;

    const body = await req.json();
    const data: { bgColorStart?: string; bgColorEnd?: string } = {};

    if (typeof body.bgColorStart === "string") data.bgColorStart = body.bgColorStart;
    if (typeof body.bgColorEnd === "string") data.bgColorEnd = body.bgColorEnd;

    const updated = await prisma.company.update({
        where: { id: session!.user.companyId },
        data,
        select: { id: true, bgColorStart: true, bgColorEnd: true },
    });

    return NextResponse.json(updated);
}
