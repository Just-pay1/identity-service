import express from "express";
const app = express();
const bodyParser = require('body-parser');
import sequelize from './database';
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(express.json());


sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err: any) => {
        console.error('Unable to connect to the database:', err);
    });





