import React from 'react';
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { quoteCardClass } from "../KanbanBoard3/styles";

interface DailyQuoteProps {
    date: Date | null;
}
//deneme
const quotes = [
    { text: "Başarı, sabırla örülen emeklerin meyvesidir. 🍂", author: "Mevlana" },
    { text: "Rüzgarın yönünü değiştiremezsin, ama yelkenlerini ayarlayabilirsin. ⛵", author: "Aristoteles" },
    { text: "En karanlık an, şafağa en yakın olanıdır. 🌅", author: "Thomas Fuller" },
    { text: "Bir adım atmaktan korktuğun yerde, ilerlemenin sırrı yatar. 🚶‍♂️", author: "Anais Nin" },
    { text: "Düşlerimizin peşinden gitmezsek, onlar da bizden uzaklaşır. ✨", author: "Ralph Waldo Emerson" },
    { text: "Kendi yolunu bulmak için, bazen kaybolmayı göze almalısın. 🌲", author: "Anonim" },
    { text: "Başlangıçlar küçüktür, ama içlerinde büyük potansiyeller saklar. 🌱", author: "Lao Tzu" },
    { text: "Zamanı en iyi kullanan, geleceği en iyi inşa eder. ⏳", author: "Benjamin Franklin" },
    { text: "Başarı, sabrın sınırlarını zorlayanların ödülüdür. 🏆", author: "Victor Hugo" },
    { text: "Hedefsiz bir yolculuk, yönsüz bir yaşamdır. 🧭", author: "Seneca" },
    { text: "Disiplin, özgürlüğün ilk adımıdır. 🌉", author: "Aristoteles" },
    { text: "Küçük çabalar büyük zaferler getirir. ⚡", author: "Sadi Şirazi" },
    { text: "Her gün bir adım at, hayallerin yakında olacak. 👣", author: "Goethe" },
    { text: "Başarı, sabır ve çaba ile sürekli beslenen bir yolculuktur. 🚶‍♀️", author: "Helen Keller" },
    { text: "Vizyon olmadan, eylem güçsüzdür; eylem olmadan vizyon faydasızdır. 🔥", author: "Thomas Jefferson" },
    { text: "Dün geçti, yarın bilinmez; bugün senin. 🎁", author: "Anonim" },
    { text: "Planlama, geleceğin inşa edilmesidir. 🗓️", author: "Alan Lakein" },
    { text: "Düzenli bir rutin, özgürlüğün kapısını açar. 🧠", author: "Marcus Aurelius" },
    { text: "Detaylara dikkat etmek, başarıya ulaşmanın anahtarıdır. 🧩", author: "Leonardo da Vinci" },
    { text: "Bugün attığın her adım, yarının temelini oluşturur. 🏗️", author: "Hermann Hesse" },
    { text: "Zamanında başlamak, yarı yarıya kazanmaktır. ⏰", author: "Anonim" },
    { text: "Zamanını yönetmek, hayatını yönetmektir. ⌚", author: "Stephen R. Covey" },
    { text: "Erteleme, fırsatların en büyük düşmanıdır. ⏱️", author: "Seneca" },
    { text: "Zamana değer veren, hayatın özüne ulaşır. 💎", author: "Johann Wolfgang von Goethe" },
    { text: "Hayal kurmak için değil, hayalleri gerçekleştirmek için yaşa. 💭", author: "Ralph Waldo Emerson" },
    { text: "Kusursuzluk, küçük detaylarda gizlidir. 🌟", author: "Michelangelo" },
    { text: "Büyük hayaller, sağlam adımlar ister. 🌿", author: "Henry David Thoreau" },
    { text: "Bugünü en iyi şekilde kullanmak, geleceği şekillendirmektir. 🗺️", author: "Benjamin Disraeli" },
    { text: "İyi planlanmış bir saat, plansız bir güne bedeldir. ⏲️", author: "Seth Godin" }
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
        <Card className={`${quoteCardClass} hover:bg-white/20 mt-4 mb-2 transition-all duration-300 max-w-3xl mx-auto`}>
            <div className="p-4 text-center relative">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-xs font-medium text-white/80">
                    Günün Sözü
                </div>

                <div className="absolute left-2 top-3 text-white/30 text-3xl font-serif">"</div>
                <div className="absolute right-2 bottom-6 text-white/30 text-3xl font-serif">"</div>

                <Typography
                    variant="h5"
                    className="text-white font-light italic mb-2 pt-2 px-4 leading-relaxed"
                >
                    {todayQuote.text}
                </Typography>

                <div className="flex items-center justify-center">
                    <div className="h-px w-8 bg-white/40 mr-2"></div>
                    <Typography variant="muted" className="text-white/80 font-medium text-sm">
                        {todayQuote.author}
                    </Typography>
                    <div className="h-px w-8 bg-white/40 ml-2"></div>
                </div>
            </div>
        </Card>
    );
};

export default DailyQuote;