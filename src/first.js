//This is the component which renders first time
//The whole app run in this component

import React,{Component} from "react";
import LoginWindow from "./login";
import { Container,  } from "semantic-ui-react";
import { HomeWindow } from "./home";
import {BrowserRouter as Router,Redirect,Switch,Route} from "react-router-dom";
import { MakePostFetch } from "./network";
import End from "./end";

export default class FirstWindow extends Component{

    constructor(props){
        super(props);
        this.state={
            authed:false
        }
        this.checkForAuth();
     }

    checkForAuth(){
        let x=localStorage.getItem("jwt_token");
        if(x!=null){

            MakePostFetch(End.checkAuth,new FormData(),true)
            .then(r=>{
                if(r.status===200){
                    //User is authed
                    this.setAuth(true);
                }
            })
    
        }
        
    }

    setAuth(b){
        this.setState({authed:b});
    }

    render(){
        return (
            
            
            <div>
                <Router>
                <Container>
                   {(this.state.authed)?<HomeRedirector />:<LoginWindow setAuth={this.setAuth.bind(this)}/>}
                </Container>
                </Router>
            </div>
            
            
            );
    }



}

    function HomeRedirector(props){
        let x=window.location.pathname;
        
        console.log(x);
       return <>
                 <Redirect to={(x=="/")?"app":x} />
                 
                    <Switch>
                        <Route  path="/app">
                            <HomeWindow/>
                        </Route>
                    </Switch>
                </>;
    }