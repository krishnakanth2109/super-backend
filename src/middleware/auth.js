import admin from 'firebase-admin';

const authenticate = async (request, reply) => {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      request.user = null;
      return;
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    request.user = decodedToken;
  } catch (error) {
    request.user = null;
  }
};

export default authenticate;