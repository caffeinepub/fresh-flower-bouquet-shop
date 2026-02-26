import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import type { Product, Testimonial, Inquiry, InquiryStatus } from "../backend.d";

export function useGetAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProductsByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "category", category],
    queryFn: async () => {
      if (!actor) return [];
      if (category === "All") {
        return actor.getAllProducts();
      }
      return actor.getProductsByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllTestimonials() {
  const { actor, isFetching } = useActor();
  return useQuery<Testimonial[]>({
    queryKey: ["testimonials"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTestimonials();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddTestimonial() {
  const queryClient = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      customerName,
      reviewText,
      rating,
    }: {
      customerName: string;
      reviewText: string;
      rating: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addTestimonial(customerName, reviewText, rating);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });
}

export function useCreateInquiry() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      customerName,
      phone,
      email,
      occasion,
      message,
      preferredDeliveryDate,
      status,
    }: {
      customerName: string;
      phone: string;
      email: string | null;
      occasion: string;
      message: string;
      preferredDeliveryDate: string;
      status: InquiryStatus;
    }): Promise<Inquiry> => {
      if (!actor) throw new Error("Actor not available");
      return actor.createInquiry(
        customerName,
        phone,
        email,
        occasion,
        message,
        preferredDeliveryDate,
        status
      );
    },
  });
}
