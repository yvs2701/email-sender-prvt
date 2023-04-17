require('dotenv').config()
const express = require('express')
const nodemailer = require('nodemailer')
const app = express()

const PORT = process.env.port || 3000

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_SMTP,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    },
})

app.get('/', function (_, res) {
    res.status(200).json({ success: true, data: 'Send a post request on /send route along with credentials to send emails!' })
})

app.post('/send', function (req, res) {
    if (req.body.APIKEY && req.body.APIKEY === process.env.ACCEPTED_API_KEY) {
        const { fromName, to, subject, text, html, disableFileAccess } = req.body

        if (typeof fromName === 'string' && typeof to === 'string' && typeof subject === 'string'
            && typeof text === 'string' && typeof html === 'string' && typeof disableFileAccess === 'boolean') {
            return new Promise(async (resolve, reject) => {
                const info = await transporter.sendMail({
                    from: `"${fromName}" <${process.env.MAIL_USER}>`,
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

app.listen(PORT, () => { console.log('Listening on port', PORT) })