import { useLocation, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SheetClose } from "@/components/ui/sheet";
import {
  ArrowLeftRight,
  ArrowRight,
  ChartNoAxesCombined,
  MapPin,
  Plane,
  TableProperties,
  UserRoundPen,
  Users,
} from "lucide-react";
import { useGetAuthenticatedUserQuery } from "@/store/services/users";

const SidebarRoutes = () => {
  const location = useLocation();
  const { data, isLoading } = useGetAuthenticatedUserQuery();

  if (isLoading) return null;

  const routes = [
    {
      title: "Analytics",
      icon: <ChartNoAxesCombined size={18} />,
      href: "/dashboard",
      roles: ["ADMIN"],
      active: location.pathname === "/dashboard",
    },
    {
      title: "Details",
      icon: <TableProperties size={18} />,
      href: "/dashboard/details",
      roles: ["ADMIN", "OPERATOR"],
      active: location.pathname === "/dashboard/details",
    },
    {
      title: "Agents",
      icon: <Users size={18} />,
      href: "/dashboard/agents",
      roles: ["ADMIN"],
      active: location.pathname === "/dashboard/agents",
    },
    {
      title: "Travelers",
      icon: <Plane size={18} />,
      href: "/dashboard/travelers",
      roles: ["ADMIN", "OPERATOR"],
      active: location.pathname === "/dashboard/travelers",
    },
    {
      title: "Create Tour",
      icon: <MapPin size={18} />,
      href: "/dashboard/create-tour",
      roles: ["ADMIN", "OPERATOR"],
      active: location.pathname === "/dashboard/referrals",
    },
    {
      title: "Profile",
      icon: <UserRoundPen size={18} />,
      href: "/dashboard/user-profile",
      roles: ["ADMIN", "ACCOUNTS", "OPERATOR"],
      active: location.pathname === "/dashboard/user-profile",
    },
    {
      title: "Transactions",
      icon: <ArrowLeftRight size={18} />,
      href: "/dashboard/transactions",
      roles: ["ADMIN", "ACCOUNTS", "OPERATOR"],
      active: location.pathname === "/dashboard/transactions",
    },
  ];

  const filteredRoutes = routes.filter((route) =>
    data?.data?.role ? route.roles.includes(data.data.role) : false
  );

  return (
    <div className="h-full">
      {filteredRoutes.map((route) => (
        <SheetClose key={route.href} asChild>
          <NavLink to={route.href}>
            <span
              className={cn(
                "py-2 hover:bg-gray-100 transition-all duration-150 my-2 flex items-center gap-2 px-4 rounded-md",
                route.active ? "bg-gray-100 font-semibold" : ""
              )}
            >
              {route.active && (
                <ArrowRight size={18} className="text-primary" />
              )}
              {route.icon && <span>{route.icon}</span>}
              {route.title}
            </span>
          </NavLink>
        </SheetClose>
      ))}
    </div>
  );
};

export default SidebarRoutes;
