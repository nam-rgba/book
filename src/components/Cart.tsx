import { Link } from "react-router-dom";
import { FaPlus, FaMinus, FaTrash, FaShoppingBag } from "react-icons/fa";
import type { CartItem } from "../store/cart.mobx";
import { observer } from "mobx-react-lite";

interface CartDropdownProps {
  cartItems: CartItem[];
  isVisible: boolean;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  className?: string;
}

const CartDropdown = observer(
     ({cartItems,isVisible,onUpdateQuantity,onRemoveItem,className = ""}: CartDropdownProps) => {
  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Format price to VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      onRemoveItem(id);
    } else {
      onUpdateQuantity(id, newQuantity);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`absolute right-0 top-6 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 ${className}`}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FaShoppingBag className="mr-2 text-blue-500" />
          Shopping Cart ({cartItems.length})
        </h3>
      </div>

      {/* Cart Items */}
      <div className="max-h-96 overflow-y-auto">
        {cartItems.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <FaShoppingBag className="mx-auto text-4xl text-gray-300 mb-3" />
            <p className="text-gray-500">Your cart is empty</p>
            <Link
              to="/products"
              className="mt-3 inline-block text-blue-500 hover:text-blue-600 font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="px-4 py-2">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center py-3 border-b border-gray-100 last:border-b-0"
              >
                {/* Product Image */}
                <div className="flex-shrink-0 w-16 h-16 mr-3">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-md border"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {item.name}
                  </h4>

                  <div className="flex items-center justify-between mt-2">
                    {/* Price */}
                    <span className="text-sm font-semibold text-blue-600">
                      {formatPrice(item.price)}
                    </span>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                      >
                        <FaMinus size={10} />
                      </button>

                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                      >
                        <FaPlus size={10} />
                      </button>

                      {/* Remove Button */}
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="ml-2 w-6 h-6 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
                      >
                        <FaTrash size={10} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer with Total and Checkout */}
      {cartItems.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          {/* Subtotal */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-700">Subtotal:</span>
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(totalPrice)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Link
              to="/cart"
              className="flex-1 px-3 py-2 text-center text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              View Cart
            </Link>
            <Link
              to="/checkout"
              className="flex-1 px-3 py-2 text-center text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Checkout
            </Link>
          </div>

          {/* Free shipping notice */}
          <div className="mt-2 text-xs text-gray-500 text-center">
            Free shipping on orders over {formatPrice(500000)}
          </div>
        </div>
      )}
    </div>
  );
}
)

export default CartDropdown;
