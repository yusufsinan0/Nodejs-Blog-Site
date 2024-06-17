const mongoose = require('mongoose');
const Post = require('./models/Post');

mongoose.connect('mongodb://127.0.0.1:27017/test')
    .then(() => console.log('Connected!'))
    .catch(err => console.error('Connection error', err));

    

    /*

    Post.create({
        title: 'İkinci123  Post Başlığım.',
        content: 'İkinci213 Post içeriği, lorem ipsum.'
    }).then(post => {
        console.log(post);
    }).catch(err => {
        console.error(err);
    });

    */
    

  
   async function postFindByIdDelete(){
    try{
        const post = await Post.findByIdAndDelete('666724289dd768a68696089a')
        console.log(post)

    }catch(error){
        console.log(error)
    }
   }

/*     async function postFindByIdUpdate() {
        try {
            const post = await Post.findByIdAndUpdate(
                '666724289dd768a68696089a', 
                { title: 'Update Title' },
                { new: true } // Güncellenmiş belgeyi döndür
            );
            console.log(post);
        } catch (error) {
            console.error(error);
        }
    }
    postFindByIdUpdate() */
/*     async function postFindById(){
        try{
            const post = await Post.findById('666724289dd768a68696089a')
            console.log(post)

        }catch(error){
            console.error(error)
        }
    }
    postFindById()
 */

    /* async function findPostAll(){
        try{
            const post = await Post.find({title:'İkinci123  Post Başlığım.'})
            console.log(post)

        }catch(error){
            console.error(error)
        }
    }
    findPostAll() */


/* async function findPost(){
        try{
            const post = await Post.find({title:'İkinci123  Post Başlığım.'})
            console.log(post)

        }catch(error){
            console.error(error)

        }
}
findPost() 

*/
