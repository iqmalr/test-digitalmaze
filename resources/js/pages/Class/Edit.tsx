import { Combobox } from '@/components/combobox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { PageProps } from '@inertiajs/core';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, Layers } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs = (className: string): BreadcrumbItem[] => [
    { title: 'Kelas', href: '/classes' },
    { title: `Edit Kelas ${className}`, href: '#' },
];

export default function EditClass() {
    const { props } = usePage<PageProps & { class: any; teachers: any[] }>();
    const { class: classData, teachers } = props;

    const [teacherQuery, setTeacherQuery] = useState('');
    const { data, setData, post, processing, errors } = useForm({
        name: classData.name || '',
        semester: classData.semester || '',
        academic_year: classData.academic_year || '',
        teacher_id: classData.teacher_id || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('classes.update', classData.id));
    };

    const hasErrors = Object.keys(errors).length > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs(classData.name)}>
            <Head title={`Edit Kelas ${classData.name}`} />
            <div className="container mx-auto max-w-4xl p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Layers className="h-6 w-6 text-primary" />
                            <h1 className="text-3xl font-bold tracking-tight">Edit Kelas</h1>
                        </div>
                        <p className="text-muted-foreground">Perbarui data kelas pada sistem</p>
                    </div>
                    <Link href="/classes">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                    </Link>
                </div>

                <Separator className="mb-6" />

                {hasErrors && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>Terdapat kesalahan pada form. Silakan periksa kembali data yang dimasukkan.</AlertDescription>
                    </Alert>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Layers className="h-5 w-5" />
                            Informasi Kelas
                        </CardTitle>
                        <CardDescription>Perbarui informasi kelas untuk data akademik</CardDescription>
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
                                    <Label htmlFor="semester">
                                        Semester <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="semester"
                                        value={data.semester}
                                        onChange={(e) => setData('semester', e.target.value)}
                                        placeholder="Contoh: 1 / 2"
                                        className={errors.semester ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                    />
                                    {errors.semester && <p className="text-xs text-red-500">{errors.semester}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="academic_year">
                                        Tahun Ajaran <span className="text-red-500">*</span>
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
                                    <Label htmlFor="teacher_id">Wali Kelas</Label>
                                    <Combobox
                                        options={teachers.map((t) => ({ label: t.name, value: t.id }))}
                                        selectedValue={data.teacher_id}
                                        onInputChange={setTeacherQuery}
                                        onSelect={(value) => setData('teacher_id', value)}
                                        inputPlaceholder="Cari nama guru..."
                                        filterQuery={teacherQuery}
                                    />
                                    {errors.teacher_id && <p className="text-xs text-red-500">{errors.teacher_id}</p>}
                                </div>
                            </div>

                            <Separator />

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    Perbarui Kelas
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
