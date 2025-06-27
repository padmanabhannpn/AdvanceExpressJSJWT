const mongoose = require('mongoose');

async function getDatabase()
{
    mongoose.connect('mongodb://localhost:27017/jwt_auth').then(() =>
    {
        console.log("DB Connected");
    }).catch(() => 
    {
         console.log("DB Not Connected");
    })
}

module.exports = {getDatabase};

