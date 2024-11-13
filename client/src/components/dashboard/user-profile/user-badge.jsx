import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetAuthenticatedUserQuery } from "@/store/services/users";
import { Loader2 } from "lucide-react";

function UserBadge() {
  const { data: profile, isLoading } = useGetAuthenticatedUserQuery();
  if (isLoading) return <Loader2 />;
  console.log(profile);

  return (
    <>
      <Link
        to="/dashboard/user-profile"
        className="flex items-center space-x-3"
      >
        <div>
          <p className="text-sm font-medium overflow-ellipsis text-slate-800 leading-none">
            {profile?.data?.fullName
              ? profile.data.fullName.length > 15
                ? profile.data.fullName.substring(0, 15) + "..."
                : profile.data.fullName
              : "N/A"}
          </p>

          <p className="text-sm text-slate-800 text-right lowercase">
            {profile?.data?.role || "N/A"}
          </p>
        </div>
        <Avatar>
          <AvatarImage
            src={profile?.data?.avatarUrl || "https://github.com/shadcn.png"}
          />
          <AvatarFallback>User</AvatarFallback>
        </Avatar>
      </Link>
    </>
  );
}

export default UserBadge;
