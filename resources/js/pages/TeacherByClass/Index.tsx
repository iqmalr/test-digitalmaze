import HeadingSmall from '@/components/heading-small';
import TeacherByClassFilter from '@/components/TeacherByClass/teacher-by-class-filter';
import TeacherByClassTable from '@/components/TeacherByClass/teacher-by-class-table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Filter, Search, Terminal } from 'lucide-react';
import { useTeacherByClass } from './useTeacherByClass';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Class',
        href: '/teacher-by-classes',
    },
];

export default function Index() {
    const {
        searchTerm,
        setSearchTerm,
        perPage,
        isLoading,
        selectedClassNames,
        selectedAcademicYears,
        // selectedSemesters,
        showFilters,
        hasActiveFilters,
        classes,
        flash,
        filterOptions,
        handleSearch,
        handlePerPageChange,
        handlePageChange,
        handleClassNameChange,
        handleAcademicYearChange,
        // handleSemesterChange,
        applyFilters,
        clearAllFilters,
        clearFiltersOnly,
        toggleFilters,
    } = useTeacherByClass();

    const renderEmptyState = () => (
        <div className="py-8 text-center">
            <div className="text-sm text-muted-foreground italic">
                {hasActiveFilters ? `No classes found with current filters` : 'No classes available.'}
            </div>
            {hasActiveFilters && (
                <Button variant="outline" size="sm" className="mt-2" onClick={clearAllFilters}>
                    Clear All Filters
                </Button>
            )}
        </div>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="space-y-6 px-4 py-6">
                <HeadingSmall title="Teacher by Class" description="Teacher by Class" />

                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">Class List</h2>
                    <Button variant="outline" size="sm" onClick={toggleFilters} className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                        {hasActiveFilters && <div className="h-2 w-2 rounded-full bg-blue-500" />}
                    </Button>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-4 rounded-lg bg-muted/30 p-4">
                        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                            <div className="relative max-w-sm flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name or teacher..."
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
                            <Select value={perPage?.toString() ?? '10'} onValueChange={handlePerPageChange}>
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

                    {showFilters && (
                        <TeacherByClassFilter
                            isLoading={isLoading}
                            hasActiveFilters={hasActiveFilters}
                            selectedClassNames={selectedClassNames}
                            selectedAcademicYears={selectedAcademicYears}
                            // selectedSemesters={selectedSemesters}
                            filterOptions={filterOptions}
                            handleClassNameChange={handleClassNameChange}
                            handleAcademicYearChange={handleAcademicYearChange}
                            // handleSemesterChange={handleSemesterChange}
                            applyFilters={applyFilters}
                            clearAllFilters={clearAllFilters}
                            clearFiltersOnly={clearFiltersOnly}
                        />
                    )}
                </div>

                {flash?.message && (
                    <Alert className="border-l-4 bg-muted/50">
                        <Terminal className="h-5 w-5" />
                        <div>
                            <AlertTitle>Notification</AlertTitle>
                            <AlertDescription>{flash.message}</AlertDescription>
                        </div>
                    </Alert>
                )}

                {!isLoading && classes.data.length === 0 ? (
                    renderEmptyState()
                ) : (
                    <TeacherByClassTable classes={classes} isLoading={isLoading} perPage={perPage} handlePageChange={handlePageChange} />
                )}
            </div>
        </AppLayout>
    );
}
