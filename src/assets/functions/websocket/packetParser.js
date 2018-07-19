// import { setRememberMeSession, checkRemember } from "../user/remember.js";
import React, { Component }     from 'react';
import hljs                     from 'highlightjs';

function processLogs(that){
  // let rawLogs = that.state.rawLogs.reverse();
  return that.state.rawLogs.map((theItem, index) => {
        return '<div>'+ getTime() + '   ' + 
               hljs.highlightAuto(JSON.stringify(theItem)).value + '</div>';
  }).join('');
}

function getTime(){
  let time = new Date(),
      mins = time.getMinutes(),
      sec = time.getSeconds();
  return time.getHours() + ':' + (mins < 10 ? '0' + mins : mins) + ':' + 
          (sec < 10 ? '0' + sec : sec);
}

function packetParser(that, msg) {    
  let state = that.state;
  
  state.rawLogs.unshift(msg);
  state.processedLogs = processLogs(that);
  state.response = hljs.highlightAuto(msg).value;

  that.setState(state);
}

export default packetParser;