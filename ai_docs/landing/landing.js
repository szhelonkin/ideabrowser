"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Circle, Check, Star, ArrowRight, Users, TrendingUp, Target, Zap, Database, Shield } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function ElegantShape({
    className,
    delay = 0,
    width = 400,
    height = 100,
    rotate = 0,
    gradient = "from-white/[0.08]",
}: {
    className?: string;
    delay?: number;
    width?: number;
    height?: number;
    rotate?: number;
    gradient?: string;
}) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: -150,
                rotate: rotate - 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
                rotate: rotate,
            }}
            transition={{
                duration: 2.4,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
                opacity: { duration: 1.2 },
            }}
            className={cn("absolute", className)}
        >
            <motion.div
                animate={{
                    y: [0, 15, 0],
                }}
                transition={{
                    duration: 12,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                style={{
                    width,
                    height,
                }}
                className="relative"
            >
                <div
                    className={cn(
                        "absolute inset-0 rounded-full",
                        "bg-gradient-to-r to-transparent",
                        gradient,
                        "backdrop-blur-[2px] border-2 border-white/[0.15]",
                        "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
                        "after:absolute after:inset-0 after:rounded-full",
                        "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
                    )}
                />
            </motion.div>
        </motion.div>
    );
}

function HeroSection() {
    const fadeUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                delay: 0.5 + i * 0.2,
                ease: [0.25, 0.4, 0.25, 1],
            },
        }),
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.05] via-transparent to-blue-600/[0.05] blur-3xl" />

            <div className="absolute inset-0 overflow-hidden">
                <ElegantShape
                    delay={0.3}
                    width={600}
                    height={140}
                    rotate={12}
                    gradient="from-blue-500/[0.15]"
                    className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
                />

                <ElegantShape
                    delay={0.5}
                    width={500}
                    height={120}
                    rotate={-15}
                    gradient="from-blue-400/[0.15]"
                    className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
                />

                <ElegantShape
                    delay={0.4}
                    width={300}
                    height={80}
                    rotate={-8}
                    gradient="from-blue-300/[0.15]"
                    className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
                />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        custom={0}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.1] border border-white/[0.2] mb-8 md:mb-12"
                    >
                        <Circle className="h-2 w-2 fill-blue-400/80" />
                        <span className="text-sm text-white/80 tracking-wide">
                            AI-платформа для российских предпринимателей
                        </span>
                    </motion.div>

                    <motion.div
                        custom={1}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 md:mb-8 tracking-tight text-white leading-tight">
                            Найдите прибыльную бизнес-идею для российского рынка{" "}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-100">
                                за 7 дней вместо 2 месяцев
                            </span>
                        </h1>
                    </motion.div>

                    <motion.div
                        custom={2}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <p className="text-lg sm:text-xl text-white/70 mb-8 leading-relaxed max-w-3xl mx-auto">
                            AI-платформа, которая анализирует российские Telegram-каналы и группы ВКонтакте, 
                            чтобы найти прибыльные ниши и готовые бизнес-идеи для вашего успеха
                        </p>
                    </motion.div>

                    <motion.div
                        custom={3}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-lg rounded-xl shadow-lg">
                            Получить доступ бесплатно на 7 дней
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function ProblemSection() {
    const problems = [
        {
            icon: <Users className="h-8 w-8 text-red-500" />,
            title: "10-15 часов в неделю на поиск",
            description: "Тратите время на просмотр Telegram и ВК без системного подхода"
        },
        {
            icon: <Shield className="h-8 w-8 text-red-500" />,
            title: "Заблокированные западные инструменты",
            description: "Не можете использовать Statista, SEMrush и другие аналитические сервисы"
        },
        {
            icon: <Target className="h-8 w-8 text-red-500" />,
            title: "Десятки интервью без понимания",
            description: "Проводите исследования, но не понимаете реальный спрос"
        },
        {
            icon: <Database className="h-8 w-8 text-red-500" />,
            title: "Разрозненные российские источники",
            description: "Собираете данные по крупицам из разных источников"
        },
        {
            icon: <TrendingUp className="h-8 w-8 text-red-500" />,
            title: "Сомнения в жизнеспособности идей",
            description: "Не уверены, что идея сработает именно в России"
        }
    ];

    return (
        <section className="py-16 md:py-24 bg-gray-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        Знакомые проблемы при поиске бизнес-идей?
                    </h2>
                    <p className="text-xl text-gray-600">
                        Большинство предпринимателей сталкиваются с этими вызовами
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {problems.map((problem, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                        >
                            <div className="mb-4">{problem.icon}</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {problem.title}
                            </h3>
                            <p className="text-gray-600">{problem.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function SolutionSection() {
    const benefits = [
        {
            icon: <Target className="h-12 w-12 text-blue-500" />,
            title: "Знайте, какие идеи работают именно в России",
            description: "200+ проверенных возможностей с анализом российского рынка",
            highlight: "200+ валидированных возможностей"
        },
        {
            icon: <Zap className="h-12 w-12 text-blue-500" />,
            title: "Экономьте 2 месяца исследований",
            description: "AI-агент анализирует рынок автоматически 24/7",
            highlight: "Автоматический анализ 24/7"
        },
        {
            icon: <Database className="h-12 w-12 text-blue-500" />,
            title: "Получайте готовые планы реализации",
            description: "С учетом российского законодательства и налогообложения",
            highlight: "Готовые планы запуска"
        }
    ];

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        Ideabrowser решает эти проблемы
                    </h2>
                    <p className="text-xl text-gray-600">
                        Три ключевых преимущества нашей AI-платформы
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            className="text-center p-8 rounded-xl bg-blue-50 border border-blue-100"
                        >
                            <div className="flex justify-center mb-6">{benefit.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                {benefit.title}
                            </h3>
                            <p className="text-gray-600 mb-4">{benefit.description}</p>
                            <div className="inline-block bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                                {benefit.highlight}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function TestimonialsSection() {
    const testimonials = [
        {
            name: "Алексей Морозов",
            title: "IT-специалист, Москва",
            description: "Нашел нишу автоматизации для малого бизнеса. За 3 месяца привлек 15 клиентов и вышел на 180к в месяц.",
            result: "180к ₽/месяц"
        },
        {
            name: "Мария Климова",
            title: "Предприниматель, СПб",
            description: "Запустила онлайн-образование для родителей. За 3 месяца заработала 500к рублей.",
            result: "500к ₽ за 3 месяца"
        },
        {
            name: "Дмитрий Волков",
            title: "Серийный предприниматель",
            description: "Нашел 3 перспективные ниши, одна из которых дала ROI более 1000%.",
            result: "ROI 1000%+"
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-16 md:py-24 bg-gray-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        Истории успеха наших клиентов
                    </h2>
                    <p className="text-xl text-gray-600">
                        Реальные результаты российских предпринимателей
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
                        <div className="flex justify-center mb-8">
                            <div className="flex space-x-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                                "{testimonials[currentIndex].description}"
                            </p>
                            
                            <div className="mb-6">
                                <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-lg font-semibold">
                                    {testimonials[currentIndex].result}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold text-gray-900">
                                    {testimonials[currentIndex].name}
                                </h4>
                                <p className="text-gray-600">{testimonials[currentIndex].title}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center mt-8 space-x-2">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={cn(
                                    "w-3 h-3 rounded-full transition-colors",
                                    index === currentIndex ? "bg-blue-500" : "bg-gray-300"
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function FeaturesSection() {
    const features = [
        {
            title: "AI-агент анализирует российские источники 24/7",
            description: "Постоянный мониторинг Telegram-каналов и групп ВК"
        },
        {
            title: "База из 200+ валидированных идей",
            description: "Проверенные возможности для российского рынка"
        },
        {
            title: "Ежедневные инсайты с анализом рынка",
            description: "Свежие данные и тренды каждый день"
        },
        {
            title: "Персональные рекомендации",
            description: "Идеи, подобранные под ваш профиль и опыт"
        },
        {
            title: "Готовые планы запуска",
            description: "Пошаговые инструкции с учетом российских реалий"
        },
        {
            title: "Интеграция с российскими платформами",
            description: "Подключение к ВК, Яндекс.Директ и другим сервисам"
        }
    ];

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        Как работает Ideabrowser
                    </h2>
                    <p className="text-xl text-gray-600">
                        Полный цикл от поиска идеи до запуска бизнеса
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors"
                        >
                            <div className="flex items-center mb-4">
                                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                    {index + 1}
                                </div>
                                <Check className="h-5 w-5 text-green-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function PricingSection() {
    const plans = [
        {
            name: "STARTER",
            price: "9,000",
            period: "год",
            features: [
                "Доступ к базе идей",
                "Еженедельные обновления",
                "Базовая аналитика",
                "Email поддержка"
            ],
            popular: false
        },
        {
            name: "PROFESSIONAL",
            price: "25,000",
            period: "год",
            features: [
                "Все из STARTER",
                "AI-агент 24/7",
                "Ежедневные инсайты",
                "Персональные консультации",
                "Готовые планы запуска",
                "Приоритетная поддержка"
            ],
            popular: true
        },
        {
            name: "CORPORATE",
            price: "Индивидуально",
            period: "",
            features: [
                "Все из PROFESSIONAL",
                "Корпоративные функции",
                "Интеграции",
                "Персональный менеджер",
                "Обучение команды"
            ],
            popular: false
        }
    ];

    return (
        <section className="py-16 md:py-24 bg-gray-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                        Выберите свой план
                    </h2>
                    <p className="text-xl text-gray-600">
                        Начните с бесплатного периода на 7 дней
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <Card key={index} className={cn(
                            "relative",
                            plan.popular && "border-blue-500 shadow-lg scale-105"
                        )}>
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                                        Популярный
                                    </span>
                                </div>
                            )}
                            
                            <CardHeader className="text-center">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                                <div className="mb-4">
                                    <span className="text-3xl font-bold text-gray-900">
                                        {plan.price === "Индивидуально" ? plan.price : `${plan.price}₽`}
                                    </span>
                                    {plan.period && (
                                        <span className="text-gray-600">/{plan.period}</span>
                                    )}
                                </div>
                            </CardHeader>
                            
                            <CardContent>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center">
                                            <Check className="h-5 w-5 text-green-500 mr-3" />
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                
                                <Button className={cn(
                                    "w-full",
                                    plan.popular 
                                        ? "bg-blue-500 hover:bg-blue-600" 
                                        : "bg-gray-900 hover:bg-gray-800"
                                )}>
                                    {plan.price === "Индивидуально" ? "Связаться с нами" : "Начать бесплатно"}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

function FooterSection() {
    return (
        <footer className="py-16 bg-gray-900 text-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6">
                        Готовы найти свою прибыльную идею?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Гарантия возврата денег в течение 30 дней
                    </p>
                    
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-lg rounded-xl mb-8">
                        Получить доступ бесплатно на 7 дней
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    
                    <div className="border-t border-gray-700 pt-8">
                        <p className="text-gray-400 text-sm">
                            © 2024 Ideabrowser. Все права защищены. | Принимаем к оплате: карты МИР, СБП, Яндекс.Деньги
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function IdeabrowserLanding() {
    return (
        <div className="min-h-screen bg-white">
            <HeroSection />
            <ProblemSection />
            <SolutionSection />
            <TestimonialsSection />
            <FeaturesSection />
            <PricingSection />
            <FooterSection />
        </div>
    );
}

export default IdeabrowserLanding;
