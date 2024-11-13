import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import SidebarRoutes from "@/components/side-bar/sidebar-routes";
import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import SignOutButton from "../ui/sign-out-btn";
import UserBadge from "../dashboard/user-profile/user-badge";

export const Sidebar = ({ data }) => {
  const location = useLocation();
  if (location.pathname === "/thank-you") return;
  return (
    <>
      <Sheet>
        <SheetTrigger className="fixed top-4 left-4">
          <Menu size={24} />
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <SheetHeader className="flex-1">
            <SheetTitle>
              <SheetClose>
                <Link to="/dashboard">
                  <img
                    src={"/assets/logo.png"}
                    alt="logo"
                    className="cursor-pointer aspect-auto w-[80%] mx-auto my-4 rounded-lg"
                  />
                </Link>
              </SheetClose>
            </SheetTitle>
            <div className="text-sm">
              <SidebarRoutes />
            </div>
          </SheetHeader>
          <SheetFooter>
            <div className="w-full">
              <SignOutButton />
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      {data && data.success && (
        <div className="absolute top-0 right-0 my-4 mr-4">
          <UserBadge />
        </div>
      )}
    </>
  );
};

export default Sidebar;
