import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { useToast } from "@/components/ui/use-toast";
import { useResetPasswordMutation } from "@/store/services/users";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();
  const { toast, dismiss } = useToast();
  const [resetPassword] = useResetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        description: "Passwords do not match",
      });
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await resetPassword({
        token,
        body: password,
      });
      if (data) {
        toast({
          title: "Password reset successful",
          description: "You can now sign in with your new password.",
        });
        navigate("/signin");
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
      <Card className="mx-auto max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            Please enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="New Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between mt-2 flex-col gap-4">
          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            Reset Password
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
};

export default ResetPassword;
