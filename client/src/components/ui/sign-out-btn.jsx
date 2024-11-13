import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "./use-toast";
import { useLogoutMutation } from "@/store/services/users";
import { SheetClose } from "./sheet";
import Cookie from "js-cookie";

const SignOutButton = () => {
  const { toast } = useToast();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      Cookie.remove("connect.sid");
      window.location.reload();

      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
        status: "success",
      });
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "An error occurred during logout.",
        status: "error",
      });
    }
  };

  return (
    <SheetClose asChild>
      <Button
        className="w-full"
        variant="destructive"
        disabled={isLoading}
        onClick={handleLogout}
      >
        Sign out
        <LogOut size={18} className="inline-flex ml-2" />
      </Button>
    </SheetClose>
  );
};

export default SignOutButton;
