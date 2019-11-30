//This file contains code to render window related to master menu
import React, { } from "react";
import { Grid, Menu, Label } from "semantic-ui-react";
import { Switch, Route, Link } from "react-router-dom";
import { AccountForm, AccountList, ReadOnlyAccountWrapper, DocAccount } from "./comp/master/account";
import { UnitForm, UnitList, ReadOnlyUnitWrapper, DocUnit } from "./comp/master/unit";
import { ItemForm, ItemList, ReadOnlyItemWrapper, DocItem } from "./comp/master/item";
import { WorkplaceForm, WorkplaceList, ReadOnlyWorkStationWrapper, DocWorkStation } from "./comp/master/workstation";
import { GroupForm, GroupList, ReadOnlyGroupWrapper, DocGroup } from "./comp/master/group";
import PropTypes from "prop-types";
import { BomList, BomForm, ReadOnlyBOMWrapper, DocBOM } from "./comp/production/bom";
import { WorkOrderForm, WorkOrderList, DocWorkOrder } from "./comp/production/workorder";
import { JobCardList, JobForm, DocJOB } from "./comp/production/job";
import { UserForm, UserList } from "./comp/master/user";
import { OperationForm, OperationList, ReadOnlyOperationWrapper, DocOperation } from "./comp/master/operation";
import { RouteForm, RouteList, ReadOnlyRouteWrapper, DocRoute } from "./comp/master/route";
import {  WorkorderTrackerWrapper } from "./comp/production/workorderTracking";
import { JobCardAlterationWrapper } from "./comp/production/job_modifier";


const altn="alt+n";
const altl="alt+l";

export function ProductionWindowResolver(props) {
    const b = "/app/production/bom";
    const w = "/app/production/workorder";
    const j = "/app/production/job";
    const f = (x, y) => x.concat(y);
    return <Switch>

        <Route path={f(b, "/*")}>
            <Window>
                <WindowItem  shortcut={altn} name="Create" path={f(b, "/create")}>
                    <BomForm create />
                </WindowItem>
                <WindowItem name="List" shortcut={altl} path={f(b, "/read")}>
                    <BomList />
                </WindowItem>
                <WindowItem nomenu component={ReadOnlyBOMWrapper} path={f(b, "/info/:id")} />
                <WindowItem nomenu component={DocBOM}  path={b} />
        
             </Window>
        </Route>

        <Route path={f(w, "/track/:wid")} component={WorkorderTrackerWrapper} />

        <Route path={f(w, "/*")}>
            <Window>
                <WindowItem name='Create' shortcut={altn} path={f(w, "/create")}>
                    <WorkOrderForm create />
                </WindowItem>

                <WindowItem name='List' shortcut={altl} path={f(w, "/read")}>
                    <WorkOrderList />
                </WindowItem>
                <WindowItem nomenu component={DocWorkOrder}  path={w} />
        
            </Window>
        </Route>

        <Route path={f(j, "/track/:jid/")} component={JobCardAlterationWrapper} />
        <Route path={f(j, "/*")}>
            <Window>
                <WindowItem name="Create" shortcut={altn}  path={f(j, "/create")}>
                    <JobForm create />
                </WindowItem>

                <WindowItem name="List" shortcut={altl} path={f(j, "/read")}>
                    <JobCardList />
                </WindowItem>
                <WindowItem nomenu component={DocJOB}  path={j} />
        
            </Window>
        </Route>


    </Switch>
}



export function Window(props) {
    const f = (v, i) => {
        return (v.props.nomenu) ? <></> : <Menu.Item key={i}> <Link to={v.props.path}>{v.props.name}</Link> </Menu.Item>
    }
    const f1 = (v, i) => {
        return (v.props.nomenu) ? <Route key={i} path={v.props.path} component={v.props.component} /> : <Route key={i} path={v.props.path} >{v.props.children}</Route>
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
    nomenu: PropTypes.bool,
    /**
     * Component to render in nomenu case
     */
    component: PropTypes.element,
    /**
     * short cut for menu item
     */
    shortcut:PropTypes.string
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
    let o = "/app/master/operation";
    let r = "/app/master/route";
    const f = (a, b) => a.concat(b);
    return <Switch>

        <Route path={a.concat("/*")}  >
            <Window>
                <WindowItem name="Create" shortcut={altn} path={a.concat("/create")} >
                    <AccountForm create />
                </WindowItem>
                <WindowItem name="List"  shortcut={altl} path={a.concat("/read")}>
                    <AccountList />
                </WindowItem>
                <WindowItem nomenu component={ReadOnlyAccountWrapper} path={f(a, "/info/:id")} />
                <WindowItem nomenu component={DocAccount}  path={a} />
            </Window>
        </Route>

        <Route path={u.concat("/*")}  >
            <Window>
                <WindowItem name="Create" shortcut={altn} path={u.concat("/create")} >
                    <UnitForm create />
                </WindowItem>
                <WindowItem name="List" shortcut={altl} path={u.concat("/read")}>
                    <UnitList />
                </WindowItem>
                <WindowItem nomenu component={ReadOnlyUnitWrapper} path={f(u, "/info/:id")} />
                <WindowItem nomenu component={DocUnit} path={u} />
            </Window>
        </Route>
        <Route path={i.concat("/*")}  >
            <Window>
                <WindowItem name="Create" shortcut={altn} path={i.concat("/create")} >
                    <ItemForm create />
                </WindowItem>
                <WindowItem name="List"  shortcut={altl} path={i.concat("/read")}>
                    <ItemList />
                </WindowItem>
                <WindowItem nomenu component={ReadOnlyItemWrapper} path={f(i, "/info/:id")} />
                <WindowItem nomenu component={DocItem} path={i} />
            </Window>
        </Route>
        <Route path={w.concat("/*")}  >
            <Window>
                <WindowItem name="Create" shortcut={altn} path={w.concat("/create")} >
                    <WorkplaceForm create />
                </WindowItem>
                <WindowItem name="List"  shortcut={altl} path={w.concat("/read")}>
                    <WorkplaceList />
                </WindowItem>
                <WindowItem nomenu component={ReadOnlyWorkStationWrapper} path={f(w, "/info/:id")} />
                <WindowItem nomenu component={DocWorkStation} path={w} />
            </Window>
        </Route>
        <Route path={g.concat("/*")}  >
            <Window>
                <WindowItem name="Create" shortcut={altn}  path={g.concat("/create")} >
                    <GroupForm create />
                </WindowItem>
                <WindowItem name="List" shortcut={altl} path={g.concat("/read")}>
                    <GroupList />
                </WindowItem>
                <WindowItem nomenu component={ReadOnlyGroupWrapper} path={f(g, "/info/:id")} />
                <WindowItem nomenu component={DocGroup} path={g} />
            </Window>
        </Route>

        <Route path={us.concat("/*")}  >
            <Window>
                <WindowItem name="Create" shortcut={altn} path={us.concat("/create")} >
                    <UserForm create />
                </WindowItem>
                <WindowItem name="List" shortcut={altl}  path={us.concat("/read")}>
                    <UserList />
                </WindowItem>
            </Window>
        </Route>

        <Route path={o.concat("/*")}>
            <Window>
                <WindowItem name="Create" shortcut={altn} path={o.concat('/create')}>
                    <OperationForm create />
                </WindowItem>
                <WindowItem name="List" shortcut={altl}  path={o.concat('/read')}>
                    <OperationList />
                </WindowItem>
                <WindowItem nomenu component={ReadOnlyOperationWrapper} path={f(o, "/info/:id")} />
                <WindowItem path={o} nomenu component={DocOperation} />
            </Window>
        </Route>

        <Route path={r.concat("/*")}>
            <Window>
                <WindowItem name="Create" shortcut={altn} path={r.concat('/create')}>
                    <RouteForm create />
                </WindowItem>
                <WindowItem name="List" shortcut={altl}  path={r.concat('/read')}>
                    <RouteList />
                </WindowItem>
                <WindowItem nomenu component={ReadOnlyRouteWrapper} path={f(r, "/info/:id")} />
                <WindowItem nomenu component={DocRoute} path={r} />
            </Window>
        </Route>
    </Switch>
}