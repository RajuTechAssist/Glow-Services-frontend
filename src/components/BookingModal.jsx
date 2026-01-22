import React, { useState, useEffect } from 'react';
import { 
  X, Calendar as CalendarIcon, Clock, MapPin, CreditCard, 
  ChevronRight, ChevronLeft, Map 
} from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import config from '../config';
import { useCustomerAuth } from '../context/CustomerAuthContext';

// ✅ NEW: Import Location Library
import { State, City } from 'country-state-city';

// Allowed cities for states OTHER than Delhi
const NCR_CITIES = [
  "Noida", "Greater Noida", "Ghaziabad", "Gurgaon", "Gurugram", "Faridabad", 
  "Sonipat", "Panipat", "Meerut", "Rohtak", "Gautam Buddha Nagar" // Add other NCR cities here
];

const BookingModal = ({ isOpen, onClose, service, quantity = 1, onSuccess }) => {
  const { customerUser, isCustomerLoggedIn } = useCustomerAuth();

  const [bookingData, setBookingData] = useState({
    selectedDate: new Date(),
    selectedTime: '',
    serviceLocation: 'home',
    address: '',
    country: 'IN', // ISO Code for India
    stateCode: '', // ISO Code for State (e.g., 'DL', 'UP')
    city: '',
    pincode: '',
    fullName: '',
    phone: '',
    email: '',
    specialInstructions: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  
  // Dynamic Lists
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  
  // State for Regret Popup
  const [showRegretModal, setShowRegretModal] = useState(false);

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
  ];

  // 1. Load States on Mount
  useEffect(() => {
    const indiaStates = State.getStatesOfCountry('IN');
    setStates(indiaStates);
  }, []);

  // 2. Auto-fill user details if logged in
  useEffect(() => {
    if (isOpen && isCustomerLoggedIn && customerUser) {
      setBookingData(prev => ({
        ...prev,
        fullName: customerUser.fullName || '',
        email: customerUser.email || '',
        phone: customerUser.phone || '',
        address: customerUser.address || '',
        city: customerUser.city || '',
        pincode: customerUser.pincode || ''
        // Note: Matching state codes automatically from a saved string is complex, 
        // so we let them select state/city fresh for bookings to ensure accuracy.
      }));
    }
  }, [isOpen, isCustomerLoggedIn, customerUser]);

  // 3. Handle Input Changes
  const handleInputChange = (field, value) => {
    setBookingData(prev => ({ ...prev, [field]: value }));

    // If State Changes -> Fetch Cities for that State
    if (field === 'stateCode') {
      const stateCities = City.getCitiesOfState('IN', value);
      setCities(stateCities);
      setBookingData(prev => ({ ...prev, stateCode: value, city: '' })); // Reset city
    }

    // If City Changes -> Check Serviceability
    if (field === 'city') {
      // ✅ FIX: Logic to allow ALL Delhi locations
      const isDelhi = bookingData.stateCode === 'DL'; 
      const isAllowedNCR = NCR_CITIES.includes(value);

      if (!isDelhi && !isAllowedNCR) {
        setShowRegretModal(true); // Show Popup for non-serviceable areas
      }
    }
  };

  const handleNextStep = () => {
    // Validation for Address Step
    if (currentStep === 2 && bookingData.serviceLocation === 'home') {
       if (!bookingData.stateCode || !bookingData.city || !bookingData.address) {
         alert("Please complete your address details.");
         return;
       }

       // ✅ FIX: Re-check serviceability on Next
       const isDelhi = bookingData.stateCode === 'DL';
       const isAllowedNCR = NCR_CITIES.includes(bookingData.city);

       if (!isDelhi && !isAllowedNCR) {
          setShowRegretModal(true);
          return;
       }
    }
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleBookingSubmit = async () => {
    try {
      // Get State Name from Code for readable data
      const selectedStateObj = State.getStateByCodeAndCountry(bookingData.stateCode, 'IN');
      const stateName = selectedStateObj ? selectedStateObj.name : bookingData.stateCode;

      const payload = {
        serviceId: service.id,
        quantity: quantity,
        selectedDate: format(bookingData.selectedDate, 'yyyy-MM-dd'),
        selectedTime: bookingData.selectedTime,
        serviceLocation: bookingData.serviceLocation,
        address: `${bookingData.address}, ${bookingData.city}, ${stateName}`,
        city: bookingData.city,
        pincode: bookingData.pincode,
        fullName: bookingData.fullName,
        email: bookingData.email,
        phone: bookingData.phone,
        specialInstructions: bookingData.specialInstructions
      };

      const response = await fetch(`${config.BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        alert(`🎉 Booking Confirmed! \nWe sent the details to ${bookingData.email}`);
        if (onSuccess) onSuccess();
        onClose();
      } else {
        alert(`Booking Failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Booking Error:", error);
      alert("Failed to connect to server.");
    }
  };

  const tileDisabled = ({ date }) => date < new Date().setHours(0, 0, 0, 0);

  if (!isOpen) return null;
  const totalPrice = service.price * quantity;

  return (
    <>
      {/* --- MAIN BOOKING MODAL --- */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[2000] p-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl transition-colors duration-300">
          
          {/* Left Sidebar Summary */}
          <div className="hidden md:block w-1/3 bg-gradient-to-br from-pink-500 to-purple-600 p-8 text-white relative">
            <div className="absolute top-0 left-0 w-full h-full bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Booking Summary</h3>
                <p className="text-pink-100 text-sm">Complete these steps to schedule your glow up!</p>
                <div className="mt-8 space-y-6">
                   <div className="flex items-start gap-3">
                      <div className="p-2 bg-white/20 rounded-lg"><CalendarIcon className="w-5 h-5" /></div>
                      <div>
                        <p className="text-xs text-pink-200 font-bold">Date</p>
                        <p className="font-medium">{format(bookingData.selectedDate, 'EEE, MMM dd, yyyy')}</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-3">
                      <div className="p-2 bg-white/20 rounded-lg"><MapPin className="w-5 h-5" /></div>
                      <div>
                        <p className="text-xs text-pink-200 font-bold">Location</p>
                        <p className="font-medium text-sm">{bookingData.city || 'Select City'}</p>
                      </div>
                   </div>
                </div>
              </div>
              <div className="mt-auto">
                 <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                   <div className="bg-white h-full transition-all duration-500" style={{ width: `${(currentStep / 4) * 100}%` }} />
                 </div>
                 <p className="text-right text-xs mt-2">Step {currentStep} of 4</p>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1 flex flex-col h-full max-h-[90vh] overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="bg-white dark:bg-gray-800 p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 z-20 transition-colors duration-300">
               <div>
                 <h2 className="text-xl font-bold text-gray-800 dark:text-white">Book {service.name}</h2>
                 <p className="text-sm text-gray-500 dark:text-gray-400">Step {currentStep}/4</p>
               </div>
               <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-300"><X className="w-6 h-6" /></button>
            </div>

            <div className="p-6 md:p-8 flex-1">
              
              {/* Step 1: Date & Time */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                    <div className="calendar-wrapper flex justify-center booking-calendar-dark">
                      <style jsx>{`
                        .booking-calendar-dark .react-calendar {
                          background-color: transparent !important;
                          border: none !important;
                          font-family: inherit;
                        }
                        :global(.dark) .booking-calendar-dark .react-calendar__tile {
                          color: #e5e7eb;
                        }
                        :global(.dark) .booking-calendar-dark .react-calendar__tile:disabled {
                          background-color: transparent;
                          color: #4b5563;
                        }
                        :global(.dark) .booking-calendar-dark .react-calendar__tile:enabled:hover,
                        :global(.dark) .booking-calendar-dark .react-calendar__tile:enabled:focus {
                          background-color: #374151;
                          border-radius: 0.5rem;
                        }
                        :global(.dark) .booking-calendar-dark .react-calendar__navigation button {
                          color: #e5e7eb;
                        }
                        :global(.dark) .booking-calendar-dark .react-calendar__navigation button:disabled {
                          background-color: transparent;
                        }
                        :global(.dark) .booking-calendar-dark .react-calendar__navigation button:enabled:hover,
                        :global(.dark) .booking-calendar-dark .react-calendar__navigation button:enabled:focus {
                          background-color: #374151;
                        }
                        :global(.dark) .booking-calendar-dark .react-calendar__month-view__weekdays__weekday {
                          color: #9ca3af;
                        }
                      `}</style>
                      <Calendar 
                        onChange={(date) => handleInputChange('selectedDate', date)} 
                        value={bookingData.selectedDate}
                        minDate={new Date()}
                        tileDisabled={tileDisabled}
                        className="border-none w-full"
                        prevLabel={<ChevronLeft className="w-5 h-5 text-pink-500" />}
                        nextLabel={<ChevronRight className="w-5 h-5 text-pink-500" />}
                      />
                    </div>
                  </div>
                  <div>
                     <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">TIME SLOT</h3>
                     <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => handleInputChange('selectedTime', time)}
                            className={`py-3 px-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
                              bookingData.selectedTime === time
                                ? 'bg-pink-500 border-pink-500 text-white shadow-lg transform scale-105'
                                : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-200 hover:border-pink-300 dark:hover:border-pink-500'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                     </div>
                  </div>
                </div>
              )}

              {/* Step 2: Location (DYNAMIC) */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                   <div className="grid grid-cols-2 gap-4 mb-6">
                      <button onClick={() => handleInputChange('serviceLocation', 'home')} className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${bookingData.serviceLocation === 'home' ? 'border-pink-500 bg-pink-50 text-pink-700 bg-pink-50 dark:bg-pink-900/20' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                        <span className="text-2xl mb-1">🏠</span><span className="font-bold text-sm">Home Service</span>
                      </button>
                      <button onClick={() => handleInputChange('serviceLocation', 'salon')} className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${bookingData.serviceLocation === 'salon' ? 'border-pink-500 bg-pink-50 text-pink-700 bg-pink-50 dark:bg-pink-900/20' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                        <span className="text-2xl mb-1">💇‍♀️</span><span className="font-bold text-sm">Visit Salon</span>
                      </button>
                   </div>

                   {bookingData.serviceLocation === 'home' && (
                     <div className="space-y-4">
                       
                       {/* Country & State */}
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Country</label>
                            <select className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-gray-300" disabled>
                               <option>India</option>
                            </select>
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">State</label>
                            <select 
                               className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none bg-white dark:bg-gray-700 dark:text-white"
                               value={bookingData.stateCode}
                               onChange={(e) => handleInputChange('stateCode', e.target.value)}
                            >
                               <option value="">Select State</option>
                               {states.map((state) => (
                                 <option key={state.isoCode} value={state.isoCode}>{state.name}</option>
                               ))}
                            </select>
                         </div>
                       </div>

                       {/* City Dropdown */}
                       <div>
                          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">City</label>
                          <select 
                             className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none disabled:bg-gray-50 dark:disabled:bg-gray-800 bg-white dark:bg-gray-700 dark:text-white"
                             value={bookingData.city}
                             onChange={(e) => handleInputChange('city', e.target.value)}
                             disabled={!bookingData.stateCode}
                          >
                             <option value="">{bookingData.stateCode ? "Select City" : "Select State First"}</option>
                             {cities.map((city) => (
                               <option key={city.name} value={city.name}>{city.name}</option>
                             ))}
                          </select>
                       </div>

                       <div>
                         <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Full Address</label>
                         <textarea 
                            value={bookingData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none bg-white dark:bg-gray-700 dark:text-white"
                            rows="2"
                            placeholder="House No, Street, Landmark"
                         />
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Pincode</label>
                         <input 
                            type="text" 
                            value={bookingData.pincode}
                            onChange={(e) => handleInputChange('pincode', e.target.value)}
                            className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none bg-white dark:bg-gray-700 dark:text-white"
                            placeholder="110001"
                         />
                       </div>
                     </div>
                   )}
                </div>
              )}

              {/* Step 3: Personal Info */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  {!isCustomerLoggedIn && (
                     <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl border border-blue-100 dark:border-blue-800 text-blue-800 dark:text-blue-200 text-sm">
                        ℹ️ <strong>Guest Checkout:</strong> We will create an account for you automatically!
                     </div>
                  )}
                  <div className="space-y-4">
                    <input 
                      type="text" 
                      placeholder="Full Name"
                      value={bookingData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none bg-white dark:bg-gray-700 dark:text-white"
                    />
                    <input 
                      type="tel" 
                      placeholder="Phone Number"
                      value={bookingData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none bg-white dark:bg-gray-700 dark:text-white"
                    />
                    <input 
                      type="email" 
                      placeholder="Email Address"
                      value={bookingData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none bg-white dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Confirm */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-fade-in text-center">
                   <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                      <CreditCard className="w-10 h-10 text-green-600 dark:text-green-400" />
                   </div>
                   <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Ready to Book?</h3>
                   <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-2xl text-left space-y-3">
                      <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-300">Service</span><span className="font-semibold dark:text-white">{service.name}</span></div>
                      <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-300">Date</span><span className="font-semibold dark:text-white">{format(bookingData.selectedDate, 'MMM dd')}</span></div>
                      <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-3 mt-3"><span className="text-gray-800 dark:text-white font-bold">Total</span><span className="text-pink-600 dark:text-pink-400 font-bold text-xl">₹{totalPrice}</span></div>
                   </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex gap-4 transition-colors duration-300">
               {currentStep > 1 && (
                 <button onClick={handlePrevStep} className="px-6 py-3 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl">Back</button>
               )}
               {currentStep < 4 ? (
                 <button 
                   onClick={handleNextStep}
                   disabled={(currentStep === 1 && !bookingData.selectedTime) || (currentStep === 2 && bookingData.serviceLocation === 'home' && !bookingData.city)}
                   className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-bold shadow-lg disabled:opacity-50"
                 >
                   Continue
                 </button>
               ) : (
                 <button onClick={handleBookingSubmit} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg">
                   Confirm Booking
                 </button>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* --- REGRET POPUP --- */}
      {showRegretModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[3000] p-4">
           <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl animate-bounce-in">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Map className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">We're not there yet! 😔</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Currently, Glow Services is only available in <strong>Delhi NCR</strong>. We are expanding soon to other cities!
              </p>
              <button 
                onClick={() => { setShowRegretModal(false); setBookingData(prev => ({...prev, city: ''})); }}
                className="w-full py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-600 transition-all"
              >
                Okay, I understand
              </button>
           </div>
        </div>
      )}
    </>
  );
};

export default BookingModal;