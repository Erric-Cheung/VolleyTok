"use client";

import UserTag from "@/components/UI/UserTag";
import MenuHeader from "../MenuHeader";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import ActivityNotication from "./ActivityNotifcation";

type Activity = {
  id: string;
  type: "like" | "comment" | "follow";
  actor_username: string;
  post_id?: string;
  created_at: string;
};

const ActivityContent = () => {
  const [activities, setActivity] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/activity")
      .then((res) => res.json())
      .then((data) => {
        setActivity(data.activities || []);
        setIsLoading(false);
        console.log(data);
      });
  }, []);

  const getLabel = (type: string) => {
    switch (type) {
      case "like":
        return "liked your post.";
      case "comment":
        return "commented on your post.";
      case "follow":
        return "started following you.";
      default:
        return "";
    }
  };

  const getLink = (activity: Activity) => {
    switch (activity.type) {
      case "follow":
        return `/@${activity.actor_username}`;
      case "like":
        return `/posts/${activity.post_id}`;
      case "comment":
        return `/posts/${activity.post_id}`;
      default:
        return "";
    }
  };

  return (
    <>
      <MenuHeader title="Notifications"></MenuHeader>
      <div className="mx-4 text-gray-400 text-sm font-bold">Recent</div>
      <div className="flex flex-col ">
        {isLoading ? (
          <div className="flex align-center justify-center mt-4 ">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
          </div>
        ) : (
          // Delete activity by id
          activities.map((activity) => (
            <div
              className="flex px-4 py-2 cursor-pointer items-center"
              key={activity.id}
              onClick={() => router.push(getLink(activity))}
            >
              <div className="flex grow">
                <ActivityNotication
                  username={activity.actor_username}
                  label={getLabel(activity.type)}
                ></ActivityNotication>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default ActivityContent;
