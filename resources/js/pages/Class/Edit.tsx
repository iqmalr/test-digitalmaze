import { Combobox } from '@/components/combobox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { PageProps } from '@inertiajs/core';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, Layers, X } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs = (className: string): BreadcrumbItem[] => [
    { title: 'Kelas', href: '/classes' },
    { title: `Edit Kelas ${className}`, href: '#' },
];

export default function EditClass() {
    const { props } = usePage<PageProps & { class: any; teachers: any[] }>();
    const { class: classData, teachers } = props;
    const { data, setData, post, processing, errors } = useForm({
        name: classData.name || '',
        // semester: classData.semester || '',
        academic_year: classData.academic_year || '',
        // teacher_ids: classData.teacher_id || [],
        teacher_ids: classData.selected_teacher_ids || [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setData(
            'teacher_ids',
            selectedTeachers.map((t) => t.id),
        );
        post(route('classes.update', classData.id));
    };

    const hasErrors = Object.keys(errors).length > 0;
    const [teacherQuery, setTeacherQuery] = useState('');
    const [selectedTeachers, setSelectedTeachers] = useState(teachers.filter((t) => data.teacher_ids.includes(t.id)));

    const handleTeacherSelect = (teacherId: string) => {
        const teacher = teachers.find((t) => t.id === teacherId);
        if (teacher && !selectedTeachers.find((t) => t.id === teacherId)) {
            const newSelected = [...selectedTeachers, teacher];
            setSelectedTeachers(newSelected);
            setData(
                'teacher_ids',
                newSelected.map((t) => t.id),
            );
        }
        setTeacherQuery('');
    };

    const handleRemoveTeacher = (teacherId: string) => {
        const newSelected = selectedTeachers.filter((t) => t.id !== teacherId);
        setSelectedTeachers(newSelected);
        setData(
            'teacher_ids',
            newSelected.map((t) => t.id),
        );
    };

    const availableTeachers = teachers.filter((t) => !selectedTeachers.find((sel) => sel.id === t.id));

    return (
        <AppLayout breadcrumbs={breadcrumbs(classData.name)}>
            <Head title={`Edit Kelas ${classData.name}`} />
            <div className="container mx-auto max-w-4xl p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Layers className="h-6 w-6 text-primary" />
                            <h1 className="text-3xl font-bold tracking-tight">Edit Classroom</h1>
                        </div>
                        <p className="text-muted-foreground">Update classroom data</p>
                    </div>
                    <Link href="/classes">
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
                            <Layers className="h-5 w-5" />
                            Kelas Information
                        </CardTitle>
                        <CardDescription>Update class information for academic data</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Nama Kelas <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Contoh: XII IPA 1"
                                        className={errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                    />
                                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="academic_year">
                                        Academic Year <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="academic_year"
                                        value={data.academic_year}
                                        onChange={(e) => setData('academic_year', e.target.value)}
                                        placeholder="Contoh: 2024/2025"
                                        className={errors.academic_year ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                    />
                                    {errors.academic_year && <p className="text-xs text-red-500">{errors.academic_year}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="teachers">Teachers (Optional)</Label>
                                    <div className="space-y-3">
                                        {selectedTeachers.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-sm text-muted-foreground">Selected Teachers:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedTeachers.map((teacher) => (
                                                        <Badge key={teacher.id} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                                                            {teacher.name}
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="ml-1 h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                                                onClick={() => handleRemoveTeacher(teacher.id)}
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </Button>
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {availableTeachers.length > 0 && (
                                            <div>
                                                <Combobox
                                                    options={availableTeachers.map((t) => ({ label: t.name, value: t.id }))}
                                                    selectedValue=""
                                                    onInputChange={setTeacherQuery}
                                                    onSelect={handleTeacherSelect}
                                                    inputPlaceholder={
                                                        selectedTeachers.length > 0 ? 'Add another teacher...' : 'Search and select teachers...'
                                                    }
                                                    filterQuery={teacherQuery}
                                                />
                                            </div>
                                        )}

                                        {availableTeachers.length === 0 && selectedTeachers.length > 0 && (
                                            <p className="text-sm text-muted-foreground italic">All available teachers have been selected.</p>
                                        )}
                                    </div>
                                    {errors.teacher_ids && <p className="text-xs text-red-500">{errors.teacher_ids}</p>}
                                </div>
                            </div>

                            <Separator />

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    Update Kelas
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
