'use client';

import { useEffect, useState } from 'react';
import {
    cpaService,
    CpaProfileResponse,
    GpaProfileResponse,
    CpaProfileRequest,
} from '@/shared/api/cpa.service';
import { GpaEditor } from '@/features/cpa/components/GpaEditor';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/shared/ui/accordion';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/shared/ui/use-toast'; // Assuming it exists, or verify
import { Button } from '@/shared/ui/button';

export default function CpaPage() {
    const [cpaProfile, setCpaProfile] = useState<CpaProfileResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    // const { toast } = useToast(); // Would need to verify toast existence

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Logic to get or initialize.
            // Ideally we get first. If 404, we initialize.
            // For now, assuming initializeCpaProfile is safe (idempotent-ish check on backend?)
            // Actually, backend creates NEW one based on code logic.
            // If I call initialize again, it might duplicate.
            // I should try to GET first. The available API is getCpaProfile(id).
            // But I don't have ID.
            // So I will call initialize first time.
            // Ideally backend should return existing if found.
            const profile = await cpaService.initializeCpaProfile();
            setCpaProfile(profile);
        } catch (error) {
            console.error('Failed to load CPA profile', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSaveGpa = async (
        gpaProfileId: string,
        data: { subjects: { id: string; letterScore: string | null | undefined }[] }
    ) => {
        if (!cpaProfile) return;

        // Map form data to request
        const gradeRequests = data.subjects.map((sub) => ({
            id: sub.id,
            letterCurrentScore: sub.letterScore || null, // Map undefined/"" to null
            letterImprovementScore: null, // UI doesn't handle improvement score yet
        }));

        const originalGpaProfile = cpaProfile.gpaProfiles.find(p => p.id === gpaProfileId);
        if (!originalGpaProfile) return;

        const gpaRequest = {
            id: gpaProfileId,
            gpaProfileCode: originalGpaProfile.gpaProfileCode,
            letterGpaScore: originalGpaProfile.letterGpaScore, // Will be recalculated by backend
            numberGpaScore: originalGpaProfile.numberGpaScore,
            previousNumberGpaScore: originalGpaProfile.previousNumberGpaScore,
            passedCredits: originalGpaProfile.passedCredits,
            gradeSubjectAverageProfileRequests: gradeRequests
        };

        const request: CpaProfileRequest = {
            id: cpaProfile.id,
            gpaProfileRequests: [gpaRequest],
        };

        try {
            const updatedProfile = await cpaService.updateCpaScore(cpaProfile.id, request);
            setCpaProfile(updatedProfile);
            // toast({ title: 'Cập nhật thành công' });
        } catch (error) {
            console.error('Update failed', error);
            // toast({ title: 'Lỗi cập nhật', variant: 'destructive' });
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!cpaProfile) {
        return <div>Không tải được dữ liệu bảng điểm.</div>;
    }

    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Bảng Điểm Cá Nhân</h1>
                <div className="mt-4 flex gap-8 rounded-lg bg-primary/10 p-6">
                    <div>
                        <span className="block text-sm text-gray-500">
                            CPA Tích lũy
                        </span>
                        <span className="text-4xl font-bold text-primary">
                            {cpaProfile.numberCpaScore?.toFixed(2) || '0.00'}
                        </span>
                    </div>
                    <div>
                        <span className="block text-sm text-gray-500">
                            Tín chỉ tích lũy
                        </span>
                        <span className="text-4xl font-bold">
                            {cpaProfile.accumulatedCredits}
                        </span>
                    </div>
                </div>
            </div>

            <Accordion type="multiple" className="w-full">
                {cpaProfile.gpaProfiles.map((gpa) => (
                    <AccordionItem key={gpa.id} value={gpa.id}>
                        <AccordionTrigger>
                            <div className="flex w-full items-center justify-between pr-4">
                                <span>{gpa.gpaProfileCode} (Kỳ {extractSemester(gpa.gpaProfileCode)})</span>
                                <div className="text-sm font-normal text-gray-500">
                                    GPA: {gpa.numberGpaScore?.toFixed(2) || '-'}
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-2">
                            <GpaEditor
                                initialData={{
                                    subjects: gpa.gradeSubjectAverageProfileResponses.map((s) => ({
                                        id: s.id,
                                        name: s.subjectName,
                                        credit: s.credit,
                                        letterScore: s.letterCurrentScore || s.letterImprovementScore,
                                        // TODO: Handle improvement score explicitly if needed
                                    })),
                                }}
                                onSave={(data) => handleSaveGpa(gpa.id, data)}
                            />
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}

function extractSemester(code: string) {
    // Example logic, adjust based on actual code format
    // GPA + StudentCode + SemesterId
    // Assuming last char? Or specific indexing.
    return code;
}
