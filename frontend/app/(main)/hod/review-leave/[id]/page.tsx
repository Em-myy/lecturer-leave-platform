import ReviewLeaveClient from "./ReviewLeaveClient";

export const instant = false;

type PageParams = Promise<{ tag: string; id: string }>;

const ReviewLeavePage = async ({ params }: { params: PageParams }) => {
  const resolvedParams = await params;
  return <ReviewLeaveClient leaveId={resolvedParams.id} />;
};

export default ReviewLeavePage;
