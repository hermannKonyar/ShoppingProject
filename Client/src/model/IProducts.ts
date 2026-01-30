
export interface IProducts {
    id: number;
    name: string;
    price: number;
    isActive: boolean;
    stock?: number;
    description?: string;
    imageUrl?: string;
}   