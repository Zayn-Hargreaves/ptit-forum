"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, TriangleAlert } from "lucide-react";

import { useAuth } from "@shared/providers/auth-provider";
import { useMe } from "@entities/session/model/queries";
import { isProfileComplete } from "@entities/session/lib/profile-check";

import { Navbar } from "@widgets/navbar/navbar";
import { Footer } from "@widgets/footer/footer";
import ProfileCompletionModal from "@features/profile/complete-profile/ui/completion-modal";

import { Alert, AlertDescription, AlertTitle } from "@shared/ui/alert/alert";
import { Button } from "@shared/ui/button/button";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { data: user, isLoading: isUserLoading } = useMe();

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      try {
        router.push("/login");
      } catch (error) {
        console.error("Redirect failed:", error);
      }
    }
  }, [isAuthLoading, isAuthenticated, router]);

  const [showModal, setShowModal] = useState(false);

  const isProfileIncomplete = useMemo(() => {
    if (!user) return false;
    return !isProfileComplete(user);
  }, [user]);

  useEffect(() => {
    if (!isProfileIncomplete) return;

    try {
      const hasSkipped = sessionStorage.getItem("skip-profile-update");
      if (!hasSkipped) setShowModal(true);
    } catch (e) {
      console.error("Failed to access sessionStorage:", e);
      setShowModal(true);
    }
  }, [isProfileIncomplete]);

  if (isAuthLoading || (isAuthenticated && isUserLoading)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const handleCloseModal = () => {
    setShowModal(false);
    try {
      sessionStorage.setItem("skip-profile-update", "true");
    } catch (e) {
      console.error("Failed to set sessionStorage:", e);
    }
  };

  const handleOpenModal = () => setShowModal(true);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto py-6 px-4 md:px-0">
        {isProfileIncomplete && !showModal && (
          <div className="mb-6">
            <Alert className="border-yellow-500/50 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
              <TriangleAlert className="h-4 w-4" />
              <AlertTitle>Hồ sơ chưa hoàn thiện</AlertTitle>
              <AlertDescription className="flex items-center justify-between gap-4">
                <span>
                  Bạn sẽ không nhận được thông báo lớp học nếu thiếu Mã SV/Lớp.
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenModal}
                  className="shrink-0 bg-background"
                >
                  Cập nhật ngay
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {children}
      </main>

      <Footer />

      {user && (
        <ProfileCompletionModal isOpen={showModal} onClose={handleCloseModal} />
      )}
    </div>
  );
}
