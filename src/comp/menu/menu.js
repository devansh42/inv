//This file contains code to render basic menu of the authed user
import React from "react";
import { Menu, Dropdown, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import Apm from "../../apm";
export function BaseMenu(props) {

    const user = JSON.parse(localStorage.getItem("user")); //May be null
    const mh = Apm.master;
    const master = [

        { text: "Account", icon: "id badge", href:mh.account.concat("/"), header: true },
        {divider:true},
        { text: "Group", icon: "user group", href:mh.group.concat("/"), header: true },
        {divider:true},
       
        { text: "Item", header: true, href:mh.item.concat("/"),icon: "boxes" },
        { text: "Unit", header: true,href:mh.unit.concat("/"), icon: "balance scale" },
        {divider:true},
        { text: "Operation", header: true,href:mh.operation.concat("/"), icon: "cog" },
        { text: "Route", header: true,href:mh.route.concat("/"), icon: "cogs" },
        { text: "Workplace", header: true,href:mh.workplace.concat("/"), icon: "warehouse" },
        {divider:true},
        { header: true, text: "User",href:mh.user.concat("/"), icon: "user" },
     

    ];

    const ph =Apm.production;
    const production = [
        {
            text: "Bill of Material(s)",href:ph.bom.concat("/") , icon: "clipboard"
        },
        { text: "Workorder", href:ph.workorder.concat("/"),  icon: "briefcase" },

        { text: "Job", icon: "cog", href:ph.job.concat("/") }
    ];

    const listMenu = ele => ele.map((v, i) => { return (v.divider) ? <Dropdown.Divider /> : <Dropdown.Item  key={i} ><Icon name={v.icon} /> <Link to={v.href}>{v.text}</Link></Dropdown.Item> });

    return (


        <Menu>
            <Dropdown floating item text="Master" >
                <Dropdown.Menu   >

                    {listMenu(master)}
                </Dropdown.Menu>
            </Dropdown>
            <Dropdown item floating text="Production" >
                <Dropdown.Menu>
                    {listMenu(production)}
                </Dropdown.Menu>
            </Dropdown>
            <Menu.Menu position="right" >
                <Dropdown floating item text={user.username}>
                    <Dropdown.Menu>
                        <Dropdown.Header icon={user.gender == "0" ? "male" : "female"} content={user.name} />

                        <Dropdown.Item text={"( " + user.group_name + " )"} />
                    </Dropdown.Menu>
                </Dropdown>

                <Menu.Item title="Logout" >
                    <Icon name='sign-out' />
                    <Link to="/logout">

                        Logout</Link>
                </Menu.Item>
            </Menu.Menu>
        </Menu>
    )
}




function MasterMenu() {
    return <Dropdown.Menu   >
        <Dropdown.Item text="Account" />
        <Dropdown.Item text="Item" />

    </Dropdown.Menu>;
}


function ProductionMenu() {
    return <Dropdown.Menu>

        <Dropdown.Item text="BOM" />
        <Dropdown.Item text="WorkOrder" />
        <Dropdown.Item text="Job Card" />



    </Dropdown.Menu>
}