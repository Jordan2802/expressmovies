const express = require('express');
const app = express();
const bodyParser = require('body-parser'); 
const multer = require('multer');
const upload = multer();
const jwt = require('jsonwebtoken');


const PORT = 3000;
let frenchMovies = [];

app.use('/public',express.static('public'));//permet d'indiquer quelle sont les middlewares que l'on veut ajouter
//app.use(bodyParser.urlencoded({extended: false}));// permet de recuperer le contenu du body (formulaire ect)

app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/movies', (req, res) => {

   const title = 'Films français des trentes dernières années' 

    frenchMovies= [
       {title: 'Le fabuleux destin d\'Amélie Poulain', year: 2001},
       {title: 'Buffet froid', year: 1979},
       {title: 'Le diner de cons', year: 1998},
       {title: 'De rouille de d\'os', year: 2012}
   ];
   res.render('movies', {
       movies: frenchMovies,
       title
   });
});

var urlencodedParser = bodyParser.urlencoded({extended: false});// pour utiliser les body parser uniquement sur /movies

// app.post('/movies', urlencodedParser, (req, res) => {
//     console.log('le titre :',req.body.movietitle);
//     console.log('année :',req.body.movieyear);
//     const newMovie = { title: req.body.movietitle, year: req.body.movieyear  };
//     frenchMovies = [...frenchMovies, newMovie];//  equivaut à push 
//     console.log(frenchMovies);
//     res.sendStatus(201);
// });

app.post('/movies',upload.fields([]), (req, res) => {
    if(!req.body){
        return res.sendStatus(500);
    }else {
        const formData = req.body;
        console.log('formData : ', formData);
        const newMovie = { title: req.body.movietitle, year: req.body.movieyear  };
        frenchMovies = [...frenchMovies, newMovie];
        res.sendStatus(201);
    }
})


app.get('/movies/add', (req, res) => {
    res.send('Prochainement, un formulaire d\'ajout ici');
});

app.get('/movie-search', (req, res) => {
    res.render('movie-search');
});

app.get('/login', (req, res) => {
    res.render('login', {
        title : 'Connexion'
    });
});

const fakeUser = {email: 'testuser@testmail.fr', password: 'qsd'};
const secret = 'qsdjS12ozehdoIJ123DJOZJLDSCqsdeffdg123ER56SDFZedhWXojqshduzaohduihqsDAqsdq';

app.post('/login', urlencodedParser, (req, res) => {
    console.log('login post', req.body);
    if(!req.body){
        return res.sendStatus(500);
    }else {
        if(fakeUser.email === req.body.email && fakeUser.password === req.body.password) {
            const myToken = jwt.sign({iss: `http://expressmovies.fr`, user: 'Sam', role: 'moderator'}, secret);
           res.json(myToken); 
        } else {
            res.sendStatus(401);
        }
    }
})

app.get('/movies/:id', (req, res) => {
    const movieid = req.params.id;
   // res.send(`film numéro ${id}`);
   res.render('movie-details', {
       movieid//movieid:movieid(:const)
   });
});


app.get('/', (req, res) => {
   // res.send('hello <b>world!!!!!</b> ');
    res.render('index');
});

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});