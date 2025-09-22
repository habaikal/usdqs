import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface FooterLink {
    key: string;
    href: string;
}

const FooterLinkColumn: React.FC<{ titleKey: string; links: FooterLink[] }> = ({ titleKey, links }) => {
    const { t } = useLanguage();
    return (
        <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">{t(titleKey)}</h3>
            {links.map(link => (
                <a key={link.key} href={link.href} className="hover:text-cyan-400 transition-colors py-1">{t(link.key)}</a>
            ))}
        </div>
    );
};

export const Footer: React.FC = () => {
    const footerLinks = [
        { title: 'footer.platform.title', links: [
            { key: 'footer.platform.info', href: '#' }, 
            { key: 'footer.platform.exchange', href: '#' }, 
            { key: 'footer.platform.whitepaper', href: '#/whitepaper' }, 
            { key: 'footer.platform.governance', href: '#/governance' }
        ] },
        { title: 'footer.support.title', links: [
            { key: 'footer.support.faq', href: '#' }, 
            { key: 'footer.support.contact', href: '#' }, 
            { key: 'footer.support.api_docs', href: '#' }, 
            { key: 'footer.support.dev_guide', href: '#' }
        ] },
        { title: 'footer.company.title', links: [
            { key: 'footer.company.about', href: '#' }, 
            { key: 'footer.company.team', href: '#' }, 
            { key: 'footer.company.investors', href: '#' }, 
            { key: 'footer.company.careers', href: '#' }
        ] },
        { title: 'footer.legal.title', links: [
            { key: 'footer.legal.terms', href: '#' }, 
            { key: 'footer.legal.privacy', href: '#' }, 
            { key: 'footer.legal.risk', href: '#' }, 
            { key: 'footer.legal.audit', href: '#' }
        ] },
    ];

    return (
        <footer className="w-full py-8 mt-24 text-gray-400 text-sm">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
                {footerLinks.map(col => (
                     <FooterLinkColumn key={col.title} titleKey={col.title} links={col.links} />
                ))}
            </div>
            <div className="w-full text-center mt-8 pt-8 border-t border-gray-700">
                &copy; {new Date().getFullYear()} <span className="gradient-text">USDQS</span>. All Rights Reserved.
            </div>
        </footer>
    );
};
