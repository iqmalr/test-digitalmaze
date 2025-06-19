import { Combobox } from '@/components/combobox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { PageProps, type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface Student {
    id: string;
    name: string;
}

interface EditParentProps extends PageProps {
    student_parent: {
        id: string;
        name: string;
        students: Student[];
    };
    students: Student[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Parent', href: '/parents' },
    { title: 'Edit Parent', href: '#' },
];

export default function EditParent() {
    const { props } = usePage<EditParentProps>();
    const { student_parent, students } = props;

    const [studentQuery, setStudentQuery] = useState('');
    const [selectedStudents, setSelectedStudents] = useState<Student[]>(student_parent.students);

    const { data, setData, post, processing, errors } = useForm({
        name: student_parent.name,
        student_ids: student_parent.students.map((s) => s.id),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setData(
            'student_ids',
            selectedStudents.map((s) => s.id),
        );
        post(route('parents.update', student_parent.id));
    };

    const handleAssignStudent = (student_id: string) => {
        const student = students.find((s) => s.id === student_id);
        if (student && !selectedStudents.find((s) => s.id === student_id)) {
            const newSelectedStudents = [...selectedStudents, student];
            setSelectedStudents(newSelectedStudents);
            setData(
                'student_ids',
                newSelectedStudents.map((s) => s.id),
            );
        }
        setStudentQuery('');
    };

    const handleRemoveStudent = (student_id: string) => {
        const newSelectedStudents = selectedStudents.filter((s) => s.id !== student_id);
        setSelectedStudents(newSelectedStudents);
        setData(
            'student_ids',
            newSelectedStudents.map((s) => s.id),
        );
    };

    const availableStudents = students.filter((student) => !selectedStudents.find((selected) => selected.id === student.id));

    const hasErrors = Object.keys(errors).length > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Class" />
            <div className="container mx-auto max-w-4xl p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold tracking-tight">Edit Class</h1>
                        </div>
                        <p className="text-muted-foreground">Update class data in the system</p>
                    </div>
                    <Link href="/parents">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                </div>

                <Separator className="mb-6" />

                {hasErrors && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>There is an error in the form. Please double check the data entered.</AlertDescription>
                    </Alert>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">Kelas Information</CardTitle>
                        <CardDescription>Update class information for academic data</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Full Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Contoh: Budi Santoso"
                                        className={errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                    />
                                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label>
                                        Assign Student <span className="text-red-500">*</span>
                                    </Label>

                                    {selectedStudents.length > 0 && (
                                        <div>
                                            <p className="text-sm text-muted-foreground">Selected Students:</p>
                                            <div>
                                                {selectedStudents.map((student) => (
                                                    <div key={student.id} className="flex items-center justify-between">
                                                        {student.name}
                                                        <Button variant="destructive" onClick={() => handleRemoveStudent(student.id)}>
                                                            Remove
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {availableStudents.length > 0 && (
                                        <Combobox
                                            options={availableStudents.map((s) => ({ label: s.name, value: s.id }))}
                                            selectedValue=""
                                            onInputChange={setStudentQuery}
                                            onSelect={handleAssignStudent}
                                            inputPlaceholder={
                                                selectedStudents.length > 0 ? 'Add another student...' : 'Search and select students...'
                                            }
                                            filterQuery={studentQuery}
                                        />
                                    )}

                                    {availableStudents.length === 0 && selectedStudents.length > 0 && (
                                        <p className="text-sm text-muted-foreground italic">All available students have been selected.</p>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Updating...' : 'Update Parent'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
