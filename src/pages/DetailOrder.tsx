import { useEffect, useState } from "react";
import { getOrderById } from "../api/order";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import type { Order } from "../interfaces/order";


const DetailOrder = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Order ID is required");
      setLoading(false);
      return;
    }
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const orderDetails = await getOrderById(id);
        console.log("Fetched order details:", orderDetails);
        setOrder(orderDetails.data ); 
      } catch (error) {
        setError("Error fetching order details: " + (error instanceof Error ? error.message : "Unknown error"));
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4 max-w-4xl">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Loading order details...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 text-xl mb-2">⚠️ Error</div>
            <p className="text-red-700">{error}</p>
          </div>
        ) : order ? (
          <div className="space-y-6">
            {/* Order Header */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Order #{order?.id}
                  </h1>
                  <p className="text-gray-600">Order ID: {order.id}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium capitalize ${
                    order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center md:text-left">
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-green-600">
                    {order.moneyFinal}₫
                  </p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {order.paymentMethod}
                  </p>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-sm text-gray-600">Estimated Delivery</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {order.estimatedDeliveryAt ? new Date(1000*Number(order.estimatedDeliveryAt)).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Delivery Information
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  <div>
                    <span className="font-medium text-gray-700">Receiver: </span>
                    <span className="text-gray-900">{order.receiverName}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Phone: </span>
                    <span className="text-gray-900">{order.receiverPhone}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Address: </span>
                    <span className="text-gray-900">{order.receiverAddress}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Order Items
              </h2>
              <div className="space-y-4">
                {order.details && order.details.length > 0 ? (
                  order.details.map((product, index) => (
                    <div key={product.id || index} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0 mr-4">
                        <img 
                          src={product.product.image || '/placeholder-image.jpg'} 
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-image.jpg';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {product.name}
                        </h3>
                        <div className="flex items-center mt-1 text-sm text-gray-600">
                          <span>Quantity: {product.quantity}</span>
                          <span className="mx-2">•</span>
                          <span>Price: {product.finalPrice.toLocaleString()}₫</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          {(product.finalPrice * product.quantity).toLocaleString()}₫
                        </div>
                        <div className="text-sm text-gray-500">
                          Total
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p>No products found in this order.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.print()}
                  className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Order
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="flex items-center justify-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Go Back
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Order not found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailOrder;