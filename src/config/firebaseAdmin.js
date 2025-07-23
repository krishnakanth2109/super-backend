const admin = require('firebase-admin');

// This line looks for your private key file in the SAME directory.
// Make sure you have placed your 'serviceAccountKey.json' here.
const serviceAccount = require('./serviceAccountKey.json');

// Initialize the Firebase Admin SDK with your service account credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Export the initialized admin object so other files can use it
module.exports = admin;