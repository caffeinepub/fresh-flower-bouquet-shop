import { useEffect, useRef, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Phone,
  Clock,
  Star,
  MessageCircle,
  ChevronRight,
  Heart,
  Loader2,
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { InquiryStatus } from "./backend.d";
import {
  useGetAllProducts,
  useGetAllTestimonials,
  useAddTestimonial,
  useCreateInquiry,
} from "./hooks/useQueries";
import { useActor } from "./hooks/useActor";
import type { Product, Testimonial } from "./backend.d";

// ─── Constants ──────────────────────────────────────────────────────────────

const CATEGORY_IMAGES: Record<string, string> = {
  Roses: "/assets/generated/roses-bouquet.dim_400x400.jpg",
  Lilies: "/assets/generated/lily-bouquet.dim_400x400.jpg",
  Mixed: "/assets/generated/mixed-bouquet.dim_400x400.jpg",
  Wedding: "/assets/generated/wedding-bouquet.dim_400x400.jpg",
  Custom: "/assets/generated/wedding-bouquet.dim_400x400.jpg",
};

const FALLBACK_IMAGE = "/assets/generated/mixed-bouquet.dim_400x400.jpg";

const HARDCODED_TESTIMONIALS: Testimonial[] = [
  {
    id: BigInt(-1),
    customerName: "Priya M.",
    reviewText:
      "On time delivery fresh flowers. More beautiful and flexible price",
    rating: BigInt(5),
    createdAt: BigInt(0),
  },
  {
    id: BigInt(-2),
    customerName: "Ravi K.",
    reviewText:
      "On time Received the Bouquet. Quicker and politely respond from staff.",
    rating: BigInt(5),
    createdAt: BigInt(0),
  },
  {
    id: BigInt(-3),
    customerName: "Anitha S.",
    reviewText:
      "The quality of the flower and the service provided was excellent.",
    rating: BigInt(5),
    createdAt: BigInt(0),
  },
];

const CATEGORIES = ["All", "Roses", "Lilies", "Mixed", "Wedding"];

const OCCASIONS = [
  "Birthday",
  "Anniversary",
  "Wedding",
  "Graduation",
  "Corporate",
  "Festival",
  "Other",
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function getProductImage(product: Product): string {
  if (
    product.imageUrl &&
    product.imageUrl.trim() !== "" &&
    !product.imageUrl.includes("placeholder")
  ) {
    return product.imageUrl;
  }
  return CATEGORY_IMAGES[product.category] ?? FALLBACK_IMAGE;
}

function StarRating({
  rating,
  max = 5,
  size = "sm",
}: {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "lg" ? "w-6 h-6" : size === "md" ? "w-5 h-5" : "w-4 h-4";
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => i).map((i) => (
        <Star
          key={`star-${i}`}
          className={`${sizeClass} ${
            i < rating
              ? "fill-flower-gold text-flower-gold"
              : "fill-transparent text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Header ─────────────────────────────────────────────────────────────────

function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-card/95 backdrop-blur-md shadow-petal border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between py-3 md:py-4">
        <div className="flex items-center gap-2">
          <span className="text-flower-pink-deep text-xl">✿</span>
          <span className="font-display text-xl md:text-2xl font-semibold text-foreground leading-none">
            Fresh Flower Bouquet
          </span>
        </div>
        <a
          href="https://wa.me/919367556002"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[oklch(0.55_0.2_145)] hover:bg-[oklch(0.48_0.2_145)] text-white rounded-full px-4 py-2 text-sm font-body font-medium transition-colors duration-200 shadow-sm"
        >
          <SiWhatsapp className="w-4 h-4" />
          <span className="hidden sm:inline">WhatsApp Us</span>
          <span className="sm:hidden">Chat</span>
        </a>
      </div>
    </header>
  );
}

// ─── Hero ───────────────────────────────────────────────────────────────────

function HeroSection({ onOrderClick }: { onOrderClick: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/assets/generated/hero-bouquet.dim_1200x700.jpg"
          alt="Fresh flower bouquets"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.12_0.04_30/0.85)] via-[oklch(0.15_0.04_30/0.55)] to-[oklch(0.2_0.04_30/0.1)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.12_0.04_30/0.6)] to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container py-32 md:py-40">
        <div className="max-w-2xl">
          {/* Status badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge className="animate-fade-up animate-fade-up-delay-1 bg-[oklch(0.55_0.2_145/0.9)] text-white border-0 px-3 py-1 text-xs font-body font-medium rounded-full">
              ● Open · Closes 9:30 PM
            </Badge>
            <Badge className="animate-fade-up animate-fade-up-delay-1 bg-[oklch(0.68_0.16_10/0.9)] text-white border-0 px-3 py-1 text-xs font-body font-medium rounded-full">
              Same-Day Delivery Available
            </Badge>
          </div>

          <h1 className="animate-fade-up animate-fade-up-delay-2 font-display text-5xl md:text-7xl font-light text-white leading-tight mb-3">
            Fresh Flower
            <br />
            <span className="italic font-medium text-[oklch(0.9_0.08_10)]">
              Bouquet Shop
            </span>
          </h1>

          <p className="animate-fade-up animate-fade-up-delay-3 font-body text-lg md:text-xl text-white/85 mb-2 font-light">
            Fresh Blooms, Delivered with Love
          </p>

          <div className="animate-fade-up animate-fade-up-delay-3 flex items-center gap-2 mb-8">
            <MapPin className="w-4 h-4 text-white/60 shrink-0" />
            <p className="font-body text-sm text-white/65">
              41-A, West, E Lokamanya St, R.S. Puram, Coimbatore, Tamil Nadu
              641002
            </p>
          </div>

          {/* Rating */}
          <div className="animate-fade-up animate-fade-up-delay-3 flex items-center gap-3 mb-8">
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <StarRating rating={5} size="sm" />
              <span className="font-body font-medium text-white text-sm">
                4.7
              </span>
              <span className="text-white/60 text-sm font-body">
                (64 reviews)
              </span>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="animate-fade-up animate-fade-up-delay-4 flex flex-wrap gap-3">
            <Button
              onClick={onOrderClick}
              className="bg-[oklch(0.68_0.16_10)] hover:bg-[oklch(0.6_0.18_10)] text-white font-body font-medium px-7 py-5 rounded-full text-base shadow-petal transition-all duration-200 hover:shadow-petal-lg"
            >
              Order Now
              <ChevronRight className="ml-1 w-4 h-4" />
            </Button>
            <a
              href="https://wa.me/919367556002"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="border-white/40 text-white bg-white/10 hover:bg-white/20 font-body font-medium px-7 py-5 rounded-full text-base backdrop-blur-sm transition-all duration-200"
              >
                <SiWhatsapp className="mr-2 w-4 h-4" />
                WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Products ───────────────────────────────────────────────────────────────

function ProductCard({
  product,
  onOrder,
}: {
  product: Product;
  onOrder: (name: string) => void;
}) {
  const imgSrc = getProductImage(product);
  return (
    <article className="product-card bg-card rounded-2xl overflow-hidden shadow-xs border border-border flex flex-col">
      <div className="relative overflow-hidden aspect-square">
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 right-3">
          <Badge className="bg-card/90 text-foreground text-xs font-body border border-border rounded-full px-2.5 py-0.5">
            {product.category}
          </Badge>
        </div>
        {!product.available && (
          <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
            <span className="font-body text-white text-sm font-medium bg-foreground/60 px-3 py-1 rounded-full">
              Currently Unavailable
            </span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-xl font-semibold text-foreground leading-tight">
            {product.name}
          </h3>
          <span className="font-body font-semibold text-[oklch(var(--flower-green-deep))] text-sm whitespace-nowrap shrink-0">
            {product.price}
          </span>
        </div>
        <p className="font-body text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">
          {product.description}
        </p>
        <Button
          onClick={() => onOrder(product.name)}
          disabled={!product.available}
          className="mt-1 w-full bg-[oklch(0.68_0.16_10)] hover:bg-[oklch(0.6_0.18_10)] text-white font-body font-medium rounded-xl transition-all duration-200"
          size="sm"
        >
          <Heart className="mr-1.5 w-3.5 h-3.5" />
          Order This
        </Button>
      </div>
    </article>
  );
}

function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {Array.from({ length: 6 }, (_, i) => i).map((i) => (
        <div key={`skeleton-${i}`} className="bg-card rounded-2xl overflow-hidden border border-border">
          <Skeleton className="aspect-square w-full" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-8 w-full mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductsSection({
  onOrderProduct,
}: {
  onOrderProduct: (name: string) => void;
}) {
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: allProducts, isLoading } = useGetAllProducts();

  const filtered =
    activeCategory === "All"
      ? allProducts ?? []
      : (allProducts ?? []).filter((p) => p.category === activeCategory);

  return (
    <section id="products" className="py-20 bg-pink-section">
      <div className="container">
        {/* Section heading */}
        <div className="text-center mb-12">
          <p className="font-body text-sm font-medium tracking-widest text-[oklch(var(--flower-pink-deep))] uppercase mb-3">
            Handcrafted With Care
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-medium text-foreground floral-underline inline-block">
            Our Bouquets
          </h2>
          <p className="font-body text-muted-foreground mt-6 max-w-md mx-auto">
            Each arrangement is freshly crafted to order, using the finest
            seasonal blooms available.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex justify-center mb-8">
          <Tabs
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="w-auto"
          >
            <TabsList className="bg-card border border-border rounded-full p-1 gap-1 flex-wrap h-auto">
              {CATEGORIES.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="rounded-full font-body text-sm px-4 py-1.5 data-[state=active]:bg-[oklch(0.68_0.16_10)] data-[state=active]:text-white"
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Grid */}
        {isLoading ? (
          <ProductsSkeleton />
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {filtered.map((product) => (
              <ProductCard
                key={product.id.toString()}
                product={product}
                onOrder={onOrderProduct}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground font-body">
            <span className="text-5xl mb-4 block">✿</span>
            No bouquets found in this category.
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Order Form ─────────────────────────────────────────────────────────────

type OrderFormProps = {
  prefilledProduct?: string;
  sectionRef: React.RefObject<HTMLElement | null>;
};

function OrderSection({ prefilledProduct, sectionRef }: OrderFormProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    email: "",
    occasion: "",
    message: "",
    preferredDeliveryDate: "",
    selectedProduct: prefilledProduct ?? "",
  });
  const [submitted, setSubmitted] = useState(false);
  const createInquiry = useCreateInquiry();

  // Sync prefilled product
  useEffect(() => {
    if (prefilledProduct) {
      setFormData((prev) => ({ ...prev, selectedProduct: prefilledProduct }));
    }
  }, [prefilledProduct]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.phone.trim()) {
      toast.error("Please fill in your name and phone number.");
      return;
    }
    if (!formData.occasion) {
      toast.error("Please select an occasion.");
      return;
    }

    try {
      const fullMessage = formData.selectedProduct
        ? `Product: ${formData.selectedProduct}\n${formData.message}`
        : formData.message;

      await createInquiry.mutateAsync({
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email.trim() ? formData.email : null,
        occasion: formData.occasion,
        message: fullMessage,
        preferredDeliveryDate: formData.preferredDeliveryDate || "Flexible",
        status: InquiryStatus.pending,
      });
      setSubmitted(true);
    } catch {
      toast.error("Something went wrong. Please try again or WhatsApp us.");
    }
  };

  if (submitted) {
    return (
      <section
        id="order"
        ref={sectionRef as React.RefObject<HTMLElement>}
        className="py-20 bg-green-section"
      >
        <div className="container max-w-xl text-center">
          <div className="bg-card rounded-3xl p-10 shadow-petal border border-border">
            <div className="text-5xl mb-4">✿</div>
            <h3 className="font-display text-3xl font-medium text-foreground mb-3">
              Order Received!
            </h3>
            <p className="font-body text-muted-foreground mb-6">
              Thank you, {formData.customerName}! We've received your inquiry
              and will contact you shortly.
            </p>
            <p className="font-body text-sm text-muted-foreground mb-6">
              For faster confirmation, reach us directly on WhatsApp.
            </p>
            <a
              href="https://wa.me/919367556002"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-[oklch(0.55_0.2_145)] hover:bg-[oklch(0.48_0.2_145)] text-white font-body rounded-full px-8 py-5">
                <SiWhatsapp className="mr-2 w-4 h-4" />
                Message Us on WhatsApp
              </Button>
            </a>
            <Button
              variant="ghost"
              className="ml-3 font-body"
              onClick={() => setSubmitted(false)}
            >
              Place Another Order
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="order"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="py-20 bg-green-section"
    >
      <div className="container max-w-2xl">
        {/* Heading */}
        <div className="text-center mb-10">
          <p className="font-body text-sm font-medium tracking-widest text-[oklch(0.8_0.06_10)] uppercase mb-3">
            Get Fresh Blooms
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-medium text-white floral-underline inline-block">
            Place an Order
          </h2>
          <p className="font-body text-white/70 mt-6 max-w-md mx-auto">
            Fill in the details below and we'll get back to you quickly to
            confirm your order.
          </p>
        </div>

        {/* Form card */}
        <div className="bg-card rounded-3xl p-7 md:p-10 shadow-petal-lg border border-border">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="customerName" className="font-body text-sm">
                  Name <span className="text-[oklch(0.68_0.16_10)]">*</span>
                </Label>
                <Input
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                  className="rounded-xl font-body"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="font-body text-sm">
                  Phone <span className="text-[oklch(0.68_0.16_10)]">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  required
                  className="rounded-xl font-body"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="font-body text-sm">
                  Email{" "}
                  <span className="text-muted-foreground text-xs">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="rounded-xl font-body"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-body text-sm">
                  Occasion <span className="text-[oklch(0.68_0.16_10)]">*</span>
                </Label>
                <Select
                  value={formData.occasion}
                  onValueChange={(val) =>
                    setFormData((prev) => ({ ...prev, occasion: val }))
                  }
                >
                  <SelectTrigger className="rounded-xl font-body">
                    <SelectValue placeholder="Select occasion" />
                  </SelectTrigger>
                  <SelectContent className="font-body">
                    {OCCASIONS.map((o) => (
                      <SelectItem key={o} value={o} className="font-body">
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="selectedProduct" className="font-body text-sm">
                  Selected Bouquet
                </Label>
                <Input
                  id="selectedProduct"
                  name="selectedProduct"
                  value={formData.selectedProduct}
                  onChange={handleChange}
                  placeholder="e.g. Red Rose Bouquet"
                  className="rounded-xl font-body"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="preferredDeliveryDate"
                  className="font-body text-sm"
                >
                  Delivery Date
                </Label>
                <Input
                  id="preferredDeliveryDate"
                  name="preferredDeliveryDate"
                  type="date"
                  value={formData.preferredDeliveryDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="rounded-xl font-body"
                />
              </div>
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <Label htmlFor="message" className="font-body text-sm">
                Special Requests / Message
              </Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="E.g. Add a greeting card, specific colors, delivery time..."
                className="rounded-xl font-body min-h-[100px]"
              />
            </div>

            <Button
              type="submit"
              disabled={createInquiry.isPending}
              className="w-full bg-[oklch(0.68_0.16_10)] hover:bg-[oklch(0.6_0.18_10)] text-white font-body font-medium py-5 rounded-xl text-base shadow-petal transition-all duration-200"
            >
              {createInquiry.isPending ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Heart className="mr-2 w-4 h-4" />
                  Send Order Inquiry
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground font-body">
              Or reach us directly:{" "}
              <a
                href="https://wa.me/919367556002"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[oklch(0.55_0.2_145)] hover:underline font-medium"
              >
                WhatsApp 093675 56002
              </a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ────────────────────────────────────────────────────────────

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="testimonial-card bg-card rounded-2xl p-6 shadow-xs border border-border flex flex-col gap-3">
      <StarRating rating={Number(testimonial.rating)} size="sm" />
      <p className="font-body text-sm text-muted-foreground leading-relaxed italic flex-1">
        "{testimonial.reviewText}"
      </p>
      <div className="flex items-center gap-2 pt-1 border-t border-border">
        <div className="w-8 h-8 rounded-full bg-[oklch(0.93_0.048_10)] flex items-center justify-center text-[oklch(0.68_0.16_10)] font-display font-semibold text-sm">
          {testimonial.customerName.charAt(0).toUpperCase()}
        </div>
        <span className="font-body text-sm font-medium text-foreground">
          {testimonial.customerName}
        </span>
      </div>
    </article>
  );
}

function ReviewModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const addTestimonial = useAddTestimonial();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      await addTestimonial.mutateAsync({
        customerName: name,
        reviewText: text,
        rating: BigInt(rating),
      });
      toast.success("Thank you for your review!");
      setOpen(false);
      setName("");
      setText("");
      setRating(5);
    } catch {
      toast.error("Could not submit review. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-[oklch(0.68_0.16_10)] text-[oklch(0.68_0.16_10)] hover:bg-[oklch(0.68_0.16_10/0.08)] font-body rounded-full px-7 py-5"
        >
          <MessageCircle className="mr-2 w-4 h-4" />
          Leave a Review
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl font-body max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-medium">
            Share Your Experience
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="review-name" className="font-body text-sm">
              Your Name
            </Label>
            <Input
              id="review-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="rounded-xl"
              required
            />
          </div>

          {/* Star selector */}
          <div className="space-y-1.5">
            <Label className="font-body text-sm">Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  className="p-0.5 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      s <= rating
                        ? "fill-flower-gold text-flower-gold"
                        : "fill-transparent text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="review-text" className="font-body text-sm">
              Your Review
            </Label>
            <Textarea
              id="review-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Tell us about your experience..."
              className="rounded-xl min-h-[100px]"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={addTestimonial.isPending}
            className="w-full bg-[oklch(0.68_0.16_10)] hover:bg-[oklch(0.6_0.18_10)] text-white font-body font-medium rounded-xl py-5"
          >
            {addTestimonial.isPending ? (
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            ) : null}
            {addTestimonial.isPending ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function TestimonialsSection() {
  const { data: backendTestimonials } = useGetAllTestimonials();

  const allTestimonials = [
    ...HARDCODED_TESTIMONIALS,
    ...(backendTestimonials ?? []),
  ];

  return (
    <section id="testimonials" className="py-20 bg-background">
      <div className="container">
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="font-body text-sm font-medium tracking-widest text-[oklch(var(--flower-pink-deep))] uppercase mb-3">
            Customer Love
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-medium text-foreground floral-underline inline-block">
            What Our Customers Say
          </h2>

          {/* Aggregate rating */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <StarRating rating={5} size="lg" />
            <span className="font-display text-4xl font-semibold text-foreground">
              4.7
            </span>
            <div className="text-left">
              <p className="font-body text-sm font-medium text-foreground">
                Excellent
              </p>
              <p className="font-body text-xs text-muted-foreground">
                Based on 64 reviews
              </p>
            </div>
          </div>
        </div>

        {/* Testimonial grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-10">
          {allTestimonials.map((t) => (
            <TestimonialCard key={t.id.toString()} testimonial={t} />
          ))}
        </div>

        <div className="text-center">
          <ReviewModal />
        </div>
      </div>
    </section>
  );
}

// ─── Contact / Footer ────────────────────────────────────────────────────────

function ContactFooter() {
  return (
    <footer id="contact" className="bg-green-section text-white">
      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[oklch(0.85_0.1_10)] text-2xl">✿</span>
              <span className="font-display text-2xl font-medium">
                Fresh Flower Bouquet Shop
              </span>
            </div>
            <p className="font-body text-white/65 text-sm leading-relaxed mb-5">
              Fresh blooms, crafted with care, delivered with love. Your trusted
              florist in Coimbatore since day one.
            </p>
            <a
              href="https://wa.me/919367556002"
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-pulse inline-flex items-center gap-2 bg-[oklch(0.55_0.2_145)] hover:bg-[oklch(0.48_0.2_145)] text-white font-body font-medium px-6 py-3 rounded-full transition-colors duration-200 shadow-green"
            >
              <SiWhatsapp className="w-5 h-5" />
              Order on WhatsApp
            </a>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-xl font-medium mb-5">
              Contact Us
            </h4>
            <ul className="space-y-4 font-body text-sm text-white/75">
              <li>
                <a
                  href="tel:+919367556002"
                  className="flex items-center gap-3 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 text-[oklch(0.85_0.1_10)] shrink-0" />
                  <span>093675 56002</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/919367556002"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-white transition-colors"
                >
                  <SiWhatsapp className="w-4 h-4 text-[oklch(0.55_0.2_145)] shrink-0" />
                  <span>WhatsApp: 093675 56002</span>
                </a>
              </li>
              <li>
                <a
                  href="https://maps.google.com/?q=41-A+West+E+Lokamanya+St+RS+Puram+Coimbatore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 hover:text-white transition-colors"
                >
                  <MapPin className="w-4 h-4 text-[oklch(0.85_0.1_10)] shrink-0 mt-0.5" />
                  <span>
                    41-A, West, E Lokamanya St, R.S. Puram,
                    <br />
                    Coimbatore, Tamil Nadu 641002
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-display text-xl font-medium mb-5">
              Opening Hours
            </h4>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-[oklch(0.55_0.2_145)] rounded-full animate-pulse" />
              <span className="font-body text-sm text-white/80">
                Currently Open
              </span>
            </div>
            <div className="bg-white/10 rounded-xl p-4 font-body text-sm text-white/75 space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[oklch(0.85_0.1_10)] shrink-0" />
                <span className="font-medium text-white">Mon – Sun</span>
              </div>
              <p className="pl-6">9:00 AM – 9:30 PM</p>
              <p className="pl-6 text-white/55 text-xs">
                Same-day delivery available. Order before 6 PM.
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-white/45">
            © 2026 Fresh Flower Bouquet Shop, Coimbatore.
          </p>
          <p className="font-body text-xs text-white/45 flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-[oklch(0.85_0.1_10)]" />{" "}
            using{" "}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/70 underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const orderSectionRef = useRef<HTMLElement | null>(null);
  const [prefilledProduct, setPrefilledProduct] = useState<string>("");
  const [initialized, setInitialized] = useState(false);
  const { actor } = useActor();

  // Initialize backend once actor is ready
  useEffect(() => {
    if (!actor) return;
    actor
      .initialize()
      .then(() => setInitialized(true))
      .catch(() => setInitialized(true)); // gracefully continue even if init fails
  }, [actor]);

  const handleOrderProduct = (productName: string) => {
    setPrefilledProduct(productName);
    setTimeout(() => {
      orderSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleHeroOrderClick = () => {
    orderSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" richColors />
      <Header />

      <main>
        <HeroSection onOrderClick={handleHeroOrderClick} />

        {initialized && (
          <>
            <ProductsSection onOrderProduct={handleOrderProduct} />
            <OrderSection
              prefilledProduct={prefilledProduct}
              sectionRef={orderSectionRef}
            />
            <TestimonialsSection />
          </>
        )}
        {!initialized && (
          <div className="py-32 flex items-center justify-center">
            <div className="text-center space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-[oklch(0.68_0.16_10)] mx-auto" />
              <p className="font-body text-muted-foreground">
                Loading the shop...
              </p>
            </div>
          </div>
        )}
      </main>

      <ContactFooter />
    </div>
  );
}
