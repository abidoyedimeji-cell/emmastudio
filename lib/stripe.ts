import "server-only"
import Stripe from "stripe"

let stripeSingleton: Stripe | null = null

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error("Missing STRIPE_SECRET_KEY")
  }

  if (!stripeSingleton) {
    stripeSingleton = new Stripe(key, {
      apiVersion: "2024-12-18.acacia",
    })
  }

  return stripeSingleton
}
