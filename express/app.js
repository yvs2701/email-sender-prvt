'use strict';
const express = require('express')
const nodemailer = require('nodemailer')
const serverless = require('serverless-http')

const app = express()
const router = express.Router();

router.use(express.urlencoded({ extended: false }))
router.use(express.json())

router.get('/', function (req, res) {
    res.status(200).json({ success: true, data: 'Hello World!' })
})

router.post('/send', function (req, res) {

    const date = new Date();
    const stamp = date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })

    console.log({ body: req.body, timestamp: stamp })

    if (req.body.APIKEY && req.body.APIKEY === process.env.ACCEPTED_API_KEY) {
        const { from, password, smtp, port, fromName, to, subject, text, html, disableFileAccess } = req.body

        if (typeof fromName === 'string' && typeof to === 'string' && typeof subject === 'string'
            && typeof text === 'string' && typeof html === 'string' && typeof disableFileAccess === 'boolean') {

            const transporter = nodemailer.createTransport({
                host: smtp,
                port: port,
                secure: false,
                auth: {
                    user: from,
                    pass: password
                },
            })

            return new Promise(async (resolve, reject) => {
                const info = await transporter.sendMail({
                    from: `"${fromName}" <${from}>`,
                    to: to,
                    subject: subject,
                    text: text,
                    html: html,
                    disableFileAccess: disableFileAccess
                })

                console.log(info)
                res.status(200).json({ success: true, data: info })

                resolve()
            })
        }
    } else {
        res.status(401).json({ success: false, data: 'API key not specified or invalid!' })
    }
})

app.use('/.netlify/functions/app', router)  // path must route to serverless fn

module.exports = app
module.exports.handler = serverless(app)