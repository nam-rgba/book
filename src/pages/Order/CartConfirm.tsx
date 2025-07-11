import React from "react";
import { FaEdit, FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";
import { MdAnnouncement } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { useOutletContext, useNavigate } from "react-router-dom";
import { cartStore } from "../../store/cart.mobx";
import { observer } from "mobx-react-lite";
import { toVND } from "../../utils/toVND";
import { Tooltip, Modal } from "antd";


interface CartConfirmContext {

  current: number;
  setCurrent: (step: number) => void;
}

const CartConfirm: React.FC = observer(() => {
  const { current, setCurrent } = useOutletContext<CartConfirmContext>();

  const [openModal, setOpenModal] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<number | null>(null);

    const navigate = useNavigate();

  // Calculate totals
  const subtotal = cartStore.cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const total = subtotal ;

  // Format price to VND

  const handleBackToProduct = () => {
    navigate("/products"); // Navigate back to cart
  };

  const handleProceedToPayment = () => {
    setCurrent(current + 1); // Go to payment step
  };

  const handleRemoveItem = (id: number) => {
    cartStore.cartItems = cartStore.cartItems.filter((item) => item.id !== id);
  };

  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    cartStore.cartItems = cartStore.cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
  };

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id);
    } else {
      handleUpdateQuantity(id, newQuantity);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {/* Modal to delete */}
      <Modal
        title="Confirm Deletion"
        okText="Delete"
        cancelText="Cancel"
        okType="danger"
        open={openModal}
        onOk={() => {
          if (selectedItem !== null) {
            handleRemoveItem(selectedItem);
            setSelectedItem(null);
          }
          setOpenModal(false);
        }}
        onCancel={() => {
          console.log("Modal closed");
          setOpenModal(false);
        }}
        centered
      >
        <div className="text-center flex flex-row items-center justify-start ">
          <MdAnnouncement size={24} color="red" className="mr-2"/>
          <p>Are you sure you want to delete this item?</p>
        </div>
      </Modal>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <FaShoppingCart className="mr-3 text-java-500" />
          Order Confirmation
        </h2>
        <p className="text-gray-600">
          Please review your order details before proceeding to payment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Order Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cart Items */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Order Items ({cartStore.cartItems.length})
              </h3>
              <button
                onClick={handleBackToProduct}
                className="flex items-center text-java-500 hover:text-java-600 font-medium transition-colors"
              >
                <FaEdit className="mr-2" />
                Edit Cart
              </button>
            </div>

            <div className="space-y-4">
              {cartStore.cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center bg-white rounded-lg p-4 shadow-sm"
                >
                  {/* Product Image */}
                  <div className="flex-shrink-0 w-20 h-20 mr-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md border"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900 mb-1">
                      {item.name}
                    </h4>

                    <div className="flex flex-row justify-between items-center">
                      <div>
                        <span className="text-sm text-gray-600 mr-2">
                          Số lượng:
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
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500 pr-4 flex items-end flex-col">
                        <Tooltip title="Remove item" color="red">
                          <div
                            className="text-red-600 cursor-pointer hover:underline p-2 mb-2 bg-red-200 rounded-md"
                            onClick={() => {
                              setOpenModal(true);
                              setSelectedItem(item.id);
                            }}
                          >
                            <RiDeleteBinLine size={20} className="inline" />
                          </div>
                        </Tooltip>
                        <div>
                          {toVND(item.price)} × {item.quantity}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

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
                <span className="text-java-500">{toVND(total)}</span>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handleProceedToPayment}
              className="w-full bg-java-500 hover:bg-java-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mb-4"
            >
              Add addtional information
            </button>

            <button
              onClick={handleBackToProduct}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Explore more products
            </button>


          </div>
        </div>
      </div>
    </div>
  );
});

export default CartConfirm;
