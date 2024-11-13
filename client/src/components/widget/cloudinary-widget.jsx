import React, { useState, useEffect } from "react";
import { UploadIcon } from "lucide-react";

const CloudinaryWidget = ({ onUpload, value, disable }) => {
  const [image, setImage] = useState(value || null);

  useEffect(() => {
    setImage(value);
  }, [value]);

  useEffect(() => {
    if (!disable) {
      const myWidget = window.cloudinary.createUploadWidget(
        {
          cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
          uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
          sources: ["local", "url"],
          multiple: false,
          resourceType: "image",
          clientAllowedFormats: ["jpg", "jpeg", "png"],
          maxFileSize: 5000000,
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            const imageUrl = result.info.secure_url;
            setImage(imageUrl);
            onUpload(imageUrl);
          }
        }
      );

      const handleClick = () => {
        myWidget.open();
      };

      const uploadWidgetElement = document.getElementById("upload_widget");
      uploadWidgetElement.addEventListener("click", handleClick);

      return () => {
        uploadWidgetElement.removeEventListener("click", handleClick);
      };
    }
  }, [onUpload, disable]);

  return (
    <div
      id="upload_widget"
      className={`border-2 rounded-md border-dashed flex justify-center items-center relative overflow-hidden ${
        disable ? "cursor-not-allowed opacity-50" : "cursor-pointer group"
      }`}
    >
      {!disable && (
        <div className="absolute opacity-0 group-hover:opacity-100 bg-black/30 top-0 left-0 bottom-0 right-0 duration-200 flex justify-center items-center">
          <div className="text-white text-sm font-semibold">
            <div className="p-2 border-2 border-white rounded-full">
              <UploadIcon className="w-12 h-12 aspect-square" />
            </div>
          </div>
        </div>
      )}
      {image ? (
        <img
          src={image}
          alt="Uploaded"
          width={100}
          height={100}
          className="aspect-square rounded-full m-2 object-cover object-center"
        />
      ) : (
        <img
          src="/assets/default_user.svg"
          alt="Upload"
          width={100}
          height={100}
        />
      )}
    </div>
  );
};

export default CloudinaryWidget;
