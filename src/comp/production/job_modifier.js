//This file contains code for rendering job card modifer 
//Job card, actually manuplated the workorder life cycle

"use strict";
import React, { useState, useEffect } from 'react';
import { Form, Select, Header, Table, TextArea, Icon, Button, Message, Label } from "semantic-ui-react"
import PropTypes from "prop-types";
import { Get, MakePostFetch } from "../../network";
import End from "../../end";
import { KVTable } from "./kv";
import { ProcessStates } from '../../Fixed';

export function JobCardAlteration({ jid, iid, ...props }) {

    const [errorState, setErrorState] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [startTime, setStartTime] = useState(Date.now());
    const [finishTime, setFinishTime] = useState(Date.now());
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);
    const [process_state, setProcessState] = useState(ProcessStates[0]);

    const payload = useEffect(() => {
        const f = new FormData();
        f.append("id", props.jid);
        return MakePostFetch(End.production.jobModifier.read, f, true)
            .then(r => {
                if (r.status == 200) {
                    return r.json();
                } else throw Error("Couldn't load Job Card Id");
            })
            .then(r => {
                return r.result;
            })
            .then(r => {
                //Process result Payload
                if (r.st_time != null) {
                    setStarted(true);
                    setStartTime(r.st_time);
                }
                if (r.fi_time != null) {
                    setFinished(true);
                    setFinishTime(r.fi_time);
                }
                setProcessState(ProcessStates.filter(v => v.key == r.state)[0]);

            })
            .catch(err => {
                setErrorState(true);
                setErrorMsg(err.message);

            })
    }, [true]);

    const kvPairs = useEffect(() => {
        const f = new FormData();
        f.append("id", props.iid);
        return MakePostFetch(End.master.kv.read, f, true)
            .then(r => {
                if (r.status == 200) {
                    return r.json();
                } else throw Error("Couldn't load Attributes of Item to be produced");
            })
            .then(r => {
                return r.result;
            })
            .catch(err => {
                setErrorState(true);
                setErrorMsg(err.message);
            })
    }, [true]);

    const handleStart = e => {
        e.target.disabled = true;
        const time = Date.now();
        startOrFinish("start", time)
            .then(r => {
                setStartTime(time);
                setStarted(true);

            })
            .catch(err => {
                setErrorState(true);
                setErrorMsg(err.message);
                e.target.disabled = false;
            })
    }
    const handleFinish = e => {

        if (!started) return;
        e.target.disabled = true;

        const time = Date.now();
        startOrFinish("finish", time)
            .then(r => {
                setFinishTime(time)
                setFinished(true);
            }).catch(err => {
                setErrorState(true);
                setErrorMsg(err.message);
                e.target.disabled = false;
            })

    }
    const startOrFinish = (action, time) => {
        const f = new FormData();
        f.append("action", action);
        f.append("time", time);
        f.append("job_card", jid);
        f.append("workorder", payload.workorder);
        return MakePostFetch(End.production.jobModifier.action, f, true)
            .then(r => {
                if (r.status == 200) {
                    return r.json()
                } else throw Error("Couldn't " + action + " this operation");
            })
            .then(r => {
                if (r.error) {
                    throw Error(r.errorMsg);
                } else { //Changing Process State
                    setProcessState(ProcessStates.filter(v => v.key == r.nextState)[0]);
                    return r.nextState;
                }

            })

    }

    const handleSubmit = e => {
        //Submits the job card and changes operation status from processing to completed

    };


    return (
        <Form id="jobcardform" error={errorState}>
            <Header dividing>{"#".concat(props.jid)}</Header>
            <Form.Group>
                <Form.Input disabled label="WorkOrder No." value={payload.workorder} />
                <Form.Input disabled label="Post Time" type="datetime-local" value={payload.post_time} />
                <Form.Input label="Quantity" disabled defaultValue={payload.qty} type="number" />
                <Form.Input label="Serial No." disabled defaultValue={(payload.sn == null) ? "" : payload.serial_no} />
            </Form.Group>
            <Form.Input disabled value={payload.operation_name} />
            <Label color={process_state.color} >{process_state.text}</Label>
            <Form.Group>

                <Form.Field>
                    {(started) ? new Date(startTime).toLocaleString() : <Button onClick={handleStart}>Start</Button>}
                </Form.Field>
                <Form.Field>
                    {(finished) ? new Date(finishTime).toLocaleString() : <Button onClick={handleFinish}>Finish</Button>}
                </Form.Field>
            </Form.Group>
            <Form.Group>
                <JobLogTable job_card={jid} setErrorMsg={setErrorMsg} header="Job Card Logs" setErrorState={setErrorState} logRecord={payload.job_logs} />
            </Form.Group>
            <Form.Group>
                <KVTable kv_pairs={kvPairs} entity={(payload.entityId == null) ? payload.plId : payload.entityId} header="Properties" />
            </Form.Group>
            <Message error>{errorMsg}</Message>
        </Form>
    );
}


JobCardAlteration.propTypes = {
    /**
     * jid is JOB Id
     */
    jid: PropTypes.number,
    /**
     * iid is item temporary id to be processed
     */
    iid: PropTypes.number
};

/**
 * Table contains logs about working minutes by accounts
 * @param {ReactProps} props 
 */
function JobLogTable({ job_card, logRecord, setErrorMsg, setErrorState, header }) {

    logRecord = logRecord.map(v => { return { recorded: true, ...v } });
    const [logs, setLogs] = useState(logRecord);


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


    const addRow = e => {
        setLogs(logs.concat({ recorded: false }));//adding more elements
    };
    const removeRow = (i, recorded) => {
        if (recorded) {
            //We have to remove recorded
            const o = JSON.stringify({ id: [logs[i].id] });
            MakePostFetch(End.production.jobModifier.delete, o, true)
                .then(r => {
                    if (r.status == 200) {
                        setLogs(logs.filter((v, ix) => i != ix));
                    } else throw Error("Couldn't delete Job Lo   g");
                })
                .catch(err => {
                    setErrorState(true);
                    setErrorMsg(err.message);
                })

        }
        else setLogs(logs.filter((v, ix) => i != ix));

    };
    const saveRow = (index, worker, startTime, finishTime, desc) => {
        const o = {
            logs: {
                worker,
                st_time: startTime,
                en_time: finishTime,
                description: desc
            },
            job_card
        };
        MakePostFetch(End.production.jobModifier.add, JSON.stringify(o), true)
            .then(r => {
                if (r.status == 200) {
                    //Log is successfully persisted in database
                    logs[index] = {
                        recorded: true,
                        ...o.logs
                    }
                    setLogs(logs);
                    //Rendering component
                    return r.result;

                } else throw Error("Couldn't add Job Log Record");
            })
            .catch(err => {
                setErrorState(true);
                setErrorMsg(err.message);
            })
    }



    return <>
        <Header content={header} />

        <Table>
            <Table.Row>
                <Table.Header>
                    <Table.Cell />
                    <Table.Cell>
                        Worker
               </Table.Cell>
                    <Table.Cell>
                        Start-Time
            </Table.Cell>
                    <Table.Cell>
                        Finish-Time
            </Table.Cell>
                    <Table.Cell>
                        Description
            </Table.Cell>
                    <Table.Cell>
                        <Button primary onClick={addRow}>Add Row</Button>
                    </Table.Cell>
                </Table.Header>
            </Table.Row>
            {logs.map((v, i) => <TableRow saveRow={saveRow} {...v} accountList={accountList} removeRow={removeRow} key={i} setErrorMsg={setErrorMsg} setErrorState={setErrorState} />)}
        </Table> </>
}

JobLogTable.propTypes = {
    /**
     * Header of job log table 
     */
    header: PropTypes.element,
    /**
     * function to set error messages
     */
    setErrorMsg: PropTypes.func,
    /**
     * function to set error state
     */
    setErrorState: PropTypes.func,
    /**
     * logs associated with job card
     */
    logRecord: PropTypes.array,
    /**
     * This is the job card id
     */
    job_card: PropTypes.number

};

/**
 * This element render table row of job logs
 * @param {object} React Props 
 */
function TableRow({ saveRow, recorded, removeRow, accountList, key, ...payload }) {
    const [startTime, setStartTime] = useState(Date.now());
    const [finishTime, setFinishTime] = useState(Date.now());
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);
    const [desc, setDesc] = useState('');
    const [worker, setWorker] = useState(0);
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

    if (recorded) {
        if (payload.st_time != null) {
            setStarted(true);
            setStartTime(payload.st_time);
        }
        if (payload.en_time != null) {
            setFinished(true);
            setFinishTime(payload.en_time);
        }
        if (payload.description.length > 0) {
            setDesc(payload.description);
        }
        setWorker(payload.worker);
    }

    const handleSave = e => {
        //validation required
        if (isNaN(startTime) || isNaN(finishTime)) {
            setErrorState(true);
            setErrorMsg("Start or Finish time is invalid");
        }
        else saveRow(worker, startTime, finishTime, desc);
    }

    return <Table.Row>
        <Table.Cell>
            <Select placeholder="Choose Worker" onChange={v => setWorker(v.target.value)} name="worker" defaultValue={worker} options={accountList} ></Select>
        </Table.Cell>
        <Table.Cell>
            {key + 1} {(started) ? <Icon name="circle" tiny color={(!finished) ? "green" : "black"} /> : <></>}
        </Table.Cell>
        <Table.Cell>
            {(started) ? <><Form.Input onChange={v => setStartTime(v.target.valueAsNumber)} name="st_time" value={startTime} />   {new Date(startTime).toLocaleString()}</> : <Button onClick={handleStart}>Start</Button>}
        </Table.Cell>
        <Table.Cell>
            {(finished) ? <><Form.Input onChange={v => setFinishTime(v.target.valueAsNumber)} name="en_time" value={finishTime} />   {new Date(finishTime).toLocaleString()} </> : <Button onClick={handleFinish}>Finish</Button>}
        </Table.Cell>

        <Table.Cell>
            <TextArea defaultValue={desc} onInput={v => setDesc(v.target.value)} name="description" rows={2} maxLength="250" placeholder="Details..." />
        </Table.Cell>

        <Table.Cell>
            <Icon.Group>
                <Icon name="save" onClick={handleSave} />
                <Icon name="times" onClick={(e) => { removeRow(key, recorded) }} />

            </Icon.Group>
        </Table.Cell>
    </Table.Row>;
};


TableRow.propTypes = {

    /**
     * function to update error state
     */
    setErrorState: PropTypes.func.isRequired,
    /**
     * function to update error message
     */
    setErrorMsg: PropTypes.func,

    /**
     * Array of avialable  master accounts
     */
    accountList: PropTypes.arrayOf(PropTypes.object),
    /**
     * specify if record is previously recorded or not
     */
    recorded: PropTypes.bool,
    /**
     * saves current log to the database 
     */
    saveRow: PropTypes.func,
    /**
     * removes row from job card logs
     */
    removeRow: PropTypes.func

};


