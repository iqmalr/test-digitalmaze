export interface Teacher {
    id: number;
    name: string;
}

export interface ClassData {
    id: number;
    name: string;
    teacher?: Teacher;
    academic_year: string;
    // semester: number;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedClasses {
    data: ClassData[];
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
    // semesters: number[];
}

export interface Filters {
    search?: string;
    per_page?: number;
    class_names?: string[];
    academic_years?: string[];
    // semesters?: number[];
}

export interface Flash {
    message?: string;
    type?: 'success' | 'error' | 'info';
}

export interface PageProps {
    classes: PaginatedClasses;
    flash?: Flash;
    filters: Filters;
    filterOptions: FilterOptions;
}
