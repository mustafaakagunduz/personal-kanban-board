export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold">404 - Sayfa Bulunamadı</h1>
            <p className="mt-4">Aradığınız sayfa mevcut değil.</p>
            <a href="/" className="mt-6 text-blue-500 hover:underline">
                Ana Sayfaya Dön
            </a>
        </div>
    );
}