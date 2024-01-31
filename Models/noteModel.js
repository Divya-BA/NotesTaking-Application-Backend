const mongoose = require('mongoose');
const noteSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    Notes: [
        {
            type: new mongoose.Schema({
               _id: {
                type: String,
                required: true
               },
               isFav: {
                type: Boolean,
                required: true
               },
               isArchive: {
                type: Boolean,
                required: true
               },
               isTrash: {
                type: Boolean,
                required: true,
               },
               title: {
                type: String,
                required: true
               },
               description: {
                type: String,
                required: true
               },
               deadline: {
                type: Date,
                required: true,
               },
               status: {
                type: String,
                enum: ['Pending', 'Completed', 'InProgress'],
                default: 'Pending',
               }
            }, { timestamps: true })
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('NoteModel', noteSchema, 'Notes');
