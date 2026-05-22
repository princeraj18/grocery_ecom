import dotenv from "dotenv";
dotenv.config();

import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY;

// console.log("Loaded Stripe Key:", stripeKey);

if (!stripeKey) {
  throw new Error(
    "Missing STRIPE_SECRET_KEY environment variable. Add it to your .env file."
  );
}

export const stripe = new Stripe(stripeKey);