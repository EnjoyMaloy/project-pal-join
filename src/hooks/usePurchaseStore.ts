import { useState, useEffect, useCallback } from "react";

export interface Transaction {
  id: string;
  date: string;
  descRu: string;
  descEn: string;
  amount: string;
  type: "purchase" | "subscription";
}

export interface SubscriptionData {
  active: boolean;
  plan: string;
  price: string;
  startDate: string;
  endDate: string;
}

export interface PurchaseStore {
  purchasedCourses: string[];
  subscription: SubscriptionData | null;
  transactions: Transaction[];
}

const STORAGE_KEY = "demo_purchase_store";
const EVENT_NAME = "purchase_store_update";

function getStore(): PurchaseStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { purchasedCourses: [], subscription: null, transactions: [] };
}

function saveStore(store: PurchaseStore) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  localStorage.removeItem("demo_reset");
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function resetPurchaseStore() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.setItem("demo_reset", "true");
  window.dispatchEvent(new Event(EVENT_NAME));
  window.dispatchEvent(new Event("demo_reset"));
}

export function purchaseCourse(courseId: string, titleRu: string, titleEn: string, amount: string) {
  const store = getStore();
  if (!store.purchasedCourses.includes(courseId)) {
    store.purchasedCourses.push(courseId);
  }
  store.transactions.unshift({
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    descRu: `Курс «${titleRu}»`,
    descEn: `Course "${titleEn}"`,
    amount,
    type: "purchase",
  });
  saveStore(store);
}

export function purchaseSubscription(plan: "monthly" | "yearly", priceLabel: string) {
  const store = getStore();
  const now = new Date();
  const end = new Date(now);
  if (plan === "monthly") end.setMonth(end.getMonth() + 1);
  else end.setFullYear(end.getFullYear() + 1);

  store.subscription = {
    active: true,
    plan,
    price: priceLabel,
    startDate: now.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
  store.transactions.unshift({
    id: crypto.randomUUID(),
    date: now.toISOString(),
    descRu: plan === "monthly" ? "Месячная подписка Premium" : "Годовая подписка Premium",
    descEn: plan === "monthly" ? "Monthly Premium Subscription" : "Yearly Premium Subscription",
    amount: priceLabel,
    type: "subscription",
  });
  saveStore(store);
}

export function usePurchaseStore(): PurchaseStore {
  const [store, setStore] = useState<PurchaseStore>(getStore);

  useEffect(() => {
    const handler = () => setStore(getStore());
    window.addEventListener(EVENT_NAME, handler);
    window.addEventListener("demo_reset", handler);
    return () => {
      window.removeEventListener(EVENT_NAME, handler);
      window.removeEventListener("demo_reset", handler);
    };
  }, []);

  return store;
}
