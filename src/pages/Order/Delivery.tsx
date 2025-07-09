import { toVND } from "../../utils/toVND";
import { cartStore } from "../../store/cart.mobx";
import { orderStore } from "../../store/order.mobx";
import { observer } from "mobx-react-lite";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Select, Alert } from "antd";
import { FaUser, FaPhone, FaMapMarkerAlt, FaCity } from "react-icons/fa";

import { getAllCities, getAllDistricts, getAllWards } from "../../api/address";

interface CartConfirmContext {
  current: number;
  setCurrent: (step: number) => void;
}

const Delivery = observer(() => {
  const { current, setCurrent } = useOutletContext<CartConfirmContext>();
  const navigate = useNavigate();

  

  // Form state

  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [selectedWard, setSelectedWard] = useState<number | null>(null);

  const [alert, setAlert] = useState<boolean>(false);
  const handleProceedToPayment = () => {
    // Reset alert state
    setAlert(false);
    // Validate form fields
    if (
      !orderStore.order.receiverName ||
      !orderStore.order.receiverPhone ||
      !orderStore.order.receiverAddress ||
      !orderStore.order.cityId ||
      !orderStore.order.districtId ||
      !orderStore.order.wardId 
    ) {
      setAlert(true);
      return;
    }
    setCurrent(current + 1); // Go to payment step
  };

  // Calculate totals
  const subtotal = cartStore.cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const total = subtotal;

  const handleBackToProduct = () => {
    navigate("/products"); // Navigate back to cart
  };

  /* Call API to get city, district, and ward start--------------------------------------------------------- */

  const [cities, setCities] = useState<{ id: number; code: string; name: string }[]>([]);
  const [districts, setDistricts] = useState<{id:number; code: string; name: string }[]>(
    []
  );
  const [wards, setWards] = useState<{ id:number; code: string; name: string }[]>([]);

  const fetchCities = async () => {
    try {
      const response = await getAllCities();
      setCities(response.data.cities);
      console.log("Cities fetched:", response.data.cities);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const fetchDistricts = async (cityCode: number) => {
    try {
      const response = await getAllDistricts(cityCode);
      console.log("Districts fetched:", response);
      setDistricts(response.data.districts);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };
  const fetchWards = async (districtCode: number) => {
    try {
      const response = await getAllWards(districtCode);
      setWards(response.data.wards);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  // Fetch cities on component mount
  useEffect(() => {
    fetchCities();
  }, []);

  // Fetch districts when city changes
  useEffect(() => {
    if (orderStore.order.cityId && selectedCity !== null) {
      console.log("Selected city ID:", orderStore.order.cityId);
      fetchDistricts(selectedCity);
    }
  }, [selectedCity]);

  // Fetch wards when district changes
  useEffect(() => {
    if (orderStore.order.districtId && selectedDistrict !== null) {
      console.log("Selected district ID:", orderStore.order.districtId);
      fetchWards(selectedDistrict);
    }
  }, [selectedDistrict]);

  /* Call API to get city, district, and ward end------------------------------------------------------- */

 

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* header */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Delivery Information</h2>
        <p className="text-gray-700 mb-6">
          Please enter your delivery address and contact details to proceed with
          your order.
        </p>
      </div>

      {/* main */}
      <div className="w-full flex flex-row justify-around">
        {" "}
        {/* information */}
        <div className="lg:col-span-2 w-full lg:w-3/4">
          <div className="bg-white border border-gray-200 rounded-lg p-6 mr-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <FaUser className="mr-3 text-blue-600" />
              Receiver Information
            </h3>

            <form className="space-y-6">
              {/* Receiver Name */}
              <div>
                <label
                  htmlFor="receiverName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Receiver Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="receiverName"
                    name="receiverName"
                    value={orderStore.order.receiverName}
                    onChange={(e) =>
                      orderStore.setOrder({ receiverName: e.target.value })
                    }
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter receiver's full name"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={orderStore.order.receiverPhone}
                    onChange={(e) =>
                      orderStore.setOrder({ receiverPhone: e.target.value })
                    }
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Street Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={orderStore.order.receiverAddress}
                    onChange={(e) =>
                      orderStore.setOrder({ receiverAddress: e.target.value })
                    }
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter street address"
                    required
                  />
                </div>
              </div>

              {/* City and District */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* City */}
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    City/Province <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCity className="text-gray-400" />
                    </div>
                    <Select
                      id="city"
                      // value={orderStore.order.cityId}
                      onChange={(value) => {
                        orderStore.setOrder({ cityId: value });
                        const code  = parseInt(cities.find((city) => city.id === value)?.code ?? "59") ;
                        console.log("Selected city code:", code);
                        setSelectedCity(code); // Update local state 
                      }}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Select city/province"
                      options={cities.map((city) => ({
                        value: city.id,
                        label: city.name,
                      }))}
                    >
                      {cities.map((city) => (
                        <Select.Option
                          key={city.id}
                          value={city.id}
                        >
                          {city.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </div>

                {/* District */}
                <div>
                  <label
                    htmlFor="district"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    District <span className="text-red-500">*</span>
                  </label>
                  {
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaCity className="text-gray-400" />
                      </div>
                      <Select
                        id="district"
                        
                        onChange={(value) => {
                          orderStore.setOrder({ districtId: value });
                          const code = parseInt(districts.find((district) => district.id === value)?.code ?? "1");
                          setSelectedDistrict(code); // Update local state
                        }}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Select district"
                        options={districts.map((district) => ({
                          value: district.id,
                          label: district.name,
                        }))}
                      >
                        {districts.map((district) => (
                          <Select.Option
                            key={district.id}
                            value={district.id}
                          >
                            {district.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  }
                </div>
              </div>

              {/* Ward and ZIP Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Ward */}
                <div>
                  <label
                    htmlFor="district"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Warrd <span className="text-red-500">*</span>
                  </label>
                  {
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaCity className="text-gray-400" />
                      </div>
                      <Select
                        id="ward"
                        
                        onChange={(value) => {
                          orderStore.setOrder({ wardId: value });
                          const code = parseInt(wards.find((ward) => ward.id === value)?.code ?? "1");
                          setSelectedWard(code); // Update local state
                          console.log("Selected ward ID:", selectedWard);
                        }}
                        className="w-full px-4 pl-10 pr-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Select district"
                        options={wards.map((ward) => ({
                          value: ward.id,
                          label: ward.name,
                        }))}
                      >
                        {wards.map((ward) => (
                          <Select.Option
                            key={ward.id}
                            value={ward.id}
                          >
                            {ward.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  }
                </div>
              </div>

              {/* Notes */}
              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Delivery Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={orderStore.order.note}
                  onChange={(e) =>
                    orderStore.setOrder({ note: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Any special instructions for delivery..."
                />
              </div>
            </form>
          </div>
        </div>
        {/* payment */}
        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Order Summary
            </h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartStore.cartItems.length} items)</span>
                <span>{toVND(subtotal)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Discount</span>
                <span className="text-red-600">{toVND(0)}</span>
              </div>

              <hr className="my-4" />

              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span className="text-blue-600">{toVND(total)}</span>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handleProceedToPayment}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mb-4"
            >
              Review your order
            </button>

            <button
              onClick={handleBackToProduct}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 mb-4 font-medium py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Explore more products
            </button>

            {/* Security Badge */}
            {alert && (
              <Alert
                message="Please fill in all required fields."
                type="error"
                showIcon
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default Delivery;
