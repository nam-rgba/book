import api from "./api";
import type { Order } from "../store/order.mobx";
import type { CartItem } from "../store/cart.mobx";


const createOrder = async ({ orderDetails, cart }: { orderDetails: Order, cart: CartItem[] }) => {

    console.log("Details for estimation:", cart);

    const detail = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        name: item.name,
    }));

    console.log("Detail for estimation:", detail);

    try {
        const response = await api.post("/order", {
            order: {
                paymentMethod: orderDetails.paymentMethod || "cod",
                receiverName: orderDetails.receiverName || "base",
                receiverPhone: orderDetails.receiverPhone || "0000000000",
                receiverAddress: orderDetails.receiverAddress || "base",
                isFreeShip: orderDetails.isFreeShip || false,
                note: orderDetails.note || "",
            },
            details: detail,
            cityId: orderDetails.cityId || null,
            districtId: orderDetails.districtId || null,
            wardId: orderDetails.wardId || null,
            storeId: 50,
            promotionCampaignIds: [],
        });
        return response.data;
    } catch (error) {
        console.error("Error estimating order:", error);
        throw error;
    }
}

const getOrders = async () => {
    try {
        const response = await api.get("/order");
        return response.data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
}

const getOrderById = async (id: string) => {
    try {
        const response = await api.get(`/order/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching order by ID:", error);
        throw error;
    }
}

export { createOrder, getOrders, getOrderById };