import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, Calendar, Hash, MapPin, Save, User } from 'lucide-react';

interface Teacher {
    id: number;
    name: string;
    nip: string;
    address: string;
    date_of_birth: string;
    created_at?: string;
    updated_at?: string;
}

interface Props {
    teacher: Teacher;
}

export default function EditTeacher({ teacher }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Teachers',
            href: '/teachers',
        },
        {
            title: `Edit - ${teacher.name}`,
            href: `/teachers/${teacher.id}/edit`,
        },
    ];

    const inertiaForm = useForm({
        name: teacher.name || '',
        nip: teacher.nip || '',
        address: teacher.address || '',
        date_of_birth: teacher.date_of_birth || '',
    });

    const onSubmit = () => {
        inertiaForm.post(`/teachers/${teacher.id}`, {
            forceFormData: true,
        });
    };

    const hasErrors = Object.keys(inertiaForm.errors).length > 0;

    const calculateAge = (birthDate: string) => {
        if (!birthDate) return null;
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const currentAge = calculateAge(inertiaForm.data.date_of_birth);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${teacher.name}`} />

            <div className="container mx-auto max-w-4xl p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <User className="h-6 w-6 text-primary" />
                            <h1 className="text-3xl font-bold tracking-tight">Edit Guru</h1>
                        </div>
                        <p className="text-muted-foreground">
                            Perbarui informasi Guru <span className="font-medium">{teacher.name}</span>
                        </p>
                    </div>
                    <Link href="/teachers">
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

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Informasi Guru
                                </CardTitle>
                                <CardDescription>Edit detail data Guru</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">
                                                Nama Lengkap <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="name"
                                                placeholder="Masukkan nama lengkap Guru"
                                                value={inertiaForm.data.name}
                                                onChange={(e) => inertiaForm.setData('name', e.target.value)}
                                                className={inertiaForm.errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                            />
                                            {inertiaForm.errors.name && (
                                                <p className="flex items-center gap-1 text-xs text-red-500">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {inertiaForm.errors.name}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="nip">
                                                NISN <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="nip"
                                                placeholder="Masukkan NISN Guru"
                                                value={inertiaForm.data.nip}
                                                onChange={(e) => inertiaForm.setData('nip', e.target.value)}
                                                className={inertiaForm.errors.nip ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                            />
                                            {inertiaForm.errors.nip && (
                                                <p className="flex items-center gap-1 text-xs text-red-500">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {inertiaForm.errors.nip}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="date_of_birth">
                                                Tanggal Lahir <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="date_of_birth"
                                                type="date"
                                                value={inertiaForm.data.date_of_birth}
                                                onChange={(e) => inertiaForm.setData('date_of_birth', e.target.value)}
                                                className={inertiaForm.errors.date_of_birth ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                            />
                                            {inertiaForm.errors.date_of_birth && (
                                                <p className="flex items-center gap-1 text-xs text-red-500">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {inertiaForm.errors.date_of_birth}
                                                </p>
                                            )}
                                            {currentAge !== null && (
                                                <p className="text-xs text-muted-foreground">Usia saat ini: {currentAge} tahun</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="address">
                                                Alamat <span className="text-red-500">*</span>
                                            </Label>
                                            <textarea
                                                id="address"
                                                value={inertiaForm.data.address}
                                                onChange={(e) => inertiaForm.setData('address', e.target.value)}
                                                placeholder="Masukkan alamat lengkap Guru"
                                                className={`min-h-[100px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none ${inertiaForm.errors.address ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                            />
                                            {inertiaForm.errors.address && (
                                                <p className="flex items-center gap-1 text-xs text-red-500">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {inertiaForm.errors.address}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex items-center gap-3 pt-4">
                                        <Button onClick={onSubmit} disabled={inertiaForm.processing} size="lg" className="min-w-[120px]">
                                            {inertiaForm.processing ? (
                                                <>
                                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                                                    Menyimpan...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Simpan Perubahan
                                                </>
                                            )}
                                        </Button>
                                        <Link href="/teachers">
                                            <Button variant="outline" size="lg">
                                                Batal
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1">
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <User className="h-5 w-5" />
                                    Ringkasan Data
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 rounded-lg border p-3">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-muted-foreground">Nama</p>
                                            <p className="truncate text-sm font-medium">{inertiaForm.data.name || 'Belum diisi'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 rounded-lg border p-3">
                                        <Hash className="h-4 w-4 text-muted-foreground" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-muted-foreground">NISN</p>
                                            <p className="text-sm font-medium">{inertiaForm.data.nip || 'Belum diisi'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 rounded-lg border p-3">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-muted-foreground">Tanggal Lahir</p>
                                            <p className="text-sm font-medium">
                                                {inertiaForm.data.date_of_birth
                                                    ? new Date(inertiaForm.data.date_of_birth).toLocaleDateString('id-ID', {
                                                          weekday: 'long',
                                                          year: 'numeric',
                                                          month: 'long',
                                                          day: 'numeric',
                                                      })
                                                    : 'Belum diisi'}
                                            </p>
                                            {currentAge !== null && (
                                                <Badge variant="secondary" className="mt-1 text-xs">
                                                    {currentAge} tahun
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2 rounded-lg border p-3">
                                        <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-muted-foreground">Alamat</p>
                                            <p className="text-sm font-medium">{inertiaForm.data.address || 'Belum diisi'}</p>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="rounded-lg bg-muted p-3">
                                    <p className="mb-2 text-xs text-muted-foreground">Status Edit</p>
                                    <div className="space-y-1">
                                        {inertiaForm.data.name !== teacher.name && (
                                            <Badge variant="outline" className="text-xs">
                                                Nama diubah
                                            </Badge>
                                        )}
                                        {inertiaForm.data.nip !== teacher.nip && (
                                            <Badge variant="outline" className="text-xs">
                                                NISN diubah
                                            </Badge>
                                        )}
                                        {inertiaForm.data.date_of_birth !== teacher.date_of_birth && (
                                            <Badge variant="outline" className="text-xs">
                                                Tanggal lahir diubah
                                            </Badge>
                                        )}
                                        {inertiaForm.data.address !== teacher.address && (
                                            <Badge variant="outline" className="text-xs">
                                                Alamat diubah
                                            </Badge>
                                        )}
                                        {inertiaForm.data.name === teacher.name &&
                                            inertiaForm.data.nip === teacher.nip &&
                                            inertiaForm.data.date_of_birth === teacher.date_of_birth &&
                                            inertiaForm.data.address === teacher.address && (
                                                <Badge variant="secondary" className="text-xs">
                                                    Tidak ada perubahan
                                                </Badge>
                                            )}
                                    </div>
                                </div>

                                {teacher.created_at && (
                                    <>
                                        <Separator />
                                        <div className="space-y-2">
                                            <p className="text-xs font-medium text-muted-foreground">Info Tambahan</p>
                                            <div className="space-y-1 text-xs text-muted-foreground">
                                                <p>Dibuat: {new Date(teacher.created_at).toLocaleDateString('id-ID')}</p>
                                                {teacher.updated_at && (
                                                    <p>Terakhir diubah: {new Date(teacher.updated_at).toLocaleDateString('id-ID')}</p>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
