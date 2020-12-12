const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const config = require('@femto-apps/config')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const redis = require('redis')
const authenticationConsumer = require('@femto-apps/authentication-consumer')
const cors = require('cors')

const User = require('../modules/User')

class Router extends express.Router {
    constructor() {
        super()

        this.parseURLEncoded = Router.parseURLEncoded
        this.parseCookies = Router.parseCookies
        this.setupSessions = Router.setupSessions
        this.setupAuthentication = Router.setupAuthentication
        this.enableRendering = Router.enableRendering
        this.addNav = Router.addNav
        this.cors = cors
        this.parseUser = Router.parseUser
    }

    static addNav(req, res, next) {
        const links = []

        if (res.locals.auth) {
            if (req.user) {
                links.push({ title: 'Logout', href: res.locals.auth.getLogout(`${config.get('authenticationConsumer.endpoint')}${req.originalUrl}`) })

                res.locals.user = req.user
            } else {
                links.push({ title: 'Login', href: res.locals.auth.getLogin(`${config.get('authenticationConsumer.endpoint')}${req.originalUrl}`) })
            }
        }

        res.locals.nav = {
            title: `${config.get('title.suffix')}`,
            links
        }

        next()
    }

    static enableRendering() {
        this.use((req, res, next) => {
            function sendPage(view, object) {
                return res.render(view, Object.assign({
                    page: { title: `${object.title} :: ${config.get('title.suffix')}` },
                    user: req.user
                }, object))
            }

            res.page = sendPage

            next()
        })
    }

    static parseURLEncoded() {
        this.use(bodyParser.urlencoded({ extended: true }))
    }

    static parseCookies() {
        this.use(cookieParser(config.get('cookie.secret')))
    }

    static async parseUser(req, res, next) {
        if (req.user) {
            req.user = await User.fromUserCached(req.user)
        }

        if (req.body && req.body.apiKey && !req.user) {
            req.user = await User.fromApiKey(req.body.apiKey)
        }

        next()
    }

    static setupSessions() {
        const redisClient = redis.createClient({
            host: config.get('redis.host'),
            port: config.get('redis.port')
        })

        this.session = session({
            store: new RedisStore({
                client: redisClient
            }),
            secret: config.get('session.secret'),
            resave: false,
            saveUninitialized: false,
            name: config.get('cookie.name'),
            cookie: {
                maxAge: config.get('cookie.maxAge')
            }
        })
    }

    static setupAuthentication() {
        this.authenticate = authenticationConsumer({
            tokenService: { endpoint: config.get('tokenService.endpoint') },
            authenticationProvider: { endpoint: config.get('authenticationProvider.endpoint'), consumerId: config.get('authenticationProvider.consumerId') },
            authenticationConsumer: { endpoint: config.get('authenticationConsumer.endpoint') },
            redirect: config.get('redirect')
        })
    }
}

module.exports = Router