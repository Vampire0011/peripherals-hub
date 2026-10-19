export type Category = "MOUSE" | "KEYBOARD";
export type ConnectionType = "WIRED" | "WIRELESS" | "BOTH";

export interface ProductDTO {
  id: string;
  sku: string;
  title: string;
  category: Category;
  price: number;
  oldPrice: number | null;
  currency: string;
  imageUrl: string;
  buyUrl: string;
  sourcePlatform: string;
  connectionType: ConnectionType;
  switches: string | null;
  sensor: string | null;
  weight: string | null;
  isAvailable: boolean;
  isWishlisted?: boolean;
  priceDrop?: {
    isDrop: boolean;
    dropPercent: number;
  };
}

export type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

export interface RawScrapedProduct {
  sku: string;
  title: string;
  category: Category;
  price: number;
  imageUrl: string;
  buyUrl: string;
  connectionType: ConnectionType;
  switches?: string;
  sensor?: string;
  weight?: string;
  sourcePlatform: string;
}
