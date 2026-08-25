import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import User from './models/User.js';

dotenv.config();
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);


async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ email: '2303031241616@paruluniversity' }).lean();
    if (!user) {
      console.log('NOT_FOUND');
    } else {
      // hide password hash when printing
      if (user.password) user.password = user.password.slice(0, 10) + '...';
      console.log('FOUND');
      console.log(JSON.stringify(user, null, 2));
    }
    process.exit(0);
  } catch (err) {
    console.error('ERROR', err.message);
    process.exit(1);
  }
}

run();
