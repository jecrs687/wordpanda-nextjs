import {
    BookOpen,
    Home,
    Languages,
    LayoutDashboard,
    LogOut,
    Menu,
    Moon,
    Search,
    Settings,
    Sun,
    Trophy,
    User,
    X
} from 'lucide-react';
import { ElementType } from 'react';

// Using a record type for better type safety
export const NavIcons: Record<string, ElementType> = {
    dashboard: LayoutDashboard,
    languages: Languages,
    profile: User,
    search: Search,
    sun: Sun,
    moon: Moon,
    menu: Menu,
    close: X,
    book: BookOpen,
    trophy: Trophy,
    settings: Settings,
    logout: LogOut,
    metrics: Trophy,
    home: Home
};
