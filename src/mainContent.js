//This file contains code for main Page content (area below menu)
import React, { } from "react";
import { Switch } from "react-router-dom";
import { MasterWindowResolver, ProductionWindowResolver } from "./window";
import { ACRoute } from "./comp/common/route";

export function MainContent(props) {
    return <Switch>
        <ACRoute  path="/app/master/*" component={MasterWindowResolver} />
        <ACRoute path="/app/production" component={ProductionWindowResolver} />
        <ACRoute path="/app" component={AppComponent} />
    </Switch>;
}

function AppComponent(props) {
    return <h3>Nothing Special</h3>
}