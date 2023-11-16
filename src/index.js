const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const express = require('express');
const mysql = require('mysql')

const app = express();
const connection = mysql.createConnection(process.env.DATABASE_URL)
console.log('Connected to PlanetScale!')

require('dotenv').config()

app.use(express.json());
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});

app.get('/', (req, res) => {
    res.send('Welcome to EPMATCH API!');
});


app.post('/CreateUser', async (req, res)=>{
    const { Mail, Password, Edad, Barrio, Sexo, EdadMin, EdadMax, Cumpleaos} = req.body;
    const creacion = await prisma.datospersonales.create({
        data:{
            "Mail": Mail,
            "Password": Password,
            "Edad": parseInt(Edad),
            "Barrio": Barrio,
            "Sexo": Sexo,
            "EdadMin": parseInt(EdadMin),
            "EdadMax": parseInt(EdadMax),
            "Cumpleaos": Cumpleaos
        }

    })
    res.json(creacion)
})

app.post('/FindUser', async (req, res) => {
    const { Mail, Password } = req.body;
    const user = await prisma.datospersonales.findFirst({
      where: {
        Mail: Mail,
        Password: Password
        }
    }); 
    res.json(user);
  });


app.post('/AddActivity', async (req, res) => {
    const { activity } = req.body;
    const crear = await prisma.intereses.create({
        data:{
            "Interes": activity
        }
    })
    res.json(crear)
})

app.post('/RegisterActivity', async (req, res)=> {
    const {userId, activity} = req.body;
    const find = await prisma.intereses.findUnique({
        where:{
            "Interes": activity
        }
    })
    if(find != null){
    const activityId = find.id;
    const register = await prisma.interesesusuario.create({
        data:{
            "IdUsuario": userId,
            "IdInteres": activityId

        }
    })
    res.json(register);
    }
    else{
        res.send("No existe esa actividad");
    }
})
module.exports = app;