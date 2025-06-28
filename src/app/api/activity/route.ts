import { getActivityNotifications, getCurrentUser } from "@/lib/data/user";

// GET Route for user activity 
export async function GET() {
  try {
    console.log("ACTIVTIES GET REQUEST");

    const user = await getCurrentUser();

    if (!user) {
      return new Response("Not authenticated.", { status: 400 });
    }

    const activities = await getActivityNotifications(user?.user_id);

    return Response.json({ activities: activities });
  } catch (error) {
    console.error("Failed to fetch activities:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
