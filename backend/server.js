const express = require('express');
const mongoose = require('mongoose');
const transactionRoutes = require('./routes/transactionRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors({ origin: '*' })); 
app.use(express.json());


mongoose.connect('mongodb+srv://rohitsahoo866:prakash1234@cluster0.tynrt9h.mongodb.net/paywize?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));


app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});