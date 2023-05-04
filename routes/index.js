const express = require('express');
const router = express.Router();
const Data = require('../models/Data')

const { 
    Login,
    SignIn
} = require('../controller/Auth');

router.get('/data', async (req, res) => {
    Data.find({}).then(data => {
        res.status(200).send({ data: data })
    }).catch(err => {
        res.status(402).send({ err: err })
    });
})

router.put('/filter', async (req, res) => {
    const {
        end_year,
        sector,
        region,
        pestle,
        country,
        topic,
        source,
        title
    } = req.body;

    const regextitle = new RegExp(title, 'i'); 
    const regexcountry = new RegExp(country, 'i'); 
    const regextopic = new RegExp(topic, 'i'); 
    const regexsource = new RegExp(source, 'i'); 

    await Data.find({ title: { $regex: regextitle }, country: { $regex: regexcountry }, topic: { $regex: regextopic }, source: { $regex: regexsource }, end_year: { $in: end_year }, sector: { $in: sector }, region: { $in: region }, pestle: { $in: pestle }  }).then(data => {
        console.log(data.length);
        res.status(200).send({ data: data })
    }).catch(err => {
        res.status(402).send({ err: err })
    });
})

router.post('/login', Login)
router.post('/signin', SignIn)

module.exports = router;