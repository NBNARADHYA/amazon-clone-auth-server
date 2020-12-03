import { Router, Request, Response } from "express";
import Stripe from "stripe";
import { getConnection } from "typeorm";
import { Order } from "../entity/Order";
import { stripe } from "../stripe";
import bodyParser from "body-parser";

const stripeWebHookRouter = Router();

stripeWebHookRouter.post(
  "/",
  bodyParser.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    const dbConnection = getConnection();

    const payload = req.body;
    const signature = req.headers["stripe-signature"];
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        payload,
        signature!,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;

      const {
        city,
        country,
        line1,
        line2,
        postal_code: postalCode,
        state,
      } = session.shipping.address;
      await dbConnection.getRepository(Order).update(
        { stripeId: session.id },
        {
          status: "PAID",
          address: line1 + line2,
          city,
          country,
          postalCode,
          state,
        }
      );
    }

    return res.status(200).send();
  }
);

export { stripeWebHookRouter };
