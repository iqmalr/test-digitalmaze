import type { PageProps } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

export const useStudentByClass = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [perPage, setPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedClassNames, setSelectedClassNames] = useState<string[]>([]);
    const [selectedAcademicYears, setSelectedAcademicYears] = useState<string[]>([]);
    // const [selectedSemesters, setSelectedSemesters] = useState<number[]>([]);
    const [showFilters, setShowFilters] = useState(false);

    const { classes, flash, filters, filterOptions } = usePage().props as unknown as PageProps;

    useEffect(() => {
        if (classes) {
            const timer = setTimeout(() => setIsLoading(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [classes]);

    useEffect(() => {
        setSearchTerm(filters.search ?? '');
        setPerPage(filters.per_page ?? 10);
        setSelectedAcademicYears(filters.academic_years ?? []);
        // setSelectedSemesters(filters.semesters ?? []);
        setSelectedClassNames(filters.class_names ?? []);
    }, [filters]);

    const applyFilters = () => {
        router.get(
            route('student-by-classes.index'),
            {
                search: searchTerm,
                per_page: perPage,
                class_names: selectedClassNames,
                academic_years: selectedAcademicYears,
                // semesters: selectedSemesters,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    const handlePerPageChange = (value: string) => {
        const newPerPage = parseInt(value);
        setPerPage(newPerPage);
        router.get(
            route('student-by-classes.index'),
            {
                search: searchTerm,
                per_page: newPerPage,
                class_names: selectedClassNames,
                academic_years: selectedAcademicYears,
                // semesters: selectedSemesters,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handlePageChange = (url: string) => {
        router.visit(url, {
            preserveState: true,
            replace: true,
        });
    };

    const handleClassNameChange = (className: string, checked: boolean) => {
        if (checked) {
            setSelectedClassNames((prev) => [...prev, className]);
        } else {
            setSelectedClassNames((prev) => prev.filter((name) => name !== className));
        }
    };

    const handleAcademicYearChange = (year: string, checked: boolean) => {
        if (checked) {
            setSelectedAcademicYears((prev) => [...prev, year]);
        } else {
            setSelectedAcademicYears((prev) => prev.filter((y) => y !== year));
        }
    };

    // const handleSemesterChange = (semester: number, checked: boolean) => {
    //     if (checked) {
    //         setSelectedSemesters((prev) => [...prev, semester]);
    //     } else {
    //         setSelectedSemesters((prev) => prev.filter((s) => s !== semester));
    //     }
    // };

    const clearAllFilters = () => {
        setSearchTerm('');
        setSelectedClassNames([]);
        setSelectedAcademicYears([]);
        // setSelectedSemesters([]);
        router.get(
            route('student-by-classes.index'),
            { per_page: perPage },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const clearFiltersOnly = () => {
        setSelectedClassNames([]);
        setSelectedAcademicYears([]);
        // setSelectedSemesters([]);
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const hasActiveFilters = Boolean(searchTerm || selectedClassNames.length || selectedAcademicYears.length);
    // const hasActiveFilters = Boolean(searchTerm || selectedClassNames.length || selectedAcademicYears.length || selectedSemesters.length);

    return {
        searchTerm,
        setSearchTerm,
        perPage,
        isLoading,
        selectedClassNames,
        selectedAcademicYears,
        // selectedSemesters,
        showFilters,
        hasActiveFilters,
        classes,
        flash,
        filterOptions,
        handleSearch,
        handlePerPageChange,
        handlePageChange,
        handleClassNameChange,
        handleAcademicYearChange,
        // handleSemesterChange,
        applyFilters,
        clearAllFilters,
        clearFiltersOnly,
        toggleFilters,
    };
};
