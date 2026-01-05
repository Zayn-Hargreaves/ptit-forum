// Define map điểm số chuẩn (Hardcode theo quy chế tín chỉ)
const GRADE_MAP: Record<string, number> = {
    'A+': 4.0, 'A': 4.0,
    'B+': 3.5, 'B': 3.0,
    'C+': 2.5, 'C': 2.0,
    'D+': 1.5, 'D': 1.0,
    'F': 0.0,
};

export interface SubjectInput {
    credit: number;
    letterScore: string | null | undefined; // Có thể null nếu chưa nhập
    isExcluded?: boolean; // Mở rộng: Môn không tính điểm (Thể dục, GDQP)
}

export const calculateGPA = (subjects: SubjectInput[]) => {
    let totalCredits = 0;
    let totalScore = 0;

    subjects.forEach((sub) => {
        // 1. Validate data rác
        if (!sub.letterScore || sub.isExcluded) return;

        const score = GRADE_MAP[sub.letterScore.toUpperCase()];

        // 2. Defensive Coding: Nếu map không ra (VD: nhập 'G'), bỏ qua hoặc throw error
        if (typeof score !== 'number') return;

        totalCredits += sub.credit;
        totalScore += score * sub.credit;
    });

    // 3. Tránh chia cho 0 (NaN)
    const gpa = totalCredits === 0 ? 0 : totalScore / totalCredits;

    return {
        gpa: Number(gpa.toFixed(2)), // Làm tròn 2 số thập phân chuẩn hiển thị
        totalCredits,
    };
};
