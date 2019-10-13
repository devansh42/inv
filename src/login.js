//This component handles all the login stuff

import React,{Component} from 'react';
import { Segment,Form,Message,Button, Grid, Header, Icon } from 'semantic-ui-react';
import {Redirect} from "react-router-dom";
import End from './end';

import { MakePostFetch } from './network';


export default class LoginWindow extends Component{
    constructor(props){
        super(props);
        this.state={
            errorState:false,
            btnLoading:false,
            btnDisabled:false,
            errorMsg:"",
            successState:false
        };
    }

    handleSubmit(e){
        let obj={
            username:document.getElementById("username").value.trim(),
            password:document.getElementById("password").value.trim()
        };
        let sc={
            username:/[a-zA-Z0-9]{5,20}/,
            password:/[a-zA-Z0-9]{8}/
        };
        let errorMsg="",valid=true;
        if(obj.username.match(sc.username)==null){
            errorMsg="Invalid Username\n";
            valid=false;
        }
        else if(obj.password.match(sc.password)==null){
            errorMsg="Invalid Password (Minimum 8 Character)";
            valid=false;
        }

     
        if(valid){
            let form=document.getElementById("signInForm");
            this.setState({errorState:false,btnDisabled:true,btnLoading:true,errorMsg:null});
            MakePostFetch(End.auth,form,false)
            .then(r=>{
                this.setState({btnDisabled:false,btnLoading:false});
              
                if(r.status>=400){
                    
                    throw Error("Invalid Username/Password");
                }else{
                   return r.json();
                }
            }).then(r=>{
                //Everything is fine
                localStorage.setItem("jwt_token",r.token);
                localStorage.setItem("uid",r.result.uid);
                localStorage.setItem("role",r.result.role);
                this.props.setAuth(true);
            }).catch(err=>{
                console.log(err);
                this.setState({errorState:true,errorMsg:err.message});
            })
           


        }else{
            this.setState({errorState:true,errorMsg});

        }
    }

    render(){

        let area=<div>
        <Grid>  
        <Grid.Column width="4"></Grid.Column>
        <Grid.Column verticalAlign="middle" width='8' >
        <Segment>
            <Form id="signInForm" error={this.state.errorState}>
                <Header  dividing>
                <Icon name="sign in"></Icon>
                Login</Header>
                <Form.Input defaultValue="admin" autoComplete="off" id="username" autoFocus  type="text" maxLength="20" label="Username" name="username" placeholder="Enter Username" />
                <Form.Input label="Password" defaultValue="root1234" id="password" autoComplete="off" type="password" name='password' placeholder="Enter your Login Password" />
                
            <Message error header="There is a problem !!" content={this.state.errorMsg} />
                 
                <Button primary onClick={this.handleSubmit.bind(this)} type="button" loading={this.state.btnLoading} disabled={this.state.btnDisabled}> Submit</Button>   
            </Form>
        </Segment>
        </Grid.Column>
        <Grid.Column width="4"></Grid.Column>
       
        </Grid>

     </div>;

       return area;
    }

}