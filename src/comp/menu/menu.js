//This file contains code to render basic menu of the authed user
import React,{Component} from "react";
import { Menu, Dropdown } from "semantic-ui-react";
import {Link} from "react-router-dom";
export class BaseMenu extends Component{
    constructor(props){
        super(props);
        this.state={};
    }
    
    render(){
        
        return(
          
            <Menu >
                <Menu.Item  >
                   <Dropdown text="Master" item>
                    <MasterMenu />
                   </Dropdown>
                </Menu.Item>
                <Menu.Item>
                    <Dropdown text="Production" item>

                    </Dropdown>
                </Menu.Item>
                <Menu.Menu >
                    <Menu.Item>
                        <Link to="/logout">Logout</Link>
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
        
        )
    }

    
}


function MasterMenu(props){
    return <Dropdown.Menu  >
                <Dropdown.Item>
                   <Link to="/app/master/account">Account</Link>
                </Dropdown.Item>
                <Dropdown.Item>
                    <Link to="/app/master/user">User</Link> 
                </Dropdown.Item>
                <Dropdown.Item>
                   <Link to="/app/master/item">Item</Link> 
                </Dropdown.Item>
                <Dropdown.Item>
                   <Link to="/app/master/group">Group</Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link to="/app/master/unit">Unit</Link> 
                </Dropdown.Item>
                <Dropdown.Item>
                   <Link to="/app/master/workstation">WorkStation</Link> 
                </Dropdown.Item>
                </Dropdown.Menu>;
}