import React from 'react';
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { quoteCardClass } from "../KanbanBoard3/styles";

interface DailyQuoteProps {
    date: Date | null;
}

const quotes = [
    { text: "Başarı, her gün tekrarlanan küçük çabaların toplamıdır.", author: "Robert Collier", emoji: "✨" },
    { text: "Bir hedefin yoksa, hiçbir rüzgar sana yardım edemez.", author: "Seneca", emoji: "🧭" },
    { text: "Bugün yaptığın seçimler, yarının olasılıklarını belirler.", author: "Ralph Marston", emoji: "🔀" },
    { text: "Hayatta en önemli şey, yapmaktan korktuğunuz şeyleri yapmaktır.", author: "Eleanor Roosevelt", emoji: "🦁" },
    { text: "Sistemleri hedeflerine, hedefleri olmayan kişiler sistemlerin hedeflerine hizmet eder.", author: "Robert Kiyosaki", emoji: "🎯" },
    { text: "Zamanın değerini bilmek, zamanı en iyi şekilde kullanmakla başlar.", author: "William Penn", emoji: "⏳" },
    { text: "Her büyük başarı, küçük başlangıçlarla ortaya çıkar.", author: "Robin Sharma", emoji: "🌱" },
    { text: "Gün doğar, her şey sıfırlanır. Şu anı yaşa, geleceği tasarla.", author: "Konfüçyüs", emoji: "🌅" },
    { text: "İyi bir plan bugün uygulanan, mükemmel bir plandan yarın uygulanacak olandan daha iyidir.", author: "George S. Patton", emoji: "📝" },
    { text: "Düşlerin büyüklüğü, onları gerçekleştirme çabanı belirler.", author: "Mahatma Gandhi", emoji: "💫" },
    { text: "Disiplin, istediğin ile ihtiyacın olan arasındaki köprüdür.", author: "Jim Rohn", emoji: "🌉" },
    { text: "Bir hedefin gerçekliği, onu gerçekleştirme kararlılığınla doğru orantılıdır.", author: "Bo Bennett", emoji: "⚡" },
    { text: "Yapabileceklerini hayal et, sonra her gün bir adım at.", author: "Arthur Ashe", emoji: "👣" },
    { text: "Başarı bir yolculuktur, bir varış noktası değil.", author: "Ben Sweetland", emoji: "🚶" },
    { text: "Tutku olmadan, harekete geçme nedeni yoktur; vizyonsuz, yön yoktur.", author: "Roy T. Bennett", emoji: "🔥" },
    { text: "Dün bir tarih, yarın bir sır, bugün bir armağandır.", author: "Eleanor Roosevelt", emoji: "🎁" },
    { text: "Planlama, geleceği bugüne taşır.", author: "Alan Lakein", emoji: "🗓️" },
    { text: "Yapılandırılmış bir günlük rutininiz varsa, zihin özgürlüğünüz vardır.", author: "Michael Hyatt", emoji: "🧠" },
    { text: "Parçaları yönetirseniz, bütünü kontrol edersiniz.", author: "Chuck Palahniuk", emoji: "🧩" },
    { text: "Gelecek, bugün kurdurduğun temellerin üzerine inşa edilir.", author: "Ralph Waldo Emerson", emoji: "🏗️" },
    { text: "Geç kalmak hayatın bir parçasıdır ama erken başlamak zaferin bir parçasıdır.", author: "Anonim", emoji: "⏰" },
    { text: "Zamanını yönetmeyi öğrenmek, kendini yönetmeyi öğrenmektir.", author: "Brian Tracy", emoji: "⌚" },
    { text: "Erteleme, fırsatın doğal düşmanıdır.", author: "Victor Kiam", emoji: "⏱️" },
    { text: "Bir şeye zaman ayırmak, ona değer vermektir.", author: "Jim Rohn", emoji: "💎" },
    { text: "Yaşamak için planla, hayal etmek için zaman bırak.", author: "Anonim", emoji: "💭" },
    { text: "Kusursuz bir gün yoktur, ama mükemmel anlar vardır.", author: "Anonim", emoji: "✨" },
    { text: "Büyük başarılar, küçük alışkanlıklarla başlar.", author: "Robin Sharma", emoji: "🌟" },
    { text: "Yapacak bir şey olması için değil, olmamak için yaşa.", author: "Henry David Thoreau", emoji: "🌿" },
    { text: "Günü planla, yolu çiz, hayatı yaşa.", author: "Anonim", emoji: "🗺️" },
    { text: "İyi planlanmış yarım saat, plansız bir saate bedeldir.", author: "Seth Godin", emoji: "⏲️" }
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
        <Card className={`${quoteCardClass} hover:bg-white/20 mt-6 mb-4 transition-all duration-300`}>
            <div className="p-6 text-center relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-3xl opacity-80">
                    {todayQuote.emoji}
                </div>

                <div className="absolute left-3 top-4 text-white/30 text-4xl font-serif">"</div>
                <div className="absolute right-3 bottom-8 text-white/30 text-4xl font-serif">"</div>

                <Typography
                    variant="h4"
                    className="text-white font-light italic mb-4 pt-4 px-6 leading-relaxed"
                >
                    {todayQuote.text}
                </Typography>

                <div className="flex items-center justify-center">
                    <div className="h-px w-10 bg-white/40 mr-3"></div>
                    <Typography variant="muted" className="text-white/80 font-medium">
                        {todayQuote.author}
                    </Typography>
                    <div className="h-px w-10 bg-white/40 ml-3"></div>
                </div>
            </div>
        </Card>
    );
};

export default DailyQuote;