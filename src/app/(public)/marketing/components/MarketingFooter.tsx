'use client';

import { cn } from '@utils/utils';
import { Facebook, Github, Instagram, Linkedin, Mail, Twitter } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';

export const MarketingFooter = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const footerLinks = [
        {
            title: "Plataforma",
            links: [
                { label: "Funcionalidades", href: "/marketing/features" },
                { label: "Jogos", href: "/marketing/games" },
                { label: "Idiomas", href: "/marketing/languages" },
                { label: "Demonstração", href: "/marketing/interactive-demo" },
                { label: "Preços", href: "/marketing/pricing" },
            ]
        },
        {
            title: "Recursos",
            links: [
                { label: "Blog", href: "/blog" },
                { label: "Guias de Estudo", href: "/resources/study-guides" },
                { label: "Glossário", href: "/resources/glossary" },
                { label: "FAQ", href: "/faq" },
                { label: "Comunidade", href: "/community" },
            ]
        },
        {
            title: "Empresa",
            links: [
                { label: "Sobre Nós", href: "/about" },
                { label: "Carreiras", href: "/careers" },
                { label: "Contato", href: "/contact" },
                { label: "Imprensa", href: "/press" },
                { label: "Termos de Uso", href: "/terms" },
                { label: "Privacidade", href: "/privacy" },
            ]
        }
    ];

    const socialIcons = [
        { icon: <Twitter size={18} />, href: "https://twitter.com/wordpanda", label: "Twitter" },
        { icon: <Facebook size={18} />, href: "https://facebook.com/wordpanda", label: "Facebook" },
        { icon: <Instagram size={18} />, href: "https://instagram.com/wordpanda", label: "Instagram" },
        { icon: <Linkedin size={18} />, href: "https://linkedin.com/company/wordpanda", label: "LinkedIn" },
        { icon: <Github size={18} />, href: "https://github.com/wordpanda", label: "GitHub" },
        { icon: <Mail size={18} />, href: "mailto:info@wordpanda.app", label: "Email" },
    ];

    return (
        <footer className={cn(
            "border-t pt-20 pb-10 px-4",
            isDark
                ? "bg-gray-950 border-gray-800/50"
                : "bg-white border-gray-200/50"
        )}>
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    {/* Brand & Newsletter column */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-5">
                            <span className="text-2xl filter drop-shadow-md">🐼</span>
                            <h1 className="text-lg font-bold tracking-tight">
                                <span className={isDark ? 'text-emerald-400' : 'text-emerald-600'}>Word</span>
                                <span>Panda</span>
                            </h1>
                        </Link>

                        <p className={cn(
                            "text-sm mb-6 max-w-sm",
                            isDark ? "text-gray-400" : "text-gray-600"
                        )}>
                            Transformando o aprendizado de idiomas através de jogos interativos,
                            inteligência artificial e uma comunidade global de estudantes.
                        </p>

                        <div className="mb-8">
                            <p className={cn(
                                "text-sm font-medium mb-2",
                                isDark ? "text-white" : "text-gray-900"
                            )}>
                                Receba novidades e dicas de estudo
                            </p>

                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Seu email"
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm flex-1",
                                        isDark
                                            ? "bg-gray-900 border border-gray-800 text-white placeholder:text-gray-500 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                                            : "bg-white border border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                                    )}
                                />
                                <button className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-medium",
                                    isDark
                                        ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                                        : "bg-emerald-500 hover:bg-emerald-600 text-white"
                                )}>
                                    Assinar
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {socialIcons.map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                                        isDark
                                            ? "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                                    )}
                                    aria-label={social.label}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links columns */}
                    {footerLinks.map((group, i) => (
                        <div key={i}>
                            <h3 className={cn(
                                "text-sm font-semibold uppercase tracking-wider mb-4",
                                isDark ? "text-gray-300" : "text-gray-900"
                            )}>
                                {group.title}
                            </h3>

                            <ul className="space-y-3">
                                {group.links.map((link, j) => (
                                    <li key={j}>
                                        <Link
                                            href={link.href}
                                            className={cn(
                                                "text-sm hover:underline",
                                                isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
                                            )}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className={cn(
                    "border-t pt-8 text-center",
                    isDark ? "border-gray-800/50" : "border-gray-200"
                )}>
                    <p className={cn(
                        "text-xs",
                        isDark ? "text-gray-500" : "text-gray-600"
                    )}>
                        © {new Date().getFullYear()} WordPanda. Todos os direitos reservados.
                    </p>

                    <div className="flex items-center justify-center gap-4 mt-4">
                        <Link
                            href="/terms"
                            className={cn(
                                "text-xs",
                                isDark ? "text-gray-500 hover:text-gray-400" : "text-gray-600 hover:text-gray-900"
                            )}
                        >
                            Termos de Uso
                        </Link>
                        <span className={isDark ? "text-gray-800" : "text-gray-300"}>•</span>
                        <Link
                            href="/privacy"
                            className={cn(
                                "text-xs",
                                isDark ? "text-gray-500 hover:text-gray-400" : "text-gray-600 hover:text-gray-900"
                            )}
                        >
                            Política de Privacidade
                        </Link>
                        <span className={isDark ? "text-gray-800" : "text-gray-300"}>•</span>
                        <Link
                            href="/cookies"
                            className={cn(
                                "text-xs",
                                isDark ? "text-gray-500 hover:text-gray-400" : "text-gray-600 hover:text-gray-900"
                            )}
                        >
                            Política de Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
