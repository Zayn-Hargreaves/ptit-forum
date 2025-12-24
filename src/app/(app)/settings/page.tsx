"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/ui/card/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/ui/tabs/tabs";
import { UpdateProfileForm } from "@features/profile/update-profile/ui/update-profile-form";

export default function SettingsPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Cài đặt</h1>
        <p className="text-muted-foreground">
          Quản lý thông tin tài khoản và tùy chọn của bạn
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Hồ sơ</TabsTrigger>
          <TabsTrigger value="account">Tài khoản</TabsTrigger>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <UpdateProfileForm />
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Bảo mật</CardTitle>
              <CardDescription>
                Tính năng đổi mật khẩu đang phát triển...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Thông báo</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
