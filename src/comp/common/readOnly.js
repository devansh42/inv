//This file contains utility's like components and hook for read only form windows
import React, { useState, useEffect } from "react";
import { MakePostFetch } from "../../network";
import { Segment, Header, Divider, Form, Message } from "semantic-ui-react";



/**
 * 
 * @param {FormData} formData, data to be submitted with fetch requests 
 */
function useReadOnly(endpoint, formData) {
    const [fetched, setfetched] = useState(false);
    const [payload, setpayload] = useState({});
    const [errorMsg, setErrorMsg] = useState(null);
    const fixed = false;

    useEffect(() => {

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
                setfetched(true);
                setpayload(r);
            })
            .catch(err => {
                //Handling error  
                setErrorMsg(err.message);
            })
    }, [fixed]);

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
    const F = () => {
        const [fetched, errorState, errorMsg, payload] = useReadOnly(endPoint, formData);
        console.log("state change" , [fetched, errorState, errorMsg, payload]);
    return <Segment>
            {header instanceof String ? <Header dividing content={header} /> : header}
            <Form loading={!fetched} error={errorState}>
                {(fetched) ? <Comp payload={payload} /> : <></>}
                <Divider />
            <Message header="There is an problem!!" error content={errorMsg} />
            </Form>
          
        </Segment>
    };
    return <F/>
}
