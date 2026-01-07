'use client';

import { useEffect, useState } from 'react';
import {
    cpaService,
    CpaProfileResponse,
    GpaProfileResponse,
    CpaProfileRequest,
} from '@/shared/api/cpa.service';
import { GpaFormValues } from '@/features/cpa/validators/gpa.schema';
import { GpaEditor } from '@/features/cpa/components/GpaEditor';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/shared/ui/accordion/accordion';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/shared/ui/button/button';

// ... (existing imports)


export default function CpaPage() {
    const [cpaProfile, setCpaProfile] = useState<CpaProfileResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    // const { toast } = useToast(); 

    const fetchData = async () => {
        setIsLoading(true);
        try {
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

    const handleAddSemester = async () => {
        if (!cpaProfile) return;
        setIsLoading(true);
        try {
            const updated = await cpaService.addGpaProfileForCpaProfile(cpaProfile.id);
            setCpaProfile(updated);
        } catch (error) {
             console.error("Failed to add semester", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveGpa = async (
        gpaProfileId: string,
        data: GpaFormValues
    ) => {
        if (!cpaProfile) return;

        // Map form data to request
        const gradeRequests = data.subjects.map((sub) => ({
            id: sub.id, // Can be null/undefined for new
            subjectId: sub.subjectId, // Needed for new
            letterCurrentScore: sub.letterScore || null, 
            letterImprovementScore: null, 
        }));

        const originalGpaProfile = cpaProfile.gpaProfiles.find(p => p.id === gpaProfileId);
        // If not found? weird.
        if (!originalGpaProfile) return;

        const gpaRequest = {
            id: gpaProfileId,
            gpaProfileCode: originalGpaProfile.gpaProfileCode,
            // Backend ignores these, but needed for DTO structure
            letterGpaScore: originalGpaProfile.letterGpaScore, 
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
        } catch (error) {
            console.error('Update failed', error);
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

            {cpaProfile.gpaProfiles.length === 0 ? (
                 <div className="text-center py-10 border rounded-lg bg-gray-50">
                     <h3 className="text-lg font-medium mb-4">Chưa có học kỳ nào</h3>
                     <Button onClick={handleAddSemester}>
                        <Plus className="mr-2 h-4 w-4"/> Thêm học kỳ mới
                     </Button>
                 </div>
            ) : (
                <>
                <div className="mb-4 flex justify-end">
                     <Button variant="secondary" size="sm" onClick={handleAddSemester}>
                        <Plus className="mr-2 h-4 w-4"/> Thêm học kỳ
                     </Button>
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
                                            // Ensure subjectId is mapped or we trust id linking?
                                            // The response 's' is GradeSubjectAverageProfileResponse.
                                            // Does it have subjectId? 
                                            // We need to check GradeSubjectAverageProfileResponse DTO.
                                            // If not, we can't map it back?
                                            // Ah, but existing items don't strictly need subjectId for retrieval if we only update score via ID.
                                            // But for consistent typing, we update.
                                            // If we rely on id, it's fine.
                                            name: s.subjectName,
                                            credit: s.credit,
                                            letterScore: s.letterCurrentScore ?? s.letterImprovementScore ?? undefined,
                                        })),
                                    }}
                                    onSave={(data) => handleSaveGpa(gpa.id, data)}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
                </>
            )}
        </div>
    );
}

function extractSemester(code: string) {
    if (!code) return "";
    // Example: GPA[Code]1 -> semester 1?
    // Just display code for now or simple extraction
    return code;
}
