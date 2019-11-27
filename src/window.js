//This file contains code to render window related to master menu
import React, { } from "react";
import { Grid, Menu } from "semantic-ui-react";
import { Switch, Route, Link } from "react-router-dom";
import { AccountForm, AccountList, ReadOnlyAccountWrapper } from "./comp/master/account";
import { UnitForm, UnitList, ReadOnlyUnitWrapper } from "./comp/master/unit";
import { ItemForm, ItemList, ReadOnlyItemWrapper } from "./comp/master/item";
import { WorkplaceForm, WorkplaceList, ReadOnlyWorkStationWrapper as ReadOnlyWorkPlaceWrapper } from "./comp/master/workstation";
import { GroupForm, GroupList, ReadOnlyGroupWrapper } from "./comp/master/group";
import PropTypes from "prop-types";
import { BomList, BomForm, ReadOnlyBOMWrapper } from "./comp/production/bom";
import { WorkOrderForm, WorkOrderList } from "./comp/production/workorder";
import { JobCardList, JobForm } from "./comp/production/job";
import { UserForm, UserList } from "./comp/master/user";
import { OperationForm, OperationList, ReadOnlyOperationWrapper } from "./comp/master/operation";
import { RouteForm, RouteList, ReadOnlyRouteWrapper } from "./comp/master/route";
import { WorkorderTracker, WorkorderTrackerWrapper } from "./comp/production/workorderTracking";
import { JobCardAlterationWrapper } from "./comp/production/job_modifier";


export function ProductionWindowResolver(props) {
    const b = "/app/production/bom";
    const w = "/app/production/workorder";
    const j = "/app/production/job";
    const f = (x, y) => x.concat(y);
    return <Switch>
        
        <Route path={f(b,"/info/:id")} component={ReadOnlyBOMWrapper} />
        <Route path={f(b, "/*")}>
            <Window>
                <WindowItem name="Create" path={f(b, "/create")}>
                    <BomForm create />
                </WindowItem>
                <WindowItem name="List" path={f(b, "/read")}>
                    <BomList />
                </WindowItem>
            </Window>
        </Route>

        <Route path={f(w, "/track/:wid")} component={WorkorderTrackerWrapper} />

        <Route path={f(w, "/*")}>
            <Window>
                <WindowItem name='Create' path={f(w, "/create")}>
                    <WorkOrderForm create />
                </WindowItem>

                <WindowItem name='List' path={f(w, "/read")}>
                    <WorkOrderList />
                </WindowItem>
            </Window>
        </Route>

        <Route path={f(j, "/track/:jid/")} component={JobCardAlterationWrapper} />
        <Route path={f(j, "/*")}>
            <Window>
                <WindowItem name="List" path={f(j, "/create")}>
                    <JobForm create />
                </WindowItem>

                <WindowItem name="List" path={f(j, "/read")}>
                    <JobCardList />
                </WindowItem>

            </Window>
        </Route>


    </Switch>
}



export function Window(props) {
    const f = (v, i) => {
        return (v.props.nomenu) ? <></> : <Menu.Item key={i}> <Link to={v.props.path}>{v.props.name}</Link></Menu.Item>
    }
    const f1 = (v, i) => {
        return <Route key={i} path={v.props.path} >{v.props.children}</Route>
    }

    const ar = props.children instanceof Array ? props.children : [props.children]

    return <div>
        <Grid centered columns={2}>
            <Grid.Column width={"1"}>
                <Menu vertical>
                    {ar.map(f)}
                </Menu>
            </Grid.Column>
            <Grid.Column width={"5"} >

            </Grid.Column>
            <Grid.Column width={"10"}>
                <Switch>
                    {ar.map(f1)}
                </Switch>
            </Grid.Column>
        </Grid>
    </div>
}


export function WindowItem(props) {
    return <></>
}
WindowItem.propTypes = {
    /**
     * nomenu, means we don't want to register it in menu
     */
    nomenu: PropTypes.bool
}

WindowItem.propTypes = {
    name: PropTypes.string,
    path: PropTypes.string
}


export function MasterWindowResolver(props) {
    let a = "/app/master/account";
    let u = "/app/master/unit";
    let i = "/app/master/item";
    let w = "/app/master/workplace";
    let g = "/app/master/group";
    let us = "/app/master/user";
    let o = '/app/master/operation';
    let r = "/app/master/route";
    const f = (a, b) => a.concat(b);
    return <Switch>

            <Route path={f(a,"/info/:id")} component={ReadOnlyAccountWrapper} />
        <Route path={a.concat("/*")}  >
            <Window>
                <WindowItem name="Create" path={a.concat("/create")} >
                    <AccountForm create />
                </WindowItem>
                <WindowItem name="List" path={a.concat("/read")}>
                    <AccountList />
                </WindowItem>
            </Window>
        </Route>

        <Route path={f(a,'/info/:id')} component={ReadOnlyUnitWrapper} />
        <Route path={u.concat("/*")}  >
            <Window>
                <WindowItem name="Create" path={u.concat("/create")} >
                    <UnitForm create />
                </WindowItem>
                <WindowItem name="List" path={u.concat("/read")}>
                    <UnitList />
                </WindowItem>
            </Window>
        </Route>
        <Route path={f(i,"/info/:id")} component={ReadOnlyItemWrapper} />

        <Route path={i.concat("/*")}  >
            <Window>
                <WindowItem name="Create" path={i.concat("/create")} >
                    <ItemForm create />
                </WindowItem>
                <WindowItem name="List" path={i.concat("/read")}>
                    <ItemList />
                </WindowItem>
            </Window>
          </Route>
            <Route path={f(w,"/info/:id")} component={ReadOnlyWorkPlaceWrapper} />
        <Route path={w.concat("/*")}  >
            <Window>
                <WindowItem name="Create" path={w.concat("/create")} >
                    <WorkplaceForm create />
                </WindowItem>
                <WindowItem name="List" path={w.concat("/read")}>
                    <WorkplaceList />
                </WindowItem>
            </Window>
        </Route>
        <Route path={f(g,"/info/:id")} component={ReadOnlyGroupWrapper} />

        <Route path={g.concat("/*")}  >
            <Window>
                <WindowItem name="Create" path={g.concat("/create")} >
                    <GroupForm create />
                </WindowItem>
                <WindowItem name="List" path={g.concat("/read")}>
                    <GroupList />
                </WindowItem>
            </Window>
        </Route>

        <Route path={us.concat("/*")}  >
            <Window>
                <WindowItem name="Create" path={us.concat("/create")} >
                    <UserForm create />
                </WindowItem>
                <WindowItem name="List" path={us.concat("/read")}>
                    <UserList />
                </WindowItem>
            </Window>
        </Route>

        <Route path={f(o,'/info/:id')} component={ReadOnlyOperationWrapper} />
        <Route path={o.concat("/*")}>
            <Window>
                <WindowItem name="Create" path={o.concat('/create')}>
                    <OperationForm create />
                </WindowItem>
                <WindowItem name="List" path={o.concat('/read')}>
                    <OperationList />
                </WindowItem>

            </Window>
        </Route>

        <Route path={f(r,'/info/:id')} component={ReadOnlyRouteWrapper} />
        <Route path={r.concat("/*")}>
            <Window>
                <WindowItem name="Create" path={r.concat('/create')}>
                    <RouteForm create />
                </WindowItem>
                <WindowItem name="List" path={r.concat('/read')}>
                    <RouteList />
                </WindowItem>
            </Window>
        </Route>
    </Switch>
}