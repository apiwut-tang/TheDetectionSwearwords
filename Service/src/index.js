import express from "express";
import http from "http";
import { spawn } from "child_process";
import fileUpload from "express-fileupload";
import cors from 'cors';
import fs from 'fs';

const app = express();

app.use(express.urlencoded({ extended: false, limit: "2mb" }));
app.use(express.json({ limit: "2mb" }));
app.use(cors())
app.use(fileUpload());

var movies = [
  {
    id: 0,
    name: "The Flash",
    type: "series",
    isPublished: false,
  },
];


app.post("/upload", async (req, res) => {
  try {
    console.log(req.files);
    if (!req.files) {
      res.status(400).send("no file");
    } else {
      const file = req.files.file;
      const tempFile = new Date().getTime() + "_" + file.name;
      file.mv("./Datafile/" + tempFile);
      const msg = "Save Success!";
      const data = {
        filename: tempFile,
      }
      const result = await convert(tempFile); //convert file
      res.status(200).send({ message: result, filename: data , Status : msg  });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});


function convert(file){
  var dataToSend
  return new Promise((resolve,reject) => {
    const python = spawn('python', ['./Tools/Profanity_Model/Convert_Speech_word_timestamp.py',file]);
    python.stdout.on('data', function (data) {
      //console.log(data)
      dataToSend = data.toString();
     });
  
     python.stderr.on('data', function (err) {
      console.log(err)
      reject(err);
     });
     // in close event we are sure that stream from child process is closed
     python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
     // send data to browser
        console.log(dataToSend)
        resolve(dataToSend);
     });
  });
}

app.get("/video/:filename", (req, res) => {
  const { filename } = req.params;
  const path = './Datafile/mute'+filename;
  res.sendFile(path);
});

app.get("/Test", (req, res) => {
  var dataToSend
  const message = "Hello Fucking World";
  const python = spawn('python', ['./Tools/Profanity_Model/resources/quickstart.py']);
  python.stdout.on('data', function (data) {
    console.log('Pipe data from python script ...');
    dataToSend = data.toString();
   });
   // in close event we are sure that stream from child process is closed
   python.on('close', (code) => {
   console.log(`child process close all stdio with code ${code}`);
   console.log(dataToSend)
   // send data to browser
   res.send(dataToSend)
   });
  // res.send(message);
});

app.get("/TestAPI", (req, res) => {
  var dataToSend
  const python = spawn('python', ['/Service/API/api.py']);
  python.stdout.on('data', function (data) {
    console.log('Pipe data from python script ...');
    dataToSend = data.toString();
   });
   // in close event we are sure that stream from child process is closed
   python.on('close', (code) => {
   console.log(`child process close all stdio with code ${code}`);
   // send data to browser
   console.log(dataToSend)
   res.send(dataToSend)
   });
  // res.send(message);
});

app.get('/download/:id', function(req, res){
  const { id } = req.params;
  //const file = `${__dirname}`+'./Datafile/mute/'+_file;
  const file = "/Service/Datafile/mute/"+id
  console.log(file)
  res.download(file); // Set disposition and send it.
});



app.get("/", (req, res) => {
  const message = "Welcome";
  console.log(message)
  res.send(message);
});


app.get("/api/movies", (req, res) => {
  console.log(req.query)
  res.send(movies);
});

app.get("/api/movies/:id", (req, res) => {
  console.log(req.params)
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id == id);
  res.send(movie);
});

app.post("/api/movies", (req, res) => {
  console.log(req.body);
  const movie = req.body;
  if (movie) {
    movies.push(movie);
  }
  const message = "Save Success!";
  res.send(message);
});

app.put("/api/movies/:id", (req, res) => {
  let message = "Update Success!";
  const { id } = req.params;
  const movie = req.body;
  const index = movies.findIndex((item) => item.id == id);
  if (movies[index]) {
    movies[index] = movie;
  } else {
    message = "Update failed!";
  }
  res.send(message);
});

app.delete("/api/movies/:id", (req, res) => {
  let message = "Delete Success!";
  const { id } = req.params;
  const index = movies.findIndex((item) => item.id == id);
  if (movies[index]) {
    movies.splice(index, 1);
  } else {
    message = "Delete failed!";
  }
  res.send(message);
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port${port}...`));

module.exports = app;
