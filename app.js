const express = require('express'); // Import For Express
const dotenv = require('dotenv'); // For .env file 
const cors = require('cors'); // For to run different server when I run use React with node 
const connectDB = require('./app/config/db.js'); // Connect Database
dotenv.config(); // .env with config
const app = express();
connectDB()


app.use(express.json()); // use Express
app.use((cors())); // Use Cors 

// Make uploads file static
app.use('/uploads', express.static(__dirname + '/uploads'));

// Student API Mother Routing 
const studentapirouter = require('./app/router/apirouter/studentrouter.js');
app.use('/api', studentapirouter);

const port = 3004
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});