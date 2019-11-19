//This file contains code for main Page content (area below menu)
import React, {} from "react";
import { Switch, Route } from "react-router-dom";
import {MasterWindowResolver, ProductionWindowResolver } from "./window";

export function MainContent(props) {
    return <Switch>
        <Route path="/app/master/*" component={MasterWindowResolver} />
        <Route path="/app/production" component={ProductionWindowResolver} />
        <Route path="/app" component={AppComponent} />
    </Switch>;
}

function AppComponent(props) {
    return <h3>Nothing Special</h3>
}