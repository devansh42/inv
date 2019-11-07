//This contains code to handle user permissions to access various menu options

import React,{Component} from "react";
import { List, Form, Reveal } from "semantic-ui-react";
import PropTypes from "prop-types";
import {MenuTree} from "../../Fixed";
/**
 * This components renders root node of tree
 * @param {ReactProps} props 
 */
export function UserPermTree(props){
    const map=(v,i)=>{
        return <treeNode key={i} {...v} />
    };

    return <List>
        {MenuTree.map(map)}
    </List>
}

/**
 * Node, which contains info current menu option node
 * @param {ReactProps} props 
 */
function treeNode(props){
    
    const [hasPerm,setPerm] = useState(props.checked);
    const [isHidden,setIsHidden]=useState(true);
  
    const subTree=p=>{
        return <List.List>
            {p.childs.map((v,i)=>{
                return <treeNode {...v} key={i} />
            })}
        </List.List>
    }

    const checkChange=e=>{
        setPerm(e.target.checked);
    }
    const handleExpansion=e=>{
        setIsHidden(!isHidden);
    }

    return <List.Item>
        {'childs' in props ? <List.Icon tilte={isHidden?"Expand":"Contract"}  name={isHidden?"plus circle":"minus circle"}  onClick={handleExpansion} /> : <List.Icon small name="circle" />}
         <List.Content>
             <List.Header>
                 <Form.Input type="checkbox" checked={hasPem} onChange={checkChange}  label={props.name} />
                    {(hasPerm)?<input hidden name='menu_perm'  value={props.value} />:<></>}
             </List.Header>
             {'childs' in props ? <Reveal><Reveal.Content hidden={isHidden} > <subTree checked={hasPerm} childs={props.childs} /></Reveal.Content></Reveal>: <></> }
         </List.Content>   
        
     </List.Item>

}

treeNode.propTypes={
    /**
     * Name of the menu options
     */
    name:PropTypes.string,
    /**
     * Code of menu Item
     */
    value:PropTypes.string,
    /**
     * specify whether user has permission to use this options
     */
    checked:PropTypes.bool.isRequired(),
    /**
     * array of child subtree
     */
    childs:PropTypes.array

}
