// features/admin/semesters/ui/admin-semesters-page.tsx
"use client";

import {useQuery} from "@tanstack/react-query";
import {semesterApi} from "@shared/api/semester.service";
import {columns, SemesterDataTable, SemesterFormSheet, useSemesterStore} from "@features/admin/semesters";

export default function AdminSemestersPage() {
    const {openCreate} = useSemesterStore();

    const {data, isLoading} = useQuery({
        queryKey: ["admin-semesters"],
        queryFn: semesterApi.getAll,
    });

    const semesters = data || [];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Quản lý Học kỳ</h2>
                <p className="text-muted-foreground">Thiết lập danh sách học kỳ cho hệ thống.</p>
            </div>

            <SemesterDataTable
                columns={columns}
                data={semesters}
                loading={isLoading}
                onCreate={openCreate}
            />

            <SemesterFormSheet/>
        </div>
    );
}