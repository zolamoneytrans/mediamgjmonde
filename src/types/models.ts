export interface NotificationItem {
  id: string;
  titleFr: string;
  titleEn: string;
  messageFr: string;
  messageEn: string;
  category: 'direct' | 'kzi' | 'shop' | 'general' | string;
  urgent: boolean;
  read: boolean;
  createdAt: string;
  actionLink?: string;
  actionTextFr?: string;
  actionTextEn?: string;
  type?: string;
  bodyFr?: string;
  bodyEn?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio' | 'none';
}

export interface ShopItem {
  id: string;
  titleFr: string;
  titleEn: string;
  descFr: string;
  descEn: string;
  priceEur: number;
  priceUsd: number;
  priceFc: number;
  category: 'books' | 'apparel' | 'media';
  imageUrl: string;
  inStock: boolean;
}

export interface CartItem {
  product: ShopItem;
  quantity: number;
}

export interface ShopOrder {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: CartItem[];
  totalEur: number;
  status: 'En préparation' | 'Expédié' | 'Livré';
  createdAt: string;
}

export interface DonationRecord {
  id: string;
  userId: string;
  userName: string;
  type: 'tithes' | 'offering' | 'kzi' | 'media';
  amount: number;
  currency: 'EUR' | 'USD' | 'FC';
  paymentMethod: 'Carte Bancaire' | 'Mobile Money' | 'PayPal';
  createdAt: string;
  receiptNumber: string;
}

export interface ConventionSpeaker {
  id: string;
  name: string;
  roleFr: string;
  roleEn: string;
  bioFr: string;
  bioEn: string;
  imageUrl: string;
}

export interface ScheduleItem {
  id: string;
  day: number;
  time: string;
  titleFr: string;
  titleEn: string;
  descFr: string;
  descEn: string;
  speakerName?: string;
}

export interface SermonNote {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface AnnouncementComment {
  id: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  likes?: number;
}

export interface AnnouncementItem {
  id: string;
  titleFr: string;
  titleEn: string;
  contentFr: string;
  contentEn: string;
  category: 'prophetic' | 'event' | 'general' | 'urgent' | string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio' | 'none';
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  createdAt: string;
  likesCount: number;
  commentsCount?: number;
  sharesCount?: number;
  pinned?: boolean;
  commentsList?: AnnouncementComment[];
  comments?: AnnouncementComment[];
}

export interface KziRegistrant {
  id: string;
  fullName: string;
  whatsapp: string;
  city: string;
  arrivalDate: string;
  departureDate: string;
  transport: string;
  lodgingOption: string;
  passSerial: string;
  seatsCount: number;
  status: 'Confirmé - Logistique Planifiée' | 'En attente de validation';
  purchasedKit?: boolean;
  kitType?: string;
  kitCount?: number;
  amountPaid?: string;
  bookingType?: 'kit' | 'bus' | 'flight' | 'arrival';
  createdAt: string;
}

export interface KziWelcomeInfo {
  themeFr: string;
  themeEn: string;
  datesFr: string;
  datesEn: string;
  locationFr: string;
  locationEn: string;
  visionTextFr: string;
  visionTextEn: string;
  kitPriceUsd: number;
  kitPriceFc: number;
  busMgjPriceFc: number;
  busMulykapPriceFc: number;
  flightPriceUsd: number;
  umojaBoardingStatus: string;
  hotelAdviceFr: string;
}

export interface MgjSector {
  id: string;
  name: string;
  leaders: string;
  contacts: string;
  address: string;
  days: string;
  hours: string;
}

export interface MgjAntenna {
  id: string;
  number: string;
  name: string;
  country: string;
  presidentName: string;
  presidentContact: string;
  sectors: MgjSector[];
}


