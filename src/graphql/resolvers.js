import User from '../models/User.js';

const resolvers = {
  Query: {
    me: () => null,
  },

  Mutation: {
    createUser: async (_, { input }) => {
      const { name, phone, email, firebaseUid } = input;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User profile already exists with this email.');
      }

      const newUser = new User({
        name,
        phone,
        email,
        firebaseUid,
      });

      try {
        const savedUser = await newUser.save();
        return savedUser;
      } catch (err) {
        // Mongoose validation errors: err.errors is an object, not an array!
        if (err.errors && typeof err.errors === 'object') {
          const messages = Object.values(err.errors).map(e => e.message);
          throw new Error(messages.join(', '));
        }
        // Other errors
        throw err;
      }
    },
  },
};

export default resolvers;
