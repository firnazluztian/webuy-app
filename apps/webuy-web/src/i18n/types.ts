export type Locale = 'en' | 'ko' | 'id';

export type CurrencyCode = 'SGD' | 'KRW' | 'IDR';

export type MarketId = 'singapore' | 'south_korea' | 'indonesia';

export interface Messages {
  shell: {
    brand: string;
    searchPlaceholder: string;
    cart: string;
    account: string;
    hi: string;
    login: string;
    logout: string;
    language: string;
    market: string;
    shippingCountry: string;
    currency: string;
    saveMarket: string;
    cancel: string;
    home: string;
    footerTagline: string;
    footerRights: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    featuredHeading: string;
    shopNow: string;
    emptyFeatured: string;
  };
  search: {
    title: string;
    resultsFor: string;
    empty: string;
    loading: string;
    error: string;
  };
  product: {
    addToCart: string;
    added: string;
    backToSearch: string;
    notFound: string;
    loading: string;
  };
  cart: {
    title: string;
    empty: string;
    quantity: string;
    subtotal: string;
    checkout: string;
    remove: string;
    continueShopping: string;
  };
  auth: {
    loginTitle: string;
    email: string;
    password: string;
    submit: string;
    error: string;
    subtitle: string;
  };
  account: {
    title: string;
    greeting: string;
    profileHint: string;
  };
  checkout: {
    title: string;
    name: string;
    address: string;
    city: string;
    placeOrder: string;
    emptyCart: string;
    errors: {
      nameRequired: string;
      addressRequired: string;
      cityRequired: string;
    };
  };
  payment: {
    processing: string;
    successTitle: string;
    successBody: string;
    viewOrder: string;
    failedTitle: string;
  };
  order: {
    title: string;
    status: string;
    total: string;
    backHome: string;
    notFound: string;
  };
  common: {
    loading: string;
    error: string;
    retry: string;
  };
}
