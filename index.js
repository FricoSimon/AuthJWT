const express = require('express')
const jwt = require('jsonwebtoken') // token generator
const crypto = require('crypto') // cryptography
const app = express()
const port = 3000
app.use(express.json()) // same with body-parser

const generateToken = () => {
    const buffer = crypto.randomBytes(64)
    const token = buffer.toString('hex')
    return token
}
const secret = generateToken() // for secret

const verify = (req, res, next) => {
    const bearer = req.headers.bearer
    jwt.verify(bearer, secret, { expiresIn: '25s' }, (err, data) => {
        if (err) {
            console.log(err.message)
            res.send(err)
            return
        }
        req.body = data
        next()
    })
}

app.post('/', verify, (req, res) => {
    res.json({
        message: "login bisa",
        data: req.body
    })
})

app.post('/login', (req, res) => {
    const user = {
        id: 1,
        email: "friko@gmail.com",
        username: "friko"
    }
    jwt.sign(user, secret, { expiresIn: '30s' }, (err, token) => {
        if (err) {
            console.log(err)
            res.json({
                message: "login gagal",
                statusCode: 304
            })
            return
        }
        const tokens = token
        res.json({
            user: user,
            token: tokens
        })
    })
})

app.put('/', (req, res) => {
    res.send("update berhasil")
})

app.delete('/', (req, res) => {
    res.send("terhapus")
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
