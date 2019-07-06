const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')


// Initialize Express
const app = express()
// Define port for Heroku
const port = process.env.PORT || 3000

// Path for public content
app.use(express.static(path.join(__dirname, '../public')))

// Define paths for Express config
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Handlebars (hbs) setting up
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Routes
app.get('', (req, res) => {
    // Get view and convert it to html
    // First arg is the hbs file name, and the second is the injected values
    res.render('index', {
        title: 'Weather App',
        name: 'Paulo Coronado'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Paulo Coronado'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text...',
        title: 'Help',
        name: 'Paulo Coronado'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, data) => {
        if (error) {
            return res.send({
                error: error
            })
        }

        forecast(data.latitude, data.longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error: error
                })
            }

            // console.log(data.location)
            // console.log(forecastData)
            return res.send({
                location: data.location,
                forecast: forecastData,
                address: req.query.address
            })
        })
    })

    // res.send({
    //     forecast: 'It is snowing',
    //     location: 'Philadelphia',
    //     address: req.query.address
    // })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term!'
        })
    }
    res.send({
        products: []
    })
})

// 404 routes (should be the last route)
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Paulo Coronado',
        errorMessage: 'Help article not found!'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Paulo Coronado',
        errorMessage: 'Page not found!'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})