const { default: mongoose } = require('mongoose')
const Schema = mongoose.Schema

const CategoriesSchema = new Schema({
    name : {
        type:String,
        required:true,
        unique:true
    }

})

module.exports = mongoose.model('Categories',CategoriesSchema)
