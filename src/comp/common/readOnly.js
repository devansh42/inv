//This file contains utility's like components and hook for read only form windows
import React, { useState, useEffect } from "react";
import { MakePostFetch } from "../../network";
import { Segment, Header, Divider, Form, Message } from "semantic-ui-react";


/**
 * React's useEffect warapper to run only one time
 */
export const useEffectOnlyOne = fn => useEffect(fn,[]);



/**
 * 
 * @param {FormData} formData, data to be submitted with fetch requests 
 */
function useReadOnly(endpoint, formData) {
    const [fetched, setfetched] = useState(false);
    const [payload, setpayload] = useState({});
    const [errorMsg, setErrorMsg] = useState(null);
    
    useEffectOnlyOne(()=>{
        MakePostFetch(endpoint, formData, true)
            .then(r => {
                if (r.status == 200) return r.json();
                else throw Error("Couldn't fulfill your request");
            })
            .then(r => {
                if (r.error) throw Error(r.errorMsg)
                else return r.result; //may be undefined
            })
            .then(r => {
                //now 'r' contains the result
               
                setpayload(r);
                setfetched(true);
            })
            .catch(err => {
                //Handling error  
                setErrorMsg(err.message);
                setfetched(true)
            })
    });

    return [fetched, errorMsg !== null, errorMsg, payload];

}

/**
 * withReadOnlySupport, is a HOC, which wrapp readonly fields of a form after fetching its content
 * @param {ReactComponent} Comp component to render as readonly area
 * @param {String|ReactComponent} header is the header of readonly form
 * @param {String} endPoint is endpoint to fetch data
 * @param {FormData} formData is formData to submit with fetch request
 */
export function withReadOnlySupport(Comp, header, endPoint, formData) {
    const F = (props) => {
        const [fetched, errorState, errorMsg, payload] = useReadOnly(endPoint, formData);
       console.log("state state",fetched,payload);
    return <Segment>
            {typeof header == "string" ? <Header dividing content={header} /> : header}
            <Form loading={!fetched} error={errorState}>
                {(fetched) ? <Comp payload={payload} /> : <></>}
                <Divider />
            <Message header="There is an problem!!" error content={errorMsg} />
            </Form>
          
        </Segment>
    };
    return F;
}


