const express = require('express')
const app = express()

const fs = require('fs')

app.set('view engine', 'pug')
app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: false}))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/create', (req, res) => {
    res.render('create')
})

app.post('/create', (req, res) => {
    const title = req.body.title
    const description = req.body.description

    if(title.trim() === '' && description.trim() === '') {
        res.render('create', { error: true })
    } 
    else {
        fs.readFile('./data/wiki.json', (err, data) =>{
            if (err) throw err

            const wiki = JSON.parse(data)

            wiki.push({
                id: id (),
                title:title,
                description: description,
            })

            fs.writeFile('./data/wiki.json', JSON.stringify(wiki), err => {
                if (err) throw err

                res.render('create', { success:true })
            })
        })
    }

    
})



app.get('/wiki', (req, res)=>{

    fs.readFile('./data/wiki.json', (err, data) => {
        if (err) throw err

        const wikis = JSON.parse(data)
        res.render('wiki', { wikis: wikis})
    })
    
})


app.get('/archive', (req, res)=>{

    fs.readFile('./data/wiki.json', (err, data) => {
        if (err) throw err

        const wikis = JSON.parse(data)
        res.render('archive', { wikis: wikis})
    })
    
})

app.get('/wiki/:id', (req, res) => {
    const id = req.params.id
    fs.readFile('./data/wiki.json', (err, data) => {
        if (err) throw err

        const wikis = JSON.parse(data)
        const wiki = wikis.filter(wiki => wiki.id == id)[0]

        res.render('detail', { wiki: wiki })
    })
    
})

app.get('/wiki/:id/delete', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/wiki.json', (err, data) => {
        if (err) throw err

        const wikis = JSON.parse(data)
        const wiki = wikis.filter(wiki => wiki.id != id)

        fs.writeFile('./data/wiki.json', JSON.stringify(wiki), (err) => {
            if (err) throw err

            res.render('wiki', {wikis: wiki, deleted: true })
        })

        
    })
})

app.get('/api1/v1/wiki', (req, res) => {
    fs.readFile('./data/wiki.json', (err, data) => {
        if (err) throw err

        const wikis = JSON.parse(data)

        res.json(wikis)
    })
    
})

app.listen(5050, err => {
    if (err) console.log(err)
    console.log('Server is running')
})

function id () {
    return '_' + Math.random().toString(36).substr(2, 9);
}