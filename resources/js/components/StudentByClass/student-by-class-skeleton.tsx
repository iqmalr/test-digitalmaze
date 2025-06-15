import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';

interface SkeletonRowsProps {
    count: number;
}

function StudentByClassSkeleton({ count }: SkeletonRowsProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <TableRow key={i}>
                    <TableCell>
                        <Skeleton className="h-5 w-8" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-5 w-12" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-5 w-48" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-9 w-20" />
                    </TableCell>
                </TableRow>
            ))}
        </>
    );
}

export default StudentByClassSkeleton;
