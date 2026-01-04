"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@shared/providers/auth-provider";
import { updateProfile } from "@shared/api/user.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    Button,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@shared/ui";
import { useEffect } from "react";
import { Camera } from "lucide-react";

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
});

export function ProfileForm() {
    const { user, refreshSession } = useAuth();

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.fullName || "",
        },
    });

    useEffect(() => {
        if (user) {
            form.reset({ name: user.fullName });
        }
    }, [user, form]);

    const mutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            toast.success("Profile updated successfully");
            refreshSession();
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update profile");
        },
    });

    function onSubmit(values: z.infer<typeof profileSchema>) {
        mutation.mutate(values);
    }

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Public Profile</CardTitle>
                    <CardDescription>
                        This is how others will see you on the site.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className="relative group cursor-pointer">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={user?.avatarUrl} />
                                    <AvatarFallback className="text-lg">{user?.fullName?.[0]?.toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-medium">Profile Picture</h4>
                                <p className="text-xs text-muted-foreground">Click to upload (Not implemented in MVP)</p>
                            </div>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Display Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Your Name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={mutation.isPending}>
                                    {mutation.isPending ? "Saving..." : "Save Changes"}
                                </Button>
                            </form>
                        </Form>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Account Security</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <FormLabel>Email</FormLabel>
                            <Input value={user?.email} disabled readOnly />
                            <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
