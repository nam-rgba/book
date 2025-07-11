import { estimateOrder } from "../../api/estimate";
import { orderStore } from "../../store/order.mobx";
import { cartStore } from "../../store/cart.mobx";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  FaShoppingCart,
  FaUser,
  FaMapMarkerAlt,
  FaCreditCard,
  FaCheckCircle,
  FaEdit,
  FaSpinner,
} from "react-icons/fa";
import { toVND } from "../../utils/toVND";

interface ReviewResponse {
  moneyProduct: number;
  shipFee: number;
  moneyFinal: number;
  moneyTax: number;
  moneyDiscount: number;
  totalPoints: number;
  moneyVat: number;
  paymentMethod: string;
  status: string;
}

interface CartConfirmContext {
  current: number;
  setCurrent: (step: number) => void;
}

const Review = observer(() => {
  const { current, setCurrent } = useOutletContext<CartConfirmContext>();
  const [money, setMoney] = useState<ReviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [checked, setChecked] = useState(false);

  // Helper function to map API response to local state

  useEffect(() => {
    const estimate = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Validate required data before making API call
        if (!orderStore.order || !cartStore.cartItems.length) {
          throw new Error("Missing order details or cart items");
        }

        const response = await estimateOrder({
          orderDetails: orderStore.order,
          cart: cartStore.cartItems,
        });

        console.log("Estimated Order:", response);

        // Validate response structure
        if (!response || typeof response !== "object") {
          throw new Error("Invalid response format");
        }

        // Use helper function to map response
        const {
          moneyProduct,
          shipFee,
          moneyFinal,
          moneyTax,
          moneyDiscount,
          totalPoints,
          moneyVat,
          paymentMethod,
          status,
        } = response.data;

        setMoney({
          moneyProduct,
          shipFee,
          moneyFinal,
          moneyTax,
          moneyDiscount,
          totalPoints,
          moneyVat,
          paymentMethod,
          status,
        });

        // add ship to order
        orderStore.order.total = moneyProduct + shipFee;
      } catch (error) {
        console.error("Error estimating order:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to estimate order";
        setError(errorMessage);
        setMoney(null);
      } finally {
        setIsLoading(false);
      }
    };

    estimate();
  }, []);

  console.log("");

  const handleEditStep = (step: number) => {
    setCurrent(step);
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    // Here you would typically call your place order API
    try {
      // await placeOrder(orderData);
      console.log("Order placed successfully!");
      // Navigate to success page or show success message
      setCurrent(3);
    } catch (error) {
      console.error("Error placing order:", error);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <FaSpinner className="animate-spin text-4xl text-java-500" />
        <span className="ml-3 text-lg">Loading order details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="text-red-600 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Error Loading Order
          </h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <FaCheckCircle className="mr-3 text-java-500" />
          Review Your Order
        </h2>
        <p className="text-gray-600">
          Please review all details before confirming your order
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <FaShoppingCart className="mr-3 text-java-500" />
                Order Items ({cartStore.cartItems.length})
              </h3>
              <button
                onClick={() => handleEditStep(0)}
                className="flex items-center text-java-500 hover:text-java-500 font-medium transition-colors"
              >
                <FaEdit className="mr-2" />
                Edit
              </button>
            </div>

            <div className="space-y-4">
              {cartStore.cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center bg-white rounded-lg p-4 shadow-sm"
                >
                  <div className="flex-shrink-0 w-16 h-16 mr-4">
                    <img
                      src={item.imageUrl || "/api/placeholder/64/64"}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md border"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-600">
                        Số lượng: {item.quantity}
                      </span>
                      <span className="font-semibold text-orange-500">
                        {toVND(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <FaUser className="mr-3 text-java-600" />
                Delivery Information
              </h3>
              <button
                onClick={() => handleEditStep(1)}
                className="flex items-center text-java-500 hover:text-java-600 font-medium transition-colors"
              >
                <FaEdit className="mr-2" />
                Edit
              </button>
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Receiver</p>
                  <p className="font-medium">
                    {orderStore.order.receiverName || "John Doe"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">
                    {orderStore.order.receiverPhone || "+84 123 456 789"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600 flex items-center">
                    <FaMapMarkerAlt className="mr-2" />
                    Delivery Address
                  </p>
                  <p className="font-medium">
                    {orderStore.order.receiverAddress ||
                      "123 Main St, District 1, Ho Chi Minh City"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <FaCreditCard className="mr-3 text-java-500" />
                Payment Method
              </h3>
              <button
                onClick={() => handleEditStep(2)}
                className="flex items-center text-java-500 hover:text-java-600 font-medium transition-colors"
              >
                <FaEdit className="mr-2" />
                Edit
              </button>
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center">
                <FaCreditCard className="text-gray-400 mr-3" />
                <div>
                  <p className="font-medium">
                    {money?.paymentMethod || "Credit Card"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {money?.paymentMethod === "COD"
                      ? "Cash on Delivery"
                      : "Online Payment"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Final Order Summary
            </h3>

            {money ? (
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{toVND(money.moneyProduct)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{toVND(money.shipFee)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>{toVND(money.moneyTax)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>VAT</span>
                  <span>{toVND(money.moneyVat)}</span>
                </div>

                {money.moneyDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{toVND(money.moneyDiscount)}</span>
                  </div>
                )}

                {money.totalPoints > 0 && (
                  <div className="flex justify-between text-orange-500">
                    <span>Points Earned</span>
                    <span>{money.totalPoints} pts</span>
                  </div>
                )}

                <hr className="my-4" />

                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-orange-500">{toVND(money.moneyFinal)}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <FaSpinner className="animate-spin text-2xl text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Calculating...</p>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="mb-6">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  className="mt-1 mr-3 text-amber-600"
                  required
                  onChange={(e) => setChecked(e.target.checked)}
                />
                <span className="text-sm text-gray-600">
                  I agree to the{" "}
                  <a href="#" className="text-java-600 hover:text-java-700">
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-java-600 hover:text-java-700">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || !money || !checked}
              className="w-full bg-java-400 hover:bg-java-500 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mb-4 flex items-center justify-center"
            >
              {isPlacingOrder ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Placing Order...
                </>
              ) : (
                <>
                  <FaCheckCircle className="mr-2" />
                  Place Order
                </>
              )}
            </button>

            <button
              onClick={() => handleEditStep(current - 1)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Back to Previous Step
            </button>


          </div>
        </div>
      </div>
    </div>
  );
});

export default Review;
