const NoteModel = require('../Models/noteModel');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const cron = require('node-cron');

function getNotes(req,res) {
    console.log(req.query._id);
    return new Promise((resolve, reject) => {
        NoteModel.findById({_id: req.params.id}).then((data) => {
            resolve(data)
        }).catch(err => {
            reject(err)
        })
    })
}

function addNote(note) {
    return new Promise((resolve, reject) => {
        NoteModel.findOne({ _id: note.body._id }).then((data) => {
            console.log(note.body._id);
            if (data) {
                NoteModel.findOneAndUpdate(
                    { _id: note.body._id },
                    {
                        $push: {
                            Notes: {
                                _id: uuidv4(),
                                title: note.body.title,
                                isFav: note.body.isFav,
                                isArchive: note.body.isArchive,
                                isTrash: note.body.isTrash,
                                description: note.body.description,
                                deadline: note.body.deadline,
                                status: note.body.status
                            }
                        }
                    }
                ).then((data) => {
                    if (data) {
                        resolve('note added');
                    } else {
                        reject('error occurred');
                    }
                }).catch((err) => {
                    reject(err);
                });
            } else {
                let newnote = new NoteModel({
                    _id: note.body._id,
                    Notes: [{
                        _id: uuidv4(),
                        title: note.body.title,
                        isFav: note.body.isFav,
                        isTrash: note.body.isTrash,
                        isArchive: note.body.isArchive,
                        description: note.body.description,
                        deadline: note.body.deadline,
                        status: note.body.status
                    }]
                });

                newnote.save().then((data) => {
                    resolve('new note created successfully');
                    console.log(data)
                }).catch((err) => {
                    reject(err);
                });
            }
        }).catch((err) => {
            reject(err);
        });
    });
}







function deleteNote(note) {
    console.log(note.body)
    return new Promise((resolve, reject) => {
        NoteModel.findOneAndUpdate({ _id: note.body.id }, { $pull: { Notes: { _id: note.body.Noteid } } })
            .then((data) => {
                resolve(data)
            })
            .catch((err) => {
                reject(err); 
            });
    });
}


function updateNote(note) {
    return new Promise((resolve, reject) => {
        NoteModel.findOneAndUpdate(
            { _id: note.body._id, "Notes._id": note.params.id },
            {
                $set: {
                    "Notes.$.title": note.body.title,
                    "Notes.$.description": note.body.description,
                    "Notes.$.deadline": note.body.deadline,
                    "Notes.$.status": note.body.status
                }
            },
            { new: true }
        ).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err)
        })
    });
}

function updateFav(note) {
    return new Promise((resolve,reject)=>{
        NoteModel.findOneAndUpdate({_id :note.body._id },{ $set: { "Notes.$[elem].isFav" : note.body.isFav } },
        { arrayFilters: [{ "elem._id": note.params.id }], new: true })
        .then((data)=>{
            resolve(data);
        })
        .catch((err)=>{
            reject(err)
        })
    });
}

function setArchive(note) {
    return new Promise((resolve,reject)=>{
        console.log(note.body)
        NoteModel.findOneAndUpdate({_id :note.body._id },{ $set: { "Notes.$[elem].isArchive" : note.body.isArchive } },
        { arrayFilters: [{ "elem._id": note.params.id }], new: true })
        .then((data)=>{
            resolve(data);
        })
        .catch((err)=>{
            reject(err)
        })
    });
}

function updateTrash(note) {
    console.log(note.body)
    return new Promise((resolve,reject)=>{
        NoteModel.findOneAndUpdate({_id :note.body._id },{ $set: { "Notes.$[elem].isTrash" : note.body.isTrash } },
        { arrayFilters: [{ "elem._id": note.params.id }], new: true })
        .then((data)=>{
            resolve(data);
        })
        .catch((err)=>{
            reject(err)
        })
    });
}
function sendReminders() {
    // Schedule a task every day at a specific time (adjust as needed)
    cron.schedule('30 13 * * *', async () => {
      try {
        const currentDate = new Date();
        const notes = await NoteModel.find({ 'Notes.deadline': { $lte: currentDate } });
  
        if (notes.length > 0) {
          // Send reminders for each note
          notes.forEach(async (note) => {
            const overdueNotes = note.Notes.filter((n) => n.deadline <= currentDate);
            if (overdueNotes.length > 0) {
              const user = await UserModel.findById(note._id); // Assuming _id is the user ID associated with notes
              if (user && user.email) {
                // Send email reminders
                const transporter = nodemailer.createTransport({
                  service: process.env.SERVICE,
                  auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASS,
                  },
                });
  
                const mailOptions = {
                  from: process.env.EMAIL,
                  to: user.email,
                  subject: 'Reminder: Pending Notes',
                  text: `You have overdue notes. Check your notes in this website ${process.env.CLIENT_URL}`,
                };
  
                transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                    console.error('Error sending reminder email:', error);
                  } else {
                    console.log('Reminder email sent:', info.response);
                  }
                });
              }
            }
          });
        }
      } catch (error) {
        console.error('Error sending reminders:', error);
      }
    });
  }
module.exports = { getNotes, addNote, deleteNote, updateNote, updateFav, setArchive , updateTrash ,sendReminders};