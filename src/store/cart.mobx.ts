import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";
export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
}

class CartStore{

    cartItems: CartItem[] = [];


    constructor() {
        makeAutoObservable(this);
        makePersistable(this, {
            name: "CartStore",
            properties: ["cartItems"],
            storage: window.localStorage
        });
    }
    
    addToCart(item: CartItem) {
        this.cartItems.push(item);
    }
    
    removeFromCart(itemId: number) {
        this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    }
    
    clearCart() {
        this.cartItems = [];
    }
    
    get totalItems() {
        return this.cartItems.length;
    }
    
    get totalPrice() {
        return this.cartItems.reduce((total, item) => total + item.price, 0);
    }

    updateQuantity(itemId: number, quantity: number) {
        const item = this.cartItems.find(item => item.id === itemId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(itemId);
            } else {
                item.quantity = quantity;
            }
        }
    }
}

export const cartStore = new CartStore();
