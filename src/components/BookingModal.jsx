import React, { useState, useEffect } from "react";
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  CreditCard,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Default styles
import { format, addDays, isSameDay } from "date-fns";

import { useCustomerAuth } from "../context/CustomerAuthContext";

import config from '../config';

const BookingModal = ({ isOpen, onClose, service, quantity = 1 }) => {
  const { customerUser, isCustomerLoggedIn } = useCustomerAuth();

  const [bookingData, setBookingData] = useState({
    selectedDate: new Date(),
    selectedTime: "",
    serviceLocation: "home",
    address: "",
    city: "",
    pincode: "",
    fullName: "",
    phone: "",
    email: "",
    createAccount: false,
    password: "",
    confirmPassword: "",
  });

  const [currentStep, setCurrentStep] = useState(1);

  // ✅ AUTO-FILL DATA IF LOGGED IN
  useEffect(() => {
    if (isOpen && isCustomerLoggedIn && customerUser) {
      setBookingData((prev) => ({
        ...prev,
        fullName: customerUser.fullName || "",
        email: customerUser.email || "",
        phone: customerUser.phone || "",
        address: customerUser.address || "",
        city: customerUser.city || "",
        pincode: customerUser.pincode || "",
      }));
    }
  }, [isOpen, isCustomerLoggedIn, customerUser]);

  // Generate Time Slots
  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
  ];

  const handleInputChange = (field, value) => {
    setBookingData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleBookingSubmit = async () => {
    try {
      // Prepare payload matching Backend DTO
      const payload = {
        serviceId: service.id,
        quantity: quantity,
        selectedDate: bookingData.selectedDate.toISOString().split("T")[0],
        selectedTime: bookingData.selectedTime,
        serviceLocation: bookingData.serviceLocation,
        address: bookingData.address,
        city: bookingData.city,
        pincode: bookingData.pincode,
        fullName: bookingData.fullName,
        email: bookingData.email,
        phone: bookingData.phone,
        specialInstructions: bookingData.specialInstructions,
      };

      const response = await fetch(`${config.BASE_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          `🎉 Booking Confirmed! \nWe sent the details to ${bookingData.email}`
        );
        onClose();
      } else {
        alert(`Booking Failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Booking Error:", error);
      alert("Failed to connect to the server.");
    }
  };

  // Disable past dates
  const tileDisabled = ({ date }) => {
    return date < new Date().setHours(0, 0, 0, 0);
  };

  if (!isOpen) return null;
  const totalPrice = service.price * quantity;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[2000] p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl">
        {/* Left Sidebar - Summary (Hidden on mobile) */}
        <div className="hidden md:block w-1/3 bg-gradient-to-br from-pink-500 to-purple-600 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Booking Summary</h3>
              <p className="text-pink-100 text-sm">
                Complete these steps to schedule your glow up!
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-pink-200 uppercase font-bold">
                      Date
                    </p>
                    <p className="font-medium">
                      {format(bookingData.selectedDate, "EEE, MMM dd, yyyy")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-pink-200 uppercase font-bold">
                      Time
                    </p>
                    <p className="font-medium">
                      {bookingData.selectedTime || "Not selected"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-pink-200 uppercase font-bold">
                      Total to Pay
                    </p>
                    <p className="text-2xl font-bold">₹{totalPrice}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-white h-full transition-all duration-500"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>
              <p className="text-right text-xs mt-2">Step {currentStep} of 4</p>
            </div>
          </div>
        </div>

        {/* Right Content - Form Steps */}
        <div className="flex-1 flex flex-col h-full max-h-[90vh] overflow-y-auto bg-gray-50">
          {/* Header */}
          <div className="bg-white p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 z-20">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Book {service.name}
              </h2>
              <p className="text-sm text-gray-500">
                Step {currentStep}:{" "}
                {currentStep === 1
                  ? "Select Date & Time"
                  : currentStep === 2
                  ? "Location Details"
                  : currentStep === 3
                  ? "Personal Info"
                  : "Review & Confirm"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Steps Content */}
          <div className="p-6 md:p-8 flex-1">
            {/* STEP 1: Date & Time (Revamped) */}
            {currentStep === 1 && (
              <div className="space-y-8">
                {/* Custom Calendar Wrapper */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">
                    1. Choose a Date
                  </h3>
                  <div className="calendar-wrapper flex justify-center">
                    <Calendar
                      onChange={(date) =>
                        handleInputChange("selectedDate", date)
                      }
                      value={bookingData.selectedDate}
                      minDate={new Date()}
                      tileDisabled={tileDisabled}
                      className="border-none w-full"
                      prevLabel={
                        <ChevronLeft className="w-5 h-5 text-pink-500" />
                      }
                      nextLabel={
                        <ChevronRight className="w-5 h-5 text-pink-500" />
                      }
                    />
                  </div>
                </div>

                {/* Time Slots Grid */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">
                    2. Pick a Time Slot
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => handleInputChange("selectedTime", time)}
                        className={`py-3 px-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
                          bookingData.selectedTime === time
                            ? "bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-200 transform scale-105"
                            : "bg-white border-gray-200 text-gray-600 hover:border-pink-300 hover:bg-pink-50"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Location */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => handleInputChange("serviceLocation", "home")}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      bookingData.serviceLocation === "home"
                        ? "border-pink-500 bg-pink-50 text-pink-700"
                        : "border-gray-200 bg-white hover:border-pink-200"
                    }`}
                  >
                    <span className="text-3xl mb-2 block">🏠</span>
                    <span className="font-bold">Home Service</span>
                  </button>
                  <button
                    onClick={() =>
                      handleInputChange("serviceLocation", "salon")
                    }
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      bookingData.serviceLocation === "salon"
                        ? "border-pink-500 bg-pink-50 text-pink-700"
                        : "border-gray-200 bg-white hover:border-pink-200"
                    }`}
                  >
                    <span className="text-3xl mb-2 block">💇‍♀️</span>
                    <span className="font-bold">Visit Salon</span>
                  </button>
                </div>

                {bookingData.serviceLocation === "home" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Address
                      </label>
                      <textarea
                        value={bookingData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                        rows="3"
                        placeholder="Street, House No, Landmark..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        value={bookingData.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Pincode"
                        value={bookingData.pincode}
                        onChange={(e) =>
                          handleInputChange("pincode", e.target.value)
                        }
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: Personal Info (With Auto Account Check) */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                {isCustomerLoggedIn ? (
                  <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-green-800 flex items-center">
                    <span className="text-2xl mr-3">👤</span>
                    <div>
                      <p className="font-bold">
                        Logged in as {customerUser.fullName}
                      </p>
                      <p className="text-sm">We pre-filled your details.</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-800 text-sm">
                    👋 <strong>New Customer?</strong> We will automatically
                    create an account for you and email your login details!
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={bookingData.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={bookingData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={bookingData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Confirm */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fade-in text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CreditCard className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Ready to Book?
                </h3>
                <p className="text-gray-500">
                  Please review your details before confirming.
                </p>

                <div className="bg-gray-100 p-6 rounded-2xl text-left space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service</span>
                    <span className="font-semibold">{service.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date & Time</span>
                    <span className="font-semibold">
                      {format(bookingData.selectedDate, "MMM dd")} at{" "}
                      {bookingData.selectedTime}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-3 mt-3">
                    <span className="text-gray-800 font-bold">
                      Total Amount
                    </span>
                    <span className="text-pink-600 font-bold text-xl">
                      ₹{totalPrice}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="p-6 bg-white border-t border-gray-100 flex gap-4">
            {currentStep > 1 && (
              <button
                onClick={handlePrevStep}
                className="px-6 py-3 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-colors"
              >
                Back
              </button>
            )}

            {currentStep < 4 ? (
              <button
                onClick={handleNextStep}
                disabled={
                  (currentStep === 1 && !bookingData.selectedTime) ||
                  (currentStep === 2 &&
                    bookingData.serviceLocation === "home" &&
                    !bookingData.address) ||
                  (currentStep === 3 &&
                    (!bookingData.fullName || !bookingData.phone))
                }
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-pink-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleBookingSubmit}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-green-200 transition-all"
              >
                Confirm Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
