import { useEffect, useState } from "react";
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
  useRegisterTravelerMutation,
  useUpdateTravelerMutation,
} from "@/store/services/traveler";
import { useSearchParams } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const formSchema = z.object({
  firstName: z.string().min(2, "First name is too short").nonempty(),
  lastName: z.string().min(2, "Last name is too short").nonempty(),
  email: z.string().email("Invalid email").nonempty(),
  phone: z.string().nonempty("Phone number is required"),
  imageUrl: z.string().optional(),
  address: z.string().optional(),
});

const TravelerForm = ({ traveler, onSuccess, params }) => {
  const [loading, setLoading] = useState(false);
  const { toast, dismiss } = useToast();
  const [registerTraveler] = useRegisterTravelerMutation();
  const [updateTraveler] = useUpdateTravelerMutation();
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

  // Handle form reset based on whether editing or adding a traveler
  useEffect(() => {
    if (params) {
      form.reset({
        firstName: traveler?.fullName?.split(" ")[0] || "",
        lastName: traveler?.fullName?.split(" ")[1] || "",
        email: traveler?.email || "",
        phone: traveler?.phone || "",
        imageUrl: traveler?.avatarUrl || "",
        address: traveler?.address || "",
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
  }, [traveler, params, form]);

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const payload = {
        fullName: values.firstName + " " + values.lastName,
        email: values.email,
        phone: values.phone,
        avatarUrl: values.imageUrl || null,
        address: values.address || "",
      };

      let response;
      if (params && traveler?._id) {
        // Update traveler logic
        response = await updateTraveler({
          id: traveler._id,
          body: payload,
        }).unwrap();
      } else {
        // Add new traveler logic
        response = await registerTraveler(payload).unwrap();
      }

      toast({ title: "Success", description: response.message });
      form.reset(); // Reset form after success
      onSuccess(); // Trigger data refresh in parent component
    } catch (error) {
      toast({
        title: "Error",
        description:
          error?.data?.message || error?.data?.error || "Something went wrong",
      });
    } finally {
      setTimeout(dismiss, 3000);
      setLoading(false);
    }
  };

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
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : params && traveler?._id ? (
            <>
              Update Traveler
              <Pencil size={18} className="inline-flex ml-2" />
            </>
          ) : (
            <>
              Add Traveler
              <PlusCircleIcon size={18} className="inline-flex ml-2" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default TravelerForm;
