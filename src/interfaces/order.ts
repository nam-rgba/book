import type { CartItem } from "./item";


export interface Order {
    id: number;
    paymentMethod: string;
    deliveryType: string;
    receiverName: string;
    receiverPhone: string;
    receiverAddress: string;
    note: string;
    isFreeShip: boolean;
    status: string;
    details: CartItem[];
    cityId: number | null; 
    districtId: number | null;
    wardId: number | null;
    moneyFinal: number; // Added total field to Order
    estimatedDeliveryAt?: string; // Optional field for estimated delivery date
}