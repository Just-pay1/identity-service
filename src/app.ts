import express from "express";
const app = express();
const bodyParser = require('body-parser');
import sequelize from './database/database';
const PORT = process.env.PORT || 3000;
const userRoute =require('./routes/user')
const cardRoute =require('./routes/card')
app.use(bodyParser.json());
app.use(express.json());

app.use('/user',userRoute);
app.use('/cards',cardRoute);
sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err: any) => {
        console.error('Unable to connect to the database:', err);
    });





