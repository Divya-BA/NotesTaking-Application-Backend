const mongoose = require('mongoose');
const noteSchema = mongoose.Schema({
    _id: {
        type: String,
        require: true
    },
    Notes: [
        {
            type: new mongoose.Schema({

               _id:{
                type: String,
                require:true
               },
               isFav:{
                type: Boolean,
                require:true
               },
               isArchive:{
                type: Boolean,
                require:true
               },
               isTrash:{
                type: Boolean,
                require: true,
               },
               title:{
                type:String,
                require:true
               },
               description:{
                type: String,
                require:true
               }
            }
            , { timestamps: true }
            )
        }
    ]

}, { timestamps: true });

module.exports = mongoose.model('NoteModel', noteSchema, 'Notes');

