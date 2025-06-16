import HeadingSmall from '@/components/heading-small';
import Pagination from '@/components/pagination';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Calendar, Search, Terminal } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Teachers',
        href: '/teachers',
    },
];

export interface Class {
    id: string;
    name: string;
    academic_year: string;
}

export interface Teacher {
    id: string;
    name: string;
    nip?: string;
    date_of_birth: string;
    address: string;
    classes: Class[];
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedTeachers {
    data: Teacher[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: PaginationLink[];
}

interface PageProps {
    flash?: {
        message?: string;
    };
    teachers: PaginatedTeachers;
    filters: {
        search: string;
        per_page: number;
        academic_year: string;
    };
    academic_years: string[];
}

export default function Index() {
    const [searchTerm, setSearchTerm] = useState('');
    const [perPage, setPerPage] = useState(10);
    const [academicYear, setAcademicYear] = useState('2024/2025');
    const { teachers, flash, filters, academic_years } = usePage().props as unknown as PageProps;

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (teachers) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [teachers]);

    useEffect(() => {
        setSearchTerm(filters.search);
        setPerPage(filters.per_page);
        setAcademicYear(filters.academic_year);
    }, [filters]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('teacher-by-classes.index'),
            {
                search: searchTerm,
                per_page: perPage,
                academic_year: academicYear,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handlePerPageChange = (value: string) => {
        const newPerPage = parseInt(value);
        setPerPage(newPerPage);
        router.get(
            route('teacher-by-classes.index'),
            {
                search: searchTerm,
                per_page: newPerPage,
                academic_year: academicYear,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleAcademicYearChange = (value: string) => {
        setAcademicYear(value);
        router.get(
            route('teacher-by-classes.index'),
            {
                search: searchTerm,
                per_page: perPage,
                academic_year: value,
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

    const renderSkeletonRows = () => {
        return Array.from({ length: perPage }).map((_, i) => (
            <TableRow key={i}>
                <TableCell>
                    <Skeleton className="h-5 w-8" />
                </TableCell>
                <TableCell className="w-[180px]">
                    <Skeleton className="h-5 w-[160px]" />
                </TableCell>
                <TableCell className="w-[120px]">
                    <Skeleton className="h-5 w-[100px]" />
                </TableCell>
                <TableCell className="w-[140px]">
                    <Skeleton className="h-5 w-[120px]" />
                </TableCell>
                <TableCell className="w-[200px]">
                    <Skeleton className="h-5 w-[180px]" />
                </TableCell>
                <TableCell>
                    <Skeleton className="h-5 w-[180px]" />
                </TableCell>
            </TableRow>
        ));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Teacher By Classes" />

            <div className="space-y-6 px-4 py-6">
                <HeadingSmall title="Teacher" description="Manage and view your created Teacher" />

                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">Teacher List</h2>
                </div>

                <div className="flex flex-col gap-4 rounded-lg bg-muted/30 p-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm font-medium">Academic Year:</span>
                        </div>
                        <Select value={academicYear} onValueChange={handleAcademicYearChange}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {academic_years.map((year) => (
                                    <SelectItem key={year} value={year}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-4">
                        <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2">
                            <div className="relative max-w-sm flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, NIP, or class..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Button type="submit" disabled={isLoading}>
                                Search
                            </Button>
                        </form>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Show:</span>
                            <Select value={perPage.toString()} onValueChange={handlePerPageChange}>
                                <SelectTrigger className="w-20">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {flash?.message && (
                    <Alert variant="default" className="border-l-4 bg-muted/50">
                        <Terminal className="h-5 w-5" />
                        <div>
                            <AlertTitle>Notification</AlertTitle>
                            <AlertDescription>{flash.message}</AlertDescription>
                        </div>
                    </Alert>
                )}

                {!isLoading && teachers.data.length === 0 ? (
                    <div className="py-8 text-center">
                        <div className="text-sm text-muted-foreground italic">
                            {filters.search ? `No teachers found matching "${filters.search}"` : 'No teachers available.'}
                        </div>
                        {filters.search && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => {
                                    setSearchTerm('');
                                    router.get(route('teacher-by-classes.index'), {
                                        per_page: perPage,
                                        academic_year: academicYear,
                                    });
                                }}
                            >
                                Clear Search
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[40px]">#</TableHead>
                                    <TableHead className="w-[180px]">Name</TableHead>
                                    <TableHead className="w-[120px]">NIP</TableHead>
                                    <TableHead className="w-[140px]">Date of Birth</TableHead>
                                    <TableHead className="w-[200px]">Address</TableHead>
                                    <TableHead>Classes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading
                                    ? renderSkeletonRows()
                                    : teachers.data.map((teacher: Teacher, index: number) => (
                                          <TableRow key={teacher.id}>
                                              <TableCell>{(teachers.current_page - 1) * teachers.per_page + index + 1}</TableCell>
                                              <TableCell className="font-medium">{teacher.name}</TableCell>
                                              <TableCell>{teacher.nip || '-'}</TableCell>
                                              <TableCell>{teacher.date_of_birth}</TableCell>
                                              <TableCell className="max-w-[200px] truncate" title={teacher.address}>
                                                  {teacher.address}
                                              </TableCell>
                                              <TableCell>
                                                  {teacher.classes.length > 0 ? (
                                                      <div className="flex flex-wrap gap-1">
                                                          {teacher.classes.map((cls) => (
                                                              <span key={cls.id} className="rounded-full bg-secondary px-3 py-1 text-xs">
                                                                  {cls.name}
                                                              </span>
                                                          ))}
                                                      </div>
                                                  ) : (
                                                      '-'
                                                  )}
                                              </TableCell>
                                          </TableRow>
                                      ))}
                            </TableBody>
                        </Table>
                        <Pagination
                            currentPage={teachers.current_page}
                            lastPage={teachers.last_page}
                            from={teachers.from}
                            to={teachers.to}
                            total={teachers.total}
                            links={teachers.links}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
