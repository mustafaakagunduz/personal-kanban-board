"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setLoading(false);

        if (result?.error) {
            setError("E-posta veya şifre hatalı.");
            return;
        }

        router.push("/");
        router.refresh();
    };

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#171718] to-[#C0FF2D]/30">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Giriş Yap</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
                        </Button>
                        <p className="text-sm text-center text-muted-foreground">
                            Şirketiniz için hesap yok mu?{" "}
                            <Link href="/register" className="underline">
                                Şirket kaydı oluşturun
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
