const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/database');

const seedAdmin = async () => {
  try {
    await connectDB();

await User.deleteMany();    


    const email = 'gkvc9696@gmail.com';
    const password = 'Gautam12@'; // Default secure password
    const name = 'Admin User';

    const userExists = await User.findOne({ email });
    console.log(userExists)

    if (userExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'admin',
    });

    console.log(`Admin user created successfully: ${user.email}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
