import axios from 'axios';
// auth actions
export function getUser () {
    return function (dispatch) {
    axios.get('/api/getCurrentUser')
    .then(res => {
        dispatch({
            type: 'GET_USER',
            payload: res.data
        });
    });
    }
};

export function getInstitutes() {
    return function (dispatch) {
    axios.get('/api/institutes')
    .then(res => {
        dispatch({
            type: 'GET_INSTITUTES',
            payload: res.data
        });
    });
    }
};

// question actions
export function getTests () {
   return function (dispatch) {
    axios.get('/api/getalltest')
    .then(result => {
        dispatch({
            type: 'GET_TESTS',
            payload: result.data
        });
    })
   }
}

export function brainLeftTestResult(leftresult) {
    return {
        type: "BRAIN_MIRROR_LEFT_RESULT",
        payload: leftresult
    }
}

export function brainRightTestResult(rightresult) {
    return {
        type: "BRAIN_MIRROR_RIGHT_RESULT",
        payload: rightresult
    }
}

export function setBrainMirrorMode(mode) {
    return {
        type: "BRAIN_MIRROR_MODE",
        payload: mode
    }
}



export function stopRecordingFunction () {
    return {
    type: 'STOP_RECORDING'
    }
}


export function setRandomTest(number) {
    return {
        type: 'SET_RANDOM_TEST',
        payload: number
    }
}