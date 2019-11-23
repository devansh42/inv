//This file contains code for rendering job card modifer 
//Job card, actually manuplated the workorder life cycle

"use strict";
import React, { useState, useEffect } from 'react';
import { Form, Header, Table, TextArea, Icon, Button, Message, Label, Loader, Segment } from "semantic-ui-react"
import PropTypes from "prop-types";
import { Get, MakePostFetch } from "../../network";
import End from "../../end";
import { KVTable } from "./kv";
import { ProcessStates, GetProcessStateColor, GetProcessStateText } from '../../Fixed';
import { CustomSelect } from "../common/form";

export function JobCardAlterationWrapper(props) {
    const { match: { params } } = props;
    return <JobCardAlteration jid={params.jid} />
}

function JobCardAlteration({ jid, iid, ...props }) {

    const [errorState, setErrorState] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [startTime, setStartTime] = useState(Date.now());
    const [finishTime, setFinishTime] = useState(Date.now());
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);
    const [process_state, setProcessState] = useState(ProcessStates[0]);
    const [payload, setPayload] = useState({});
    const [payloadLoaded, setpayloadLoaded] = useState(false);
    const [kvPairs, setKvPairs] = useState([]);

    const fetched = true;
    useEffect(() => {
        const f = new FormData();
        f.append("id", jid);
        MakePostFetch(End.production.jobModifier.read, f, true)
            .then(r => {
                if (r.status == 200) {
                    return r.json();
                } else throw Error("Couldn't load Job Card Id");
            })
            .then(r => {
                return r.result;
            })
            .then(r => {
                return { ...r.job_card, job_logs: r.job_logs }
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
                setPayload(r);
                setpayloadLoaded(true);
            })
            .catch(err => {
                setErrorState(true);
                setErrorMsg(err.message);

            })
    }, [fetched, jid]);

    useEffect(() => {
        const f = new FormData();
        f.append("id", iid);
        MakePostFetch(End.master.kv.read, f, true)
            .then(r => {
                if (r.status == 200) {
                    return r.json();
                } else throw Error("Couldn't load Attributes of Item to be produced");
            })
            .then(r => {
                setKvPairs(r.result);
            })
            .catch(err => {
                setErrorState(true);
                setErrorMsg(err.message);
            })
    }, [fetched, iid]);

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



console.log(payload.state);
    return (payloadLoaded) ? <Segment> <Form id="jobcardform" error={errorState}>

        <Segment.Group horizontal>
            <Segment>
                <Header dividing>{"JOB Status -  #".concat(jid)}   <Label color={GetProcessStateColor(payload.state)} >{GetProcessStateText(payload.state)}</Label>
                </Header>
                <Form.Group>
                    <Form.Input readOnly label="WorkOrder No." value={"#".concat(payload.workorder)} />
                    <Form.Input label="Post Time" readOnly  value={payload.post_time} />
                    </Form.Group>
                   <Form.Group>
                    <Form.Input label="Quantity" readOnly defaultValue={payload.qty} type="number" />
                    <Form.Input label="Serial No." readOnly defaultValue={(payload.sn == null) ? "" : payload.serial_no} />
                    </Form.Group>
                <Form.Group>
                    <Form.Input label="Operation" readOnly value={payload.name} />
                    <Form.Field>
                        {(started) ? new Date(startTime).toLocaleString() : <Button primary onClick={handleStart}>Start</Button>}
                    </Form.Field>
                    <Form.Field>
                        {(finished) ? new Date(finishTime).toLocaleString() : <Button primary onClick={handleFinish}>Finish</Button>}
                    </Form.Field>
                </Form.Group>
            </Segment>
            <Segment>
                <KVTable kv_pairs={kvPairs} entity={(payload.entityId == null) ? payload.plId : payload.entityId} header="Properties" />
            </Segment>

        </Segment.Group>
        <Segment>
            <JobLogTable job_card={jid} setErrorMsg={setErrorMsg} header="Job Card Logs" setErrorState={setErrorState} logRecord={payload.job_logs} />
        </Segment>

        <Message error>{errorMsg}</Message>
    </Form></Segment>
        : <Loader />;
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
    console.log(logRecord);
    const [logs, setLogs] = useState(logRecord);
    const [accountList, setAccountList] = useState([]);
    const fetched = true;

    useEffect(() => {
        Get.Account()
            .then(r => {
                setAccountList(r) //returning array of account holders
            })
            .catch(err => {
                setErrorState(true);
                setErrorMsg("Couldn't load Account list");
            })
    }, [fetched, setErrorMsg, setErrorState]);


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
                    } else throw Error("Couldn't delete Job Log");
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
            logs: [{
                worker,
                st_time: startTime,
                en_time: finishTime,
                description: desc
            }],
            job_card
        };
        MakePostFetch(End.production.jobModifier.add, JSON.stringify(o), true)
            .then(r => {
                if (r.status == 200) {
                    //Log is successfully persisted in database
                    logs[index] = {
                        recorded: true,
                        ...o.logs[0]
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
        <Header dividing content={header} />

        <Table celled>
            <Table.Header>

                <Table.Row>
                    <Table.HeaderCell />
                    <Table.HeaderCell>
                        Worker
               </Table.HeaderCell>
                    <Table.HeaderCell>
                        Start-Time
            </Table.HeaderCell>
                    <Table.HeaderCell>
                        Finish-Time
            </Table.HeaderCell>
                    <Table.HeaderCell>
                        Description
            </Table.HeaderCell>
                    <Table.HeaderCell>
                        <Button primary onClick={addRow}>Add Row</Button>
                    </Table.HeaderCell>

                </Table.Row>
            </Table.Header>
            <Table.Body>
                {logs.map((v, i) => <TableRow index={i} {...v} saveRow={saveRow} {...v} accountList={accountList} removeRow={removeRow} key={i} setErrorMsg={setErrorMsg} setErrorState={setErrorState} />)}
            </Table.Body>
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
function TableRow({ saveRow,index, setErrorState, setErrorMsg, recorded, removeRow, accountList, key, ...payload }) {
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

       useEffect(()=>{ //Prevents infinite render loop
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
    
       },[payload,recorded]); 
   
    const handleSave = e => {
        //validation required
        if (isNaN(startTime) || isNaN(finishTime)) {
            setErrorState(true);
            setErrorMsg("Start or Finish time is invalid");
        }
        else saveRow(index,worker, startTime, finishTime, desc);
    }

    return <Table.Row>
          <Table.Cell>
         {(started) ? <Icon name="circle" tiny color={(!finished) ? "green" : "black"} /> : <></>}
        </Table.Cell>
        <Table.Cell>
      {(recorded)?payload.worker_name:<CustomSelect placeholder="Choose Worker" onChange={(_,d)=>setWorker(d.value)} name="worker"  options={accountList} ></CustomSelect>
      }  </Table.Cell>
      
        <Table.Cell>
            {(started) ? new Date(startTime).toLocaleString() : <Button onClick={handleStart}>Start</Button>}
        </Table.Cell>
        <Table.Cell>
            {(finished) ? new Date(finishTime).toLocaleString() : <Button onClick={handleFinish}>Finish</Button>}
        </Table.Cell>

        <Table.Cell>
            <Form.Input readOnly={recorded} defaultValue={desc} onInput={v => setDesc(v.target.value)} name="description"  maxLength="250" placeholder="Details..." />
        </Table.Cell>

        <Table.Cell>
          
               {(recorded)?<></>:<Icon circular name="save" title="Save Time Log" onClick={handleSave} />}
                <Icon circular  name="times" color="red" title="Remove Time Log" onClick={(e) => { removeRow(index, recorded) }} />

           
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


