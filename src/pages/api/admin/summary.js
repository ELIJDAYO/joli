import Product from 'models/Models';
import Order from 'models/Order';
import User from 'models/Users';
import { getSession } from 'next-auth/react';
import db from 'utils/db';

const handler = async (req, res) => {
  const session = await getSession({ req });
  console.log(session);
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send('signin required');
  }

  await db.connect();
  const ordersCount = await Order.countDocuments();
  const productsCount = await Product.countDocuments();
  const usersCount = await User.countDocuments();
  // To get the total sales, i'm using the aggregate function.
  const ordersPriceGroup = await Order.aggregate([
    {
      $group: {
        _id: null,
        sales: { $sum: '$totalPrice' },
      },
    },
  ]);
  //    check the orders price group length. If it's greater than zero, it means that we have total cells.
  const ordersPrice =
    ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;

  const salesData = await Order.aggregate([
    {
      $group: {
        /** get the monthly report of the cells,get the data from created add field inside the
         * order model and put the sum of total price inside the total cells variable at the end return cells data
         * to the front end.
         * go back to the dashboard, dot us and here I'm going to format the data
         * */
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        totalSales: { $sum: '$totalPrice' },
      },
    },
  ]);

  await db.disconnect();
  res.send({ ordersCount, productsCount, usersCount, ordersPrice, salesData });
};

export default handler;
