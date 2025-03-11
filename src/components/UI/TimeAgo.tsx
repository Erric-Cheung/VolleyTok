interface timeAgoProps {
  timestamp: Date;
  timeAgo?: string;
}

const TimeAgo = ({ timestamp }: timeAgoProps) => {
  const time = timeAgo(timestamp);

  return <div className="text-xs">{time}</div>;
};

// Helper function to get time posted ago
const timeAgo = (timestamp: Date): string => {
  const past = new Date(timestamp);
  const now = new Date();

  const diffMs = now.getTime() - past.getTime(); // Difference in milliseconds
  const diffMinutes = Math.floor(diffMs / (1000 * 60)); // Convert to minutes
  const diffHours = Math.floor(diffMinutes / 60); // Convert to hours
  const diffDays = Math.floor(diffHours / 24); // Convert to days

  if (diffMinutes < 1) {
    return "Just now";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  } else {
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  }
};

export default TimeAgo;
