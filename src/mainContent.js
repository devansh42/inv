//This file contains code for main Page content (area below menu)
import React,{Component} from "react";
import {Switch,Route} from "react-router-dom";
import { MasterWindow, MasterWindowResolver } from "./comp/master/window";

export function MainContent(props){
    return <Switch>
        <Route path="/app/master/*" component={MasterWindowResolver} />
        <Route path="/app" component={AppComponent} />
    </Switch>;
}

function AppComponent(props){
    return <h3>Nothing Special</h3>
}