import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";

actor {
  // Types
  type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Text;
    category : Text;
    imageUrl : Text;
    available : Bool;
  };

  module Product {
    public func compareByCategory(product1 : Product, product2 : Product) : Order.Order {
      Text.compare(product1.category, product2.category);
    };
  };

  type InquiryStatus = {
    #pending;
    #confirmed;
    #delivered;
  };

  type Inquiry = {
    id : Nat;
    customerName : Text;
    phone : Text;
    email : ?Text;
    occasion : Text;
    message : Text;
    preferredDeliveryDate : Text;
    status : InquiryStatus;
    createdAt : Time.Time;
  };

  type Testimonial = {
    id : Nat;
    customerName : Text;
    reviewText : Text;
    rating : Nat;
    createdAt : Time.Time;
  };

  // Persistent data structures, immutable run-time maps
  var currentInquiryId = 1;
  var currentTestimonialId = 1;

  let persistentProductDB = Map.empty<Nat, Product>();
  let persistentInquiryDB = Map.empty<Nat, Inquiry>();
  let persistentTestimonialDB = Map.empty<Nat, Testimonial>();

  // Initialize sample products
  public shared ({ caller }) func initialize() : async () {
    if (persistentProductDB.size() > 0) {
      Runtime.trap("Already initialized");
    };

    let sampleProducts : [Product] = [
      {
        id = 1;
        name = "Red Rose Bouquet";
        description = "A classic bouquet of fresh red roses.";
        price = "₹299";
        category = "Roses";
        imageUrl = "https://example.com/rose.jpg";
        available = true;
      },
      {
        id = 2;
        name = "Lilies and Roses Mix";
        description = "A beautiful mix of lilies and roses.";
        price = "₹399";
        category = "Mixed";
        imageUrl = "https://example.com/lily_rose.jpg";
        available = true;
      },
      {
        id = 3;
        name = "Wedding Special";
        description = "Custom wedding bouquet arrangement.";
        price = "₹999";
        category = "Wedding/Custom";
        imageUrl = "https://example.com/wedding.jpg";
        available = true;
      },
      {
        id = 4;
        name = "White Lily Bouquet";
        description = "Elegant white lilies, perfect for any occasion.";
        price = "₹349";
        category = "Lilies";
        imageUrl = "https://example.com/lily.jpg";
        available = true;
      },
      {
        id = 5;
        name = "Mixed Seasonal Bouquet";
        description = "A vibrant bouquet of seasonal flowers.";
        price = "₹299";
        category = "Mixed";
        imageUrl = "https://example.com/seasonal.jpg";
        available = true;
      },
      {
        id = 6;
        name = "Custom Roses Arrangement";
        description = "Custom design with fresh roses.";
        price = "₹449";
        category = "Roses";
        imageUrl = "https://example.com/custom_rose.jpg";
        available = true;
      },
    ];

    for (product in sampleProducts.values()) {
      persistentProductDB.add(product.id, product);
    };
  };

  // Product functions
  public query ({ caller }) func getAllProducts() : async [Product] {
    persistentProductDB.values().toArray();
  };

  public query ({ caller }) func getProductById(id : Nat) : async ?Product {
    persistentProductDB.get(id);
  };

  public query ({ caller }) func getProductsByCategory(category : Text) : async [Product] {
    persistentProductDB.values().filter(
      func(product) { product.category == category }
    ).toArray();
  };

  // Inquiry functions
  public query ({ caller }) func getAllInquiries() : async [Inquiry] {
    persistentInquiryDB.values().toArray();
  };

  public shared ({ caller }) func createInquiry(
    customerName : Text,
    phone : Text,
    email : ?Text,
    occasion : Text,
    message : Text,
    preferredDeliveryDate : Text,
    status : InquiryStatus,
  ) : async Inquiry {
    let inquiryType : Inquiry = {
      id = currentInquiryId;
      customerName;
      phone;
      email;
      occasion;
      message;
      preferredDeliveryDate;
      status = #pending;
      createdAt = Time.now();
    };
    persistentInquiryDB.add(currentInquiryId, inquiryType);
    currentInquiryId += 1;
    inquiryType;
  };

  public shared ({ caller }) func updateInquiryStatus(inquiryId : Nat, status : InquiryStatus) : async () {
    switch (persistentInquiryDB.get(inquiryId)) {
      case (null) { Runtime.trap("Inquiry not found") };
      case (?inquiryType) {
        let updatedInquiry : Inquiry = {
          id = inquiryType.id;
          customerName = inquiryType.customerName;
          phone = inquiryType.phone;
          email = inquiryType.email;
          occasion = inquiryType.occasion;
          message = inquiryType.message;
          preferredDeliveryDate = inquiryType.preferredDeliveryDate;
          status;
          createdAt = inquiryType.createdAt;
        };
        persistentInquiryDB.add(inquiryId, updatedInquiry);
      };
    };
  };

  // Testimonial functions
  public shared ({ caller }) func addTestimonial(
    customerName : Text,
    reviewText : Text,
    rating : Nat,
  ) : async Testimonial {
    let testimonialType : Testimonial = {
      id = currentTestimonialId;
      customerName;
      reviewText;
      rating;
      createdAt = Time.now();
    };
    persistentTestimonialDB.add(currentTestimonialId, testimonialType);
    currentTestimonialId += 1;
    testimonialType;
  };

  public query ({ caller }) func getAllTestimonials() : async [Testimonial] {
    persistentTestimonialDB.values().toArray();
  };
};
