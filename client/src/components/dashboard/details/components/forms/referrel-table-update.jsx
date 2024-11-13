import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import DatePicker from "@/components/ui/date-picker";
import {
  useGetSingleBookingByIdQuery,
  useUpdateBookingMutation,
  useGetBookingsDirectQuery,
  useGetBookingsReferralQuery,
} from "@/store/services/booking";
import Loader from "@/components/loader/loader";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
  tourType: z.string().optional(),
  package: z.string().optional(),
});

const RefferrelTableEdit = ({ bookingId, setOpen }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const { data, isLoading, refetch } = useGetSingleBookingByIdQuery(bookingId);
  const [updateBooking] = useUpdateBookingMutation();
  const updateRefetch =
    useGetBookingsDirectQuery() || useGetBookingsReferralQuery();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: null,
      endDate: null,
      tourType: "",
      package: "",
    },
  });

  const onSubmit = async (values) => {
    const formattedStartDate = values.startDate
      ? values.startDate.toISOString()
      : null;
    const formattedEndDate = values.endDate
      ? values.endDate.toISOString()
      : null;

    // Validate that at least one field is filled before proceeding
    if (
      !formattedStartDate &&
      !formattedEndDate &&
      values.tourType === "" &&
      values.package === ""
    ) {
      toast({
        title: "Please fill at least one field to update",
        status: "error",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await updateBooking({
        id: bookingId,
        body: {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          venue: values.package,
          packageType: values.tourType,
        },
      });
      // Check if response and response.data exist
      if (response && response.data && response.data.success) {
        toast({
          title: response.data.message,
          status: "success",
        });
        await updateRefetch.refetch();
        refetch();
        setOpen(false);
      } else {
        // Handle unexpected response structure
        console.error("Update Booking Error:", response?.error?.data?.error);
        const errorMessage =
          response?.error?.data?.error || "Unexpected response structure";
        toast({
          title: "Error",
          description: errorMessage,
          status: "error",
        });
      }
    } catch (error) {
      console.error("Update Booking Error:", error);
      const errorMessage = error?.data?.error || "An unexpected error occurred";
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      form.reset({
        startDate: data.data.startDate ? new Date(data.data.startDate) : null,
        endDate: data.data.endDate ? new Date(data.data.endDate) : null,
        tourType: data.data.packageType || "",
        package: data.data.venue || "",
      });
    }
  }, [data, form]);

  if (isLoading) return <Loader />;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                  placeholder="Select a start date"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                  placeholder="Select an end date"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tourType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tour Type</FormLabel>
              <FormControl>
                <Input placeholder="Tour Type" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="package"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Package</FormLabel>
              <FormControl>
                <Input placeholder="Package" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{loading ? "Updating..." : "Update"}</Button>
      </form>
    </Form>
  );
};

export default RefferrelTableEdit;
