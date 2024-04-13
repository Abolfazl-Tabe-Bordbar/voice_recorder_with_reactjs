import React from 'react';
import MicRecorder from 'mic-recorder-to-mp3';
import { Base64 } from 'js-base64';
import axios from "axios";

const Mp3Recorder = new MicRecorder({ 
    bitRate: 64 ,
    prefix: "data:audio/wav;base64,",
});


class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isRecording: false,
      blobURL: '',
      isBlocked: false,
    };
  }


  start = () => {
    if (this.state.isBlocked) {
      console.log('Permission Denied');
    } else {
      Mp3Recorder
        .start()
        .then(() => {
          this.setState({ isRecording: true });
        }).catch((e) => console.error(e));
    }
  };

  stop = () => {
    Mp3Recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob)
        const binaryString = btoa(blobURL)
        console.log(binaryString);
        this.setState({ blobURL, isRecording: false });

        // const file = new File(buffer, 'me-at-thevoice.mp3', {
        //   type: blob.type,
        //   lastModified: Date.now()
        // });
        // let fd = new FormData();
        // fd.append("image",file);
        // axios.post("http://localhost:4000/admins/categories",fd).then().catch();

        console.log(file);
      }).catch((e) => console.log(e));
  };

  componentDidMount() {
    navigator.mediaDevices.getUserMedia({ audio: true },
      () => {
        console.log('Permission Granted');
        this.setState({ isBlocked: false });
      },
      () => {
        console.log('Permission Denied');
        this.setState({ isBlocked: true })
      },
    );
    
    
  }


  render(){
    return (
      <div className="App">
      
        <header className="App-header">
        {/* <Button variant="contained" color="primary" >Start When ready</Button> */}
            <button   color="primary"  onClick={this.start} disabled={this.state.isRecording}>start</button>
            <button   color="primary" onClick={this.stop} disabled={!this.state.isRecording}>stop</button>
          <audio src={this.state.blobURL} controls="controls" />
        </header>
      </div>
    );
  }
}



export default App;