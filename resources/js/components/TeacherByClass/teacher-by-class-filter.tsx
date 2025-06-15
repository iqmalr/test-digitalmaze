import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';

type Props = {
    isLoading: boolean;
    hasActiveFilters: boolean;
    selectedClassNames: string[];
    selectedAcademicYears: string[];
    filterOptions: {
        class_names: string[];
        academic_years: string[];
    };
    handleClassNameChange: (className: string, checked: boolean) => void;
    handleAcademicYearChange: (year: string, checked: boolean) => void;
    applyFilters: () => void;
    clearAllFilters: () => void;
    clearFiltersOnly: () => void;
};

export default function TeacherByClassFilter({
    isLoading,
    hasActiveFilters,
    selectedClassNames,
    selectedAcademicYears,
    filterOptions,
    handleClassNameChange,
    handleAcademicYearChange,
    applyFilters,
    clearAllFilters,
    clearFiltersOnly,
}: Props) {
    return (
        <Card>
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Filters</CardTitle>
                    {hasActiveFilters && (
                        <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-destructive hover:text-destructive">
                            <X className="mr-1 h-4 w-4" />
                            Clear All
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <FilterGroup
                        title="Class Names"
                        options={filterOptions.class_names}
                        selected={selectedClassNames}
                        onChange={handleClassNameChange}
                    />
                    <FilterGroup
                        title="Academic Years"
                        options={filterOptions.academic_years}
                        selected={selectedAcademicYears}
                        onChange={handleAcademicYearChange}
                    />
                    {/* <FilterGroup
                        title="Semesters"
                        options={filterOptions.semesters}
                        selected={selectedSemesters}
                        onChange={handleSemesterChange}
                        format={(item) => `Semester ${item}`}
                    /> */}
                </div>

                <div className="flex gap-2 border-t pt-4">
                    <Button onClick={applyFilters} disabled={isLoading}>
                        Apply Filters
                    </Button>
                    <Button variant="outline" onClick={clearFiltersOnly}>
                        Clear Filters
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

function FilterGroup<T extends string | number>({
    title,
    options,
    selected,
    onChange,
    format = (val) => String(val),
}: {
    title: string;
    options: T[];
    selected: T[];
    onChange: (item: T, checked: boolean) => void;
    format?: (val: T) => string;
}) {
    return (
        <div className="space-y-3">
            <h4 className="text-sm font-medium">{title}</h4>
            <div className="max-h-32 space-y-2 overflow-y-auto">
                {options.map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                        <Checkbox
                            id={`${title}-${item}`}
                            checked={selected.includes(item)}
                            onCheckedChange={(checked) => onChange(item, checked as boolean)}
                        />
                        <label htmlFor={`${title}-${item}`} className="cursor-pointer text-sm">
                            {format(item)}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}
