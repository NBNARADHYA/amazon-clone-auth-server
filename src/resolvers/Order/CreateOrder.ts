import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Cart } from "../../entity/Cart";
import { Order } from "../../entity/Order";
import { OrderContent } from "../../entity/OrderContent";
import { Product } from "../../entity/Product";
import { Context } from "../../types/Context";
import { IsAuth } from "../middlewares/IsAuth";
import { CreateOrderInput } from "./createOrder/CreateOrderInput";
import { CreateOrderOutput } from "./createOrder/CreateOrderOutput";
import { stripe } from "../../stripe";

@Resolver()
export class CreateOrder {
  @Mutation(() => CreateOrderOutput)
  @UseMiddleware(IsAuth)
  async createOrder(
    @Arg("data")
    { products, checkout }: CreateOrderInput,
    @Ctx() { dbConnection, req }: Context
  ): Promise<CreateOrderOutput> {
    const productsData = await dbConnection
      .getRepository(Product)
      .findByIds(products.map(({ product }) => product));
    const stripeSession = await stripe.checkout.sessions.create({
      customer_email: req.user.email,
      payment_method_types: ["card"],
      line_items: productsData.map(({ name, imageUrl, price }, index) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name,
            images: imageUrl.split("|"),
          },
          unit_amount: parseInt(price),
        },
        quantity: products[index].nos,
      })),
      mode: "payment",
      success_url: `${process.env.CLIENT_HOST}/post_payment?success=true`,
      cancel_url: `${process.env.CLIENT_HOST}/post_payment?success=false`,
      shipping_address_collection: {
        allowed_countries: ["IN", "US", "CA", "AU", "FR", "GE", "GB", "ES"],
      },
    });

    const order = new Order();
    order.user = req.user;
    order.stripeId = stripeSession.id;

    const result = await dbConnection.getRepository(Order).insert(order);

    const orderContents = products.map(
      ({ product, nos }): OrderContent => {
        const newProduct = new OrderContent();
        newProduct.product = product;
        newProduct.nos = nos;
        newProduct.order = order;
        return newProduct;
      }
    );

    if (checkout) {
      await dbConnection.getRepository(Cart).delete({ email: req.user.email });
    }

    try {
      await dbConnection.getRepository(OrderContent).insert(orderContents);
    } catch (error) {
      throw new Error(error);
    }
    return {
      ...result.raw[0],
      stripeId: stripeSession.id,
    };
  }
}
