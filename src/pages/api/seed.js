import User from 'models/Users';
import data from 'utils/data';
import db from 'utils/db';
// What we're going to do in the seed.js is to seed sample users
const handler = async (req, res) => {
  await db.connect();
  //   We are going to delete all previous user in the user collection.
  await User.deleteMany();
  /*We are going to add sample users, but where is the source of that user?
It's coming from data in their utils folder and the users in the data.*/
  await User.insertMany(data.users);
  await db.disconnect();
  res.send({ message: 'seeded successfully' });
};
export default handler;
