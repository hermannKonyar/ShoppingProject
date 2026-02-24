import { createContext, useContext, useState } from "react";
import { ICart } from "../model/ICart";

interface ICartContextValue {
    cart: ICart | null;
    setCart: (cart: ICart | null) => void;
    deleteItem: (productId: number, quantity: number) => void;
}

export const CartContext = createContext<ICartContextValue | null>(null);

export function useCartContext() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCartContext must be used within a CartContextProvider");
    }
    return context;
}

export function CartContextProvider({children}: {children: React.ReactNode}) {
    const [cart, setCart] = useState<ICart | null>(null);
    const deleteItem = (productId: number, quantity: number) => {
        
    }
    return (
        <CartContext.Provider value={{cart, setCart, deleteItem}}>
            {children}
        </CartContext.Provider>
    );
}
