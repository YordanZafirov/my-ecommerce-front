import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
const stripe = require('stripe')(process.env.STRIPE_SK);
import {buffer} from 'micro';

const endpointSecret = "whsec_a4d6f42bed727415634f28ed0637b1ad16c6a427f17578b585c0c3bb0abeb384";

export default async function handler(req,res) {
  await mongooseConnect();

  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
    } catch (err) {
      console.log('Webhook error:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const orderId = session.metadata.orderId;

        await Order.findByIdAndUpdate(orderId, { paid: true });

        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).send('OK');
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
}
}

export const config = {
  api: {bodyParser:false,}
};

//fairly-wisdom-joy-unreal
//acct_1L32I1An23JU7UqB
//amity-vouch-worth-calm
//acct_1L32I1An23JU7UqB