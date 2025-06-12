import React, { useState } from 'react';

interface NewsItem {
    id: number;
    category: 'all' | 'announcements' | 'groups';
    title: string;
    description: string;
    time: string;
    categoryLabel: string;
    image: string;
}

const News: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('all');

    const newsData: NewsItem[] = [
        {
            id: 1,
            category: 'groups',
            title: 'Передаем экстренное сообщение от группы "Долг"',
            description: 'В районе старого военного полигона зафиксирована повышенная аномальная активность. Разведгруппа "Сокол-3" сообщает о появлении нового типа гравитационных аномалий в 2 км к северо-востоку от Кордона.',
            time: '15 мин.',
            categoryLabel: 'Группировки',
            image: 'https://platform.polygon.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/24913522/S2HoS_GSCGameWorld_Mill_raw.jpg?quality=90&strip=all&crop=7.8125%2C0%2C84.375%2C100&w=2400'
        },
        {
            id: 2,
            category: 'announcements',
            title: 'Новое обновление системы безопасности',
            description: 'Администрация Зоны объявляет о внедрении новых протоколов безопасности для всех сталкеров. Обязательная регистрация на всех КПП начинается с понедельника.',
            time: '1 час',
            categoryLabel: 'Анонсы',
            image: 'https://img.sector.sk/files/recenzie/202411148316647////stalker-2-heart-of-chornobyl-6105724-41-1920.jpg'
        },
        {
            id: 3,
            category: 'all',
            title: 'Торговцы сообщают о дефиците патронов',
            description: 'В связи с участившимися столкновениями между группировками, на рынке наблюдается острая нехватка боеприпасов. Цены выросли в 2-3 раза.',
            time: '3 часа',
            categoryLabel: 'Все новости',
            image: 'https://imgs.sector.sk/files/novinky/0/2025/4-14-18-25-20/stalker-2-prave-dostal-roadmap-image-994.jpg'
        },
        {
            id: 4,
            category: 'groups',
            title: 'Свобода заключила временное перемирие',
            description: 'Группировка "Свобода" объявила о временном прекращении огня в районе Свалки. Перемирие продлится до конца недели для эвакуации раненых.',
            time: '5 часов',
            categoryLabel: 'Группировки',
            image: 'https://itc.ua/wp-content/uploads/2025/03/Stalker-2-Heart-of-Chernobyl-Review-Checkpoitn-Gaming-Omi-Koulas-39-scaled-1.jpg'
        }
    ];

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    const filteredNews = newsData.filter(news => 
        activeTab === 'all' ? true : news.category === activeTab
    );

    return (
        <div className="container">
            <div className="flex gap-[10px] pb-[25px] items-center">
                <button 
                    onClick={() => handleTabClick('all')}
                    className={`px-[13px] h-[37px] rounded-[9px] hover:opacity-80 transition-opacity ${
                        activeTab === 'all' 
                            ? 'bg-white text-black' 
                            : 'bg-[rgba(255,255,255,0.02)] border border-white/5 text-white/70'
                    }`}
                >
                    Все новости
                </button>
                <button 
                    onClick={() => handleTabClick('announcements')}
                    className={`px-[13px] h-[37px] rounded-[9px] hover:opacity-80 transition-opacity ${
                        activeTab === 'announcements' 
                            ? 'bg-white text-black' 
                            : 'bg-[rgba(255,255,255,0.02)] border border-white/5 text-white/70'
                    }`}
                >
                    Дневник разработки
                </button>
                <button 
                    onClick={() => handleTabClick('groups')}
                    className={`px-[13px] h-[37px] rounded-[9px] hover:opacity-80 transition-opacity ${
                        activeTab === 'groups' 
                            ? 'bg-white text-black' 
                            : 'bg-[rgba(255,255,255,0.02)] border border-white/5 text-white/70'
                    }`}
                >
                    Объявления
                </button>
            </div>
            <div className='h-[408px] w-[536px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
                <div className='flex flex-col gap-[10px]'>
                    {filteredNews.map((news) => (
                        <div key={news.id} className="bg-[#080808] rounded-[16px] w-fit relative">
                            <img  src={news.image} className='h-[147px] rounded-t-[16px] w-[536px] object-cover ' alt="" />
                            <div className="absolute h-[147px] inset-0 bg-gradient-to-t from-[#080808] from-10% via-[#080808]/50 via-60% to-transparent"></div>
                            <div className='flex items-center gap-[10px] pb-[10px] p-3'>
                                <p className='w-fit rounded-full flex items-center text-[13px] px-[8px] h-[25px] bg-white'>{news.categoryLabel}</p>
                                <p className='w-fit rounded-full flex items-center text-[13px] px-[8px] h-[25px] border border-white/5 text-white/60'>{news.time}</p>
                            </div>
                            <div className="flex flex-col gap-[10px] p-3">
                                <h1 className='text-white font-semibold'>{news.title}</h1>
                                <p className='text-white/60 text-[12px] w-[490px]'>{news.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default News;