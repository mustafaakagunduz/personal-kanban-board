"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
    const router = useRouter();
    const [companyName, setCompanyName] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ companyName, name, email, password }),
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            setError(data.error || "Kayıt sırasında bir hata oluştu.");
            setLoading(false);
            return;
        }

        const result = await signIn("credentials", { email, password, redirect: false });
        setLoading(false);

        if (result?.error) {
            setError("Hesap oluşturuldu ama giriş yapılamadı, lütfen giriş sayfasından deneyin.");
            return;
        }

        router.push("/");
        router.refresh();
    };

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#171718] to-[#C0FF2D]/30">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Şirket Kaydı Oluştur</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="companyName">Şirket Adı</Label>
                            <Input
                                id="companyName"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Adınız</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email">E-posta</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="password">Şifre</Label>
                            <Input
                                id="password"
                                type="password"
                                minLength={8}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? "Oluşturuluyor..." : "Şirketi Oluştur"}
                        </Button>
                        <p className="text-sm text-center text-muted-foreground">
                            Zaten hesabınız var mı?{" "}
                            <Link href="/login" className="underline">
                                Giriş yapın
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
