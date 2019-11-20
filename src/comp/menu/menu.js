//This file contains code to render basic menu of the authed user
import React from "react";
import { Menu, Dropdown } from "semantic-ui-react";
import { Link } from "react-router-dom";
export function BaseMenu(props) {
    return (

       
           <Menu>
                <Dropdown item text="Master" >
                    <MasterMenu />
                </Dropdown>
                <Dropdown item  text="Production" >

                    <ProductionMenu />
                </Dropdown>
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