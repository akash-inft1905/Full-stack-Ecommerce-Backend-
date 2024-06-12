import express from "express";
import dbConnect from "../config/dbConnect.js";
import dotenv from "dotenv";
import userRoutes from "../routes/userRoute.js";
import { globalErrhandler, notFound } from "../middlewares/globalErrHandler.js";
import productsRouter from "../routes/productsRoutes.js";
import categoriesRouter from "../routes/categoriesRouter.js";
import brandsRouter from "../routes/brandsRouter.js";
import colorRouter from "../routes/colorRouter.js";
import reviewRouter from "../routes/reviewRouter.js";
import orderRouter from "../routes/ordersRouter.js";
import Stripe from "stripe";
import Order from "../models/Order.js";
import couponsRouter from "../routes/couponsRouter.js";
import { sendOrderConfirmationEmail } from "../services/emailService.js";
dotenv.config();

const app = express();
dbConnect();

//stripe webhook

//stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

const endpoint_secret =
  "whsec_af0aa546ec05218be0d2a38f2b5af829e4ee0c5fa1e9eb40746d6e6d9b6b30b2";

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        sig,
        endpoint_secret
      );
      console.log("event");
    } catch (err) {
      console.log("err", err.message);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    if (event.type === "checkout.session.completed") {
      //update the order
      const session = event.data.object;
      const { orderId, email } = session.metadata;
      const paymentStatus = session.payment_status;
      const paymentMethod = session.payment_method_types[0];
      const totalAmount = session.amount_total / 100; // Convert to actual amount
      const currency = session.currency;
      //find the order
      const order = await Order.findByIdAndUpdate(
        JSON.parse(orderId),
        {
          totalPrice: totalAmount,
          currency,
          paymentMethod,
          paymentStatus,
        },
        {
          new: true,
        }
      );

      // Send email confirmation to the user
      console.log("Send");
      await sendOrderConfirmationEmail(email, totalAmount, currency);
    } else {
      return;
    }
    response.send();
  }
);

//middlewares
app.use(express.json());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/brands", brandsRouter);
app.use("/api/v1/colors", colorRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/coupons", couponsRouter);

//err handler middlewares
app.use(notFound);
app.use(globalErrhandler);

export default app;
