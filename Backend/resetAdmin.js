import dotenv from 'dotenv';
import dns from 'dns';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

dotenv.config();
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

async function resetAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password', salt);

    const result = await db.collection('users').updateOne(
      { email: 'admin@hostelcare.com' },
      {
        $set: {
          password: hashedPassword,
          failedLoginAttempts: 0,
          isEmailVerified: true
        },
        $unset: {
          lockUntil: ''
        }
      }
    );

    console.log('Update result:', result);

    const updatedAdmin = await db.collection('users').findOne({ email: 'admin@hostelcare.com' });
    console.log('Updated admin:', {
      email: updatedAdmin.email,
      role: updatedAdmin.role,
      isEmailVerified: updatedAdmin.isEmailVerified,
      failedLoginAttempts: updatedAdmin.failedLoginAttempts,
      lockUntil: updatedAdmin.lockUntil,
      passwordMatch: await bcrypt.compare('password', updatedAdmin.password)
    });

    process.exit(0);
  } catch (err) {
    console.error('Error resetting admin:', err);
    process.exit(1);
  }
}

resetAdmin();
