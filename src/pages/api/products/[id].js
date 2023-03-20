import Product from 'models/Models';
import db from 'utils/db';
/**What we're going to do in this API is to connect to the database, gets the product in the database

using find by ID method and using the ID in the you are able to get the product in the database based */
const handler = async (req, res) => {
  await db.connect();
  /**get the product in the database based

on the ID in the URL */
  const product = await Product.findById(req.query.id);
  await db.disconnect();
  /**return the product to the front end */
  res.send(product);
};

export default handler;
