export type CategoryId = 'shawl' | 'robe' | 'cap' | 'accessories';

export interface ProductOption {
  label: string;
  price: number;
}

export interface Product {
  id: string;
  category: CategoryId;
  branch: string;
  name: string;
  description: string;
  basePrice: number;
  imageUrl: string;
  colorImages?: Record<string, string>;
    hideSizing?: boolean;
  hideCapDetails?: boolean;
  hideAmericanShawl?: boolean;

  americanShawlTitle?: string;
  americanShawlSubtitle?: string;
  americanShawlPrice?: number;

  options: ProductOption[];
  secondaryOptions?: string[];
  secondaryOptionPrices?: Record<string, number>;
  secondaryLabel?: string;
  noCapDeduction?: number;
  supportsColorSwatches?: boolean;
  supportsHeadCircumference?: boolean;
  disableAutoColorize?: boolean;
}

export interface StoreCopy {
  brandName: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  studioTitle: string;
  studioSubtitle: string;
  pricesTitle: string;
  pricesSubtitle: string;
}

export interface StoreState {
  version: number;
  logoUrl: string;
  studioBgUrl: string;
  copy: StoreCopy;
  products: Product[];
  sectionOrder?: string[];
  customTexts?: Record<string, string>;
  customImages?: Record<string, string>;
  dynamicSettings?: StoreDynamicSettings;
}

export interface CartItem {
  id: string;
  productId?: string;
  title: string;
  details?: string;
  unitPrice: number;
  costPrice?: number;
  quantity: number;
  category: CategoryId | 'custom-stole';
  fabricType?: string;
  shawlColor?: string;
  threadColor?: string;
  embroideredText?: string;
  rightEmbroideredText?: string;
  leftEmbroideredText?: string;
  size?: string;
  capStyle?: string;
  capColor?: string;
  capEmbroidery?: string;
  gownOption?: string;
  universityLogo?: string;
  customModelImage?: string;
  customNotes?: string;
  excludedOptions?: string[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
  extraPrice?: number;
  defaultThreadHex?: string;
  defaultThreadName?: string;
}

export interface CustomDeliveryOffice {
  id: string;
  name: string;
  notes?: string;
}

export interface WilayaDeliveryRate {
  home: number;
  office: number;
}

export interface DeliveryPricingConfig {
  freeDelivery: boolean;
  deliveryLocked?: boolean;
  defaultHomePrice: number;
  defaultOfficePrice: number;
  wilayas: Record<string, WilayaDeliveryRate>;
}

export interface ShippingCompanyAccount {
  id: string;
  name: string;
  apiId: string;
  apiToken: string;
  isDefault: boolean;
  isActive: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  wilaya: string;
  university?: string;
  rating: number;
  comment: string;
  productTag?: string;
  dateLabel?: string;
}

export interface PromoCode {
  id: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  active: boolean;
  label?: string;
}

export interface PromoSettings {
  promoCodeInputEnabled: boolean;
  storewideDiscountPercent: 0 | 10 | 20;
  promoCodes: PromoCode[];
}

export interface ShowcasePhoto {
  id: string;
  imageUrl: string;
  caption?: string;
  wilaya?: string;
  tag?: string;
}

export type StoreSectionKey =
  | 'trustBadges'
  | 'catalog'
  | 'studio'
  | 'howToOrder'
  | 'pricing'
  | 'showcase'
  | 'testimonials';

export interface StoreDynamicSettings {
  stoleColors: ColorSwatch[];
  crepeStoleColors?: ColorSwatch[];
  gownColors: ColorSwatch[];
  threadColors: ColorSwatch[];
  capColors: ColorSwatch[];
  ordersPaused: boolean;
  pauseMessage: string;
  pausedCategories?: Partial<Record<CategoryId, boolean>>;
  categoryPauseBadge?: string;
  telegramEnabled?: boolean;
  telegramBotToken?: string;
  telegramChatId?: string;
  paymentInfo?: string;
  customDeliveryOffices?: CustomDeliveryOffice[];
  testimonials?: Testimonial[];
  showcasePhotos?: ShowcasePhoto[];
  showcaseBadge?: string;
  showcaseTitle?: string;
  showcaseSubtitle?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImageUrl?: string;
  promoSettings?: PromoSettings;
  customTexts?: Record<string, string>;
  hiddenSections?: Partial<Record<StoreSectionKey, boolean>>;
  categoryBranches?: Partial<Record<CategoryId, string[]>>;
  seasonBannerEnabled?: boolean;
  seasonBannerText?: string;
  whatsappNumber?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  categoryImageBgColors?: Partial<Record<CategoryId, string>>;
  categoryCoverImages?: Partial<Record<CategoryId, string>>;
  productColorImages?: Record<string, Record<string, string>>;
  americanShawlFrontImage?: string;
  americanShawlBackImage?: string;
  regularShawlBaseImage?: string;
  deletedProductIds?: string[];
  disabledColorizeProductIds?: string[];
  capOptionPrices?: Record<string, number>;
  productPriceOverrides?: Record<
    string,
    {
      basePrice: number;
      options?: ProductOption[];
      secondaryOptions?: string[];
      secondaryOptionPrices?: Record<string, number>;
      noCapDeduction?: number;
    }
  >;
  deliveryPricing?: DeliveryPricingConfig;
  shippingCompanies?: ShippingCompanyAccount[];
  updatedAt?: string;
}



