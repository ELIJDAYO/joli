import Order from 'models/Order';
import { getSession } from 'next-auth/react';
import db from 'utils/db';

// create a handler and export the handler.
const handler = async (req, res) => {
  const session = await getSession({ req });
  /**Check the authentication first using get session, import  getsession from next/auth and if it doesn't
exist, return this message signing required and the status code for this API is 401. */
  if (!session) {
    return res.status(401).send('signin required');
  }

  const { user } = session;
  await db.connect();
  const newOrder = new Order({
    /** then create a new order based
    on the data in the payload in the record body.*/
    ...req.body,
    user: user._id,
  });

  const order = await newOrder.save();
  //   save that order and send back a status code
  res.status(201).send(order);
};
export default handler;
