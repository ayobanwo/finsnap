'use client';
import { useState, useEffect } from 'react';
import { Moon, Sun, TrendingUp, Settings } from 'lucide-react';

interface HeaderProps {
    onSettingsClick: () => void;
}

export default function Header({ onSettingsClick }: HeaderProps) {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
    }, []);

    const toggleTheme = () => {
        const next = !isDark;
        setIsDark(next);
        document.documentElement.classList.toggle('dark', next);
        try { localStorage.setItem('pfs_theme', next ? 'dark' : 'light'); } catch {}
    };

    return (
        <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[var(--text-primary)] flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-[var(--surface)]" strokeWidth={2.5} />
                    </div>
                    <div>
                        <span className="font-semibold text-[var(--text-primary)] text-sm tracking-tight">FinSnap v 1.0</span>
                        
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={onSettingsClick}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-light)] transition-all"
                        aria-label="Settings"
                    >
                        <Settings className="w-4 h-4" />
                    </button>
                    <button
                        onClick={toggleTheme}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-light)] transition-all"
                        aria-label="Toggle theme"
                    >
                        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </header>
    );
}
