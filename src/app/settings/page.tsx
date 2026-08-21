"use client"

import { useState } from "react";
import Link from "next/link";
import useSWR, { mutate } from "swr";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Trash2 } from "lucide-react";

interface UserRow {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "MEMBER";
    teamMemberships: { teamId: string }[];
}

interface TeamRow {
    id: string;
    name: string;
    members: { user: { id: string; name: string; email: string } }[];
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function SettingsPage() {
    const { data: session } = useSession();
    const { data: users } = useSWR<UserRow[]>("/api/users", fetcher);
    const { data: teams } = useSWR<TeamRow[]>("/api/teams", fetcher);

    const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "MEMBER" });
    const [newTeamName, setNewTeamName] = useState("");
    const [memberPick, setMemberPick] = useState<Record<string, string>>({});
    const [error, setError] = useState<string | null>(null);

    const isAdmin = session?.user?.role === "ADMIN";

    const createUser = async () => {
        setError(null);
        const res = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser),
        });
        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            setError(data.error || "Kullanıcı oluşturulamadı.");
            return;
        }
        setNewUser({ name: "", email: "", password: "", role: "MEMBER" });
        mutate("/api/users");
    };

    const deleteUser = async (id: string) => {
        await fetch(`/api/users/${id}`, { method: "DELETE" });
        mutate("/api/users");
        mutate("/api/teams");
    };

    const createTeam = async () => {
        setError(null);
        const res = await fetch("/api/teams", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newTeamName }),
        });
        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            setError(data.error || "Takım oluşturulamadı.");
            return;
        }
        setNewTeamName("");
        mutate("/api/teams");
    };

    const deleteTeam = async (id: string) => {
        await fetch(`/api/teams/${id}`, { method: "DELETE" });
        mutate("/api/teams");
    };

    const addMember = async (teamId: string) => {
        const userId = memberPick[teamId];
        if (!userId) return;
        await fetch(`/api/teams/${teamId}/members`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
        });
        mutate("/api/teams");
        mutate("/api/users");
    };

    const removeMember = async (teamId: string, userId: string) => {
        await fetch(`/api/teams/${teamId}/members?userId=${userId}`, { method: "DELETE" });
        mutate("/api/teams");
        mutate("/api/users");
    };

    if (!isAdmin) {
        return (
            <div className="h-screen w-screen flex flex-col items-center justify-center gap-4">
                <p>Bu sayfayı sadece yöneticiler görebilir.</p>
                <Link href="/" className="underline flex items-center gap-1">
                    <ArrowLeft className="h-4 w-4" /> Panoya dön
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-screen p-6 flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-1 underline">
                    <ArrowLeft className="h-4 w-4" /> Panoya dön
                </Link>
                <h1 className="text-2xl font-semibold">Şirket Ayarları</h1>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Kullanıcılar</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            {users?.map((u) => (
                                <div key={u.id} className="flex items-center justify-between border rounded-md p-2">
                                    <div>
                                        <p className="font-medium">{u.name}</p>
                                        <p className="text-sm text-muted-foreground">{u.email} · {u.role}</p>
                                    </div>
                                    {u.id !== session?.user?.id && (
                                        <Button variant="outline" size="icon" onClick={() => deleteUser(u.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-2 border-t pt-4">
                            <Label>Yeni Kullanıcı</Label>
                            <Input
                                placeholder="İsim"
                                value={newUser.name}
                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            />
                            <Input
                                placeholder="E-posta"
                                type="email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            />
                            <Input
                                placeholder="Şifre"
                                type="password"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            />
                            <Select
                                value={newUser.role}
                                onValueChange={(role) => setNewUser({ ...newUser, role })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MEMBER">Üye</SelectItem>
                                    <SelectItem value="ADMIN">Yönetici</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={createUser}>Kullanıcı Ekle</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Takımlar</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="flex flex-col gap-4">
                            {teams?.map((team) => (
                                <div key={team.id} className="border rounded-md p-3 flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium">{team.name}</p>
                                        <Button variant="outline" size="icon" onClick={() => deleteTeam(team.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        {team.members.map((m) => (
                                            <div key={m.user.id} className="flex items-center justify-between text-sm">
                                                <span>{m.user.name}</span>
                                                <button
                                                    className="text-red-600 underline"
                                                    onClick={() => removeMember(team.id, m.user.id)}
                                                >
                                                    çıkar
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <Select
                                            value={memberPick[team.id] || ""}
                                            onValueChange={(v) => setMemberPick({ ...memberPick, [team.id]: v })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Üye seç" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {users
                                                    ?.filter((u) => !team.members.some((m) => m.user.id === u.id))
                                                    .map((u) => (
                                                        <SelectItem key={u.id} value={u.id}>
                                                            {u.name}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                        <Button variant="outline" onClick={() => addMember(team.id)}>
                                            Ekle
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2 border-t pt-4">
                            <Input
                                placeholder="Yeni takım adı"
                                value={newTeamName}
                                onChange={(e) => setNewTeamName(e.target.value)}
                            />
                            <Button onClick={createTeam}>Takım Ekle</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
