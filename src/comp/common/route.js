//This file contains component definition for Route

import React from "react";
import PropTypes from "prop-types";
import { Header, Message, Segment, Icon } from "semantic-ui-react";
import {Route} from 'react-router-dom';

/**
 * ACRoute, is Access Control Route, it takes a permission array to permit access else renders an Forbidden Message
 * @param {ReactProp} props 
 */
export function ACRoute({ perm, ...props }) {
    const perms = JSON.parse(localStorage.getItem("perms"));
    let permitted = false;
    if (perm != undefined) {

        if (perm instanceof Array) {
            permitted = perm.filter(v => perms.indexOf(v) != -1).length > 0;
        } else {
            permitted = perms.indexOf(perm) != -1;
        }
    } else {
        permitted = true;
    }
    return (permitted) ? <Route {...props}>
        {props.children}
    </Route> : <Segment>
            <Message error>
                <Message.Header >
                <Icon name="ban" />
                    Forbidden Access
            </Message.Header>
                <Message.Content>You cannot access this resource. Contact <b>Admin</b> for further assistance. </Message.Content>
            </Message>
        </Segment>
}


ACRoute.propTypes = {
    /**
     * perm, is the array or string of permission required to render underlying component
     */
    perm: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string])
}

