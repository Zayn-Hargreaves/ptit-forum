import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition, useMemo } from 'react';

export function useDocumentFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const createQueryString = useCallback(
        (params: Record<string, string | number | null>) => {
            const newSearchParams = new URLSearchParams(searchParams.toString());

            for (const [key, value] of Object.entries(params)) {
                if (value === null) {
                    newSearchParams.delete(key);
                } else {
                    newSearchParams.set(key, String(value));
                }
            }

            return newSearchParams.toString();
        },
        [searchParams]
    );

    const setSearch = (q: string) => {
        const queryString = createQueryString({ q, page: 1 });
        const newPath = `${pathname}?${queryString}`;

        // Optimize: Prevent router push if URL won't change
        if (newPath === `${pathname}?${searchParams.toString()}`) return;

        startTransition(() => {
            router.push(newPath);
        });
    };

    const setSubject = (subjectId: string | null) => {
        startTransition(() => {
            router.push(`${pathname}?${createQueryString({ subjectId, page: 1 })}`);
        });
    };

    const setType = (type: string | null) => {
        startTransition(() => {
            router.push(`${pathname}?${createQueryString({ type, page: 1 })}`);
        });
    };

    const setSort = (sort: string) => {
        startTransition(() => {
            router.push(`${pathname}?${createQueryString({ sort, page: 1 })}`);
        });
    };

    const setPage = (page: number) => {
        startTransition(() => {
            router.push(`${pathname}?${createQueryString({ page })}`);
        });
    };

    const clearFilters = () => {
        router.push(pathname);
    };

    const filters = useMemo(() => ({
        q: searchParams.get('q') || '',
        subjectId: searchParams.get('subjectId'),
        sort: searchParams.get('sort') || 'createdAt,desc',
        type: searchParams.get('type'),
        page: Number(searchParams.get('page')) || 1,
    }), [searchParams]);

    return {
        isPending,
        searchParams,
        filters,
        setSearch,
        setSubject,
        setType,
        setSort,
        setPage,
        clearFilters
    };
}
