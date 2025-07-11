import { createOrder } from "../../api/order" 
import { observer } from "mobx-react-lite"
import { orderStore } from "../../store/order.mobx";
import { cartStore } from "../../store/cart.mobx";
import { useEffect, useState, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaSpinner, FaHome, FaShoppingBag, FaCopy, FaShare } from "react-icons/fa";
import { toVND } from "../../utils/toVND";
import SuccessAnimation from "../../components/SuccessAnimation";

interface CartConfirmContext {
  current: number;
  setCurrent: (step: number) => void;
}

interface OrderData {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  estimatedDelivery: string;
  paymentMethod: string;
}

const Checkout = observer(() => {
    const { current, setCurrent } = useOutletContext<CartConfirmContext>();
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const hasCreatedOrder = useRef(false);

    useEffect(() => {
        const createOrderAsync = async () => {
            // Prevent duplicate API calls
            if (hasCreatedOrder.current) {
                return;
            }
            
            try {
                hasCreatedOrder.current = true;
                setIsLoading(true);
                setError(null);
                
                const orderDetails = orderStore.order;
                const cartItems = cartStore.cartItems;

                // Create order
                const response = await createOrder({ orderDetails, cart: cartItems });
                console.log("Order created successfully:", response);
                
                // Transform response data to our interface
                const transformedData: OrderData = {
                    id: response.data?.id || Math.random().toString(36).substr(2, 9),
                    orderNumber: response.data?.code || `BMD${Date.now()}`,
                    total: response.data?.moneyFinal || cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                    status: response.data?.status || 'confirmed',
                    estimatedDelivery: response.data?.estimatedDelivery || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                    paymentMethod: response.data?.paymentMethod || orderDetails.paymentMethod || 'Credit Card'
                };
                
                setOrderData(transformedData);

                // Reset cart after successful order creation
                cartStore.clearCart();
                orderStore.resetOrder();
                
            } catch (error) {
                console.error("Error creating order:", error);
                setError(error instanceof Error ? error.message : 'Failed to create order');
                hasCreatedOrder.current = false; // Reset flag on error to allow retry
            } finally {
                setIsLoading(false);
            }
        };

        createOrderAsync();
    }, []);

    const handleCopyOrderNumber = () => {
        if (orderData?.orderNumber) {
            navigator.clipboard.writeText(orderData.orderNumber);
        }
    };

    const handleGoHome = () => {
        navigate('/');
    };

    const handleContinueShopping = () => {
        navigate('/products');
    };



    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-6xl text-blue-600 mb-4 mx-auto" />
                    <h2 className="text-2xl font-semibold text-gray-700 mb-2">Processing Your Order</h2>
                    <p className="text-gray-500">Please wait while we confirm your order...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow-lg">
                    <div className="text-red-500 text-6xl mb-4">❌</div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Order Failed</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => setCurrent(current - 1)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                {/* Success Animation and Header */}
                <div className="text-center mb-12">
                    <SuccessAnimation size={120} duration={1} className="mb-6" />
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Order Confirmed! 🎉
                    </h1>
                    <p className="text-xl text-gray-600 mb-2">
                        Thank you for your purchase
                    </p>
                    <p className="text-gray-500">
                        We've received your order and will process it shortly
                    </p>
                </div>

                {/* Order Details Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <div className="border-b border-gray-200 pb-6 mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Order Details</h2>
                        
                        {/* Order Number */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Order Number</p>
                                    <p className="text-xl font-mono font-semibold text-gray-900">
                                        {orderData?.orderNumber}
                                    </p>
                                </div>
                                <button
                                    onClick={handleCopyOrderNumber}
                                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    <FaCopy />
                                    <span className="text-sm">Copy</span>
                                </button>
                            </div>
                        </div>

                        {/* Order Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center md:text-left">
                                <p className="text-sm text-gray-600">Total Amount</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {orderData ? toVND(orderData.total) : 'N/A'}
                                </p>
                            </div>
                            <div className="text-center md:text-left">
                                <p className="text-sm text-gray-600">Payment Method</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {orderData?.paymentMethod}
                                </p>
                            </div>
                            <div className="text-center md:text-left">
                                <p className="text-sm text-gray-600">Estimated Delivery</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {orderData?.estimatedDelivery}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full">
                            <FaCheckCircle className="mr-2" />
                            <span className="font-medium capitalize">{orderData?.status}</span>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-blue-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Next?</h3>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                                You'll receive an email confirmation shortly
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                                We'll notify you when your order ships
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                                Track your order in your account dashboard
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">

                    
                    <button
                        onClick={handleContinueShopping}
                        className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        <FaShoppingBag />
                        <span>Continue Shopping</span>
                    </button>
                    
                    <button
                        onClick={handleGoHome}
                        className="flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                        <FaHome />
                        <span>Go Home</span>
                    </button>
                </div>

                {/* Social Share */}
                <div className="text-center mt-8">
                    <p className="text-gray-600 mb-4">Share your purchase</p>
                    <button className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
                        <FaShare />
                        <span>Share on Social Media</span>
                    </button>
                </div>
            </div>
        </div>
    );
})

export default Checkout;