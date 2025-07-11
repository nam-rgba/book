import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";

import type { CartItem } from "./cart.mobx";

export interface Order {
    paymentMethod: string;
    deliveryType: string;
    receiverName: string;
    receiverPhone: string;
    receiverAddress: string;
    note: string;
    isFreeShip: boolean;
    status: string;
    detail: CartItem[];
    cityId: number | null; 
    districtId: number | null;
    wardId: number | null;
    total: number; // Added total field to Order
    
}

export interface ProgressStep {
    current: number;
}

class OrderStore {
    order: Order = {
        paymentMethod: "",
        deliveryType: "",
        receiverName: "",
        receiverPhone: "",
        receiverAddress: "",
        note: "",
        isFreeShip: false,
        status: "pending",
        detail: [],
        cityId: null,
        districtId: null,
        wardId: null,
        total: 0, // Added total field to Order
    };

    progressStep: ProgressStep = { current: 0 };

    constructor() {
        makeAutoObservable(this);
        makePersistable(this, {
            name: "OrderStore",
            properties: ["order", "progressStep"],
            storage: window.localStorage
        });
    }

    setOrder(orderData: Partial<Order>) {
        this.order = { ...this.order, ...orderData };
    }

    setProgressStep(step: number) {
        this.progressStep.current = step;
    }

    resetOrder() {
        this.order = {
            paymentMethod: "",
            deliveryType: "",
            receiverName: "",
            receiverPhone: "",
            receiverAddress: "",
            note: "",
            isFreeShip: false,
            status: "pending",
            detail: [],
            cityId: null,
            districtId: null,
            wardId: null,
            total: 0, // Reset total to 0
        };
        this.progressStep.current = 0;
    }


}

export const orderStore = new OrderStore();

