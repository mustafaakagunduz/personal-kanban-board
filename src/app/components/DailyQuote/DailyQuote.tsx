import React from 'react';
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";

interface DailyQuoteProps {
    date: Date | null;
}

const quotes = [
    { text: "Başarı, her gün tekrarlanan küçük çabaların toplamıdır.", author: "Robert Collier" },
    { text: "Bir hedefin yoksa, hiçbir rüzgar sana yardım edemez.", author: "Seneca" },
    { text: "Bugün yaptığın seçimler, yarının olasılıklarını belirler.", author: "Ralph Marston" },
    { text: "Hayatta en önemli şey, yapmaktan korktuğunuz şeyleri yapmaktır.", author: "Eleanor Roosevelt" },
    { text: "Sistemleri hedeflerine, hedefleri olmayan kişiler sistemlerin hedeflerine hizmet eder.", author: "Robert Kiyosaki" },
    { text: "Zamanın değerini bilmek, zamanı en iyi şekilde kullanmakla başlar.", author: "William Penn" },
    { text: "Her büyük başarı, küçük başlangıçlarla ortaya çıkar.", author: "Robin Sharma" },
    { text: "Gün doğar, her şey sıfırlanır. Şu anı yaşa, geleceği tasarla.", author: "Konfüçyüs" },
    { text: "İyi bir plan bugün uygulanan, mükemmel bir plandan yarın uygulanacak olandan daha iyidir.", author: "George S. Patton" },
    { text: "Düşlerin büyüklüğü, onları gerçekleştirme çabanı belirler.", author: "Mahatma Gandhi" },
    { text: "Disiplin, istediğin ile ihtiyacın olan arasındaki köprüdür.", author: "Jim Rohn" },
    { text: "Bir hedefin gerçekliği, onu gerçekleştirme kararlılığınla doğru orantılıdır.", author: "Bo Bennett" },
    { text: "Yapabileceklerini hayal et, sonra her gün bir adım at.", author: "Arthur Ashe" },
    { text: "Başarı bir yolculuktur, bir varış noktası değil.", author: "Ben Sweetland" },
    { text: "Tutku olmadan, harekete geçme nedeni yoktur; vizyonsuz, yön yoktur.", author: "Roy T. Bennett" },
    { text: "Dün bir tarih, yarın bir sır, bugün bir armağandır.", author: "Eleanor Roosevelt" },
    { text: "Planlama, geleceği bugüne taşır.", author: "Alan Lakein" },
    { text: "Yapılandırılmış bir günlük rutininiz varsa, zihin özgürlüğünüz vardır.", author: "Michael Hyatt" },
    { text: "Parçaları yönetirseniz, bütünü kontrol edersiniz.", author: "Chuck Palahniuk" },
    { text: "Gelecek, bugün kurdurduğun temellerin üzerine inşa edilir.", author: "Ralph Waldo Emerson" },
    { text: "Geç kalmak hayatın bir parçasıdır ama erken başlamak zaferin bir parçasıdır.", author: "Anonim" },
    { text: "Zamanını yönetmeyi öğrenmek, kendini yönetmeyi öğrenmektir.", author: "Brian Tracy" },
    { text: "Erteleme, fırsatın doğal düşmanıdır.", author: "Victor Kiam" },
    { text: "Bir şeye zaman ayırmak, ona değer vermektir.", author: "Jim Rohn" },
    { text: "Yaşamak için planla, hayal etmek için zaman bırak.", author: "Anonim" },
    { text: "Kusursuz bir gün yoktur, ama mükemmel anlar vardır.", author: "Anonim" },
    { text: "Büyük başarılar, küçük alışkanlıklarla başlar.", author: "Robin Sharma" },
    { text: "Yapacak bir şey olması için değil, olmamak için yaşa.", author: "Henry David Thoreau" },
    { text: "Günü planla, yolu çiz, hayatı yaşa.", author: "Anonim" },
    { text: "İyi planlanmış yarım saat, plansız bir saate bedeldir.", author: "Seth Godin" }
];

const DailyQuote: React.FC<DailyQuoteProps> = ({ date }) => {
    // Günün belirli bir özelliğine göre (tarih) rastgele ama tutarlı bir söz seçme
    const getQuoteForDay = (date: Date): typeof quotes[0] => {
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();

        // Her gün farklı bir söz için seed oluştur
        const seed = day + month * 31 + year * 366;
        const quoteIndex = seed % quotes.length;

        return quotes[quoteIndex];
    };

    const todayQuote = date ? getQuoteForDay(date) : getQuoteForDay(new Date());

    return (
        <Card className="w-full mt-6 mb-4 bg-white/10 backdrop-blur-sm border-0 shadow-md overflow-hidden">
            <div className="p-4 text-center">
                <Typography variant="h4" className="text-white font-light italic mb-2">
                    "{todayQuote.text}"
                </Typography>
                <Typography variant="muted" className="text-white/80">
                    — {todayQuote.author}
                </Typography>
            </div>
        </Card>
    );
};

export default DailyQuote;