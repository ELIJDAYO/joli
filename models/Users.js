import mongoose from 'mongoose';
/*  a schema function.
Accept an object as a parameter and inside that object we need to list the fields of user.*/
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);
/*If we already created that model in the Mongo, there is no need to go for mongoose model function.

But if it's not for the first time, we need to create the model.*/
const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
