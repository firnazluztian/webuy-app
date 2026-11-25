import type { Messages } from '../types';

const en: Messages = {
  shell: {
    brand: 'WeBuy',
    searchPlaceholder: 'Search products…',
    cart: 'Cart',
    account: 'Account',
    login: 'Sign in',
    logout: 'Sign out',
    language: 'Language',
    home: 'Home',
    footerTagline: 'Shop essentials across Singapore, Korea, and Indonesia.',
    footerRights: '© WeBuy. All rights reserved.',
  },
  home: {
    heroTitle: 'Find what you need',
    heroSubtitle: 'Curated products with fast checkout — switch market anytime.',
    featuredHeading: 'Featured',
    shopNow: 'Shop now',
    emptyFeatured: 'No featured products yet.',
  },
  search: {
    title: 'Search',
    resultsFor: 'Results for',
    empty: 'No products matched your search.',
    loading: 'Searching…',
    error: 'Search failed. Try again.',
  },
  product: {
    addToCart: 'Add to cart',
    added: 'Added to cart',
    backToSearch: 'Back to search',
    notFound: 'Product not found.',
    loading: 'Loading product…',
  },
  cart: {
    title: 'Your cart',
    empty: 'Your cart is empty.',
    quantity: 'Qty',
    subtotal: 'Subtotal',
    checkout: 'Checkout',
    remove: 'Remove',
    continueShopping: 'Continue shopping',
  },
  auth: {
    loginTitle: 'Sign in',
    email: 'Email',
    password: 'Password',
    submit: 'Sign in',
    error: 'Unable to sign in. Please try again.',
    subtitle: 'Access your orders and account details.',
  },
  account: {
    title: 'Your account',
    greeting: 'Signed in as',
    profileHint: 'Manage your profile and shopping preferences.',
  },
  checkout: {
    title: 'Checkout',
    name: 'Full name',
    address: 'Address',
    city: 'City',
    placeOrder: 'Place order',
    emptyCart: 'Add items before checkout.',
    errors: {
      nameRequired: 'Enter your full name.',
      addressRequired: 'Enter your address.',
      cityRequired: 'Enter your city.',
    },
  },
  payment: {
    processing: 'Processing payment…',
    successTitle: 'Payment successful',
    successBody: 'Your order is confirmed. Thank you for shopping with WeBuy.',
    viewOrder: 'View order',
    failedTitle: 'Payment failed',
  },
  order: {
    title: 'Order',
    status: 'Status',
    total: 'Total',
    backHome: 'Back to home',
    notFound: 'Order not found.',
  },
  common: {
    loading: 'Loading…',
    error: 'Something went wrong.',
    retry: 'Retry',
  },
};

export default en;
