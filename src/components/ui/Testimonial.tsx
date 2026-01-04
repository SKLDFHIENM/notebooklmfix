import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

interface TestimonialProps {
    lang: 'en' | 'cn';
}

interface Review {
    id: number;
    name: string;
    role: string;
    avatar: string;
    content: string;
    contentEn: string;
    rating: number;
    platform: 'wechat' | 'xiaohongshu' | 'jike' | 'twitter';
}

const REVIEWS: Review[] = [
    {
        id: 1,
        name: '羽',
        role: '',
        avatar: '🪶',
        content: '效果特别好的，如果没问题的话后面还会下单',
        contentEn: 'The results are great. Will definitely order more if everything goes smoothly.',
        rating: 5,
        platform: 'wechat'
    },
    {
        id: 2,
        name: '林**',
        role: '产品经理',
        avatar: '🌸',
        content: '4K 效果太明显了，直接能放 PPT 汇报',
        contentEn: '4K quality is amazing, perfect for executive presentations.',
        rating: 5,
        platform: 'wechat'
    },
    {
        id: 3,
        name: '张*学',
        role: '大学生',
        avatar: '📚',
        content: '答辩前一晚发现图全糊了，这工具救我一命！20 张图 10 分钟搞定',
        contentEn: 'Saved my thesis defense! Fixed 20 blurry images in 10 minutes.',
        rating: 5,
        platform: 'xiaohongshu'
    },
    {
        id: 4,
        name: 'A***x',
        role: '设计师',
        avatar: '🎨',
        content: '清晰度拉满，色彩还原也很准',
        contentEn: 'Crystal clear, color accuracy is spot on.',
        rating: 5,
        platform: 'twitter'
    },
    {
        id: 5,
        name: '陈*师',
        role: '老师',
        avatar: '👨‍🏫',
        content: '做学习资料终于不用忍受糊图了，感谢！',
        contentEn: 'Finally no more blurry images for study materials. Thanks!',
        rating: 5,
        platform: 'wechat'
    },
    {
        id: 6,
        name: '小*',
        role: '博主',
        avatar: '✨',
        content: '批量处理太方便了，省超多时间',
        contentEn: 'Batch processing is so convenient, saves tons of time.',
        rating: 5,
        platform: 'xiaohongshu'
    },
    {
        id: 7,
        name: 'K***n',
        role: '程序员',
        avatar: '💻',
        content: '终于有人做了！开源项目 respect 👏',
        contentEn: 'Finally someone built this! Open source, respect 👏',
        rating: 5,
        platform: 'jike'
    },
    {
        id: 8,
        name: '王*',
        role: '运营',
        avatar: '📊',
        content: '导出图清清楚楚，领导都夸报告质量提升了',
        contentEn: 'Exports are crystal clear now, boss praised the improved report quality.',
        rating: 5,
        platform: 'wechat'
    },
    {
        id: 9,
        name: '李**',
        role: '销售',
        avatar: '💼',
        content: '给客户做方案再也不尴尬了',
        contentEn: 'No more embarrassing blurry images in client proposals.',
        rating: 5,
        platform: 'xiaohongshu'
    }
];

const PlatformBadge: React.FC<{ platform: Review['platform'] }> = ({ platform }) => {
    const config = {
        wechat: { bg: 'bg-[#07C160]/10', text: 'text-[#07C160]', label: '微信' },
        xiaohongshu: { bg: 'bg-red-500/10', text: 'text-red-500', label: '小红书' },
        jike: { bg: 'bg-yellow-500/10', text: 'text-yellow-600', label: '即刻' },
        twitter: { bg: 'bg-sky-500/10', text: 'text-sky-500', label: 'X' }
    };
    const c = config[platform];
    return (
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${c.bg} ${c.text}`}>
            {c.label}
        </span>
    );
};

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-300 dark:text-zinc-600'}`}
            />
        ))}
    </div>
);

// Single review card component
const ReviewCard: React.FC<{ review: Review; lang: 'en' | 'cn' }> = ({ review, lang }) => (
    <div className="flex-shrink-0 w-[300px] p-5 bg-white dark:bg-zinc-900/80 rounded-2xl border border-zinc-200/80 dark:border-white/10 shadow-sm">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center text-lg ring-2 ring-white dark:ring-zinc-800 shadow-sm">
                    {review.avatar}
                </div>
                <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">{review.name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{review.role}</p>
                </div>
            </div>
            <PlatformBadge platform={review.platform} />
        </div>

        {/* Rating */}
        <div className="mb-2">
            <StarRating rating={review.rating} />
        </div>

        {/* Content */}
        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed line-clamp-3">
            "{lang === 'en' ? review.contentEn : review.content}"
        </p>
    </div>
);

export const Testimonial: React.FC<TestimonialProps> = ({ lang }) => {
    // 复制数组以实现无缝循环
    const duplicatedReviews = [...REVIEWS, ...REVIEWS];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
        >
            {/* Section Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 rounded-full mb-4">
                    <Quote className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                        {lang === 'en' ? 'Loved by thousands' : '用户评价'}
                    </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-heading font-bold text-zinc-900 dark:text-white mb-2">
                    {lang === 'en' ? 'What Our Users Say' : '听听他们怎么说'}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {lang === 'en' ? 'Join 2000+ users who fixed their NotebookLM exports' : '已有 2000+ 用户成功修复了他们的导出图片'}
                </p>
            </div>

            {/* Auto-scrolling Marquee */}
            <div className="relative overflow-hidden">
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-zinc-50 dark:from-zinc-950 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-zinc-50 dark:from-zinc-950 to-transparent z-10 pointer-events-none" />

                {/* Scrolling Track */}
                <motion.div
                    className="flex gap-5 py-2"
                    animate={{
                        x: [0, -((300 + 20) * REVIEWS.length)]
                    }}
                    transition={{
                        x: {
                            duration: 40,
                            repeat: Infinity,
                            ease: "linear"
                        }
                    }}
                >
                    {duplicatedReviews.map((review, idx) => (
                        <ReviewCard key={`${review.id}-${idx}`} review={review} lang={lang} />
                    ))}
                </motion.div>
            </div>

            {/* Social Proof Stats */}
            <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-zinc-200/50 dark:border-white/5">
                <div className="text-center">
                    <p className="text-2xl font-bold text-zinc-900 dark:text-white">2,847</p>
                    <p className="text-xs text-zinc-500">{lang === 'en' ? 'Images Fixed' : '图片已修复'}</p>
                </div>
                <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-700"></div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-zinc-900 dark:text-white">4.9</p>
                    <p className="text-xs text-zinc-500">{lang === 'en' ? 'Avg Rating' : '平均评分'}</p>
                </div>
                <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-700"></div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-zinc-900 dark:text-white">98%</p>
                    <p className="text-xs text-zinc-500">{lang === 'en' ? 'Success Rate' : '成功率'}</p>
                </div>
            </div>
        </motion.div>
    );
};
