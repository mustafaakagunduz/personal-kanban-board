import React from 'react';
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { quoteCardClass } from "../KanbanBoard3/styles";
import { useLanguage } from '../../../context/LanguageContext';

interface DailyQuoteProps {
    date: Date | null;
}
//deneme
const trQuotes = [
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

const enQuotes = [
    { text: "Success is the fruit of efforts woven with patience. 🍂", author: "Rumi" },
    { text: "You can't change the direction of the wind, but you can adjust your sails. ⛵", author: "Aristotle" },
    { text: "The darkest hour is just before the dawn. 🌅", author: "Thomas Fuller" },
    { text: "The secret to progress lies where you fear to take a step. 🚶‍♂️", author: "Anais Nin" },
    { text: "If we don't chase our dreams, they drift away from us. ✨", author: "Ralph Waldo Emerson" },
    { text: "To find your way, sometimes you must risk getting lost. 🌲", author: "Anonymous" },
    { text: "Beginnings are small, but they hide great potential. 🌱", author: "Lao Tzu" },
    { text: "Those who use time best, build the best future. ⏳", author: "Benjamin Franklin" },
    { text: "Success is the reward of those who push the limits of patience. 🏆", author: "Victor Hugo" },
    { text: "A journey without a goal is a life without direction. 🧭", author: "Seneca" },
    { text: "Discipline is the first step to freedom. 🌉", author: "Aristotle" },
    { text: "Small efforts bring great victories. ⚡", author: "Saadi Shirazi" },
    { text: "Take a step every day, your dreams will soon be within reach. 👣", author: "Goethe" },
    { text: "Success is a journey constantly nourished by patience and effort. 🚶‍♀️", author: "Helen Keller" },
    { text: "Without vision, action is powerless; without action, vision is useless. 🔥", author: "Thomas Jefferson" },
    { text: "Yesterday is gone, tomorrow is unknown; today is yours. 🎁", author: "Anonymous" },
    { text: "Planning is the construction of the future. 🗓️", author: "Alan Lakein" },
    { text: "A regular routine opens the door to freedom. 🧠", author: "Marcus Aurelius" },
    { text: "Paying attention to details is the key to success. 🧩", author: "Leonardo da Vinci" },
    { text: "Every step you take today lays the foundation for tomorrow. 🏗️", author: "Hermann Hesse" },
    { text: "Starting on time is half the battle won. ⏰", author: "Anonymous" },
    { text: "Managing your time is managing your life. ⌚", author: "Stephen R. Covey" },
    { text: "Procrastination is the greatest enemy of opportunities. ⏱️", author: "Seneca" },
    { text: "Those who value time, grasp the essence of life. 💎", author: "Johann Wolfgang von Goethe" },
    { text: "Live not to dream, but to make dreams come true. 💭", author: "Ralph Waldo Emerson" },
    { text: "Perfection lies in the small details. 🌟", author: "Michelangelo" },
    { text: "Great dreams require steady steps. 🌿", author: "Henry David Thoreau" },
    { text: "Making the most of today shapes the future. 🗺️", author: "Benjamin Disraeli" },
    { text: "A well-planned hour is worth a day without a plan. ⏲️", author: "Seth Godin" }
];



const DailyQuote: React.FC<DailyQuoteProps> = ({ date }) => {
    const { language, t } = useLanguage();

    // Dile göre alıntıları seç
    const quotes = language === 'tr' ? trQuotes : enQuotes;

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
        <Card className={`${quoteCardClass} mt-4 mb-2 transition-all duration-300 max-w-3xl mx-auto`}>
            <div className="p-4 text-center relative">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-xs font-medium text-white/80">
                    {t('dailyQuote.title')}
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