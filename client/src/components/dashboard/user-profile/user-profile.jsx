import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUploadWidget from "@/components/widget/cloudinary-widget";
import { Toaster } from "@/components/ui/toaster";
import {
  useGetAuthenticatedUserQuery,
  useUpdateUserMutation,
} from "@/store/services/users";
import Loader from "@/components/loader/loader";
import { Navigate } from "react-router-dom";
import { Edit } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import profileDemo from "../../../../public/assets/default_user.svg";

const UserProfile = () => {
  const [editable, setEditable] = useState(false);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    image: "",
  });

  const { data: profile, isLoading } = useGetAuthenticatedUserQuery();
  const [updateUser] = useUpdateUserMutation();
  const { toast, dismiss } = useToast();
  const getProfile = useGetAuthenticatedUserQuery();

  useEffect(() => {
    if (profile?.data) {
      const { fullName, email, phone, avatarUrl } = profile.data;
      const nameParts = fullName ? fullName.split(" ") : [];
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      setUser({
        firstName,
        lastName,
        email: email || "",
        mobile: phone || "N/A",
        image: avatarUrl || profileDemo,
      });
    }
  }, [profile]);

  if (isLoading) return <Loader />;
  if (!profile.data) return <Navigate to="/" />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateUser = async () => {
    const { firstName, lastName, email, mobile, image } = user;
    if (!firstName || !lastName || !email || !mobile) {
      return toast({
        title: "Error",
        description: "Please fill all required fields.",
      });
    }

    const fullName = `${firstName} ${lastName}`;

    try {
      const result = await updateUser({
        id: profile.data._id,
        body: {
          fullName,
          email,
          phone: mobile,
          avatarUrl: image,
        },
      }).unwrap();

      if (result?.success) {
        toast({
          description: "Success! Changes have been saved successfully!",
        });
        setEditable(false);
        getProfile.refetch();
      }
    } catch (error) {
      toast({
        description: "Error! Could not save changes.",
        variant: "destructive",
      });
    } finally {
      setTimeout(dismiss, 3000);
    }
  };

  const inputFields = [
    {
      id: "firstName",
      label: "First Name",
      type: "text",
      placeholder: "First name",
    },
    {
      id: "lastName",
      label: "Last Name",
      type: "text",
      placeholder: "Last name",
    },
    { id: "email", label: "Email", type: "email", placeholder: "Email" },
  ];

  return (
    <div className="w-full flex justify-center items-center">
      <Card className="w-full max-w-2xl sm:max-w-3xl md:max-w-screen-lg p-4 md:p-6 shadow-xl relative">
        <Button
          size={"icon"}
          variant={"ghost"}
          className="absolute right-4"
          onClick={() => setEditable(!editable)}
        >
          <Edit size={18} />
        </Button>
        <CardHeader>
          <div className="profile flex items-center gap-3">
            <ImageUploadWidget
              onUpload={(url) => setUser((prev) => ({ ...prev, image: url }))}
              value={user.image}
              disable={!editable}
            />
          </div>
        </CardHeader>

        <CardContent>
          <form>
            <div className="input-section-1 grid sm:grid-cols-2 grid-cols-1 gap-4 pb-4">
              {inputFields.map(({ id, label, type, placeholder }) => (
                <div key={id} className="flex flex-col gap-2">
                  <label htmlFor={id} className="text-sm font-medium">
                    {label}
                  </label>
                  <Input
                    id={id}
                    name={id}
                    type={type}
                    placeholder={placeholder}
                    disabled={!editable}
                    value={user[id]}
                    onChange={handleChange}
                  />
                </div>
              ))}
              <div className="flex flex-col gap-2">
                <label htmlFor="mobile" className="text-sm font-medium">
                  Mobile Number
                </label>
                <PhoneInput
                  inputStyle={{
                    width: "100%",
                    height: "2.5rem",
                    borderRadius: "0.375rem",
                    // make the county selector disable while input fields are disabled
                    borderColor: editable ? "#CBD5E1" : "#E2E8F0",
                    color: editable ? "#000000" : "#9ca3af",
                  }}
                  country={"in"}
                  value={user.mobile}
                  onChange={(phone) =>
                    setUser((prev) => ({ ...prev, mobile: phone }))
                  }
                  inputProps={{
                    name: "mobile",
                    required: true,
                    autoFocus: false,
                    disabled: !editable,
                  }}
                />
              </div>
            </div>
          </form>
          <div className="flex flex-wrap sm:justify-end gap-6 mt-4 justify-center">
            <Button
              type="button"
              size={"lg"}
              variant={"outline"}
              onClick={() => setEditable(false)}
              disabled={!editable}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateUser}
              type="button"
              size={"lg"}
              variant={"outline"}
              disabled={!editable}
            >
              Confirm
            </Button>
          </div>
        </CardContent>
        <Toaster />
      </Card>
    </div>
  );
};

export default UserProfile;
