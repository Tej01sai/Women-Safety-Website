const express = require('express');
const mongoose = require ('mongoose');
const cors = require ('cors');
const path = require('path');

require ('dotenv').config();

const app = express();
const PORT =  process.env.PORT || 5000;

// for middle war and for using of cors 
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

//For Routing 

const authRoutes = require('./routes/auth');
app.use('/api/auth',authRoutes);

// Serve index.html for root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

mongoose.connect(process.env.MONGO_URI)
.then(()=>  {

    console.log('connected to MongoDB');
    app.listen(PORT, ()=> console.log(`server running on port ${PORT}`));
})

.catch(err=> console.log(err));