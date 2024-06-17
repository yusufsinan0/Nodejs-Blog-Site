const express = require('express');
const router = express.Router();
const Users = require('../models/Users')
const session = require('express-session')



router.get('/register',(req,res)=>{
    console.log(req.body)



    res.render('site/register')
})

router.get('/login',(req,res)=>{
    res.render('site/login')
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Users.findOne({ email });

        if (user) {
            if (user.password === password) {
                req.session.userId = user._id; // Oturum açan kullanıcının ID'sini session'a kaydedin
                res.redirect('/');
            } else {
                res.redirect('/users/login');
            }
        } else {
            res.redirect('/users/login');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Sunucu hatası');
    }
});

  
  // Register route
  router.get('/register', (req, res) => {
    res.render('site/register');
  });

router.post('/register',(req,res)=>{
    if(!req.body){
        res.status(500).send('Dosya bulunamadı')
    }
    Users.create(req.body)
    .then((user)=>{
        req.session.sessionFlash = {
            type:'alert alert-success',
            message:`Başarılı şekilde kayıt oldunuz ${user.username} `
        }
        res.redirect('/users/login')
    })
    .catch(err=>{
        console.error(err)
        res.redirect('/users/register')
    })
})

module.exports = router;
