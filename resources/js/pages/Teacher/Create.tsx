import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, UserPlus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Siswa', href: '/students' },
    { title: 'Tambah Siswa', href: '/students/create' },
];

export default function CreateStudent() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        nisn: '',
        address: '',
        date_of_birth: '',
    });

    //   const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    //   const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0] || null;
    //     setData('photo', file);

    //     if (file) {
    //       const reader = new FileReader();
    //       reader.onload = (e) => {
    //         setPhotoPreview(e.target?.result as string);
    //       };
    //       reader.readAsDataURL(file);
    //     } else {
    //       setPhotoPreview(null);
    //     }
    //   };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('students.store'), {
            forceFormData: true,
        });
    };

    const hasErrors = Object.keys(errors).length > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Siswa" />
            <div className="container mx-auto max-w-4xl p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <UserPlus className="h-6 w-6 text-primary" />
                            <h1 className="text-3xl font-bold tracking-tight">Tambah Siswa Baru</h1>
                        </div>
                        <p className="text-muted-foreground">Masukkan data siswa ke dalam sistem</p>
                    </div>
                    <Link href="/students">
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
                            <UserPlus className="h-5 w-5" />
                            Informasi Siswa
                        </CardTitle>
                        <CardDescription>Lengkapi informasi siswa untuk data akademik</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Nama Lengkap <span className="text-red-500">*</span>
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
                                    <Label htmlFor="nisn">
                                        NISN <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="nisn"
                                        value={data.nisn}
                                        onChange={(e) => setData('nisn', e.target.value)}
                                        placeholder="Contoh: 123456789"
                                        className={errors.nisn ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                    />
                                    {errors.nisn && <p className="text-xs text-red-500">{errors.nisn}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date_of_birth">
                                        Tanggal Lahir <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="date_of_birth"
                                        type="date"
                                        value={data.date_of_birth}
                                        onChange={(e) => setData('date_of_birth', e.target.value)}
                                        className={errors.date_of_birth ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                    />
                                    {errors.date_of_birth && (
                                        <p className="flex items-center gap-1 text-xs text-red-500">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.date_of_birth}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Alamat</Label>
                                    <textarea
                                        id="address"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        placeholder="Contoh: Jl. Kenangan No. 45"
                                        className={`min-h-[100px] w-full rounded-md border px-3 py-2 text-sm ${errors.address ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                    />
                                    {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
                                </div>
                            </div>

                            <Separator />

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    Simpan Siswa
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
