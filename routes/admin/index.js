const express = require('express')
const router = express.Router()
const Categories = require('../../models/Categories')
const Post = require('../../models/Post')
const path = require('path');




router.get('/', (req, res) => {
    res.render('admin/index')
})


router.get('/categories', (req, res) => {
    Categories.find().sort({name:1}).lean()
    .then((categories)=>{
        res.render('admin/categories',{categories:categories})
    })
    .catch(err=>{
        console.error(err)
        res.status(500).send('SUNUCU HATASI')
    })
})

router.get('/posts',(req,res)=>{
    Post.find({})
    .populate({path:'categories',model: 'Categories'})
    .sort({$id:-1})
    .lean()
    .then((posts)=>{
        res.render('admin/posts',{posts:posts})
    })
    .catch(err=>{
        console.error(err)
        res.status(500).send('Sunucu hatası')
    })
})



router.post('/categories', (req, res) => {
    Categories.create({
        ...req.body
    })
        .then(() => {
            res.redirect('/admin/categories'); 
        })
        .catch(err => {
            console.error(err)
        })
})

router.delete('/categories/:id',(req,res)=>{
    Categories.findByIdAndDelete(req.params.id)
    .then(()=>{
        res.redirect('/admin/categories')

    })
    .catch(err=>{
        console.error(err)
        res.status(500).send('Sunucu hatası')

    })
})

router.delete('/posts/:id',(req,res)=>{
    Post.deleteOne({_id: req.params.id})
    .then(()=>{
        res.redirect('/admin/posts')
    })
    .catch(err=>{
        console.error(err)
        res.status(500).send('SUNUCU HATASI ROUTER.DELETE')
    })
})

router.get('/posts/edit/:id',(req,res)=>{
    Post.findOne({_id:req.params.id}).lean()
    .then((post)=>{
        Categories.find({}).then(categories=>{
            res.render('admin/edit-post',{post:post,categories:categories})
        })
    })
})

router.put('/posts/:id', (req, res) => {
    // Dosya yükleme kontrolü yap
    if (!req.files || !req.files.post_image) {
        return res.status(400).send('Yüklenen dosya bulunamadı.');
    }

    let post_image = req.files.post_image;
    // Dosyayı belirtilen klasöre taşı
    post_image.mv(path.resolve(__dirname, '../../public/img/postimages', post_image.name), (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        // Post'u veritabanında ara
        Post.findOne({ _id: req.params.id }).lean()
        .then((post) => {
            // Post bulunamadıysa hata mesajı gönder
            if (!post) {
                return res.status(404).send('Post bulunamadı.');
            }

            // Post özelliklerini güncelle
            post.title = req.body.title;
            post.content = req.body.content;
            post.date = req.body.date;
            post.categories = req.body.categories;
            post.post_image = `/img/postimages/${post_image.name}`;

            // Güncellenmiş postu kaydet ve yönlendir
            Post.updateOne({ _id: req.params.id }, post).then(() => {
                res.redirect('/admin/posts');
            }).catch(err => {
                res.status(500).send('Post güncellenirken bir hata oluştu.');
            });
        })
        .catch(err => {
            res.status(500).send('Veritabanında bir hata oluştu.');
        });
    });
});



module.exports = router