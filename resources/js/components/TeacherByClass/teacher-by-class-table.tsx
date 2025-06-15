import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TeacherByClassSkeleton from './teacher-by-class-skeleton';

interface Props {
    classes: any;
    isLoading: boolean;
    perPage: number;
    handlePageChange: (url: string) => void;
}

export default function TeacherByClassTable({ classes, isLoading, perPage, handlePageChange }: Props) {
    if (!classes) return null;

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
                        {classes.links.slice(1, -1).map((link: any, i: number) => (
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
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Homeroom Teacher</TableHead>
                        <TableHead>Academic Year</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TeacherByClassSkeleton count={perPage} />
                    ) : (
                        classes.data.map((cls: any, i: number) => (
                            <TableRow key={cls.id}>
                                <TableCell>{(classes.current_page - 1) * classes.per_page + i + 1}</TableCell>
                                <TableCell>{cls.name}</TableCell>
                                <TableCell>{cls.teacher?.name ?? '-'}</TableCell>
                                <TableCell className="max-w-[180px] truncate">{cls.academic_year}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            {renderPagination()}
        </div>
    );
}
