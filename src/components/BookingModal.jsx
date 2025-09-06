import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, User, Phone, Mail, CreditCard } from 'lucide-react';

const BookingModal = ({ isOpen, onClose, service, quantity = 1 }) => {
  const [bookingData, setBookingData] = useState({
    // Date & Time
    selectedDate: '',
    selectedTime: '',
    
    // Location
    serviceLocation: 'home', // 'home' or 'salon'
    address: '',
    city: '',
    pincode: '',
    
    // Customer Details
    fullName: '',
    phone: '',
    email: '',
    
    // Additional
    specialInstructions: '',
    paymentMethod: 'cod' // 'cod', 'online'
  });

  const [currentStep, setCurrentStep] = useState(1);

  // Available time slots
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
  ];

  // Get available dates (next 30 days, excluding Sundays)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip Sundays (day 0)
      if (date.getDay() !== 0) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    
    return dates;
  };

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBookingSubmit = () => {
    // Here you would typically send the booking data to your backend
    const bookingDetails = {
      service: service,
      quantity: quantity,
      totalPrice: service.price * quantity,
      bookingData: bookingData
    };
    
    console.log('Booking Details:', bookingDetails);
    
    // For now, just show alert
    alert(`Booking confirmed! 
    
Service: ${service.name}
Date: ${bookingData.selectedDate}
Time: ${bookingData.selectedTime}
Location: ${bookingData.serviceLocation === 'home' ? 'Home Service' : 'Salon Visit'}
Total: ₹${service.price * quantity}

We will call you at ${bookingData.phone} to confirm the booking.`);
    
    onClose();
  };

  if (!isOpen) return null;

  const totalPrice = service.price * quantity;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Book Service</h3>
              <p className="text-gray-600">{service.name}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Step Indicator */}
          <div className="flex items-center mt-4 space-x-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-pink-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 4 && <div className={`w-8 h-1 mx-2 ${
                  step < currentStep ? 'bg-pink-500' : 'bg-gray-200'
                }`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Date & Time</span>
            <span>Location</span>
            <span>Details</span>
            <span>Confirm</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Date & Time Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <Calendar className="h-12 w-12 text-pink-500 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-gray-900 mb-2">Select Date & Time</h4>
                <p className="text-gray-600">Choose your preferred appointment slot</p>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Date</label>
                <div className="grid grid-cols-3 gap-3 max-h-40 overflow-y-auto">
                  {getAvailableDates().slice(0, 15).map((date) => {
                    const dateObj = new Date(date);
                    const isSelected = bookingData.selectedDate === date;
                    return (
                      <button
                        key={date}
                        onClick={() => handleInputChange('selectedDate', date)}
                        className={`p-3 rounded-lg border text-sm transition-all duration-200 ${
                          isSelected
                            ? 'border-pink-500 bg-pink-50 text-pink-700'
                            : 'border-gray-200 hover:border-pink-300 hover:bg-pink-25'
                        }`}
                      >
                        <div className="font-medium">
                          {dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="text-xs">
                          {dateObj.getDate()}/{dateObj.getMonth() + 1}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Time</label>
                <div className="grid grid-cols-3 gap-3">
                  {timeSlots.map((time) => {
                    const isSelected = bookingData.selectedTime === time;
                    return (
                      <button
                        key={time}
                        onClick={() => handleInputChange('selectedTime', time)}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                          isSelected
                            ? 'border-pink-500 bg-pink-50 text-pink-700'
                            : 'border-gray-200 hover:border-pink-300 hover:bg-pink-25'
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location Selection */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-pink-500 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-gray-900 mb-2">Service Location</h4>
                <p className="text-gray-600">Where would you like the service?</p>
              </div>

              {/* Location Type */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleInputChange('serviceLocation', 'home')}
                  className={`p-6 rounded-xl border-2 text-center transition-all duration-200 ${
                    bookingData.serviceLocation === 'home'
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-pink-300'
                  }`}
                >
                  <div className="text-2xl mb-2">🏠</div>
                  <div className="font-medium">Home Service</div>
                  <div className="text-sm text-gray-600">We come to you</div>
                </button>

                <button
                  onClick={() => handleInputChange('serviceLocation', 'salon')}
                  className={`p-6 rounded-xl border-2 text-center transition-all duration-200 ${
                    bookingData.serviceLocation === 'salon'
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-pink-300'
                  }`}
                >
                  <div className="text-2xl mb-2">🏪</div>
                  <div className="font-medium">Visit Salon</div>
                  <div className="text-sm text-gray-600">Come to our salon</div>
                </button>
              </div>

              {/* Address Form (only for home service) */}
              {bookingData.serviceLocation === 'home' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
                    <textarea
                      value={bookingData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter your complete address..."
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        value={bookingData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="City"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                      <input
                        type="text"
                        value={bookingData.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        placeholder="Pincode"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Customer Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <User className="h-12 w-12 text-pink-500 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-gray-900 mb-2">Your Details</h4>
                <p className="text-gray-600">We need these to confirm your booking</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={bookingData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={bookingData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={bookingData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions (Optional)</label>
                  <textarea
                    value={bookingData.specialInstructions}
                    onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                    placeholder="Any specific requirements or instructions..."
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleInputChange('paymentMethod', 'cod')}
                      className={`p-4 rounded-lg border-2 text-center transition-all duration-200 ${
                        bookingData.paymentMethod === 'cod'
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-pink-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">💵</div>
                      <div className="font-medium">Cash on Delivery</div>
                      <div className="text-sm text-gray-600">Pay after service</div>
                    </button>

                    <button
                      onClick={() => handleInputChange('paymentMethod', 'online')}
                      className={`p-4 rounded-lg border-2 text-center transition-all duration-200 ${
                        bookingData.paymentMethod === 'online'
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-pink-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">💳</div>
                      <div className="font-medium">Online Payment</div>
                      <div className="text-sm text-gray-600">Pay now securely</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <CreditCard className="h-12 w-12 text-pink-500 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-gray-900 mb-2">Confirm Booking</h4>
                <p className="text-gray-600">Please review your booking details</p>
              </div>

              {/* Booking Summary */}
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium">{service.name}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {bookingData.selectedDate && new Date(bookingData.selectedDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{bookingData.selectedTime}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">
                    {bookingData.serviceLocation === 'home' ? 'Home Service' : 'Salon Visit'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{service.duration}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium">{quantity}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer:</span>
                  <span className="font-medium">{bookingData.fullName}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{bookingData.phone}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment:</span>
                  <span className="font-medium">
                    {bookingData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                  </span>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-pink-600">₹{totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
                <p className="mb-2"><strong>Please Note:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Our team will call you 30 minutes before the appointment</li>
                  <li>Cancellation allowed up to 2 hours before the appointment</li>
                  <li>For home services, please ensure someone is available at the address</li>
                  <li>All tools and products are sanitized and professional grade</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-3xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Total Amount</div>
              <div className="text-2xl font-bold text-pink-600">₹{totalPrice}</div>
            </div>
            
            <div className="flex space-x-3">
              {currentStep > 1 && (
                <button
                  onClick={handlePrevStep}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors duration-200"
                >
                  Previous
                </button>
              )}
              
              {currentStep < 4 ? (
                <button
                  onClick={handleNextStep}
                  disabled={
                    (currentStep === 1 && (!bookingData.selectedDate || !bookingData.selectedTime)) ||
                    (currentStep === 2 && bookingData.serviceLocation === 'home' && (!bookingData.address || !bookingData.city || !bookingData.pincode)) ||
                    (currentStep === 3 && (!bookingData.fullName || !bookingData.phone || !bookingData.email))
                  }
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-xl hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next Step
                </button>
              ) : (
                <button
                  onClick={handleBookingSubmit}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
                >
                  Confirm Booking
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
