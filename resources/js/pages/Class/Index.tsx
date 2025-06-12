import HeadingSmall from '@/components/heading-small';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Search, Terminal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Class',
        href: '/classes',
    },
];

interface ClassItem {
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

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedClasses {
    data: ClassItem[];
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
    classes: PaginatedClasses;
    filters: {
        search: string;
        per_page: number;
    };
}

export default function Index() {
    const [searchTerm, setSearchTerm] = useState('');
    const [perPage, setPerPage] = useState(10);
    const { classes, flash, filters } = usePage().props as unknown as PageProps;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (classes) {
            const timer = setTimeout(() => setIsLoading(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [classes]);

    useEffect(() => {
        setSearchTerm(filters.search ?? '');
        setPerPage(filters.per_page ?? 10);
    }, [filters]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('classes.index'),
            {
                search: searchTerm,
                per_page: perPage,
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
            route('classes.index'),
            {
                search: searchTerm,
                per_page: newPerPage,
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
                <TableCell>
                    <Skeleton className="h-5 w-24" />
                </TableCell>
                <TableCell>
                    <Skeleton className="h-5 w-32" />
                </TableCell>
                <TableCell>
                    <Skeleton className="h-5 w-12" />
                </TableCell>
                <TableCell>
                    <Skeleton className="h-5 w-48" />
                </TableCell>
                <TableCell>
                    <Skeleton className="h-9 w-20" />
                </TableCell>
            </TableRow>
        ));
    };

    const renderPagination = () => {
        if (classes.last_page <= 1) return null;

        return (
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Showing {classes.from} to {classes.to} of {classes.total} results
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => classes.links[0].url && handlePageChange(classes.links[0].url)}
                        disabled={classes.current_page === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <div className="flex items-center gap-1">
                        {classes.links.slice(1, -1).map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'secondary' : 'outline'}
                                size="sm"
                                onClick={() => link.url && handlePageChange(link.url)}
                                className="min-w-[40px]"
                            >
                                {link.label}
                            </Button>
                        ))}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => classes.links.at(-1)?.url && handlePageChange(classes.links.at(-1)!.url)}
                        disabled={classes.current_page === classes.last_page}
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6 px-4 py-6">
                <HeadingSmall title="Class" description="Manage and view available classes" />

                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">Class List</h2>
                    <Link href={route('classes.create')}>
                        <Button>Add Class</Button>
                    </Link>
                </div>

                <div className="flex items-center gap-4 rounded-lg bg-muted/30 p-4">
                    <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                        <div className="relative max-w-sm flex-1">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or teacher..."
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
                        <Select value={perPage?.toString() ?? '10'} onValueChange={handlePerPageChange}>
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

                {flash?.message && (
                    <Alert className="border-l-4 bg-muted/50">
                        <Terminal className="h-5 w-5" />
                        <div>
                            <AlertTitle>Notification</AlertTitle>
                            <AlertDescription>{flash.message}</AlertDescription>
                        </div>
                    </Alert>
                )}

                {!isLoading && classes.data.length === 0 ? (
                    <div className="py-8 text-center">
                        <div className="text-sm text-muted-foreground italic">
                            {filters.search ? `No classes found for "${filters.search}"` : 'No classes available.'}
                        </div>
                        {filters.search && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => {
                                    setSearchTerm('');
                                    router.get(route('classes.index'), { per_page: perPage });
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
                                    <TableHead>#</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Homeroom Teacher</TableHead>
                                    <TableHead>Capacity</TableHead>
                                    <TableHead>Academic Year</TableHead>
                                    <TableHead className="text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading
                                    ? renderSkeletonRows()
                                    : classes.data.map((cls, i) => (
                                          <TableRow key={cls.id}>
                                              <TableCell>{(classes.current_page - 1) * classes.per_page + i + 1}</TableCell>
                                              <TableCell>{cls.name}</TableCell>
                                              <TableCell>{cls.teacher?.name ?? '-'}</TableCell>
                                              <TableCell>{cls.capacity}</TableCell>
                                              <TableCell className="max-w-[180px] truncate">
                                                  {cls.academic_year}-Semester {cls.semester}
                                              </TableCell>
                                              <TableCell className="text-center">
                                                  <div className="flex justify-center gap-2">
                                                      <Link href={`/classes/${cls.id}/detail`}>
                                                          <Button variant="update" size="sm">
                                                              Detail
                                                          </Button>
                                                      </Link>
                                                  </div>
                                              </TableCell>
                                          </TableRow>
                                      ))}
                            </TableBody>
                        </Table>
                        {renderPagination()}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
