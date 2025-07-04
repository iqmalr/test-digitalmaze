import AlertDialogDelete from '@/components/alert-dialog-delete';
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
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Search, Terminal } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Student',
        href: '/students',
    },
];
interface Classes {
    id: string;
    name: string;
    academic_year: string;
}
interface Student {
    id: string;
    name: string;
    nisn?: string;
    date_of_birth: string;
    address: string;
    classes: Classes[];
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedStudents {
    data: Student[];
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
    students: PaginatedStudents;
    filters: {
        search: string;
        per_page: number;
    };
}

export default function Index() {
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [perPage, setPerPage] = useState(10);
    const { students, flash, filters } = usePage().props as unknown as PageProps;
    const { processing, delete: destroy } = useForm();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (students) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [students]);

    useEffect(() => {
        setSearchTerm(filters.search);
        setPerPage(filters.per_page);
    }, [filters]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('students.index'),
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
            route('students.index'),
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

    const handleDelete = () => {
        if (selectedStudent) {
            destroy(route('students.destroy', selectedStudent.id));
            setSelectedStudent(null);
        }
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
                    <div className="flex justify-center gap-2">
                        <Skeleton className="h-9 w-[64px]" />
                        <Skeleton className="h-9 w-[76px]" />
                    </div>
                </TableCell>
            </TableRow>
        ));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Student" />

            <div className="space-y-6 px-4 py-6">
                <HeadingSmall title="Student" description="Manage and view your created Student" />

                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">Student List</h2>
                    <Link href={route('students.create')}>
                        <Button>Add Student</Button>
                    </Link>
                </div>

                <div className="flex items-center gap-4 rounded-lg bg-muted/30 p-4">
                    <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2">
                        <div className="relative max-w-sm flex-1">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                            <Input
                                placeholder="Search by name, NISN, or address..."
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

                {flash?.message && (
                    <Alert variant="default" className="border-l-4 bg-muted/50">
                        <Terminal className="h-5 w-5" />
                        <div>
                            <AlertTitle>Notification</AlertTitle>
                            <AlertDescription>{flash.message}</AlertDescription>
                        </div>
                    </Alert>
                )}

                {!isLoading && students.data.length === 0 ? (
                    <div className="py-8 text-center">
                        <div className="text-sm text-muted-foreground italic">
                            {filters.search ? `No students found matching "${filters.search}"` : 'No students available.'}
                        </div>
                        {filters.search && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => {
                                    setSearchTerm('');
                                    router.get(route('students.index'), { per_page: perPage });
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
                                    <TableHead className="w-[120px]">NISN</TableHead>
                                    <TableHead className="w-[140px]">Date of Birth</TableHead>
                                    <TableHead className="w-[200px]">Address</TableHead>
                                    <TableHead className="text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading
                                    ? renderSkeletonRows()
                                    : (() => {
                                          //   const groupedStudents = groupStudentsByClass(students.data);
                                          let rowNumber = (students.current_page - 1) * students.per_page + 1;

                                          return students.data.map((student) => (
                                              <>
                                                  {/* {group.students.map((student, studentIndex) => ( */}
                                                  <TableRow key={student.id}>
                                                      <TableCell>{rowNumber++}</TableCell>
                                                      <TableCell className="font-medium">{student.name}</TableCell>
                                                      <TableCell>{student.nisn || '-'}</TableCell>
                                                      <TableCell>{student.date_of_birth}</TableCell>
                                                      <TableCell className="max-w-[200px] truncate" title={student.address}>
                                                          {student.address}
                                                      </TableCell>
                                                      {/* <TableCell className="max-w-[160px] truncate">
                                                          {studentIndex === 0 ? <span>{group.className}</span> : <span></span>}
                                                      </TableCell> */}
                                                      <TableCell className="text-center">
                                                          <div className="flex justify-center gap-2">
                                                              <Link href={`/students/${student.id}/edit`}>
                                                                  <Button variant="update" size="sm">
                                                                      Edit
                                                                  </Button>
                                                              </Link>
                                                              <AlertDialogDelete
                                                                  title="Are you sure?"
                                                                  description={`This will permanently delete the student "${student.name}".`}
                                                                  onConfirm={handleDelete}
                                                                  loading={processing}
                                                              >
                                                                  <Button
                                                                      variant="destructive"
                                                                      size="sm"
                                                                      onClick={() => setSelectedStudent(student)}
                                                                      disabled={processing}
                                                                  >
                                                                      Delete
                                                                  </Button>
                                                              </AlertDialogDelete>
                                                          </div>
                                                      </TableCell>
                                                  </TableRow>
                                                  {/* ))} */}
                                              </>
                                          ));
                                      })()}
                            </TableBody>
                        </Table>
                        {/* {renderPagination()} */}
                        <Pagination
                            currentPage={students.current_page}
                            lastPage={students.last_page}
                            from={students.from}
                            to={students.to}
                            total={students.total}
                            links={students.links}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
