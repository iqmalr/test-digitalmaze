import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

interface Option {
    label: string;
    value: string;
}

export function Combobox({
    options,
    selectedValue,
    onSelect,
    inputPlaceholder,
    onInputChange,
    filterQuery,
}: {
    options: Option[];
    selectedValue: string;
    onSelect: (value: string) => void;
    inputPlaceholder?: string;
    onInputChange?: (query: string) => void;
    filterQuery?: string;
}) {
    const [open, setOpen] = useState(false);
    const selected = options.find((option) => option.value === selectedValue);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full justify-between">
                    {selected ? selected.label : 'Pilih guru'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput placeholder={inputPlaceholder} value={filterQuery} onValueChange={(val) => onInputChange?.(val)} />
                    <CommandList>
                        <CommandEmpty>Guru tidak ditemukan.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    onSelect={() => {
                                        onSelect(option.value);
                                        setOpen(false);
                                    }}
                                >
                                    <Check className={cn('mr-2 h-4 w-4', selectedValue === option.value ? 'opacity-100' : 'opacity-0')} />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
