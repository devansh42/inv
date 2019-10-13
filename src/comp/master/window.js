//This file contains code to render window related to master menu
import React,{Component} from "react";
import { Grid, Menu } from "semantic-ui-react";
import {Switch,Route ,Link} from "react-router-dom";
import { AccountForm, AccountList } from "./account";
import { UnitForm, UnitList } from "./unit";
import {ItemForm,ItemList} from "./item";
import { WorkplaceForm, WorkplaceList } from "./workstation";
import {GroupForm,GroupList} from "./group";
import PropTypes from "prop-types";


export function MasterWindow(props){
    const f=v=>{
        return <Menu.Item> <Link to={v.props.path}>{v.props.name}</Link></Menu.Item>
    }
    const f1=v=>{
        return <Route path={v.props.path}>{v.props.children}</Route>
    }

    return <div>
        <Grid centered columns={2}>
            <Grid.Column>
                <Menu vertical>
                {props.children.map(f)}
                </Menu>
            </Grid.Column>
            <Grid.Column>
                <Switch>
                {props.children.map(f1)}
                </Switch>
            </Grid.Column>
        </Grid>
    </div>     
}


export function MasterWindowItem(props){
    return <></>
}

MasterWindowItem.propTypes={
    name:PropTypes.string,
    path:PropTypes.element
}


export function MasterWindowResolver(props){
    let a="/app/master/account";
    let u="/app/master/unit";
    let i="/app/master/item";
    let w="/app/master/workplace";
    let g="/app/master/group";
    
   return <Switch>
        
        <Route path={a.concat("/*")}  >
            <MasterWindow>
                <MasterWindowItem name="Create" path={a.concat("/create")} >
                    <AccountForm create />
                </MasterWindowItem>
                <MasterWindowItem name="List" path={a.concat("/read")}>
                    <AccountList/>
                </MasterWindowItem>
            </MasterWindow>
        </Route>
        
        <Route path={u.concat("/*")}  >
            <MasterWindow>
                <MasterWindowItem name="Create" path={u.concat("/create")} >
                    <UnitForm create />
                </MasterWindowItem>
                <MasterWindowItem name="List" path={u.concat("/read")}>
                    <UnitList/>
                </MasterWindowItem>
            </MasterWindow>
        </Route>
        
        <Route path={i.concat("/*")}  >
            <MasterWindow>
                <MasterWindowItem name="Create" path={i.concat("/create")} >
                    <ItemForm create />
                </MasterWindowItem>
                <MasterWindowItem name="List" path={i.concat("/read")}>
                    <ItemList/>
                </MasterWindowItem>
            </MasterWindow>
        </Route>
        <Route path={w.concat("/*")}  >
            <MasterWindow>
                <MasterWindowItem name="Create" path={w.concat("/create")} >
                    <WorkplaceForm create />
                </MasterWindowItem>
                <MasterWindowItem name="List" path={w.concat("/read")}>
                    <WorkplaceList/>
                </MasterWindowItem>
            </MasterWindow>
        </Route>
        
        <Route path={g.concat("/*")}  >
            <MasterWindow>
                <MasterWindowItem name="Create" path={g.concat("/create")} >
                    <GroupForm create />
                </MasterWindowItem>
                <MasterWindowItem name="List" path={g.concat("/read")}>
                    <GroupList/>
                </MasterWindowItem>
            </MasterWindow>
        </Route>
        
        
    </Switch>
}