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
import { AlertCircle, ArrowLeft, UserPlus } from 'lucide-react';
import { useState } from 'react';
interface Student {
    id: string;
    name: string;
}
interface CreateParentProps extends PageProps {
    students: Student[];
}
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Parent', href: '/parents' },
    { title: 'Add Parent', href: '/parents/create' },
];

export default function CreateParent() {
    const { props } = usePage<CreateParentProps>();
    const students = props.students || [];
    const [studentQuery, setStudentQuery] = useState('');
    const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);

    // const student
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        student_ids: [] as string[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setData(
            'student_ids',
            selectedStudents.map((s) => s.id),
        );
        console.log(data);
        post(route('parents.store'));
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
            <Head title="Tambah Siswa" />
            <div className="container mx-auto max-w-4xl p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <UserPlus className="h-6 w-6 text-primary" />
                            <h1 className="text-3xl font-bold tracking-tight">Add New Parent</h1>
                        </div>
                        <p className="text-muted-foreground">Enter parent data into the system</p>
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
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5" />
                            Parent Information
                        </CardTitle>
                        <CardDescription>Complete Parent information for academic data</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
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
                                    <Label htmlFor="name">
                                        Assign Student <span className="text-red-500">*</span>
                                    </Label>
                                    {/* <form action=""> */}
                                    {/* <select name="student" id="" value={data.student_id.toString()}>
                                        <option value="">Select Student</option>
                                        {students.map((student) => (
                                            <option key={student.id} value={student.name}>
                                                {student.name}
                                            </option>
                                        ))}
                                    </select> */}

                                    {selectedStudents.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-sm text-muted-foreground">Selected Students:</p>
                                            <div>
                                                {selectedStudents.map((student) => (
                                                    <div key={student.id}>
                                                        {student.name}
                                                        <Button onClick={() => handleRemoveStudent(student.id)}>x</Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {availableStudents.length > 0 && (
                                        <div>
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
                                        </div>
                                    )}

                                    {availableStudents.length === 0 && selectedStudents.length > 0 && (
                                        <p className="text-sm text-muted-foreground italic">All available students have been selected.</p>
                                    )}

                                    {/* <Button onSubmit={handleAssignStudent}> */}
                                    {/* <Button onClick={() => handleAssignStudent}>assign student</Button> */}
                                    {/* </form> */}
                                    {/* <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Contoh: Budi Santoso"
                                        className={errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                    /> */}
                                    {/* {errors.name && <p className="text-xs text-red-500">{errors.name}</p>} */}
                                </div>
                            </div>

                            <Separator />

                            <div className="flex justify-end">
                                <Button type="button" onClick={handleSubmit} disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Parent'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
