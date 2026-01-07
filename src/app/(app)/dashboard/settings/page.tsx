import { ProfileForm } from "@features/dashboard/settings/profile-form";

export default function DashboardSettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">Manage your account settings and profile preferences.</p>
            </div>

            <ProfileForm />
        </div>
    );
}
