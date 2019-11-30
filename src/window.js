//This file contains code to render window related to master menu
import React from "react";
import { Grid, Menu, Label } from "semantic-ui-react";
import { Switch, Link } from "react-router-dom";
import { AccountForm, AccountList, ReadOnlyAccountWrapper, DocAccount } from "./comp/master/account";
import { UnitForm, UnitList, ReadOnlyUnitWrapper, DocUnit } from "./comp/master/unit";
import { ItemForm, ItemList, ReadOnlyItemWrapper, DocItem } from "./comp/master/item";
import { WorkplaceForm, WorkplaceList, ReadOnlyWorkStationWrapper, DocWorkStation } from "./comp/master/workstation";
import { GroupForm, GroupList, ReadOnlyGroupWrapper, DocGroup } from "./comp/master/group";
import PropTypes from "prop-types";
import { BomList, BomForm, ReadOnlyBOMWrapper, DocBOM } from "./comp/production/bom";
import { WorkOrderForm, WorkOrderList, DocWorkOrder } from "./comp/production/workorder";
import { JobCardList, JobForm, DocJOB } from "./comp/production/job";
import { UserForm, UserList, ReadOnlyUserWrapper, DocUser } from "./comp/master/user";
import { OperationForm, OperationList, ReadOnlyOperationWrapper, DocOperation } from "./comp/master/operation";
import { RouteForm, RouteList, ReadOnlyRouteWrapper, DocRoute } from "./comp/master/route";
import { WorkorderTrackerWrapper } from "./comp/production/workorderTracking";
import { JobCardAlterationWrapper } from "./comp/production/job_modifier";
import { ACRoute } from "./comp/common/route";

const altn = "alt+n";
const altl = "alt+l";

export function ProductionWindowResolver(props) {
    const b = "/app/production/bom";
    const w = "/app/production/workorder";
    const j = "/app/production/job";
    const f = (x, y) => x.concat(y);
    return <Switch>

        <ACRoute path={f(b, "/*")}>
            <Window>
                <WindowItem shortcut={altn} perm={['2.1.1']} name="Create" path={f(b, "/create")}>
                    <BomForm create />
                </WindowItem>
                <WindowItem name="List" perm={['2.1.3']} shortcut={altl} path={f(b, "/read")}>
                    <BomList />
                </WindowItem>
                <WindowItem nomenu perm={['2.1.4']} component={ReadOnlyBOMWrapper} path={f(b, "/info/:id")} />
                <WindowItem nomenu component={DocBOM} path={b} />

            </Window>
        </ACRoute>

        <ACRoute path={f(w, "/track/:wid")} perm={['2.2.4']} component={WorkorderTrackerWrapper} />

        <ACRoute path={f(w, "/*")}>
            <Window>
                <WindowItem name='Create' perm={['2.2.1']} shortcut={altn} path={f(w, "/create")}>
                    <WorkOrderForm create />
                </WindowItem>

                <WindowItem name='List' perm={['2.2.3']} shortcut={altl} path={f(w, "/read")}>
                    <WorkOrderList />
                </WindowItem>
                <WindowItem nomenu component={DocWorkOrder} path={w} />

            </Window>
        </ACRoute>

        <ACRoute path={f(j, "/track/:jid/")} perm={['2.3.2']} component={JobCardAlterationWrapper} />
        <ACRoute path={f(j, "/*")}>
            <Window>
                <WindowItem name="Create" perm={['2.3.1']} shortcut={altn} path={f(j, "/create")}>
                    <JobForm create />
                </WindowItem>

                <WindowItem name="List" perm={['2.3.3']} shortcut={altl} path={f(j, "/read")}>
                    <JobCardList />
                </WindowItem>
                <WindowItem nomenu component={DocJOB} path={j} />

            </Window>
        </ACRoute>


    </Switch>
}



export function Window(props) {
    const f = (v, i) => {
        return (v.props.nomenu) ? <></> : <Menu.Item key={i}> <Link to={v.props.path}>{v.props.name}</Link> </Menu.Item>
    }
    const f1 = (v, i) => {
        return (v.props.nomenu) ? <ACRoute key={i} perm={v.props.perm} path={v.props.path} component={v.props.component} /> : <ACRoute key={i} perm={v.props.perm} path={v.props.path} >{v.props.children}</ACRoute>
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
    shortcut: PropTypes.string,
    /**
     * Perms to follow on this url
     */
    perm: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
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

        <ACRoute path={a.concat("/*")}  >
            <Window>
                <WindowItem name="Create" perm={['1.1.1']} shortcut={altn} path={a.concat("/create")} >
                    <AccountForm create />
                </WindowItem>
                <WindowItem name="List" perm={['1.1.3']} shortcut={altl} path={a.concat("/read")}>
                    <AccountList />
                </WindowItem>
                <WindowItem nomenu perm={['1.1.4']} component={ReadOnlyAccountWrapper} path={f(a, "/info/:id")} />
                <WindowItem nomenu component={DocAccount} path={a} />
            </Window>
        </ACRoute>

        <ACRoute path={u.concat("/*")}  >
            <Window>
                <WindowItem name="Create" perm={['1.5.1']} shortcut={altn} path={u.concat("/create")} >
                    <UnitForm create />
                </WindowItem>
                <WindowItem name="List" perm={['1.5.3']} shortcut={altl} path={u.concat("/read")}>
                    <UnitList />
                </WindowItem>
                <WindowItem nomenu perm={['1.5.4']} component={ReadOnlyUnitWrapper} path={f(u, "/info/:id")} />
                <WindowItem nomenu component={DocUnit} path={u} />
            </Window>
        </ACRoute>
        <ACRoute path={i.concat("/*")}  >
            <Window>
                <WindowItem name="Create" perm={['1.3.1']} shortcut={altn} path={i.concat("/create")} >
                    <ItemForm create />
                </WindowItem>
                <WindowItem name="List" perm={['1.3.3']} shortcut={altl} path={i.concat("/read")}>
                    <ItemList />
                </WindowItem>
                <WindowItem nomenu perm={['1.3.4']} component={ReadOnlyItemWrapper} path={f(i, "/info/:id")} />
                <WindowItem nomenu component={DocItem} path={i} />
            </Window>
        </ACRoute>
        <ACRoute path={w.concat("/*")}  >
            <Window>
                <WindowItem name="Create" perm={['1.6.1']} shortcut={altn} path={w.concat("/create")} >
                    <WorkplaceForm create />
                </WindowItem>
                <WindowItem name="List" perm={['1.6.3']} shortcut={altl} path={w.concat("/read")}>
                    <WorkplaceList />
                </WindowItem>
                <WindowItem nomenu perm={['1.6.4']} component={ReadOnlyWorkStationWrapper} path={f(w, "/info/:id")} />
                <WindowItem nomenu component={DocWorkStation} path={w} />
            </Window>
        </ACRoute>
        <ACRoute path={g.concat("/*")}  >
            <Window>
                <WindowItem name="Create" perm={['1.4.1']} shortcut={altn} path={g.concat("/create")} >
                    <GroupForm create />
                </WindowItem>
                <WindowItem name="List" perm={['1.4.3']} shortcut={altl} path={g.concat("/read")}>
                    <GroupList />
                </WindowItem>
                <WindowItem nomenu perm={['1.4.4']} component={ReadOnlyGroupWrapper} path={f(g, "/info/:id")} />
                <WindowItem nomenu component={DocGroup} path={g} />
            </Window>
        </ACRoute>

        <ACRoute path={us.concat("/*")}  >
            <Window>
                <WindowItem name="Create" perm={['1.2.1']} shortcut={altn} path={us.concat("/create")} >
                    <UserForm create />
                </WindowItem>
                <WindowItem name="List" perm={['1.2.3']} shortcut={altl} path={us.concat("/read")}>
                    <UserList />
                </WindowItem>
                <WindowItem nomenu perm={['1.2.4']} component={ReadOnlyUserWrapper} path={f(us, "/info/:id")} />
                <WindowItem path={o} nomenu component={DocUser} />
                
            </Window>
        </ACRoute>

        <ACRoute path={o.concat("/*")}>
            <Window>
                <WindowItem name="Create" perm={['1.8.1']} shortcut={altn} path={o.concat('/create')}>
                    <OperationForm create />
                </WindowItem>
                <WindowItem name="List" perm={['1.8.3']} shortcut={altl} path={o.concat('/read')}>
                    <OperationList />
                </WindowItem>
                <WindowItem nomenu perm={['1.8.4']} component={ReadOnlyOperationWrapper} path={f(o, "/info/:id")} />
                <WindowItem path={o} nomenu component={DocOperation} />
            </Window>
        </ACRoute>

        <ACRoute path={r.concat("/*")}>
            <Window>
                <WindowItem name="Create" perm={['1.7.1']} shortcut={altn} path={r.concat('/create')}>
                    <RouteForm create />
                </WindowItem>
                <WindowItem name="List" perm={['1.7.3']} shortcut={altl} path={r.concat('/read')}>
                    <RouteList />
                </WindowItem>
                <WindowItem nomenu perm={['1.7.4']} component={ReadOnlyRouteWrapper} path={f(r, "/info/:id")} />
                <WindowItem nomenu component={DocRoute} path={r} />
            </Window>
        </ACRoute>
    </Switch>
}