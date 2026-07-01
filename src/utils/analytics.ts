/**
 * Utility for sending tracking events to Google Analytics (GA4) and Meta Pixel (Facebook Pixel).
 */

export const trackGAEvent = (
  action: string,
  category: string,
  label: string,
  value?: number
) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  } else {
    // Log in development
    if (process.env.NODE_ENV === "development") {
      console.log(`[GA Event] Action: ${action}, Category: ${category}, Label: ${label}, Value: ${value}`);
    }
  }
};

export const trackPixelEvent = (
  eventName: string,
  options?: object
) => {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", eventName, options);
  } else {
    // Log in development
    if (process.env.NODE_ENV === "development") {
      console.log(`[Meta Pixel Event] Event: ${eventName}`, options);
    }
  }
};
