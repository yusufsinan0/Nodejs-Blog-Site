const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const path = require('path');
const Categories = require('../models/Categories');
const Users = require('../models/Users')
const Contact = require('../models/Contact')


router.get('/', (req, res) => {
    console.log(req.session)
    res.render('site/index');
});

/* router.get('/admin', (req, res) => {
    res.render('admin/index');
}); */

router.get('/contact', (req, res) => {
    res.render('site/contact');
});

router.post('/contact',(req,res)=>{
    if(!req.body){
        res.status(500).send('Sunucu hatası')
    }

    Contact.create(req.body)
    .then(()=>{
        req.session.sessionFlash={
            type:'alert alert-success',
            message:'formunuz başarılı olarak gönderildi'
        }
        res.redirect('/contact')
    })
    .catch(err=> {
        console.error(err)
    })
})

router.get('/blog', (req, res) => {
    Post.find({}).populate({path:'author',model:'Users'}).sort({$natural:-1}).lean().then(posts => {
        Categories.find().lean()
        .then((categories)=>{
            res.render('site/blog', { posts: posts , categories:categories });

        })
    }).catch(err => console.error(err));
});





router.get('/posts/:id', (req, res) => {

    Post.findById(req.params.id)
        .populate({ path: 'author', model: 'Users' })
        .lean()
        .then(post => {
            if (!post) {
                return res.status(404).send("Post not found");
            }

            Categories.find({})
                .lean()
                .then(categories => {
                    if (!categories) {
                        return res.status(404).send("Categories not found");
                    }

                    res.render('site/post', { post: post, categories: categories });
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).send("Internal Server Error");
                });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Internal Server Error");
        });
});


router.get('/add-post', (req, res) => {
    if(!req.session.userId){
        res.redirect('/users/login')
    }
    Categories.find({}).lean()
    .then((categories)=>{
        res.render('site/add-post',{categories:categories})

    })
});


router.post('/posts/test', (req, res) => {
    if (!req.files || !req.files.post_image) {
        return res.status(400).send('Dosya bulunamadı');
    }

    let post_image = req.files.post_image;
    post_image.mv(path.resolve(__dirname, '../public/img/postimages', post_image.name));

    // req.body.category bir string (kategori _id'si) olarak gelecektir
    Post.create({
        title: req.body.title,
        content: req.body.content,
        post_image: `/img/postimages/${post_image.name}`,
        category: req.body.category ,
        author : req.session.userId
    })
    .then(() => {
        req.session.sessionFlash = {
            type: 'alert alert-success',
            message: 'Blog başarılı şekilde oluşturuldu'
        };
        res.redirect('/blog');
    })
    .catch(err => {
        console.error(err);
        res.status(500).send('SUNUCU HATASI');
    });
});

router.get('/categories/categoryId',(req,res)=>{
    Post.find({category:req.params.categoryId})
    .populate({path:'category',model:Categories})
    .then(posts=>{

    })
})


module.exports = router;
