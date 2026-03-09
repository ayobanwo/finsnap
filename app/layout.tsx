import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'FinSnap',
    description: 'Your personal finance tracker',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{
                    __html: `
                        try {
                            const theme = localStorage.getItem('pfs_theme');
                            if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                                document.documentElement.classList.add('dark');
                            }
                        } catch(e) {}
                    `
                }} />
            </head>
            <body>{children}</body>
        </html>
    );
}
