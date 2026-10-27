import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

async function resetAllAccountBalances() {
  const uri = process.env.MONGODB_URI;
  await mongoose.connect(uri);

  const accountsCol = mongoose.connection.db.collection('accounts');
  
  // Set all existing accounts balance to 0
  const updateRes = await accountsCol.updateMany({}, { $set: { balance: 0 } });
  console.log(`Updated ${updateRes.modifiedCount} accounts to balance 0.`);

  // Remove any fake credit card debt
  const deleteRes = await accountsCol.deleteMany({ type: 'credit' });
  console.log(`Removed ${deleteRes.deletedCount} fake credit accounts.`);

  const remaining = await accountsCol.find({}).toArray();
  console.log('Remaining Accounts:', remaining.map(a => ({ id: a._id, name: a.name, balance: a.balance })));

  await mongoose.disconnect();
  process.exit(0);
}

resetAllAccountBalances().catch(err => {
  console.error('Reset error:', err);
  process.exit(1);
});
