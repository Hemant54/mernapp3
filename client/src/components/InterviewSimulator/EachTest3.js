import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Grid, Typography,Button, MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import createPalette from '@material-ui/core/styles/createPalette';
import createTypography from '@material-ui/core/styles/createTypography';
import { getUser, stopRecordingFunction } from '../../actions/index';
import axios from 'axios';
import RecordRTC from 'recordrtc';
import { ReactMicPlus } from 'react-mic-plus';
import Loading from '../Utility/Loading';
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from "@material-ui/core/DialogTitle";
import './testscreen.css';
import Noty from 'noty';
import "../../../node_modules/noty/lib/noty.css";  
import "../../../node_modules/noty/lib/themes/metroui.css";
let recordRTC;
let MediaStreamRecorder = RecordRTC.MediaStreamRecorder;
const mediaConstraints = { video: true, audio: true };
const recordingOptions = { type: "video", mimeType: 'video/webm', recorderType: MediaStreamRecorder , bitsPerSecond: 128000 };

var dialog = false;
var changedFocus = 0;

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#26B897",
      contrastText: "#fff"
    }
  },
  typography: createTypography(createPalette({}), {
    fontFamily: '"OverPass"',
  })
});

function hasGetUserMedia() {
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

if (hasGetUserMedia()) {
} else {
  alert('getUserMedia() is not supported in your browser');
}

class EachTest3 extends React.Component {
    constructor(props) {
        super(props);
        const questionID = this.props.location.search.split('=')[1];
        const testdata = this.props.tests.filter((eachtest,key)=>{
            if(eachtest._id === questionID){
                return true;
            }
            return false;
        })[0];
        let questionArray = [];
        if (testdata) {
            questionArray = testdata.questionArray.map(eachData => {
                return {
                    ...eachData
                }
            })
        }
        let testarray = [];
         testarray = questionArray.filter((eachquestions, key) => {
            return {
                ...eachquestions,
                answered: {
                    state: false,
                    key: ''
                }
            }
        })[2];

        const randomVal = props.random;
        const val = Math.floor(Math.random() * Object.keys(testarray).length).toString();
        var randomSet;
        if(testarray[randomVal]) {
            randomSet = testarray[randomVal];
        } else {
            randomSet = testarray[val];
        }        
        var data3 = [];
        for(var i=1;i<=3;i++) {
          data3.push(randomSet[i.toString()])
        }
        this.state = {
            redirect: false,
            questions: data3,
            optionValue: '',
            questionID: 0,
            videoStop: false,
            recorder: undefined,
            testId : questionID,
            redirectToSuccess : false,
            testName : testdata.testname,
            time : 40,
            audioStatus: false,
            loading: false,
            permission: false,
            end: false,
            count: 0
        }
    }


    startTime() {
        var audio = document.getElementById("audioElement");
        var prevAudio = document.getElementById("prepAudio");
        var startAudio = document.getElementById("startAudio");
        var endAudio = document.getElementById("endAudio");
        audio.onended = () => {
          prevAudio.play();
          prevAudio.onended = () => {
            this.setState({ audioStatus: true });
          }
        };
    
        if (this.state.audioStatus === true && this.state.permission) {
          if(this.state.time === 30) {
            startAudio.play();
            this.setState({ audioStatus: false });
            startAudio.onended = () => {
              this.setState(state => ({
                time: state.time - 1,
                audioStatus: true
              }));
            }
          } else if(this.state.time === 1) {
            if(this.state.count === 0) {
              endAudio.play();
              this.setState({ end: true, count: 1 });
              endAudio.onended = () => {
                this.setState({ time: this.state.time - 1,end: false });
              }
            }
          } else {
            this.setState(state => ({
              time: state.time - 1
            }));
          }
        }
      }


    componentDidMount() {
        window.onbeforeunload = (event) => {
          console.log('Page is attempted to being refreshed!');
          event.preventDefault();
          return '';
        };
        this.interval = setInterval(() => this.startTime(), 1000);
        this.props.getUser();
        var video;
        video = document.getElementById('video');
        window.navigator.mediaDevices
          .getUserMedia(mediaConstraints)
          .then(stream => {
            this.setState({ permission: true });
            video.srcObject = stream;
            recordRTC = RecordRTC(stream, recordingOptions);
            this.setState({ recorder: recordRTC }, () => {
                this.state.recorder.startRecording();
            });
          })
          .catch((error) => {
            this.setState({ permission: false });
            alert("Permission Denied!");
            console.log(error);
          });
    }

    componentDidUpdate(nextProps, nextState) {
        if (this.state.time === 0) {
            this.setState({ audioStatus: false });
          }
        var that = this;
        window.onfocus = function() {
            if(document.hidden) {
              changedFocus++;
              if(changedFocus === 2) {
                that.setState({ loading: true });
                axios.post("/api/completeTest", {_id:that.props.userData._id,testname:that.state.testName})
                  .then(res => {
                    if(res.status === 200) {
                      that.setState({ redirect: true, loading: false });
                    }
                  })
                  .catch(err => console.log(err));
              } else {
                dialog=true;
              }
            }
        }
        if(nextProps.userData !== this.props.userData && !this.props.userData._id) {
            this.setState({ redirect: true });
        }
    }

    componentWillUnmount() {
        changedFocus = 0;
        dialog = false;
        window.onfocus = null;
        window.onbeforeunload = null;
        clearInterval(this.interval);
    }

    stopRecording = () => {
        try {
          recordRTC.stopRecording((audioVideoWebMURL) => {
            let blob = recordRTC.getBlob();
            var fileName = "Part3.mp4";
            const config = {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data'
                }
            }
            var Formdata = new FormData()
            Formdata.append(`file_`, blob);
            Formdata.append(`filename`, fileName)
            Formdata.append(`_id`, this.props.userData._id);
            Formdata.append(`testname`, this.state.testName);
            this.setState({ loading: true });
            axios.post('/api/uploadVideo', Formdata, config)
                .then(res => {
                    if (res.status === 200) {
                    	axios.post("/api/completeTest", {_id:this.props.userData._id,testname:this.state.testName})
                    		.then(res => {
                    			if(res.status === 200) {
                    				this.setState({ redirectToSuccess: true, loading: false });
                    			}
                    		})
                    		.catch(err => console.log(err));
                    }
                }).catch(err => {
                    console.log(err)
                })
              })
        }
        catch(err) {
          console.log('No video recorded yet');
        }
    }


    nextQues = () => {

        if(this.state.questionID < this.state.questions.length - 1 && !this.state.end){
            this.setState({questionID:this.state.questionID+1,count: 0})
        }

        if(this.state.questionID === this.state.questions.length -1  ){

            this.stopRecording();
        }

       this.setState({
           time : 40,
       })
    }

    render () {

        if(this.state.redirect) {
            return (
                <Redirect to = '/' />
            );
        }
        if(this.state.redirectToSuccess) {
            return (
                <Redirect to = '/interviewsimulator/test/complete' />
            );
        }

        return (
        <MuiThemeProvider theme={theme}>
            <Grid container style={{textAlign:"center"}}>
                <Grid container style={{margin:"10px 0"}}>
                    <Grid item xs={12} style={{textAlign:"right"}}>
                        <div style={{display:"flex",justifyContent:"flex-end"}}>
                            <div className="timing">
                                <Typography style={{fontSize: "20px"}}>{this.state.time < 30 ? this.state.time : this.state.time-30 }s</Typography>
                            </div>
                        </div>
                        {this.state.time < 30 ? <Typography style={{marginRight:"50px"}}>Answering Time</Typography> : <Typography style={{marginRight:"50px"}}>Preparation Time</Typography>}
                        {this.state.time === 0 ? this.nextQues() : null}
                    </Grid>
                </Grid>
                <Grid item xs={12} style={{marginBottom:"10px"}}>
                    <Typography style={{marginLeft:"40px",marginBottom:"-30px", textAlign:"left"}} variant="h4">Part 3</Typography>
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '0px' }}>
                        <video id='video' style={{
                            width: 400,
                            height: 250
                        }}
                            autoPlay
                            muted="muted"
                        ></video>
                    </div>
                </Grid>
                <Grid item xs={12} style={{margin:"40px 0"}}>
                    {
                        this.state.questions.map((eachData, key) => {
                            if (key === this.state.questionID) {
                                return (
                                    <div style={{textAlign:"center"}} key={key}>
                                        <Typography variant='h4'>
                                            Question {this.state.questionID + 1}:&nbsp;   
                                            {eachData.question}
                                        </Typography>
                                        <audio
                                            id="audioElement"
                                            style={{ display: 'none' }}
                                            autoPlay="true"
                                            controls
                                            src={eachData.audio}>
                                        </audio>
                                        <audio id="prepAudio" style={{display: "none"}} controls>
                                            <source src="https://innovative-labs.s3.ap-south-1.amazonaws.com/Audio/prep.mp3" />
                                        </audio>
                                        <audio id="startAudio" style={{display: "none"}} controls>
                                            <source src="https://innovative-labs.s3.ap-south-1.amazonaws.com/Audio/start.mp3" />
                                        </audio>
                                        <audio id="endAudio" style={{display: "none"}} controls>
                                            <source src="https://innovative-labs.s3.ap-south-1.amazonaws.com/Audio/end.mp3" />
                                        </audio>
                                    </div>
                                );

                            }
                            return undefined;

                        })
                    }
                </Grid>
                <Grid item xs={12} style={{margin:"10px 0"}}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <ReactMicPlus
                            record={true}
                            className="sound-wave"
                            onStop={this.onStop}
                            strokeColor="white"
                            backgroundColor="black"
                            nonstop={true}
                            width="1000"
                            duration={5} />
                        { this.state.loading ? <Loading text="Finishing up..." /> : null }
                    </div>
                </Grid>
                <Dialog open={dialog} onClose={() => dialog=false}>
                    <DialogTitle>Please Note!</DialogTitle>
                    <DialogContent>
                      <Typography variant="h5">Don't change the window again or your test will be completed immediately!</Typography>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => dialog=false} color="primary">
                        Ok
                      </Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        </MuiThemeProvider>
        );

    }
};
function mapStateToProps (state) {
    return {
        userData: state.auth.userData,
        tests: state.questions.tests,
        random: state.random.random
    };
};
function mapDispatchToProps (dispatch) {
    return bindActionCreators({
        getUser: getUser,
        stopRecordingFunction: stopRecordingFunction
    }, dispatch)
};
export default connect(mapStateToProps, mapDispatchToProps)(EachTest3);
