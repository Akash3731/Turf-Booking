import { useState, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import AuthContext from "../../contexts/AuthContext";
import { toast } from "react-toastify";

const TurfForm = ({ turf, onSubmitSuccess }) => {
  const { authAxios } = useContext(AuthContext);
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState(turf?.images || []);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bank details state
  const [bankDetails, setBankDetails] = useState({
    razorpayMerchantId: turf?.razorpayMerchantId || "",
  });

  // Sport types options
  const sportTypes = ["Football", "Cricket", "Basketball", "Tennis", "Other"];

  // Common facilities
  const facilityOptions = [
    "Changing Rooms",
    "Shower",
    "Parking",
    "Drinking Water",
    "Flood Lights",
    "Equipment Rental",
    "Cafeteria",
    "Washrooms",
  ];

  // Initial values
  const initialValues = {
    name: turf?.name || "",
    description: turf?.description || "",
    address: turf?.address || "",
    city: turf?.city || "",
    price: turf?.price || "",
    sportTypes: turf?.sportTypes || ["Football"],
    facilities: turf?.facilities || [],
    openingTime: turf?.openingTime || "06:00",
    closingTime: turf?.closingTime || "22:00",
    size: turf?.size || "",
    isActive: turf?.isActive ?? true,
    keepExistingImages: true,
  };

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    price: Yup.number()
      .required("Price is required")
      .positive("Price must be positive"),
    sportTypes: Yup.array().min(1, "Select at least one sport type"),
    openingTime: Yup.string().required("Opening time is required"),
    closingTime: Yup.string().required("Closing time is required"),
    size: Yup.string().required("Turf size is required"),
  });

  // Handle image change
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Preview images
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreview([...imagePreview, ...newPreviews]);

    // Store files for upload
    setImages([...images, ...files]);
  };

  // Handle form submission
  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Basic validation for bank details
      if (!bankDetails.razorpayMerchantId) {
        setSubmitError("Razorpay Bank Account ID is required");
        setIsSubmitting(false);
        return;
      }

      // Create FormData for file upload
      const formData = new FormData();

      // Add all form fields to FormData
      Object.keys(values).forEach((key) => {
        if (key === "sportTypes" || key === "facilities") {
          // Handle arrays
          values[key].forEach((value) => {
            formData.append(`${key}`, value);
          });
        } else {
          formData.append(key, values[key]);
        }
      });

      // Add bank account ID to FormData
      formData.append("razorpayMerchantId", bankDetails.razorpayMerchantId);

      // Add images to FormData
      if (images.length > 0) {
        images.forEach((image) => {
          formData.append("images", image);
        });
      }

      // Get current token from localStorage to ensure it's fresh
      const token = localStorage.getItem("token");

      // Configure request headers with token
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      let response;

      try {
        if (turf?._id) {
          // Update existing turf
          response = await authAxios.put(
            `/api/turfs/${turf._id}`,
            formData,
            config
          );
        } else {
          // Create new turf
          response = await authAxios.post("/api/turfs", formData, config);
        }
      } catch (apiError) {
        // Specific error handling for API calls
        const errorMessage =
          apiError.response?.data?.message ||
          "Failed to save turf. Please check your input and try again.";

        setSubmitError(errorMessage);
        setIsSubmitting(false);
        return;
      }

      // Success handling
      setIsSubmitting(false);

      if (response.data.success) {
        // Reset form if creating new turf
        if (!turf?._id) {
          resetForm();
          setImages([]);
          setImagePreview([]);
          setBankDetails({
            razorpayMerchantId: "",
          });
        }

        // Call success callback
        if (onSubmitSuccess) {
          onSubmitSuccess(response.data.data);
        }

        // Optional: Show success toast or notification
        toast.success(
          turf?._id
            ? "Turf updated successfully"
            : "New turf created successfully"
        );
      }
    } catch (error) {
      // Catch any unexpected errors
      console.error("Unexpected error saving turf:", error);

      setSubmitError("An unexpected error occurred. Please try again later.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">
        {turf?._id ? "Edit Turf" : "Add New Turf"}
      </h2>

      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {submitError}
        </div>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="space-y-6">
            {/* Basic Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Turf Name *
                </label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  City *
                </label>
                <Field
                  type="text"
                  id="city"
                  name="city"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
                <ErrorMessage
                  name="city"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            </div>

            {/* Address and Description */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Address *
              </label>
              <Field
                type="text"
                id="address"
                name="address"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
              <ErrorMessage
                name="address"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description *
              </label>
              <Field
                as="textarea"
                id="description"
                name="description"
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Pricing & Size */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Price per Hour (₹) *
                </label>
                <Field
                  type="number"
                  id="price"
                  name="price"
                  min="0"
                  step="1"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
                <ErrorMessage
                  name="price"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="size"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Turf Size *
                </label>
                <Field
                  type="text"
                  id="size"
                  name="size"
                  placeholder="e.g., 5-a-side, 11-a-side, 30x40m"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
                <ErrorMessage
                  name="size"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Active Status
                </label>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <Field
                      type="checkbox"
                      name="isActive"
                      className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="ml-2 text-gray-700">
                      Turf is available for booking
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="openingTime"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Opening Time *
                </label>
                <Field
                  type="time"
                  id="openingTime"
                  name="openingTime"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
                <ErrorMessage
                  name="openingTime"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="closingTime"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Closing Time *
                </label>
                <Field
                  type="time"
                  id="closingTime"
                  name="closingTime"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
                <ErrorMessage
                  name="closingTime"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            </div>

            {/* Sport Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sport Types *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {sportTypes.map((sport) => (
                  <label key={sport} className="inline-flex items-center">
                    <Field
                      type="checkbox"
                      name="sportTypes"
                      value={sport}
                      className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="ml-2 text-gray-700">{sport}</span>
                  </label>
                ))}
              </div>
              <ErrorMessage
                name="sportTypes"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Facilities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facilities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {facilityOptions.map((facility) => (
                  <label key={facility} className="inline-flex items-center">
                    <Field
                      type="checkbox"
                      name="facilities"
                      value={facility}
                      className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="ml-2 text-gray-700">{facility}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Turf Images
              </label>

              {turf?.images && turf.images.length > 0 && (
                <div className="mb-2">
                  <label className="inline-flex items-center">
                    <Field
                      type="checkbox"
                      name="keepExistingImages"
                      className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="ml-2 text-gray-700">
                      Keep existing images
                    </span>
                  </label>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                You can upload multiple images. Max 5 images allowed.
              </p>

              {/* Image Previews */}
              {imagePreview.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                  {imagePreview.map((src, index) => (
                    <div
                      key={index}
                      className="relative h-24 bg-gray-100 rounded-md overflow-hidden"
                    >
                      <img
                        src={src}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bank Details Section */}
            <div>
              <label
                htmlFor="razorpayMerchantId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Razorpay Merchant ID *
              </label>
              <input
                type="text"
                id="razorpayMerchantId"
                value={bankDetails.razorpayMerchantId}
                onChange={(e) =>
                  setBankDetails({
                    razorpayMerchantId: e.target.value,
                  })
                }
                placeholder="Enter Razorpay Merchant ID"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                The unique identifier for the turf owner's Razorpay account
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
              >
                {isSubmitting
                  ? "Saving..."
                  : turf?._id
                  ? "Update Turf"
                  : "Create Turf"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TurfForm;
