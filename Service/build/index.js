"use strict";

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _child_process = require("child_process");

var _expressFileupload = require("express-fileupload");

var _expressFileupload2 = _interopRequireDefault(_expressFileupload);

var _cors = require("cors");

var _cors2 = _interopRequireDefault(_cors);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express2.default)();

app.use(_express2.default.urlencoded({ extended: false, limit: "2mb" }));
app.use(_express2.default.json({ limit: "2mb" }));
app.use((0, _cors2.default)());
app.use((0, _expressFileupload2.default)());

var movies = [{
  id: 0,
  name: "The Flash",
  type: "series",
  isPublished: false
}];

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
        filename: tempFile
      };
      const result = await convert(tempFile); //convert file
      res.status(200).send({ message: result, filename: data, Status: msg });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

function convert(file) {
  var dataToSend;
  return new _promise2.default((resolve, reject) => {
    const python = (0, _child_process.spawn)('python', ['./Tools/Profanity_Model/Convert_Speech_word_timestamp.py', file]);
    python.stdout.on('data', function (data) {
      //console.log(data)
      dataToSend = data.toString();
    });

    python.stderr.on('data', function (err) {
      console.log(err);
      reject(err);
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', code => {
      console.log(`child process close all stdio with code ${code}`);
      // send data to browser
      console.log(dataToSend);
      resolve(dataToSend);
    });
  });
}

app.get("/video/:filename", (req, res) => {
  const { filename } = req.params;
  const path = './Datafile/mute' + filename;
  res.sendFile(path);
});

app.get("/Test", (req, res) => {
  var dataToSend;
  const message = "Hello Fucking World";
  const python = (0, _child_process.spawn)('python', ['./Tools/Profanity_Model/resources/quickstart.py']);
  python.stdout.on('data', function (data) {
    console.log('Pipe data from python script ...');
    dataToSend = data.toString();
  });
  // in close event we are sure that stream from child process is closed
  python.on('close', code => {
    console.log(`child process close all stdio with code ${code}`);
    console.log(dataToSend);
    // send data to browser
    res.send(dataToSend);
  });
  // res.send(message);
});

app.get("/TestAPI", (req, res) => {
  var dataToSend;
  const python = (0, _child_process.spawn)('python', ['/Service/API/api.py']);
  python.stdout.on('data', function (data) {
    console.log('Pipe data from python script ...');
    dataToSend = data.toString();
  });
  // in close event we are sure that stream from child process is closed
  python.on('close', code => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    console.log(dataToSend);
    res.send(dataToSend);
  });
  // res.send(message);
});

app.get('/download/:id', function (req, res) {
  const { id } = req.params;
  //const file = `${__dirname}`+'./Datafile/mute/'+_file;
  const file = "/Service/Datafile/mute/" + id;
  console.log(file);
  res.download(file); // Set disposition and send it.
});

app.get("/", (req, res) => {
  const message = "Welcome";
  console.log(message);
  res.send(message);
});

app.get("/api/movies", (req, res) => {
  console.log(req.query);
  res.send(movies);
});

app.get("/api/movies/:id", (req, res) => {
  console.log(req.params);
  const { id } = req.params;
  const movie = movies.find(movie => movie.id == id);
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
  const index = movies.findIndex(item => item.id == id);
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
  const index = movies.findIndex(item => item.id == id);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJhcHAiLCJ1c2UiLCJleHByZXNzIiwidXJsZW5jb2RlZCIsImV4dGVuZGVkIiwibGltaXQiLCJqc29uIiwibW92aWVzIiwiaWQiLCJuYW1lIiwidHlwZSIsImlzUHVibGlzaGVkIiwicG9zdCIsInJlcSIsInJlcyIsImNvbnNvbGUiLCJsb2ciLCJmaWxlcyIsInN0YXR1cyIsInNlbmQiLCJmaWxlIiwidGVtcEZpbGUiLCJEYXRlIiwiZ2V0VGltZSIsIm12IiwibXNnIiwiZGF0YSIsImZpbGVuYW1lIiwicmVzdWx0IiwiY29udmVydCIsIm1lc3NhZ2UiLCJTdGF0dXMiLCJlcnIiLCJkYXRhVG9TZW5kIiwicmVzb2x2ZSIsInJlamVjdCIsInB5dGhvbiIsInN0ZG91dCIsIm9uIiwidG9TdHJpbmciLCJzdGRlcnIiLCJjb2RlIiwiZ2V0IiwicGFyYW1zIiwicGF0aCIsInNlbmRGaWxlIiwiZG93bmxvYWQiLCJxdWVyeSIsIm1vdmllIiwiZmluZCIsImJvZHkiLCJwdXNoIiwicHV0IiwiaW5kZXgiLCJmaW5kSW5kZXgiLCJpdGVtIiwiZGVsZXRlIiwic3BsaWNlIiwicG9ydCIsInByb2Nlc3MiLCJlbnYiLCJQT1JUIiwibGlzdGVuIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsTUFBTUEsTUFBTSx3QkFBWjs7QUFFQUEsSUFBSUMsR0FBSixDQUFRQyxrQkFBUUMsVUFBUixDQUFtQixFQUFFQyxVQUFVLEtBQVosRUFBbUJDLE9BQU8sS0FBMUIsRUFBbkIsQ0FBUjtBQUNBTCxJQUFJQyxHQUFKLENBQVFDLGtCQUFRSSxJQUFSLENBQWEsRUFBRUQsT0FBTyxLQUFULEVBQWIsQ0FBUjtBQUNBTCxJQUFJQyxHQUFKLENBQVEscUJBQVI7QUFDQUQsSUFBSUMsR0FBSixDQUFRLGtDQUFSOztBQUVBLElB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LFFBQU1LLFFBQVFuQyxJQUFJcUMsSUFBbEI7QUFDQSxRQUFNRyxRQUFROUMsT0FBTytDLFNBQVAsQ0FBa0JDLElBQUQsSUFBVUEsS0FBSy9DLEVBQUwsSUFBV0EsRUFBdEMsQ0FBZDtBQUNBLE1BQUlELE9BQU84QyxLQUFQLENBQUosRUFBbUI7QUFDakI5QyxXQUFPOEMsS0FBUCxJQUFnQkwsS0FBaEI7QUFDRCxHQUZELE1BRU87QUFDTGxCLGNBQVUsZ0JBQVY7QUFDRDtBQUNEaEIsTUFBSUssSUFBSixDQUFTVyxPQUFUO0FBQ0QsQ0FYRDs7QUFhQTlCLElBQUl3RCxNQUFKLENBQVcsaUJBQVgsRUFBOEIsQ0FBQzNDLEdBQUQsRUFBTUMsR0FBTixLQUFjO0FBQzFDLE1BQUlnQixVQUFVLGlCQUFkO0FBQ0EsUUFBTSxFQUFFdEIsRUFBRixLQUFTSyxJQUFJOEIsTUFBbkI7QUFDQSxRQUFNVSxRQUFROUMsT0FBTytDLFNBQVAsQ0FBa0JDLElBQUQsSUFBVUEsS0FBSy9DLEVBQUwsSUFBV0EsRUFBdEMsQ0FBZDtBQUNBLE1BQUlELE9BQU84QyxLQUFQLENBQUosRUFBbUI7QUFDakI5QyxXQUFPa0QsTUFBUCxDQUFjSixLQUFkLEVBQXFCLENBQXJCO0FBQ0QsR0FGRCxNQUVPO0FBQ0x2QixjQUFVLGdCQUFWO0FBQ0Q7QUFDRGhCLE1BQUlLLElBQUosQ0FBU1csT0FBVDtBQUNELENBVkQ7O0FBWUEsTUFBTTRCLE9BQU9DLFFBQVFDLEdBQVIsQ0FBWUMsSUFBWixJQUFvQixJQUFqQztBQUNBN0QsSUFBSThELE1BQUosQ0FBV0osSUFBWCxFQUFpQixNQUFNM0MsUUFBUUMsR0FBUixDQUFhLG9CQUFtQjBDLElBQUssS0FBckMsQ0FBdkI7O0FBRUFLLE9BQU9DLE9BQVAsR0FBaUJoRSxHQUFqQiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBleHByZXNzIGZyb20gXCJleHByZXNzXCI7XHJcbmltcG9ydCBodHRwIGZyb20gXCJodHRwXCI7XHJcbmltcG9ydCB7IHNwYXduIH0gZnJvbSBcImNoaWxkX3Byb2Nlc3NcIjtcclxuaW1wb3J0IGZpbGVVcGxvYWQgZnJvbSBcImV4cHJlc3MtZmlsZXVwbG9hZFwiO1xyXG5pbXBvcnQgY29ycyBmcm9tICdjb3JzJztcclxuaW1wb3J0IGZzIGZyb20gJ2ZzJztcclxuXHJcbmNvbnN0IGFwcCA9IGV4cHJlc3MoKTtcclxuXHJcbmFwcC51c2UoZXhwcmVzcy51cmxlbmNvZGVkKHsgZXh0ZW5kZWQ6IGZhbHNlLCBsaW1pdDogXCIybWJcIiB9KSk7XHJcbmFwcC51c2UoZXhwcmVzcy5qc29uKHsgbGltaXQ6IFwiMm1iXCIgfSkpO1xyXG5hcHAudXNlKGNvcnMoKSlcclxuYXBwLnVzZShmaWxlVXBsb2FkKCkpO1xyXG5cclxudmFyIG1vdmllcyA9IFtcclxuICB7XHJcbiAgICBpZDogMCxcclxuICAgIG5hbWU6IFwiVGhlIEZsYXNoXCIsXHJcbiAgICB0eXBlOiBcInNlcmllc1wiLFxyXG4gICAgaXNQdWJsaXNoZWQ6IGZhbHNlLFxyXG4gIH0sXHJcbl07XHJcblxyXG5cclxuYXBwLnBvc3QoXCIvdXBsb2FkXCIsIGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zb2xlLmxvZyhyZXEuZmlsZXMpO1xyXG4gICAgaWYgKCFyZXEuZmlsZXMpIHtcclxuICAgICAgcmVzLnN0YXR1cyg0MDApLnNlbmQoXCJubyBmaWxlXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3QgZmlsZSA9IHJlcS5maWxlcy5maWxlO1xyXG4gICAgICBjb25zdCB0ZW1wRmlsZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpICsgXCJfXCIgKyBmaWxlLm5hbWU7XHJcbiAgICAgIGZpbGUubXYoXCIuL0RhdGFmaWxlL1wiICsgdGVtcEZpbGUpO1xyXG4gICAgICBjb25zdCBtc2cgPSBcIlNhdmUgU3VjY2VzcyFcIjtcclxuICAgICAgY29uc3QgZGF0YSA9IHtcclxuICAgICAgICBmaWxlbmFtZTogdGVtcEZpbGUsXHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgY29udmVydCh0ZW1wRmlsZSk7IC8vY29udmVydCBmaWxlXHJcbiAgICAgIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHsgbWVzc2FnZTogcmVzdWx0LCBmaWxlbmFtZTogZGF0YSAsIFN0YXR1cyA6IG1zZyAgfSk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICByZXMuc3RhdHVzKDUwMCkuc2VuZChlcnIpO1xyXG4gIH1cclxufSk7XHJcblxyXG5cclxuZnVuY3Rpb24gY29udmVydChmaWxlKXtcclxuICB2YXIgZGF0YVRvU2VuZFxyXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSxyZWplY3QpID0+IHtcclxuICAgIGNvbnN0IHB5dGhvbiA9IHNwYXduKCdweXRob24nLCBbJy4vVG9vbHMvUHJvZmFuaXR5X01vZGVsL0NvbnZlcnRfU3BlZWNoX3dvcmRfdGltZXN0YW1wLnB5JyxmaWxlXSk7XHJcbiAgICBweXRob24uc3Rkb3V0Lm9uKCdkYXRhJywgZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgLy9jb25zb2xlLmxvZyhkYXRhKVxyXG4gICAgICBkYXRhVG9TZW5kID0gZGF0YS50b1N0cmluZygpO1xyXG4gICAgIH0pO1xyXG4gIFxyXG4gICAgIHB5dGhvbi5zdGRlcnIub24oJ2RhdGEnLCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGVycilcclxuICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgfSk7XHJcbiAgICAgLy8gaW4gY2xvc2UgZXZlbnQgd2UgYXJlIHN1cmUgdGhhdCBzdHJlYW0gZnJvbSBjaGlsZCBwcm9jZXNzIGlzIGNsb3NlZFxyXG4gICAgIHB5dGhvbi5vbignY2xvc2UnLCAoY29kZSkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBjaGlsZCBwcm9jZXNzIGNsb3NlIGFsbCBzdGRpbyB3aXRoIGNvZGUgJHtjb2RlfWApO1xyXG4gICAgIC8vIHNlbmQgZGF0YSB0byBicm93c2VyXHJcbiAgICAgICAgY29uc29sZS5sb2coZGF0YVRvU2VuZClcclxuICAgICAgICByZXNvbHZlKGRhdGFUb1NlbmQpO1xyXG4gICAgIH0pO1xyXG4gIH0pO1xyXG59XHJcblxyXG5hcHAuZ2V0KFwiL3ZpZGVvLzpmaWxlbmFtZVwiLCAocmVxLCByZXMpID0+IHtcclxuICBjb25zdCB7IGZpbGVuYW1lIH0gPSByZXEucGFyYW1zO1xyXG4gIGNvbnN0IHBhdGggPSAnLi9EYXRhZmlsZS9tdXRlJytmaWxlbmFtZTtcclxuICByZXMuc2VuZEZpbGUocGF0aCk7XHJcbn0pO1xyXG5cclxuYXBwLmdldChcIi9UZXN0XCIsIChyZXEsIHJlcykgPT4ge1xyXG4gIHZhciBkYXRhVG9TZW5kXHJcbiAgY29uc3QgbWVzc2FnZSA9IFwiSGVsbG8gRnVja2luZyBXb3JsZFwiO1xyXG4gIGNvbnN0IHB5dGhvbiA9IHNwYXduKCdweXRob24nLCBbJy4vVG9vbHMvUHJvZmFuaXR5X01vZGVsL3Jlc291cmNlcy9xdWlja3N0YXJ0LnB5J10pO1xyXG4gIHB5dGhvbi5zdGRvdXQub24oJ2RhdGEnLCBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgY29uc29sZS5sb2coJ1BpcGUgZGF0YSBmcm9tIHB5dGhvbiBzY3JpcHQgLi4uJyk7XHJcbiAgICBkYXRhVG9TZW5kID0gZGF0YS50b1N0cmluZygpO1xyXG4gICB9KTtcclxuICAgLy8gaW4gY2xvc2UgZXZlbnQgd2UgYXJlIHN1cmUgdGhhdCBzdHJlYW0gZnJvbSBjaGlsZCBwcm9jZXNzIGlzIGNsb3NlZFxyXG4gICBweXRob24ub24oJ2Nsb3NlJywgKGNvZGUpID0+IHtcclxuICAgY29uc29sZS5sb2coYGNoaWxkIHByb2Nlc3MgY2xvc2UgYWxsIHN0ZGlvIHdpdGggY29kZSAke2NvZGV9YCk7XHJcbiAgIGNvbnNvbGUubG9nKGRhdGFUb1NlbmQpXHJcbiAgIC8vIHNlbmQgZGF0YSB0byBicm93c2VyXHJcbiAgIHJlcy5zZW5kKGRhdGFUb1NlbmQpXHJcbiAgIH0pO1xyXG4gIC8vIHJlcy5zZW5kKG1lc3NhZ2UpO1xyXG59KTtcclxuXHJcbmFwcC5nZXQoXCIvVGVzdEFQSVwiLCAocmVxLCByZXMpID0+IHtcclxuICB2YXIgZGF0YVRvU2VuZFxyXG4gIGNvbnN0IHB5dGhvbiA9IHNwYXduKCdweXRob24nLCBbJy9TZXJ2aWNlL0FQSS9hcGkucHknXSk7XHJcbiAgcHl0aG9uLnN0ZG91dC5vbignZGF0YScsIGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICBjb25zb2xlLmxvZygnUGlwZSBkYXRhIGZyb20gcHl0aG9uIHNjcmlwdCAuLi4nKTtcclxuICAgIGRhdGFUb1NlbmQgPSBkYXRhLnRvU3RyaW5nKCk7XHJcbiAgIH0pO1xyXG4gICAvLyBpbiBjbG9zZSBldmVudCB3ZSBhcmUgc3VyZSB0aGF0IHN0cmVhbSBmcm9tIGNoaWxkIHByb2Nlc3MgaXMgY2xvc2VkXHJcbiAgIHB5dGhvbi5vbignY2xvc2UnLCAoY29kZSkgPT4ge1xyXG4gICBjb25zb2xlLmxvZyhgY2hpbGQgcHJvY2VzcyBjbG9zZSBhbGwgc3RkaW8gd2l0aCBjb2RlICR7Y29kZX1gKTtcclxuICAgLy8gc2VuZCBkYXRhIHRvIGJyb3dzZXJcclxuICAgY29uc29sZS5sb2coZGF0YVRvU2VuZClcclxuICAgcmVzLnNlbmQoZGF0YVRvU2VuZClcclxuICAgfSk7XHJcbiAgLy8gcmVzLnNlbmQobWVzc2FnZSk7XHJcbn0pO1xyXG5cclxuYXBwLmdldCgnL2Rvd25sb2FkLzppZCcsIGZ1bmN0aW9uKHJlcSwgcmVzKXtcclxuICBjb25zdCB7IGlkIH0gPSByZXEucGFyYW1zO1xyXG4gIC8vY29uc3QgZmlsZSA9IGAke19fZGlybmFtZX1gKycuL0RhdGFmaWxlL211dGUvJytfZmlsZTtcclxuICBjb25zdCBmaWxlID0gXCIvU2VydmljZS9EYXRhZmlsZS9tdXRlL1wiK2lkXHJcbiAgY29uc29sZS5sb2coZmlsZSlcclxuICByZXMuZG93bmxvYWQoZmlsZSk7IC8vIFNldCBkaXNwb3NpdGlvbiBhbmQgc2VuZCBpdC5cclxufSk7XHJcblxyXG5cclxuXHJcbmFwcC5nZXQoXCIvXCIsIChyZXEsIHJlcykgPT4ge1xyXG4gIGNvbnN0IG1lc3NhZ2UgPSBcIldlbGNvbWVcIjtcclxuICBjb25zb2xlLmxvZyhtZXNzYWdlKVxyXG4gIHJlcy5zZW5kKG1lc3NhZ2UpO1xyXG59KTtcclxuXHJcblxyXG5hcHAuZ2V0KFwiL2FwaS9tb3ZpZXNcIiwgKHJlcSwgcmVzKSA9PiB7XHJcbiAgY29uc29sZS5sb2cocmVxLnF1ZXJ5KVxyXG4gIHJlcy5zZW5kKG1vdmllcyk7XHJcbn0pO1xyXG5cclxuYXBwLmdldChcIi9hcGkvbW92aWVzLzppZFwiLCAocmVxLCByZXMpID0+IHtcclxuICBjb25zb2xlLmxvZyhyZXEucGFyYW1zKVxyXG4gIGNvbnN0IHsgaWQgfSA9IHJlcS5wYXJhbXM7XHJcbiAgY29uc3QgbW92aWUgPSBtb3ZpZXMuZmluZCgobW92aWUpID0+IG1vdmllLmlkID09IGlkKTtcclxuICByZXMuc2VuZChtb3ZpZSk7XHJcbn0pO1xyXG5cclxuYXBwLnBvc3QoXCIvYXBpL21vdmllc1wiLCAocmVxLCByZXMpID0+IHtcclxuICBjb25zb2xlLmxvZyhyZXEuYm9keSk7XHJcbiAgY29uc3QgbW92aWUgPSByZXEuYm9keTtcclxuICBpZiAobW92aWUpIHtcclxuICAgIG1vdmllcy5wdXNoKG1vdmllKTtcclxuICB9XHJcbiAgY29uc3QgbWVzc2FnZSA9IFwiU2F2ZSBTdWNjZXNzIVwiO1xyXG4gIHJlcy5zZW5kKG1lc3NhZ2UpO1xyXG59KTtcclxuXHJcbmFwcC5wdXQoXCIvYXBpL21vdmllcy86aWRcIiwgKHJlcSwgcmVzKSA9PiB7XHJcbiAgbGV0IG1lc3NhZ2UgPSBcIlVwZGF0ZSBTdWNjZXNzIVwiO1xyXG4gIGNvbnN0IHsgaWQgfSA9IHJlcS5wYXJhbXM7XHJcbiAgY29uc3QgbW92aWUgPSByZXEuYm9keTtcclxuICBjb25zdCBpbmRleCA9IG1vdmllcy5maW5kSW5kZXgoKGl0ZW0pID0+IGl0ZW0uaWQgPT0gaWQpO1xyXG4gIGlmIChtb3ZpZXNbaW5kZXhdKSB7XHJcbiAgICBtb3ZpZXNbaW5kZXhdID0gbW92aWU7XHJcbiAgfSBlbHNlIHtcclxuICAgIG1lc3NhZ2UgPSBcIlVwZGF0ZSBmYWlsZWQhXCI7XHJcbiAgfVxyXG4gIHJlcy5zZW5kKG1lc3NhZ2UpO1xyXG59KTtcclxuXHJcbmFwcC5kZWxldGUoXCIvYXBpL21vdmllcy86aWRcIiwgKHJlcSwgcmVzKSA9PiB7XHJcbiAgbGV0IG1lc3NhZ2UgPSBcIkRlbGV0ZSBTdWNjZXNzIVwiO1xyXG4gIGNvbnN0IHsgaWQgfSA9IHJlcS5wYXJhbXM7XHJcbiAgY29uc3QgaW5kZXggPSBtb3ZpZXMuZmluZEluZGV4KChpdGVtKSA9PiBpdGVtLmlkID09IGlkKTtcclxuICBpZiAobW92aWVzW2luZGV4XSkge1xyXG4gICAgbW92aWVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIG1lc3NhZ2UgPSBcIkRlbGV0ZSBmYWlsZWQhXCI7XHJcbiAgfVxyXG4gIHJlcy5zZW5kKG1lc3NhZ2UpO1xyXG59KTtcclxuXHJcbmNvbnN0IHBvcnQgPSBwcm9jZXNzLmVudi5QT1JUIHx8IDgwODA7XHJcbmFwcC5saXN0ZW4ocG9ydCwgKCkgPT4gY29uc29sZS5sb2coYExpc3RlbmluZyBvbiBwb3J0JHtwb3J0fS4uLmApKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYXBwO1xyXG4iXX0=