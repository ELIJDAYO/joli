import Order from 'models/Order';
import { getSession } from 'next-auth/react';
import db from 'utils/db';
/**To create API with defind function named handler and export default of that function. */
const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send('signin required');
  }
  //    checking the method of the http request
  if (req.method === 'GET') {
    await db.connect();
    /**So by using populate, all the Ids of user will be populated and the data of user from the user collection
    will be put in the user variable and we get only the name of user, not all data of the user in the
    user collection. */
    const orders = await Order.find({}).populate('user', 'name');
    await db.disconnect();
    // send them back to the front end.
    res.send(orders);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

export default handler;
