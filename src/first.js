//This is the component which renders first time
//The whole app run in this component

import React, { useState,useEffect } from "react";
import LoginWindow from "./login";
import { Container, } from "semantic-ui-react";
import { HomeWindow } from "./home";
import { BrowserRouter as Router, Redirect, Switch, Route } from "react-router-dom";
import { MakePostFetch } from "./network";
import End from "./end";

export default function FirstWindow(props) {
   const [authed, setAuth] = useState(false);



    useEffect(() => {
        let x = localStorage.getItem("jwt_token");
        if (x != null) {

            MakePostFetch(End.checkAuth, new FormData(), true)
                .then(r => {
                    if (r.status === 200) {
                        //User is authed
                        setAuth(true);
                    }
                });

        }

    }, [props]);


    return (


        <div>
            <Router>
                <Container>
                    {(authed) ? <HomeRedirector /> : <LoginWindow setAuth={setAuth} />}
                </Container>
            </Router>
        </div>


    );




}


function LogoutHandler(props){
    ["jwt_token","uid","role"].forEach(v=>localStorage.removeItem(v));
    window.location.href="/";
    return <FirstWindow /> 
}

function HomeRedirector(props) {
    let x = window.location.pathname;

    return <>
        <Redirect to={(x === "/") ? "app" : x} />

        <Switch>
            <Route path="/app">
                <HomeWindow />
            </Route>
            <Route path='/logout'>
                <LogoutHandler/>
            </Route>
        </Switch>
    </>;
}