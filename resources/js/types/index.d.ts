import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}
export interface ClassItem {
    id: string;
    name: string;
    teacher?: {
        id: string;
        name: string;
    } | null;
    capacity: number;
    description?: string;
    academic_year: string;
    semester: number;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedClasses {
    data: ClassItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: PaginationLink[];
}

export interface FilterOptions {
    class_names: string[];
    academic_years: string[];
    semesters: number[];
}

export interface PageProps {
    flash?: {
        message?: string;
    };
    classes: PaginatedClasses;
    filters: {
        search: string;
        per_page: number;
        class_names: string[];
        academic_years: string[];
        semesters: number[];
    };
    filterOptions: FilterOptions;
}
