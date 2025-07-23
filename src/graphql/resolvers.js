import User from '../models/User.js';

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (!context.user) {
        return null;
      }
      const userProfile = await User.findOne({ firebaseUid: context.user.uid });
      return userProfile;
    },
    protectedData: (parent, args, context) => {
      if (!context.user) {
        throw new Error('You must be logged in to see this.');
      }
      return `Welcome, authenticated user ${context.user.email}! This is secret data.`;
    }
  },

  Mutation: {
    createUser: async (_, { input }, context) => {
      if (!context.user) {
        throw new Error('Authentication required! Cannot create user profile.');
      }

      const { uid, email } = context.user;
      const { name, phone } = input;

      const existingUser = await User.findOne({ firebaseUid: uid });
      if (existingUser) {
        throw new Error('User profile already exists.');
      }

      const newUser = new User({
        firebaseUid: uid,
        email: email,
        name: name,
        phone: phone,
      });

      const savedUser = await newUser.save();
      return savedUser;
    },
  },
};

export default resolvers;
