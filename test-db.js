// test-db.js

// This loads the variables from your .env file
require('dotenv').config();
const { MongoClient } = require('mongodb');

// Get the connection string from your .env file
const uri = process.env.MONGO_URI;
console.log('--- Attempting to connect with the following URI ---');
console.log(uri);
console.log('----------------------------------------------------');

const client = new MongoClient(uri);

async function runTest() {
  try {
    // Attempt to connect to the database
    await client.connect();
    console.log('\n✅✅✅ SUCCESS: Connected successfully to MongoDB Atlas! ✅✅✅');
    console.log('The credentials in your .env file are correct.');
  } catch (err) {
    // If it fails, print the error
    console.error('\n❌❌❌ FAILURE: Could not connect to MongoDB. ❌❌❌');
    console.error('The credentials in your .env file are WRONG.');
    console.error('Error details:', err);
  } finally {
    // Close the connection
    await client.close();
  }
}

// Run the test
runTest();