import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Pencil, PlusCircleIcon } from "lucide-react";
import ImageUploadWidget from "@/components/widget/cloudinary-widget";
import { useToast } from "@/components/ui/use-toast";
import {
  useRegisterAgentMutation,
  useUpdateAgentMutation,
} from "@/store/services/agents";
import { useSearchParams } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // Import default styles

const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name is too short" }),
  lastName: z.string().min(2, { message: "Last name is too short" }),
  email: z.string().email({ message: "Invalid email" }),
  phone: z.string().nonempty({ message: "Phone number is required" }),
  imageUrl: z.string().optional(),
  address: z.string().optional(),
});

function AgentForm({ agent, onSuccess, params }) {
  const [loading, setLoading] = useState(false);
  const { toast, dismiss } = useToast();
  const [registerAgent, { isLoading: isRegistering }] =
    useRegisterAgentMutation();
  const [updateAgent, { isLoading: isUpdating }] = useUpdateAgentMutation();
  const [searchParams, setSearchParams] = useSearchParams();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      imageUrl: "",
      address: "",
    },
  });

  // Populate form when editing an existing agent
  useEffect(() => {
    if (params) {
      const nameParts = agent?.fullName?.split(" ") || [];
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      form.reset({
        firstName: firstName,
        lastName: lastName,
        email: agent?.email || "",
        phone: agent?.phone || "",
        imageUrl: agent?.avatarUrl || "",
        address: agent?.address || "",
      });
    } else {
      form.reset({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        imageUrl: "",
        address: "",
      });
    }
  }, [agent, params, form]);

  const onSubmit = async (values) => {
    try {
      setLoading(true);

      const payload = {
        fullName: values.firstName + " " + values.lastName,
        email: values.email,
        phone: values.phone,
        avatarUrl: values.imageUrl || null,
        address: values.address || null,
      };

      if (params) {
        // Update agent logic
        const response = await updateAgent({
          id: agent._id,
          body: payload,
        }).unwrap();
        if (response.success) {
          toast({
            title: "Success",
            description: "Agent updated successfully",
          });
        }
      } else {
        // Register new agent logic
        const response = await registerAgent(payload).unwrap();
        if (response.success) {
          toast({ title: "Success", description: "Agent added successfully" });
        }
      }

      form.reset(); // Reset form after success
      onSuccess(); // Trigger parent to refresh data
    } catch (error) {
      toast({
        title: "Error",
        description:
          error?.data?.message || error?.data?.error || "Something went wrong",
      });
    } finally {
      setLoading(false);
      setTimeout(dismiss, 5000);
    }
  };

  const isLoading = isRegistering || isUpdating;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex justify-center mb-2">
                Add Profile Picture
              </FormLabel>
              <FormControl>
                <ImageUploadWidget
                  onUpload={(url) => form.setValue("imageUrl", url)}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  First Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Last Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Phone <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <PhoneInput
                  country={"in"}
                  value={field.value}
                  onChange={(value) => form.setValue("phone", "+" + value)}
                  inputStyle={{ width: "100%" }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="sm"
          className="w-full mt-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : params ? (
            <>
              <Pencil className="mr-2 h-4 w-4" /> Update Agent
            </>
          ) : (
            <>
              <PlusCircleIcon className="mr-2 h-4 w-4" /> Add Agent
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

export default AgentForm;
