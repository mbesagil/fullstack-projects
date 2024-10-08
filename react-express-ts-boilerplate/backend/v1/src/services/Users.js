import User from '../models/Users.js';

const insert = async (userData) => {
  // ...saving...
  const user = new User(userData);
  return user.save();
};

const loginUser = (loginData) => {
  return User.findOne(loginData);
};

const list = () => {
  // ...listing...
  return User.find({});
};

const findOne = (where) => {
  // ...listing...
  return User.findOne(where);
};

const modify = (where, updateData) => {
  return User.findOneAndUpdate(where, updateData, { new: true });
};

const remove = (id) => {
  return User.findByIdAndDelete(id);
};

export {
  insert,
  loginUser,
  list,
  findOne,
  modify,
  remove,
};
