"use client";

import { Topic } from "@entities/topic/model/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/ui/tabs/tabs";
import { useState } from "react";
import { ApprovedPostsTab } from "./tabs/ApprovedPostsTab";
import { PendingPostsTab } from "./tabs/PendingPostsTab";
import { MembersTab } from "./tabs/MembersTab";
import { JoinRequestsTab } from "./tabs/JoinRequestsTab";
import { TopicHeader } from "./TopicHeader";
import { useTopicPermission } from "./useTopicPermission";

interface TopicDetailViewProps {
  topic: Topic;
}

export function TopicDetailView({ topic }: TopicDetailViewProps) {
  const [activeTab, setActiveTab] = useState("discussions");
  const { canManage } = useTopicPermission(topic);

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <TopicHeader topic={topic} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger
            value="discussions"
            className="rounded-t-md data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none"
          >
            Discussions
          </TabsTrigger>
          <TabsTrigger
            value="members"
            className="rounded-t-md data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none"
          >
            Members
          </TabsTrigger>
          {canManage && (
            <>
              <TabsTrigger
                value="pending"
                className="rounded-t-md data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none"
              >
                Pending Posts
              </TabsTrigger>
              <TabsTrigger
                value="requests"
                className="rounded-t-md data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none shadow-none"
              >
                Join Requests
              </TabsTrigger>
            </>
          )}
        </TabsList>

        <div className="mt-6">
          <TabsContent value="discussions">
            <ApprovedPostsTab topicId={topic.id} />
          </TabsContent>

          <TabsContent value="members">
            {activeTab === "members" && <MembersTab topicId={topic.id} />}
          </TabsContent>

          {canManage && (
            <>
              <TabsContent value="pending">
                {activeTab === "pending" && <PendingPostsTab topicId={topic.id} />}
              </TabsContent>
              <TabsContent value="requests">
                {activeTab === "requests" && <JoinRequestsTab topicId={topic.id} />}
              </TabsContent>
            </>
          )}
        </div>
      </Tabs>
    </div>
  );
}
