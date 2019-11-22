//This file contains element definition 
import React from 'react';
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import { Form, Segment, Header, Dropdown } from 'semantic-ui-react';
/**
 * This element is the wrapper over semantic-ui's select element
 * @param {ReactProps} param0 
 */
export const CustomSelect = ({ name, onChange, ...props }) => {
    const i = React.createRef();
    const handleChange = (e, d) => {
        i.current.value = d.value;
     
        if (onChange !== undefined) {
            onChange(e, d);
        
        }
    }

    //  return <><Select {...props} onChange={handleChange} /><input ref={i} name={name} hidden />   </>
    return <>
        <Dropdown selection search {...props} onChange={handleChange} />
        <input ref={i} name={name} hidden />
    </>
}
CustomSelect.propTypes = {
    /**
     * name, is the name of input element associated with this select Element
     */
    name: PropTypes.string.isRequired,
    ...Dropdown.propTypes
}


/**
 *  This element is the wrapper over semantic-ui's Checkbox element
 * @param {ReactProps} param0 
 */
export const CustomCheckbox = ({ checked, name, onChange, ...props }) => {
    const i = React.createRef();
    const handleChange = (e, d) => {
        i.current.checked = d.checked;
        i.current.value=d.checked;
        if (onChange !== undefined) {
            onChange.call(this, e, d);
        }
    }
    return <><Form.Checkbox  {...props} onChange={handleChange} /><input name={name} hidden ref={i} />   </>
}
CustomCheckbox.propTypes = {
    /**
     * name, is the name of hidden field of input element
     */
    name: PropTypes.string.isRequired,
    ...Form.Checkbox.propTypes

}

/**
 * finds an element with given name
 * @param {String} s is the element's name 
 */
export const $ = s => {
    return document.getElementsByName(s).item(0);
}
/**
 * finds an element with given id
 * @param {String} s is the element's id 
 */
export const $$ = s => {
    return document.getElementById(s);
}

export function SuccessMessage({ header, ...props }) {
    return <Segment color='green' compact>
        <Header content={header} />
        {props.children}
    </Segment>
}

SuccessMessage.propTypes = {
    /**
     * Header of the success card
     */
    header: PropTypes.string.isRequired
}

export function HeaderLink({ header, link, ...props }) {
    return <Link to={link}>{header}</Link>
}

HeaderLink.propTypes = {
    header: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired
}