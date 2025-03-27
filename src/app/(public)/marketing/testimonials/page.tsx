'use client';

import { cn } from '@utils/utils';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useState } from 'react';
import { MarketingFooter } from '../components/MarketingFooter';
import { MarketingHeader } from '../components/MarketingHeader';

export default function TestimonialsPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [activeCategory, setActiveCategory] = useState('all');

    const categories = [
        { id: 'all', label: 'Todos' },
        { id: 'students', label: 'Estudantes' },
        { id: 'professionals', label: 'Profissionais' },
        { id: 'teachers', label: 'Professores' },
        { id: 'travelers', label: 'Viajantes' }
    ];

    const testimonials = [
        {
            quote: "O WordPanda transformou completamente minha experiência de aprendizado. Em apenas 3 meses, já consigo manter conversas básicas em espanhol!",
            author: "Mariana Silva",
            role: "Estudante Universitária",
            avatar: "MS",
            gradient: "from-pink-500 to-purple-500",
            rating: 5,
            category: "students",
            featured: true
        },
        {
            quote: "Os jogos interativos e o sistema de repetição espaçada fizeram toda a diferença no meu aprendizado. O idioma parece fluir naturalmente agora.",
            author: "Carlos Eduardo",
            role: "Desenvolvedor de Software",
            avatar: "CE",
            gradient: "from-blue-500 to-cyan-500",
            rating: 5,
            category: "professionals",
            featured: true
        },
        {
            quote: "Como professor, recomendo o WordPanda para todos os meus alunos. A metodologia é cientificamente embasada e os resultados são impressionantes.",
            author: "Prof. Roberto Almeida",
            role: "Doutor em Linguística",
            avatar: "RA",
            gradient: "from-emerald-500 to-green-500",
            rating: 5,
            category: "teachers",
            featured: true
        },
        {
            quote: "Finalmente encontrei uma plataforma que se adapta ao meu ritmo. O assistente de IA personaliza as lições perfeitamente para minhas necessidades.",
            author: "Juliana Costa",
            role: "Profissional de Marketing",
            avatar: "JC",
            gradient: "from-amber-500 to-orange-500",
            rating: 5,
            category: "professionals",
            featured: false
        },
        {
            quote: "Aprender mandarim parecia impossível até eu descobrir o WordPanda. A abordagem visual e os exercícios práticos tornam tudo mais acessível.",
            author: "Ricardo Mendes",
            role: "Empresário",
            avatar: "RM",
            gradient: "from-red-500 to-rose-500",
            rating: 4,
            category: "professionals",
            featured: false
        },
        {
            quote: "Uso a plataforma há 6 meses e já consegui uma promoção no trabalho por causa da minha fluência em inglês. Melhor investimento que já fiz!",
            author: "Fernanda Lima",
            role: "Analista de Comércio Exterior",
            avatar: "FL",
            gradient: "from-violet-500 to-purple-500",
            rating: 5,
            category: "professionals",
            featured: false
        },
        {
            quote: "Meus filhos adoram o WordPanda e não percebem que estão aprendendo enquanto brincam. Os jogos são super envolventes!",
            author: "Patrícia Oliveira",
            role: "Mãe e Professora",
            avatar: "PO",
            gradient: "from-teal-500 to-emerald-500",
            rating: 5,
            category: "teachers",
            featured: false
        },
        {
            quote: "Durante minha viagem à Espanha, consegui me comunicar com os locais graças ao WordPanda. As situações práticas que a plataforma ensina são extremamente úteis.",
            author: "Gabriel Santos",
            role: "Fotógrafo e Viajante",
            avatar: "GS",
            gradient: "from-amber-500 to-yellow-500",
            rating: 5,
            category: "travelers",
            featured: false
        },
        {
            quote: "Estou preparando meu intercâmbio e o WordPanda tem sido meu companheiro diário. Em apenas 3 meses, evoluí mais do que em 2 anos de curso tradicional.",
            author: "Larissa Campos",
            role: "Estudante de Intercâmbio",
            avatar: "LC",
            gradient: "from-sky-500 to-blue-500",
            rating: 5,
            category: "students",
            featured: false
        },
        {
            quote: "Como coordenador pedagógico, integrei o WordPanda no currículo da nossa escola e os resultados foram surpreendentes. Os alunos estão mais engajados e aprendendo mais rápido.",
            author: "Marcos Pereira",
            role: "Coordenador Pedagógico",
            avatar: "MP",
            gradient: "from-indigo-500 to-purple-500",
            rating: 4,
            category: "teachers",
            featured: false
        },
        {
            quote: "Já testei várias plataformas de idiomas, mas o WordPanda é o único que conseguiu me manter motivado. A gamificação realmente funciona!",
            author: "Thiago Martins",
            role: "Estudante de Engenharia",
            avatar: "TM",
            gradient: "from-orange-500 to-red-500",
            rating: 5,
            category: "students",
            featured: false
        },
        {
            quote: "Estou viajando pela América Latina e uso o WordPanda para aprimorar meu espanhol em cada país que visito. As nuances culturais que a plataforma ensina são incríveis.",
            author: "Amanda Costa",
            role: "Nômade Digital",
            avatar: "AC",
            gradient: "from-green-500 to-teal-500",
            rating: 5,
            category: "travelers",
            featured: false
        }
    ];

    const filteredTestimonials = activeCategory === 'all'
        ? testimonials
        : testimonials.filter(t => t.category === activeCategory);

    const featuredTestimonials = testimonials.filter(t => t.featured);

    return (
        <div className={`min-h-screen w-full ${isDark
                ? 'bg-gradient-to-b from-gray-950 via-blue-950/10 to-purple-950/10 text-white'
                : 'bg-gradient-to-b from-white via-zinc-100/30 to-purple-50/30 text-gray-900'
            }`}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/5 rounded-full blur-3xl"></div>
                <div className="absolute top-1/3 -left-40 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-600/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-400/10 dark:bg-pink-600/5 rounded-full blur-3xl"></div>
            </div>

            <MarketingHeader />

            <main className="pt-10 pb-20">
                {/* Hero section */}
                <section className="relative py-16 md:py-24 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className={cn(
                                "inline-block px-4 py-1 rounded-full text-sm font-medium mb-6",
                                isDark
                                    ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                    : "bg-purple-50 text-purple-700 border border-purple-100"
                            )}
                        >
                            Depoimentos
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6"
                        >
                            Histórias de <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">sucesso</span> dos nossos alunos
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className={cn(
                                "text-lg md:text-xl max-w-3xl mx-auto mb-10",
                                isDark ? "text-zinc-300" : "text-zinc-700"
                            )}
                        >
                            Descubra como o WordPanda tem transformado a forma como as pessoas aprendem novos idiomas ao redor do mundo
                        </motion.p>
                    </div>
                </section>

                {/* Featured testimonials */}
                <section className="px-4 mb-20">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                        >
                            {featuredTestimonials.map((testimonial, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                                    className={cn(
                                        "rounded-2xl border p-8 h-full flex flex-col relative overflow-hidden",
                                        isDark
                                            ? "bg-gray-900/60 backdrop-blur-sm border-gray-800/60"
                                            : "bg-white/80 backdrop-blur-sm border-gray-200/60 shadow-xl shadow-gray-200/20"
                                    )}
                                >
                                    <div className={cn(
                                        `absolute -right-16 -top-16 w-32 h-32 rounded-full bg-gradient-to-br ${testimonial.gradient} opacity-10 blur-2xl`
                                    )}></div>

                                    <div className="relative z-10">
                                        <div className="text-purple-500 dark:text-purple-400 mb-6">
                                            <Quote size={30} className="opacity-75" />
                                        </div>

                                        <p className={cn(
                                            "text-lg italic font-medium leading-relaxed mb-8",
                                            isDark ? "text-gray-300" : "text-gray-700"
                                        )}>
                                            "{testimonial.quote}"
                                        </p>

                                        <div className="mt-auto">
                                            <div className="flex mb-4">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={16}
                                                        className={i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                                                    />
                                                ))}
                                            </div>

                                            <div className="flex items-center">
                                                <div className={cn(
                                                    `w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-4 bg-gradient-to-br ${testimonial.gradient}`
                                                )}>
                                                    {testimonial.avatar}
                                                </div>

                                                <div>
                                                    <h4 className="font-bold">{testimonial.author}</h4>
                                                    <p className={cn(
                                                        "text-sm",
                                                        isDark ? "text-gray-400" : "text-gray-600"
                                                    )}>
                                                        {testimonial.role}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Testimonials filter */}
                <section className="px-4 mb-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-center mb-12">
                            <div className={cn(
                                "inline-flex rounded-xl p-1 border",
                                isDark ? "bg-gray-900/60 border-gray-800" : "bg-white border-gray-200 shadow-sm"
                            )}>
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setActiveCategory(category.id)}
                                        className={cn(
                                            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                            activeCategory === category.id
                                                ? (isDark
                                                    ? "bg-purple-600 text-white"
                                                    : "bg-purple-500 text-white")
                                                : (isDark
                                                    ? "text-gray-300 hover:text-white"
                                                    : "text-gray-700 hover:text-gray-900")
                                        )}
                                    >
                                        {category.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTestimonials.map((testimonial, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: (index % 6) * 0.1 }}
                                    className={cn(
                                        "p-6 rounded-xl border h-full",
                                        isDark
                                            ? "bg-gray-900/40 backdrop-blur-sm border-gray-800/60"
                                            : "bg-white backdrop-blur-sm border-gray-200/60 shadow-lg shadow-gray-200/10"
                                    )}
                                >
                                    <div className="flex items-start mb-4">
                                        <div className={cn(
                                            `w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3 bg-gradient-to-br ${testimonial.gradient}`
                                        )}>
                                            {testimonial.avatar}
                                        </div>

                                        <div>
                                            <h4 className="font-bold">{testimonial.author}</h4>
                                            <p className={cn(
                                                "text-sm",
                                                isDark ? "text-gray-400" : "text-gray-600"
                                            )}>
                                                {testimonial.role}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={14}
                                                className={i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                                            />
                                        ))}
                                    </div>

                                    <p className={cn(
                                        "text-sm leading-relaxed italic",
                                        isDark ? "text-gray-300" : "text-gray-700"
                                    )}>
                                        "{testimonial.quote}"
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Video testimonials section */}
                <section className="py-20 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                                className={cn(
                                    "inline-block px-4 py-1 rounded-full text-sm font-medium mb-4",
                                    isDark
                                        ? "bg-pink-500/10 text-pink-400 border border-pink-500/20"
                                        : "bg-pink-50 text-pink-700 border border-pink-100"
                                )}
                            >
                                Vídeo Depoimentos
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                viewport={{ once: true }}
                                className="text-3xl md:text-4xl font-bold mb-6"
                            >
                                Veja e ouça nossas <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">histórias</span> de sucesso
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                viewport={{ once: true }}
                                className={cn(
                                    "max-w-3xl mx-auto text-lg mb-12",
                                    isDark ? "text-zinc-300" : "text-zinc-700"
                                )}
                            >
                                Assista aos depoimentos em vídeo de alunos que transformaram sua fluência com o WordPanda
                            </motion.p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map((video, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="overflow-hidden rounded-xl"
                                >
                                    <div className={cn(
                                        "relative aspect-video rounded-xl overflow-hidden cursor-pointer group",
                                        isDark ? "bg-gray-800" : "bg-gray-200"
                                    )}>
                                        {/* Placeholder for video thumbnail */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className={cn(
                                                "w-16 h-16 rounded-full flex items-center justify-center",
                                                isDark ? "bg-gray-900/70" : "bg-white/70"
                                            )}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isDark ? "text-purple-400" : "text-purple-600"}>
                                                    <polygon points="5 3 19 12 5 21 5 3" />
                                                </svg>
                                            </div>
                                        </div>

                                        <div className={cn(
                                            "absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 opacity-0 group-hover:opacity-100",
                                            isDark ? "bg-gradient-to-t from-gray-900 to-transparent" : "bg-gradient-to-t from-gray-900/80 to-transparent"
                                        )}>
                                            <h3 className="text-white font-medium">
                                                De iniciante a fluente em 6 meses
                                            </h3>
                                            <p className="text-white/70 text-sm">
                                                Por Maria Santos • Estudante
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA section */}
                <section className="py-20 px-4 relative overflow-hidden">
                    <div className={cn(
                        "max-w-7xl mx-auto rounded-3xl p-12 md:p-16 relative overflow-hidden",
                        isDark
                            ? "bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-800/50"
                            : "bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100/50"
                    )}>
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_rgba(168,85,247,0.15),_transparent_50%)]"></div>
                            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
                        </div>

                        <div className="relative z-10 text-center max-w-3xl mx-auto">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                                className="text-3xl md:text-4xl font-bold mb-6"
                            >
                                Pronto para se juntar a milhares de <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">alunos satisfeitos</span>?
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                viewport={{ once: true }}
                                className={cn(
                                    "text-lg mb-10",
                                    isDark ? "text-zinc-300" : "text-zinc-700"
                                )}
                            >
                                Comece sua jornada de aprendizado hoje mesmo e junte-se à nossa comunidade global de estudantes
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                viewport={{ once: true }}
                                className="flex flex-col sm:flex-row gap-4 justify-center"
                            >
                                <Link href="/register">
                                    <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium shadow-lg hover:shadow-purple-500/20 dark:hover:shadow-purple-400/20 transform hover:-translate-y-1 transition-all duration-300">
                                        Comece Gratuitamente
                                    </button>
                                </Link>
                                <Link href="/marketing/interactive-demo">
                                    <button className={`px-8 py-4 rounded-xl font-medium shadow-md ${isDark
                                            ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm'
                                            : 'bg-gray-900 hover:bg-gray-800 text-white'
                                        } transform hover:-translate-y-1 transition-all duration-300`}>
                                        Ver Demonstração
                                    </button>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </section>
            </main>

            <MarketingFooter />
        </div>
    );
}
