import React, { Component } from 'react';
import './css/main.css'
import logo from './img/aicon2.png';
import { browserHistory } from 'react-router';
import poster from './img/Machine-Learning.jpg';
import Axios from 'axios';

class App extends Component{
  constructor(props)
  {
    super(props);
    this.state = {
      files:[{name: 'Choose File'}],
      massage : "",
      Detail : null,
      Json : null
    };
  }

  onFileChange = (e) => {
    //console.log(e);
    this.setState({ files:e.target.files })
  }

   addFile = async (e) => {
    if(this.state.files[0].name=="Choose File"|this.state.files[0].type!="video/mp4")
    {
      alert("invalid input");
    }else{
      e.preventDefault();
      const res = await this.uploadFile();
      console.log(res);
      const jsonoutput = JSON.parse(res.message)
      this.setState({ Detail : res})
      this.setState({ Json : jsonoutput})
    }
  }

  uploadFile = () => {
    let data = new FormData();
    data.append("file", this.state.files[0]);
    console.log(this.state.files[0])
    return new Promise((resolve,reject) => {
      fetch('http://localhost:8080/upload',{
        method: "post",
        body: data,
      })
      .then((Response)=> Response.json())
      .then((Response)=>{
        resolve(Response);
      })
      .catch((Error)=>{
          reject(Error);
      });

    });
  }

  ConvertFile = () => {
    let data = new FormData();
    data.append("file", this.state.files[0]);
    console.log(this.state.files[0])
    return new Promise((resolve,reject) => {
      fetch('http://localhost:8080/Converter',{
        method: "post",
        body: data,
      })
      .then((Response)=> Response.json())
      .then((Response)=>{
        resolve(Response);
      })
      .catch((Error)=>{
          reject(Error);
      });

    });
  }

  downloadFile=(path)=>{
    console.log(path)
        fetch('http://localhost:8080/download/'+path,)
          .then(response => {
            console.log(response)
            response.blob().then(blob => {
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = url;
                a.download = 'Machine_Learning_video_output.mp4';
                a.click();
            });
    });
  }
  

  // getfileaxios=(path)=>{
  //   Axios.get('http://localhost:8080/download2/'+path,).then((Response)=>{
  //     console.log(Response);
  //   })
  // }


  resetpage=()=>{
    browserHistory.push('/')
  }

  render(){
    return(
         
          <body class="landing">
            <header id="header" class="alt">
              <h1><a>Swear Words</a></h1>
              {/* <a href="#nav">Menu</a> */}
            </header>
           
                <section id="banner">
                  {/* <i class="icon fa-diamond"></i> */}
                  <img class="imgicon" src={logo}></img>
                  <h2>machine learning</h2>
                  <p>The detection of English swear words in audio files</p>
                  <ul class="actions">
                    <li><a href="#" class="button big special">START</a></li>
                  </ul>
                </section>
            
                <section id="one" class="wrapper style1"></section>

            <section id="four" class="wrapper style2 special">
				<div class="inner">
					<header class="major narrow">
						<h2>Get in touch</h2>
						<p>Choose your file for detection profanity words</p>
					</header>
          <p>SwearWords converts your video files online. Amongst many others, we support MP4, WEBM AVI and other. You can check detail quality and file size.</p>
					<form onSubmit={this.addFile}>
						<div class="container 75%">
							<div class="row uniform 50%">
              <div>
                <input type="file" name="file-2[]" id="file-2" class="inputfile inputfile-2" 
                data-multiple-caption="{count} files selected" 
                onChange={this.onFileChange} />
				      	<label for="file-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/></svg> <span>{this.state.files[0].name}&hellip;</span></label>
                </div>
								<div class="11u$">
                   Name : {this.state.files[0].name} 
                   <div>Size : {this.state.files[0].size} </div>
                   <div>type :  {this.state.files[0].type}</div>
                   <div>lastModified : {this.state.files[0].lastModified} </div>
                   {this.state.Detail != null ? (
                     <div>Filename : {this.state.Detail.filename.filename}
                     <div>Status : {this.state.Detail.Status}</div>
                     </div>
                    ): <div/>}
                    {this.state.Json != null ? (
                     <div>
                       Storage path : {this.state.Json.output}
                      <div>
                       Rude_word : {
                         this.state.Json.word.map((item, index)=>(
                          <div key={'word-'+index}>
                            Word : {item.[0]} start_time : {item.[1]} end_time : {item.[2]}
                           </div> 
                           ))
                       } 
                      </div>
                     </div> 
                    ): <div/>}
								</div>
							</div>
						</div>
						<ul class="actions">
							<li><input type="submit" class="special" value="Submit" /></li>
							<li><input type="reset" class="alt" value="Reset" onClick={this.resetpage}/></li>
						</ul>
					</form>
				</div>
        
			</section>
      {/* <section id="one" class="wrapper style1"></section> */}
      <section id="three" class="wrapper style3 special">
				<div class="inner">
					<header class="major narrow	">
						<h2>Magna sed consequat tempus</h2>
						<p>Ipsum dolor tempus commodo turpis adipiscing Tempor placerat sed amet accumsan</p>
					</header>
                     {this.state.Json != null ? (
                     <div>
                       <video width="1024" height="768" controls="controls" poster={poster}>
                          <source src={'http://localhost:8080/video/'+this.state.Json.pathoutput} type="video/mp4"></source>
                      </video>
                      <button class="fa fa-download" value="Download" onClick={()=>{this.downloadFile(this.state.Json.pathoutput)}}>Download</button>
                                         
                      
                     </div> 
                     
                    ): <div/>}  
            
                   
				</div>
			</section>
    
       </body>
      
           
             
    )
  }
}

export default App;
