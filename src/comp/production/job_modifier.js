//This file contains code for rendering job card modifer 
"use strict";
import React, { Component, useState, useEffect } from 'react';
import { Form, Select, Header, Table, TextArea, Icon } from "semantic-ui-react"
import PropTypes from "prop-types";
import { Get, MakePostFetch } from "../../network";
import End from "../../end";

export function JobCardAlteration(props) {
    const [errorState, setErrorState] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [startTime, setStartTime] = useState(Date.now());
    const [finishTime, setFinishTime] = useState(Date.now());
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);

    const payload = useEffect(() => {
        const f = new FormData();
        f.append("id", props.jid);
        return MakePostFetch(End.production.job.read, f, true)
            .then(r => {
                if (r.status == 200) {
                    return r.json();
                } else throw Error("Couldn't load Job Card Id");
            })
            .then(r => {
                return r.result;
            })
            .catch(err => {
                setErrorState(true);
                setErrorMsg(err.message);

            })
    }, [true]);

    const accountList = useEffect(() => {
        return Get.Account()
            .then(r => {
                return r //returning array of account holders
            })
            .catch(err => {
                setErrorState(true);
                setErrorMsg("Couldn't load Account list");
            })
    }, [true]);



    const [logs, setLogs] = useState([]);
    const addRow = e => {
        const l = logs;
        l.push(1);
        setLogs(l);//adding more elements
    };
    const handleStart = e => {
        setStartTime(Date.now());
        e.target.disabled = true;
        setStarted(true);
    }
    const handleFinish = e => {
        if (!started) return;
        setFinishTime(Date.now());
        e.target.disabled = true;
        setFinished(true);
    }
    const handleSubmit = e => {

    };



    return (
        <Form id="jobcardform" error={errorState}>
            <Header dividing>{"#".concat(props.jid)}</Header>
            <Form.Group>
                <Form.Input disabled label="WorkOrder No." value={payload.workorder} />
                <Form.Input disabled label="Post Time" type="datetime" value={payload.post_time} />
                <Form.Input label="Quantity" defaultValue={1} type="number" />
            </Form.Group>
            <Form.Input disabled value={payload.operation_name} />
            <Form.Field label="Account">
                <Select value={payload.account} options={accountList} placeholder='Choose Account to Assign' ></Select>
            </Form.Field>
            <Form.Group>
                <Form.Field>
                    {(started) ? new Date(startTime).toLocaleString() : <Button onClick={handleStart}>Start</Button>}
                </Form.Field>
                <Form.Field>
                    {(finished) ? new Date(finishTime).toLocaleString() : <Button onClick={handleFinish}>Finish</Button>}
                </Form.Field>
            </Form.Group>
            <Form.Group>
                <Header.Subheader>Job Logs</Header.Subheader>

                <Table>
                    <Table.Row>
                        <Table.Header>
                            <Table.Cell>
                                SI
                        </Table.Cell>
                            <Table.Cell>
                                Start-Time
                        </Table.Cell>
                            <Table.Cell>
                                Finish-Time
                        </Table.Cell>
                            <Table.Cell>
                                Quantity Completed
                        </Table.Cell>
                            <Table.Cell>
                                Description
                        </Table.Cell>
                        </Table.Header>
                    </Table.Row>
                    {logs.map((v, i) => {
                        return <TableRow totalQty={payload.totalQty} setCompletedQty={setCompletedQty} completedQty={completedQty} key={i} setErrorMsg={setErrorMsg} setErrorState={setErrorState} />
                    })}
                    <Table.Row>
                        <Table.Footer>
                            <Table.Cell>
                                <Button onClick={addRow}>Add Row</Button>
                            </Table.Cell>
                        </Table.Footer>
                    </Table.Row>
                </Table>
            </Form.Group>
            <Form.Group>
                <KVTable kv_pairs={kvPairPayload} />
            </Form.Group>
            <Message error>{errorMsg}</Message>
            <Button onClick={handleSubmit}>Submit</Button>
        </Form>
    );
}

/**
 * 
 * @param {ReactProps} props 
 */
function KVTable({kv_pairs,...props}) {
    const [kvpair,setKvpair]=useState(kv_pairs);
    const addRow=e=>{
        let x=kvpair;
        x.push({mutable:true});
        setKvpair(x);
    };
    const removeRow=i=>{
        setKvpair(kvpair.filter((v,xi)=>xi!==i));
    }

    return <Table>
        <Table.Row>
            <Table.Header>
                <Table.Cell>
                    <Button onClick={addRow}>Add Row</Button>
                </Table.Cell>

                <Table.Cell>
                 Key
                </Table.Cell>
                <Table.Cell>
                Value
                </Table.Cell>
            </Table.Header>
            {kvpair.map((v,i)=>{
                return <KVTableRow key={i} kv_key={v.key} removeRow={removeRow} kv_value={v.value} mutable={v.mutable} />
            })}

        </Table.Row>
    </Table>
}


KVTable.propTypes = {
    /**
     * These are the kv pairs pf previously completed actions
     */
    kvPairs: PropTypes.arrayOf(PropTypes.array)
}



/**
 * 
 * @param {ReactProps} props 
 */
function KVTableRow({key,removeRow, mutable, kv_key, kv_value, ...props }) {
    const handleRemove=e=>{
        removeRow(key);
    }

    return (mutable) ? <Table.Row>
        <Table.Cell>
            <Form.Input name="key" placeholder="Key of Attribute" />
        </Table.Cell>
        <Table.Cell>
            <Form.Input name="value" placeholder="Value of Attribute" />
        </Table.Cell>
        <Table.Cell>
            <Icon name="times" title="Remove" onClick={handleRemove} />
        </Table.Cell>
    </Table.Row> : <Table.Row>
            <Table.Cell>
                {kv_key}
            </Table.Cell>
            <Table.Cell>
                {kv_value}
            </Table.Cell>
        </Table.Row>;
}

KVTableRow.propTypes = {

    kv_key: PropTypes.string,
    kv_value: PropTypes.string,
    mutable: PropTypes.bool,
    /**
     * Removes a row in the kv table
     */
    removeRow:PropTypes.func
}

/**
 * This element render table row of job logs
 * @param {object} React Props 
 */
function TableRow({ setErrorMsg, setErrorState, ...props }) {
    const [startTime, setStartTime] = useState(Date.now());
    const [finishTime, setFinishTime] = useState(Date.now());
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);
   
    const handleStart = e => {
        setStartTime(Date.now());
        e.target.disabled = true;
        setStarted(true);
    }
    const handleFinish = e => {
        if (!started) return;
        setFinishTime(Date.now());
        e.target.disabled = true;
        setFinished(true);
    }
    
    const handleInput = e => {
        const v = Number(e.target.value);
        let errorState, errorMsg;

        if (v <= 0) {
            errorState = true;
            errorMsg = "Invalid Completed Quantity, must be positive";
        }
        else if (totalQty < (completedQty + v)) {
            errorState = true;
            errorMsg = "Invalid Completed Quantity,It must be less than total Quantity";
        }
        else {
            //No Error
            setCompletedQty(completedQty + v);//updating completed quantity for the whole job card
        }

        if (errorState) {
            setErrorState(errorState);
            setErrorMsg(errorMsg);
        }
    }

    return (removed) ? <></> : <Table.Row>
        <Table.Cell>
            <Select placeholder="Choose Worker" name="worker" options={workers} ></Select>
        </Table.Cell>
        <Table.Cell>
            {props.key + 1} {(started) ? <Icon name="circle" tiny color={(!finished) ? "green" : "black"} /> : <></>}
        </Table.Cell>
        <Table.Cell>
            {(started) ? new Date(startTime).toLocaleString() : <Button onClick={handleStart}>Start</Button>}
        </Table.Cell>
        <Table.Cell>
            {(finished) ? new Date(finishTime).toLocaleString() : <Button onClick={handleFinish}>Finish</Button>}
        </Table.Cell>
        
        <Table.Cell>
            <TextArea rows={2} placeholder="Details..." />
        </Table.Cell>
        <Table.Cell>
            <Icon name="times" onClick={(e) => { setRemoved(true); }} />
        </Table.Cell>
    </Table.Row>;
};


TableRow.propTypes = {
    /**
     * Worker to associated with work
     */
    workers:PropTypes.arrayOf(PropTypes.object),

    /**
     * function to update error state
     */
    setErrorState: PropTypes.func.isRequired,
    /**
     * function to update error message
     */
    setErrorMsg: PropTypes.func,
    
    /**
     * total quantity to be completed
     */
    totalQty: PropTypes.number
};

JobCardAlteration.propTypes = {
    /**
     * jid is JOB Id
     */
    jid: PropTypes.number
};