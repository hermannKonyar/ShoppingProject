 export interface ICart {
    cartId: string;
    customerId: string;
    items: ICartItems[];
 }

 export interface ICartItems {
    productId: number;
    name: string;
    price: number;
    imageUrl: string;
    quantity: number;
    
}