//This contains code to handle user permissions to access various menu options

import React, { useState } from "react";
import { List, Form, } from "semantic-ui-react";
import PropTypes from "prop-types";
import { MenuTree } from "../../Fixed";
/**
 * This components renders root node of tree
 * @param {ReactProps} props 
 */
export function UserPermTree(props) {
    const map = (v, i) => {
        return <TreeNode checked={false} key={i} {...v} />
    };

    return <List>
        {MenuTree.map(map)}
    </List>
}

/**
 * Node, which contains info current menu option node
 * @param {ReactProps} props 
 */
function TreeNode(props) {

    const [hasPerm, setPerm] = useState(props.checked);
    const [isHidden, setIsHidden] = useState(true); //by default all subtrees are hidden
    const SubTree = p => {
        return <List.List style={{display:(isHidden)?"none":"block"}} >
            {p.childs.map((v, i) => {
                return <TreeNode {...v} checked={hasPerm} key={i} />
            })}
        </List.List>
    }

    const checkChange = (_,d) => {
        setPerm(d.checked);
    }
    const handleExpansion = e => {
        setIsHidden(!isHidden);
    }

    return <List.Item>
        {'childs' in props ? <List.Icon tilte={isHidden ? "Expand" : "Contract"} name={isHidden ? "plus circle" : "minus circle"} onClick={handleExpansion} /> : <List.Icon size="tiny" name="circle" />}
        <List.Content>
            <List.Header>
                <Form.Checkbox checked={hasPerm}   onChange={checkChange} label={props.name} />
                {(hasPerm) ? <input hidden name='menu_perm' defaultValue={props.value} /> : <></>}
            </List.Header>
            {'childs' in props ? <SubTree checked={hasPerm} childs={props.childs} /> : <></>}
        </List.Content>

    </List.Item>

}

TreeNode.propTypes = {
    /**
     * Name of the menu options
     */
    name: PropTypes.string,
    /**
     * Code of menu Item
     */
    value: PropTypes.string,
    /**
     * specify whether user has permission to use this options
     */
    checked: PropTypes.bool,
    /**
     * array of child subtree
     */
    childs: PropTypes.array

}
