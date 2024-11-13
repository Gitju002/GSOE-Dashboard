import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // Import the CSS for styling
import { EyeIcon, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRegisterUserMutation } from "@/store/services/users";
import { useToast } from "@/components/ui/use-toast";

const SignUp = ({ setTab }) => {
  const { toast, dismiss } = useToast();
  const [registerUser] = useRegisterUserMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    role: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data, error } = await registerUser({
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email.toLowerCase(),
        password: user.password,
        role: user.role,
        phone: user.phone.length >= 10 ? user.phone : null,
      });
      if (data) {
        setTab("sign-in");
        toast({
          title: "User created successfully",
          description: "You have successfully created an account",
        });
      }
      if (error) {
        toast({
          description:
            error.data.error || error.data.message || "Something went wrong",
        });
      }
    } catch (error) {
      toast({
        description: "Something went wrong",
      });
    } finally {
      setLoading(false);
      setTimeout(dismiss, 5000);
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
          <CardDescription>
            Enter your details to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={user.firstName}
                  onChange={(e) =>
                    setUser({ ...user, firstName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={user.lastName}
                  onChange={(e) =>
                    setUser({ ...user, lastName: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="flex">
                <PhoneInput
                  country={"in"}
                  value={user.phone}
                  onChange={(phone) => setUser({ ...user, phone })}
                  inputStyle={{ width: "100%" }} // optional, to match your styling
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="flex relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  value={user.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                />
                <div className="absolute top-1/2 -translate-y-1/2 right-0 p-2 cursor-pointer">
                  {showPassword ? (
                    <EyeOff onClick={() => setShowPassword(false)} size={18} />
                  ) : (
                    <EyeIcon onClick={() => setShowPassword(true)} size={18} />
                  )}
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select
                value={user.role}
                onValueChange={(value) => {
                  setUser({ ...user, role: value });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPERATOR">Operator</SelectItem>
                  <SelectItem value="ACCOUNTS">Accounts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end">
              <Button
                className="text-muted-foreground underline text-xs"
                onClick={() => setTab("sign-in")}
                variant="link"
              >
                Already have an account
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSubmit}>
            {loading ? "Loading..." : "Sign Up"}
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
};

export default SignUp;
