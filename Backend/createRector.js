import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);


const EMAIL = '2303031241616@paruluniversity';
const PASSWORD = '@Niti258096';

const upsertRector = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    let rector = await User.findOne({ email: EMAIL });
    const hashed = await bcrypt.hash(PASSWORD, 10);

    if (rector) {
      rector.name = rector.name || 'Rector';
      rector.password = hashed;
      rector.role = 'rector';
      await rector.save();
      console.log('Updated existing rector:', EMAIL);
    } else {
      rector = await User.create({
        name: 'Rector',
        email: EMAIL,
        password: hashed,
        role: 'rector',
      });
      console.log('Created rector:', EMAIL);
    }

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

upsertRector();
