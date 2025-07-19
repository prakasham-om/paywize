const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const mongoose = require('mongoose');


router.post('/', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, type, amount } = req.body;

    if (!userId || !type || !amount || isNaN(amount) || amount <= 0) {
      throw new Error('Invalid input');
    }

    const user = await User.findById(userId).session(session);
    if (!user) throw new Error('User not found');

    const openingBalance = user.balance || 0;
    let closingBalance;

    // Calculate new balance
    if (type === 'deposit') {
      closingBalance = openingBalance + Number(amount);
    } else if (type === 'withdrawal') {
      if (openingBalance < amount) throw new Error('Insufficient funds');
      closingBalance = openingBalance - Number(amount);
    } else {
      throw new Error('Invalid transaction type');
    }

    // Create transaction
    const transaction = new Transaction({
      user: userId,
      type,
      amount: Number(amount),
      openingBalance,
      closingBalance,
      date: new Date(),
    });

    await transaction.save({ session });

    
    user.balance = closingBalance;
    await user.save({ session });

    await session.commitTransaction();
    res.status(201).json(transaction);
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ error: err.message });
  } finally {
    session.endSession();
  }
});
router.get('/daily/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const queryDate = req.query.date ? new Date(req.query.date) : new Date();

    const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));


    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    
    const lastTxnBeforeDay = await Transaction.findOne({
      user: userId,
      date: { $lt: startOfDay },
    }).sort({ date: -1 });

    const openingBalance = lastTxnBeforeDay
      ? closingBalance
      : user.balance || 0;

  
    const transactions = await Transaction.find({
      user: userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ date: 1 });

    const totalDeposits = transactions
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalWithdrawals = transactions
      .filter(t => t.type === 'withdrawal')
      .reduce((sum, t) => sum + t.amount, 0);

    const closingBalance = openingBalance + totalDeposits - totalWithdrawals;

    const summary = {
      date: startOfDay.toISOString().split('T')[0],
      openingBalance : openingBalance === 0? closingBalance : openingBalance,
      totalDeposits,
      totalWithdrawals,
      closingBalance,
      transactions,
    };

    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





module.exports = router;
