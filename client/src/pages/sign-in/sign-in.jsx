import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "@/store/services/users";
import { useToast } from "@/components/ui/use-toast";

const SignIn = ({ setTab }) => {
  const navigate = useNavigate();
  const [loginUser] = useLoginUserMutation();
  const { toast, dismiss } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data, error } = await loginUser({
        email: user.email.toLowerCase(),
        password: user.password,
      });
      if (data) {
        navigate("/dashboard");
        toast({
          title: "Login successful",
          description: "You have successfully logged in",
        });
      }
      if (error) {
        toast({
          description:
            error.data.error || error.data.message || "Something went wrong",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setTimeout(dismiss, 5000);
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>
            Enter your email and password to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="flex relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
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
            <div className="flex justify-between">
              <Link to="/forgot-password">
                <Button
                  className="text-muted-foreground underline text-xs"
                  variant="link"
                >
                  Forgot Password?
                </Button>
              </Link>
              <Button
                className="text-muted-foreground underline text-xs"
                onClick={() => setTab("sign-up")}
                variant="link"
              >
                Don&apos;t have an account? Sign up
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            Login
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
};

export default SignIn;
