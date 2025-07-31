"use client";

import { useCallback } from "react";

interface EventParameters {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

interface EcommerceItem {
  item_id: string;
  item_name: string;
  category?: string;
  quantity?: number;
  price?: number;
}

interface PurchaseParameters {
  transaction_id: string;
  value: number;
  currency?: string;
  items: EcommerceItem[];
}

export function useGoogleAnalytics() {
  // Track custom events
  const trackEvent = useCallback((parameters: EventParameters) => {
    if (typeof window !== "undefined" && window.gtag) {
      const { action, category, label, value, ...otherParams } = parameters;
      
      window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
        ...otherParams,
      });
    }
  }, []);

  // Track page views manually
  const trackPageView = useCallback((url: string, title?: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
        page_location: url,
        page_title: title || document.title,
      });
    }
  }, []);

  // Track purchases (ecommerce)
  const trackPurchase = useCallback((parameters: PurchaseParameters) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "purchase", {
        transaction_id: parameters.transaction_id,
        value: parameters.value,
        currency: parameters.currency || "ARS",
        items: parameters.items,
      });
    }
  }, []);

  // Track add to cart events
  const trackAddToCart = useCallback((item: EcommerceItem, value?: number) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "add_to_cart", {
        currency: "ARS",
        value: value || item.price || 0,
        items: [item],
      });
    }
  }, []);

  // Track remove from cart events
  const trackRemoveFromCart = useCallback((item: EcommerceItem, value?: number) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "remove_from_cart", {
        currency: "ARS",
        value: value || item.price || 0,
        items: [item],
      });
    }
  }, []);

  // Track begin checkout
  const trackBeginCheckout = useCallback((items: EcommerceItem[], value: number) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "begin_checkout", {
        currency: "ARS",
        value: value,
        items: items,
      });
    }
  }, []);

  // Track search events
  const trackSearch = useCallback((searchTerm: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "search", {
        search_term: searchTerm,
      });
    }
  }, []);

  // Track user engagement
  const trackEngagement = useCallback((engagementTime: number) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "user_engagement", {
        engagement_time_msec: engagementTime,
      });
    }
  }, []);

  return {
    trackEvent,
    trackPageView,
    trackPurchase,
    trackAddToCart,
    trackRemoveFromCart,
    trackBeginCheckout,
    trackSearch,
    trackEngagement,
  };
}