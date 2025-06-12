import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    currentPage: number;
    lastPage: number;
    from: number;
    to: number;
    total: number;
    links: PaginationLink[];
    onPageChange: (url: string) => void;
}

export default function Pagination({ currentPage, lastPage, from, to, total, links, onPageChange }: PaginationProps) {
    if (lastPage <= 1) return null;

    return (
        <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
                Showing {from} to {to} of {total} results
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => links[0].url && onPageChange(links[0].url)} disabled={currentPage === 1}>
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Button>

                <div className="flex items-center gap-1">
                    {links.slice(1, -1).map((link, index) => (
                        <Button
                            key={index}
                            variant={link.active ? 'secondary' : 'outline'}
                            size="sm"
                            onClick={() => link.url && onPageChange(link.url)}
                            disabled={!link.url}
                            className="min-w-[40px]"
                        >
                            {link.label}
                        </Button>
                    ))}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => links[links.length - 1].url && onPageChange(links[links.length - 1].url)}
                    disabled={currentPage === lastPage}
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
