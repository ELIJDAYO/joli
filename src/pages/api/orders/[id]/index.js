// /api/orders/:id

import Order from 'models/Order';
import { getSession } from 'next-auth/react';
import db from 'utils/db';
// defining a handler like what we did to create API.
const handler = async (req, res) => {
  // get the current user using get session function from next-auth.
  const session = await getSession({ req });
  if (!session) {
    // if the session is null or undefined, send a status code for a one.
    return res.status(401).send('signin required');
  }

  await db.connect();
  //   then connect to the database on Order obj from mongoose model
  //    to get access to the ID in url use req.query.id.
  const order = await Order.findById(req.query.id);
  await db.disconnect();
  //   and send back order to the front end
  res.send(order);
};
// Let's go to the front end part.
export default handler;
