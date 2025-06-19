import HeadingSmall from '@/components/heading-small';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Terminal } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Parent',
        href: '/parents',
    },
];

interface Student {
    id: string;
    name: string;
}

interface Parent {
    id: string;
    name: string;
    students: Student[];
    students_count: number;
    students_names: string;
}

interface PageProps {
    flash?: {
        message?: string;
    };
    parents: Parent[];
}

export default function Index() {
    const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
    const { parents, flash } = usePage().props as unknown as PageProps;
    const { processing, delete: destroy } = useForm();

    const handleDelete = () => {
        if (selectedParent) {
            router.delete(route('parents.destroy', selectedParent.id), {
                onSuccess: () => {
                    setSelectedParent(null);
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Parent" />

            <div className="space-y-6 px-4 py-6">
                <HeadingSmall title="Parent" description="Manage and view your created Parent" />

                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">Parent List</h2>
                    <Link href={route('parents.create')}>
                        <Button>Add Parent</Button>
                    </Link>
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

                {parents.length === 0 ? (
                    <div className="py-8 text-center">
                        <div className="text-sm text-muted-foreground italic">No parents available.</div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">#</TableHead>
                                    <TableHead className="w-[200px]">Parent Name</TableHead>
                                    <TableHead className="w-[300px]">Students</TableHead>

                                    <TableHead className="text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {parents.map((parent, index) => (
                                    <TableRow key={parent.id}>
                                        <TableCell className="font-medium">{index + 1}</TableCell>
                                        <TableCell className="font-medium">{parent.name}</TableCell>
                                        <TableCell>
                                            {parent.students.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {parent.students.map((student) => (
                                                        <Badge key={student.id} variant="secondary" className="text-xs">
                                                            {student.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-muted-foreground italic">No students assigned</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-center gap-2">
                                                <Link href={`/parents/${parent.id}/edit`}>
                                                    <Button variant="outline" size="sm">
                                                        Edit
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedParent(parent);
                                                        if (confirm(`Are you sure you want to delete parent "${parent.name}"?`)) {
                                                            handleDelete();
                                                        }
                                                    }}
                                                    disabled={processing}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
