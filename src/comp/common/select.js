//This file contains element definition 
import React from 'react';
import PropTypes from "prop-types";
import { Select } from 'semantic-ui-react';
/**
 * This element is the wrapper over semantic-ui's select element
 * @param {ReactProps} param0 
 */
export const CustomSelect = ({ name, onChange, ...props }) => {
    const [choice, setChoice] = useState(null);
    const handleChange = (e, d) => {
        setChoice(d.value);
        if ('onChange' !== undefined) {
            onChange.call(this,e,d);
        }
    }

    return <><Select {...props} onChange={handleChange} /><input value={choice} name={name} hidden />   </>
}
CustomSelect.propTypes = {
    /**
     * name, is the name of input element associated with this select Element
     */
    name: PropTypes.string.isRequired,
    ...Select.propTypes
}