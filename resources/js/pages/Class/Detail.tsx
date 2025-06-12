import HeadingSmall from '@/components/heading-small';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@inertiajs/core';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEvent } from 'react';

interface Student {
    id: number;
    name: string;
    nisn: string;
    gender: string;
}

interface Props extends PageProps {
    classItem: {
        id: number;
        name: string;
        teacher?: {
            id: string;
            name: string;
        } | null;
    };
    students: Student[];
    [key: string]: any;
}

interface StudentOption {
    id: number;
    name: string;
}

export default function ClassDetail() {
    const { classItem, students, allStudents } = usePage<Props & { allStudents: StudentOption[] }>().props;

    const { data, setData, post, processing, reset, errors } = useForm({
        student_id: '',
    });

    const handleAssign = (e: FormEvent) => {
        e.preventDefault();

        if (data.student_id === '') {
            return;
        }

        post(`/classes/${classItem.id}/assign-student`, {
            preserveScroll: true,
            onSuccess: () => {
                reset('student_id');
            },
            onError: (errors) => {
                console.error('Error assigning student:', errors);
            },
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Class', href: '/classes' },
                { title: classItem.name, href: `#` },
            ]}
        >
            <Head title={`Detail ${classItem.name}`} />
            <div className="space-y-6 p-6">
                <HeadingSmall title="Class" />
                <h1 className="text-xl font-semibold">{classItem.name}</h1>
                <p className="text-muted-foreground">Homeroom Teacher: {classItem.teacher?.name ?? '-'}</p>
                {/* <p className="text-muted-foreground">Homeroom Teacher: {classItem.homeroom_teacher || '-'}</p> */}

                <form onSubmit={handleAssign} className="mt-6 flex items-center gap-2">
                    <select
                        value={data.student_id}
                        onChange={(e) => setData('student_id', e.target.value)}
                        className="rounded border px-3 py-2"
                        disabled={processing}
                    >
                        <option value="">-- Select Student --</option>
                        {allStudents.map((student) => (
                            <option key={student.id} value={student.id.toString()}>
                                {student.name}
                            </option>
                        ))}
                    </select>

                    <button
                        type="submit"
                        disabled={processing || data.student_id === ''}
                        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {processing ? 'Adding...' : 'Add'}
                    </button>
                </form>

                {errors.student_id && <p className="text-sm text-red-500">{errors.student_id}</p>}

                <div>
                    <h2 className="mt-6 mb-2 text-lg font-medium">Registered Students</h2>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>NISN</TableHead>
                                <TableHead>Gender</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground italic">
                                        No students registered in this class.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                students.map((student, i) => (
                                    <TableRow key={student.id}>
                                        <TableCell>{i + 1}</TableCell>
                                        <TableCell>{student.name}</TableCell>
                                        <TableCell>{student.nisn}</TableCell>
                                        <TableCell>{student.gender}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
