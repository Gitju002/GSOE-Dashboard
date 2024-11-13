import { useState, useEffect } from "react";
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
import { Link } from "react-router-dom";
import {
  useForgotPasswordMutation,
  useResendPasswordMutation,
} from "@/store/services/users";
import { motion } from "framer-motion";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();
  const [resendPassword] = useResendPasswordMutation();
  const { toast, dismiss } = useToast();

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(timer - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data, error } = await forgotPassword({
        email: email.toLowerCase(),
      });
      if (data) {
        toast({
          title: "Password reset email sent",
          description:
            "Please check your email for instructions on how to reset your password.",
        });
        setIsEmailSent(true); // Set the email sent state to true
        setTimer(120); // Start the 2-minute timer
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

  const handleResendPassword = async () => {
    try {
      setLoading(true);
      const { data, error } = await resendPassword({
        email: email.toLowerCase(),
      });
      if (data) {
        toast({
          title: "Password reset email resent",
          description:
            "Please check your email for instructions on how to reset your password.",
        });
        setTimer(120); // Reset the 2-minute timer
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
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address to receive a password reset link.
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
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between mt-2 flex-col gap-4">
          {!isEmailSent ? (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full"
            >
              Send Password Reset Link
            </Button>
          ) : (
            <>
              {timer === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Button
                    onClick={handleResendPassword}
                    disabled={loading}
                    className="w-full"
                    variant="ghost"
                    type="button"
                  >
                    Resend password
                  </Button>
                </motion.div>
              ) : (
                <Button disabled={true} className="w-full" variant="ghost">
                  Resend password in {Math.floor(timer / 60)}:{timer % 60}
                </Button>
              )}
            </>
          )}
          <div className="flex justify-between">
            <Link to="/signin">
              <Button
                className="text-muted-foreground underline text-xs"
                variant="link"
              >
                Back to Sign In
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
};

export default ForgotPassword;
