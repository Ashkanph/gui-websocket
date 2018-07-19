import React, { Component } from 'react';
import Header       from '../Header/header.js';
import AlertContainer   from 'react-alert'
import Websocket    from "../../assets/functions/websocket/websocket.js";

import {
    Grid,
    Button,
    Input,
    Form,
    Checkbox,
    Divider,
    TextArea,
    Dropdown
  } from "semantic-ui-react";

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            inputValue: {
                URL:        '',
                username:   '',
                password:   '',
                request:    '',
                rememberMe: false,
                checkJSON:  false,
                selectedSavedRequest: null
            },
            request:        '',
            response:       '',
            ws:             null,
            user:           null,
            rawLogs:        [],
            processedLogs:  '',
            themeClass:     'light',
            jsonCheckResult:false,
            savedRequest:   [],
            savedRequestOption: []
        };

        this.handleChangeInputValue   = this.handleChangeInputValue.bind(this);
        this.connectWebsocket         = this.connectWebsocket.bind(this);
        this.connectSubmit            = this.connectSubmit.bind(this);
        this.sendRequest              = this.sendRequest.bind(this);
        this.clearLogs                = this.clearLogs.bind(this);
        this.changeTheme              = this.changeTheme.bind(this);
        this.getSavedRequests         = this.getSavedRequests.bind(this);
        this.saveRequest              = this.saveRequest.bind(this);
        this.removeSelectedSavedRequest = this.removeSelectedSavedRequest.bind(this);
        this.disconnectSubmit         = this.disconnectSubmit.bind(this);
    }

    componentDidMount(){
        document.getElementsByTagName('body')[0].className = this.state.themeClass;
        let savedRequest = localStorage.getItem('savedRequest');

        if(savedRequest != null && savedRequest != ""){
            let state = this.state;
            state.savedRequest = JSON.parse(savedRequest);
            this.setState(state, ()=>{
                this.getSavedRequests();
            });
        }
    }

    handleChangeInputValue(e, { name, value }) {
        let inputValue = this.state.inputValue;
        if (name == "checkJSON")
            inputValue.checkJSON = !inputValue.checkJSON;
        else if (name == "selectedSavedRequest" && value != null && value != ''){
            inputValue.selectedSavedRequest = value;
            inputValue.request = value;
        } else 
            inputValue[name] = value;
        this.setState({ inputValue });

        let state = this.state;
        if(name === 'request' || name == "selectedSavedRequest"){
            if(this.isJson(value))
                state.jsonCheckResult = true;
            else
                state.jsonCheckResult = false;

            this.setState(state);
        }        
    }

    connectWebsocket(){
        let inputs = this.state.inputValue,
            ws = new Websocket({that: this}),
            state = this.state;

        state.ws = ws;
        this.setState(state, () => {
                ws.connect(inputs.URL);        
        });
    }

    connectSubmit(){
        if(this.state.ws == null){
            let inputs = this.state.inputValue;
            
            if(inputs.URL == null || inputs.URL == ''){
                this.msg.error("URL is empty!");
                return;
            }
            this.connectWebsocket();
        }
    }

    isJson(str) {
        if(str == '[]' || typeof str != 'string')
            return false;

        try {
            var o = JSON.parse(str);
            return true;
        }
        catch (e) { 
            return false;
        }
    }

    sendRequest(){
        let state   = this.state,
            inputs  = state.inputValue;
            
        if(this.state.inputValue.checkJSON && !this.isJson(inputs.request)){
            this.msg.error("Your request doesn't look to be a valid JSON!");
            return;
        }
        if(state.ws == null){
            this.msg.error("No websocket connection. Please first connect to a websocket.");
            return;
        }
        
        if(inputs.request === ''){
            this.msg.error("You have not entered any request!");
            return;
        }

        state.ws.send(inputs.request);        
    }

    disconnectSubmit(){
        this.state.ws.close();        
    }

    clearLogs(){
        let state   = this.state;
        state.rawLogs = [];
        state.processedLogs = '';
        this.setState(state);
    }

    changeTheme(){
        let state   = this.state;
        if(state.themeClass == 'light')
            state.themeClass = 'dark';
        else
            state.themeClass = 'light';

        this.setState(state);
        document.getElementsByTagName('body')[0].className = state.themeClass;
    }

    getSavedRequests(){
        let savedRequest = this.state.savedRequest,
            allRequests = savedRequest.map((request, index) => {
                return { key: request.name, text: request.name, value: request.request }
            });
        
        let state = this.state;
        state.savedRequestOption = allRequests;
        this.setState(state);
    }

    saveRequest(){
        let inputValue = this.state.inputValue;
        if(inputValue.saveName != null && inputValue.request != ''){
            let state = this.state;
            state.savedRequest.push({
                name:       inputValue.saveName,
                request:    inputValue.request
            });
            localStorage.setItem('savedRequest', JSON.stringify(state.savedRequest));
            this.setState(state, ()=>{
                this.getSavedRequests();
            });
            this.msg.success('Your message saved successfully.')
        }else if(inputValue.saveName == null){
            this.msg.error('Enter the save name')
        }else if(inputValue.request == ''){
            this.msg.error('Enter the request')
        }    
    }

    removeSelectedSavedRequest () {
        let state = this.state,
            array = state.savedRequest,
            index = null;

        if(state.inputValue.selectedSavedRequest != null)
            for (var j=0; j<array.length; j++) {
                if (array[j].request === state.inputValue.selectedSavedRequest) 
                    index = j;
            }
        if(index != null){
            array.splice(index, 1);
            state.savedRequest =  array;
            
            localStorage.setItem('savedRequest', JSON.stringify(state.savedRequest));
            this.setState(state, ()=>{
                this.getSavedRequests();
            });
            this.msg.success('Your message removed successfully.')
        }
    }

    render() {

        let state        = this.state,
            checkJSONMsg = state.jsonCheckResult ? "Correct JSON!" : "Wrong JSON!",
            checkJSONColor = state.jsonCheckResult ? "green" : "red",
            requestPlaceHolder = state.inputValue.checkJSON ?
                        "Request (in JSON format)"
                        : "Request (Any string)";

        return (
            <div className="main-container">
                <Grid>
                    <Header changeTheme={this.changeTheme} theme={this.state.themeClass} />
                    <AlertContainer ref={a => this.msg = a} {...alertOptions}/>
                    <Grid.Row>
                        <Grid.Column
                            verticalAlign="middle">
                            <Form onSubmit={this.connectSubmit}>
                                <Form.Group widths="equal">
                                    <Form.Field control={Input} 
                                    name="URL"
                                    onChange={this.handleChangeInputValue}
                                    placeholder="َWS URL" />
                                    {
                                        this.state.ws == null ?
                                            <Form.Field control={Button} color="green">
                                                Connect
                                            </Form.Field>
                                            :
                                            <Form.Field control={Button}
                                                onClick={this.disconnectSubmit}  
                                                color="red">
                                                Disconnect
                                            </Form.Field>
                                    }
                                </Form.Group>
                            </Form>
                            <Divider />
                            <br />
                        </Grid.Column>
                    </Grid.Row>


                    <Grid.Row columns={2} divided >
                        <Grid.Column mobile={16} tablet={8} computer={8}>
                            <Form.Field control={TextArea} 
                            name="request"
                            value={this.state.inputValue.request}
                            style={{ minHeight: 300, width: '100%', padding: '0.5rem' }}
                            onChange={this.handleChangeInputValue}
                            placeholder={requestPlaceHolder} />
                        </Grid.Column>
                        <Grid.Column mobile={16} tablet={8} computer={8}>
                            <pre className='response'>
                                <div 
                                    dangerouslySetInnerHTML={{__html: this.state.response}} >
                                </div>
                            </pre>
                        </Grid.Column>
                    </Grid.Row>

                    <Form.Field control={Button} 
                                className="margin-top-5px"
                                onClick={this.sendRequest}
                                color="green">
                        Send
                    </Form.Field>
                    <Checkbox
                        label="JSON"
                        name="checkJSON"
                        style={{ marginTop: '0.85rem' }}
                        defaultChecked={this.state.inputValue.checkJSON}
                        onChange={this.handleChangeInputValue}/>
                    {
                        this.state.inputValue.checkJSON === true &&
                            <Form.Field control={Button} 
                                        className="margin-top-5px"
                                        content={checkJSONMsg}
                                        color={checkJSONColor} disabled />
                    }

                    <Form   style={{display: 'block', float: 'right'}}>
                        <Form.Group>
                            <Form.Field control={Input} type="text"
                                        className="margin-top-5px"
                                        name="saveName" 
                                        onChange={this.handleChangeInputValue} 
                                        placeholder="Save name" />
                            <Form.Field control={Button} color="blue"
                                        className="margin-top-5px"
                                        name="saveName" 
                                        onClick={this.saveRequest} 
                                        content="Save request" />
                            <Form.Field
                                        className="margin-top-5px">                              
                                <Dropdown   search  scrolling selection 
                                            name="selectedSavedRequest" 
                                            placeholder="Select saved request"
                                            onChange={this.handleChangeInputValue} 
                                            onSearchChange={this.handleChangeInputValue}
                                            options={this.state.savedRequestOption} />
                            </Form.Field>                              
                            <Form.Field control={Button} color="red"
                                        className="margin-top-5px"
                                        name="saveName" 
                                        onClick={this.removeSelectedSavedRequest} 
                                        content="Unsave request" />
                        </Form.Group>
                    </Form>
                    <Divider horizontal>
                        Logs 
                        <span   title="Clear the logs"
                                className="clear-btn" 
                                onClick={this.clearLogs}>
                            Clear
                        </span>
                    </Divider>

                    <Grid.Row>
                        <Grid.Column verticalAlign="middle">
                            <div className='logs' dangerouslySetInnerHTML={{__html: this.state.processedLogs}}>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}


const alertOptions = {
    offset: 14,
    position: 'bottom left',
    theme: 'dark',
    time: 5000,
    transition: 'scale',
    type: 'error'
};


export default Main;