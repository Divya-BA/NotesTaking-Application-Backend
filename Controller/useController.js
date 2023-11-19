const repo = require('../Repository/noteRepo');

function GetNotes(req, res) {
    repo.getNotes(req).then(data => {
        res.status(200).send(data)
    })
}


function AddNote(req, res) {
    repo.addNote(req).then(data => {
        res.status(201).send(data);
    }).catch((err)=>{
        res.status(404).send(err)
    })

}

function DeleteNote(req,res) {
    repo.deleteNote(req).then(data => {
        res.status(200).send(data);
    })
}

function UpdateNote(req, res) {
    repo.updateNote(req).then(data => {
        res.status(200).send(data)
    })
}
function UpdateFav(req, res) {
    repo.updateFav(req).then(data => {
        res.status(200).send(data)
    })
}

function SetArchive(req, res) {
    console.log(req.body)
    repo.setArchive(req).then(data => {
        res.status(200).send(data)
    })
}

function UpdateTrash(req, res) {
    console.log(req.body)
    repo.updateTrash(req).then(data => {
        res.status(200).send(data)
    })
}

module.exports = { GetNotes, AddNote, DeleteNote, UpdateNote, UpdateFav,SetArchive, UpdateTrash }