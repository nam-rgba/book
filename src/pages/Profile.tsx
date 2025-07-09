import { useState, useEffect } from "react";
import getProfile from "../api/profile";
import { getOrders } from "../api/order";
import Header from "../components/Header";
import { observer } from "mobx-react-lite";
import { userStore } from "../store/user.mobx";
import avt from "../assets/landing/avt.webp";
import {
  FaUser,
  FaEdit,
  FaShoppingBag,
  FaPhone,
  FaEnvelope,
  FaCalendar,
  FaEye,
  FaDownload,
} from "react-icons/fa";
import { toVND } from "../utils/toVND";

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  total: number;
  items: number;
  paymentMethod: string;
}

const Profile = observer(() => {
  const [activeTab, setActiveTab] = useState<"profile" | "orders">("profile");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  // Initialize user data from userStore or with defaults
  const [userData, setUserData] = useState({
    fullName: userStore.user?.fullName || "John Doe",
    email: userStore.user?.email || "john.doe@example.com",
    phone: userStore.user?.phone || "+84 123 456 789",
    address:
      userStore.user?.address ||
      "123 Main Street, District 1, Ho Chi Minh City",
    avatar: userStore.user?.avatar || "/api/placeholder/150/150",
    joinDate: "January 2024",
    totalOrders: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoading(true);
        setProfileError(null);
        setOrdersError(null);

        // Load user profile
        try {
          const profileData = await getProfile();
          if (profileData && profileData.data) {
            const user = profileData.data;
            setUserData((prev) => ({
              ...prev,
              fullName: user.fullName || prev.fullName,
              email: user.email || prev.email,
              phone: user.phone || prev.phone,
              address: user.address || prev.address,
              avatar: user.avatar || prev.avatar,
            }));

            // Update userStore
            userStore.setUser(user);
          }
        } catch (error) {
          console.error("Error loading profile:", error);
          setProfileError("Failed to load profile data. Using cached data.");
        }

        // Load orders
        try {
          const ordersData = await getOrders();
          console.log("Orders data:", ordersData);
          if (ordersData && ordersData.data) {
            const formattedOrders = ordersData.data.orders.map(
              (order: {
                id: number;
                code?: string;
                createdAt?: string;
                status?: string;
                totalMoney?: number;
                details?: unknown[];
                paymentMethod?: string;
              }) => ({
                id: order.id,
                orderNumber: order.code || `BMD${order.id}`,
                date: order.createdAt,
                status: order.status || "pending",
                total: order.totalMoney || 0,
                items: order.details?.length || 1,
                paymentMethod: order.paymentMethod || "COD",
              })
            );
            setOrders(formattedOrders);

            // Update totals
            const totalOrders = formattedOrders.length;
            const totalSpent = formattedOrders.reduce(
              (sum: number, order: Order) => sum + order.total,
              0
            );
            setUserData((prev) => ({
              ...prev,
              totalOrders,
              totalSpent,
            }));
          }
        } catch (error) {
          console.error("Error loading orders:", error);
          setOrdersError("Failed to load order history.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "complete":
        return "bg-green-100 text-green-800";
      case "delivering":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-red-100 text-red-800";
      case "confirm":
        return "bg-lime-100 text-lime-600";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    try {
      // Save profile logic here - you can call updateProfile API
      setIsEditing(false);
      // For now, just update the userStore if user exists
      if (userStore.user) {
        userStore.setUser({
          ...userStore.user,
          fullName: userData.fullName,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
        });
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleDownloadReceipt = (orderId: string) => {
    console.log("Downloading receipt for order:", orderId);
    alert("Receipt download feature will be implemented soon!");
  };

  const handleViewOrder = (orderId: string) => {
    console.log("Viewing order:", orderId);
    alert("Order details view will be implemented soon!");
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-6">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={avt}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                  <FaEdit size={12} />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {userData.fullName}
                </h1>
                <p className="text-gray-600 mb-1 flex items-center justify-center md:justify-start">
                  <FaEnvelope className="mr-2" />
                  {userData.email}
                </p>
                <p className="text-gray-600 mb-1 flex items-center justify-center md:justify-start">
                  <FaPhone className="mr-2" />
                  {userData.phone}
                </p>
                <p className="text-gray-500 text-sm flex items-center justify-center md:justify-start">
                  <FaCalendar className="mr-2" />
                  Member since {userData.joinDate}
                </p>
              </div>

              {/* Stats */}
              <div className="flex space-x-6 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {userData.totalOrders}
                  </p>
                  <p className="text-sm text-gray-600">Total Orders</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {toVND(userData.totalSpent)}
                  </p>
                  <p className="text-sm text-gray-600">Total Spent</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "profile"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <FaUser className="inline mr-2" />
                  Profile Data
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "orders"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <FaShoppingBag className="inline mr-2" />
                  Order History
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {profileError && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">{profileError}</p>
                </div>
              )}

              {activeTab === "profile" ? (
                /* Profile Data Section */
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Personal Information
                    </h2>
                    <button
                      onClick={handleEditProfile}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <FaEdit />
                      <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={userData.fullName}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              fullName: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="px-3 py-2 bg-gray-50 rounded-lg">
                          {userData.fullName}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={userData.email}
                          onChange={(e) =>
                            setUserData({ ...userData, email: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="px-3 py-2 bg-gray-50 rounded-lg">
                          {userData.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={userData.phone}
                          onChange={(e) =>
                            setUserData({ ...userData, phone: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="px-3 py-2 bg-gray-50 rounded-lg">
                          {userData.phone}
                        </p>
                      )}
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      {isEditing ? (
                        <textarea
                          value={userData.address}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              address: e.target.value,
                            })
                          }
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="px-3 py-2 bg-gray-50 rounded-lg">
                          {userData.address}
                        </p>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Orders Section */
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Order History
                    </h2>
                    <p className="text-gray-600">
                      {orders.length} orders found
                    </p>
                  </div>

                  {ordersError && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800 text-sm">{ordersError}</p>
                    </div>
                  )}

                  {isLoading ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <p className="mt-2 text-gray-600">Loading orders...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    // No orders found
                    <div className="text-center py-12">
                      <FaShoppingBag className="mx-auto text-4xl text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No orders yet
                      </h3>
                      <p className="text-gray-600">
                        Start shopping to see your orders here!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-4 mb-2">
                                <h3 className="font-semibold text-gray-900">
                                  #{order.orderNumber}
                                </h3>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                    order.status
                                  )}`}
                                >
                                  {order.status.charAt(0).toUpperCase() +
                                    order.status.slice(1)}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                <div>
                                  <p className="font-medium">Date</p>
                                  <p>
                                    {new Date(order.date).toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="font-medium">Items</p>
                                  <p>
                                    {order.items} item
                                    {order.items > 1 ? "s" : ""}
                                  </p>
                                </div>
                                <div>
                                  <p className="font-medium">Payment</p>
                                  <p>{order.paymentMethod}</p>
                                </div>
                                <div>
                                  <p className="font-medium">Total</p>
                                  <p className="font-semibold text-blue-600">
                                    {toVND(order.total)}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2 mt-4 md:mt-0">
                              <button
                                onClick={() => handleViewOrder(order.id)}
                                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 px-3 py-1 rounded border border-blue-200 hover:border-blue-300 transition-colors"
                              >
                                <FaEye size={14} />
                                <span className="text-sm">View</span>
                              </button>
                              <button
                                onClick={() => handleDownloadReceipt(order.id)}
                                className="flex items-center space-x-1 text-gray-600 hover:text-gray-700 px-3 py-1 rounded border border-gray-200 hover:border-gray-300 transition-colors"
                              >
                                <FaDownload size={14} />
                                <span className="text-sm">Receipt</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Profile;
