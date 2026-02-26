import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Inquiry {
    id: bigint;
    customerName: string;
    status: InquiryStatus;
    createdAt: Time;
    email?: string;
    preferredDeliveryDate: string;
    message: string;
    occasion: string;
    phone: string;
}
export interface Product {
    id: bigint;
    name: string;
    description: string;
    available: boolean;
    imageUrl: string;
    category: string;
    price: string;
}
export interface Testimonial {
    id: bigint;
    customerName: string;
    createdAt: Time;
    reviewText: string;
    rating: bigint;
}
export enum InquiryStatus {
    pending = "pending",
    delivered = "delivered",
    confirmed = "confirmed"
}
export interface backendInterface {
    addTestimonial(customerName: string, reviewText: string, rating: bigint): Promise<Testimonial>;
    createInquiry(customerName: string, phone: string, email: string | null, occasion: string, message: string, preferredDeliveryDate: string, status: InquiryStatus): Promise<Inquiry>;
    getAllInquiries(): Promise<Array<Inquiry>>;
    getAllProducts(): Promise<Array<Product>>;
    getAllTestimonials(): Promise<Array<Testimonial>>;
    getProductById(id: bigint): Promise<Product | null>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    initialize(): Promise<void>;
    updateInquiryStatus(inquiryId: bigint, status: InquiryStatus): Promise<void>;
}
