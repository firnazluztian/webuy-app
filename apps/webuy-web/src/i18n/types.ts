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
    assistantOpen: string;
    assistantBubbleSays: string;
    assistantBubbleMessage: string;
    assistantTitle: string;
    assistantSubtitle: string;
    assistantPlaceholder: string;
    assistantSend: string;
    assistantEmpty: string;
    assistantThinking: string;
    assistantError: string;
    assistantClear: string;
    assistantExpand: string;
    assistantCollapse: string;
    assistantGuestName: string;
    assistantLoginRequired: string;
    assistantLoginCta: string;
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
    brand: string;
    category: string;
    stock: string;
    availability: string;
    discount: string;
    specifications: string;
    sku: string;
    weight: string;
    dimensions: string;
    shipping: string;
    warranty: string;
    returnPolicy: string;
    minimumOrder: string;
    tags: string;
    reviews: string;
    reviewsEmpty: string;
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
    username: string;
    password: string;
    submit: string;
    error: string;
    subtitle: string;
    orContinueWith: string;
    continueWithGoogle: string;
    continueWithApple: string;
    usernameRequired: string;
    passwordRequired: string;
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
