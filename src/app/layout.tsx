// /src/app/layout.tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../context/LanguageContext";
import { Providers } from "./providers";

const jakartaSans = Plus_Jakarta_Sans({
    variable: "--font-jakarta-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Kanban Board",
    description: "Kişisel görev yönetimi uygulaması",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="tr">
        <body
            className={`${jakartaSans.variable} ${geistMono.variable} antialiased p-0 m-0 overflow-hidden`}
        >
        <Providers>
            <LanguageProvider>{children}</LanguageProvider>
        </Providers>
        </body>
        </html>
    );
}