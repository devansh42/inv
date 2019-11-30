//This file Workplace


import React, { Component } from "react";
import { Button, Form, Message, Table, Header, Icon, Segment } from "semantic-ui-react";
import { MakePostFetch, Get, FormResponseHandlerWithLoadingDisabler, FormErrorHandler } from "../../network";
import End from "../../end";
import { GroupTypes } from "../../Fixed";
import { Link } from 'react-router-dom';
import { RecordList } from '../common/recordList';
import { CustomSelect, $, SuccessMessage, HeaderLink } from "../common/form";
import Apm from "../../apm";
import { withReadOnlySupport } from "../common/readOnly";
import { InfoDoc } from "../common/info";

function timeSecToString(s) {
    let x = "";
    let h = s / 3600;
    h = parseInt(h);
    x += ((h > 9) ? h: "0" + h );
    x += ":";
    s -= (h * 3600);
    let m = parseInt(s / 60);
    x += ((m > 9) ? m: "0" + m);
    return x;
}
export function WorkplaceList(props) {


    const mapFn = v => {
        const {gid, name, addr, op_time, id, cl_time, group_name } = v;
        return <Table.Row key={id}>
            <Table.Cell width={1}>
                <Link title="Modify this Record" to={Apm.master.workplace + "/modify/" + id}>
                    <Icon name="edit" ></Icon>
                </Link>
            </Table.Cell>
            <Table.Cell>
            <HeaderLink header={name} link={Apm.master.workplace+"/info/"+id} />
           
            </Table.Cell>
            <Table.Cell>
            <HeaderLink header={group_name} link={Apm.master.group+"/info/"+gid} />
           
            </Table.Cell>
            <Table.Cell>
                {timeSecToString(op_time)}
            </Table.Cell>
            <Table.Cell>
                {timeSecToString(cl_time)}
            </Table.Cell>
            <Table.Cell>
                {addr}
            </Table.Cell>
        </Table.Row>
    };

    const fetcher = () => {
        return MakePostFetch(End.master.workplace.read, new FormData(), true)
    }

    const headers = [
        "", "Name",
        <HeaderLink header="Group" link={Apm.master.group.concat("/read")} />
        , "Opening Time", "Closing Time", "Location"
    ];

    return <RecordList headers={headers} title="WorkPlace(s)" mapFn={mapFn} fetchPromise={fetcher} />

};




export function ReadOnlyWorkStationWrapper({ match: { params: { id } } }) {
    const f = new FormData();
    f.append("id", id);

    const d = ({ payload, ...props }) => {
        console.log(payload);
    return <>
            <Form.Input readOnly defaultValue={payload.name} title="Name of Workplace e.g. Factory-1" label="Name" name="name" type="text" id="wrk_name" placeholder="WorkPlace Name" />
            <Form.Input readOnly name="Address" defaultValue={payload.addr} label="Address" type="text" placeholder="WorkPlace Address" />
            <Form.Input readOnly label='Group' defaultValue={payload.group_name} />

            <Form.Group>
                <Form.Input readOnly defaultValue={timeSecToString(payload.op_time)} id="op_time" name="op_time" title="Opening Time e.g. 08:15:00"  label="Opening Time" />
                <Form.Input readOnly defaultValue={timeSecToString(payload.cl_time)} id="cl_time" name="cl_time" title="Opening Time e.g. 22:15:00"  label="Closing Time" />
            </Form.Group>
        </>
    }
    const E = withReadOnlySupport(d, "Workplace", End.master.workplace.read, f);
    return <Segment.Group>
       <E/>
    </Segment.Group>;
}

export function DocWorkStation(props){
    return <InfoDoc header="WorkPlace">
        <p>
            Workplace is the entity to record <b>WorkStation</b>, <b>WareHouse</b> and <b>WorkPlaces</b>.<br/>
              This enitity is useful in <b>Operation</b> definitions and Item Inventory.
            You can also use <b>Group</b> to make certain kind of Workplace and Warehouse.
        </p>
    </InfoDoc>
}


export class WorkplaceForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorState: false,
            errorMsg: null,
            btnDisable: false,
            btnLoading: false,
            successState: false,
            name: this.props.name,
            addr: this.props.addr,
            op_time: this.props.op_time,
            cl_time: this.props.cl_time,
            gid: this.props.gid,
            GroupOptions: []
        }


        this.pullResource();

    }

    pullResource() {
        Get.Group(GroupTypes.Workplace)
            .then(r => { this.setState({ GroupOptions: r }) })
            .catch(err => { this.setState({ errorState: true, errorMsg: "Unable to fetch Workplace Groups" }) });

    }


    handleSubmit(e) {
        let o = {
            name: $("name").value,
            addr: $("addr").value,
            op_time: $("op_time").value,
            cl_time: $("cl_time").value,
            gid: $("gid").value
        };
        let oe = {
            name: /\w{2,200}/,
            addr: /.{2,500}/,
            op_time: /\d{2}:\d{2}/,
            cl_time: /\d{2}:\d{2}/,
            gid: /\d{1,}/
        };
        let valid = true, errorMsg = null;
        if (o.name.trim().match(oe.name) === null) {
            errorMsg = "Invalid Name (2-200) Character\n";

        }
        else if (o.addr.trim().match(oe.addr) === null) {
            errorMsg = "Invalid Address\n";

        }
        else if (o.op_time.trim().match(oe.op_time) === null) {
            errorMsg = "Invalid Opening Time\n";
        }
        else if (o.cl_time.trim().match(oe.cl_time) === null) {
            errorMsg = "Invalid Closing Time\n";
        }
        else if (o.gid.trim().match(oe.gid) === null) {
            errorMsg = "Choose valid Group";
        }
        valid = errorMsg === null;

        if (valid) {
            let form = $("formWorkplace");
            this.setState({ btnLoading: true, btnDisable: true, name: o.name.trim(), gid: o.gid.trim(), cl_time: o.cl_time.trim(), addr: o.addr.trim(), op_time: o.op_time.trim() });
            if (this.props.create) {
                MakePostFetch(End.master.workplace.create, form, true)
                    .then(FormResponseHandlerWithLoadingDisabler.bind(this))
                    .then(r => {
                        this.setState({ successState: true });
                    })
                    .catch(FormErrorHandler.bind(this));

            } else {
                //Handler for modification state
                let p = this.props;
                //no change of content
                if (p.name === o.name && p.addr === o.addr && p.op_time === o.op_time && p.cl_time === o.cl_time && p.gid === o.gid) {
                    this.setState({ successState: true });
                } else {
                    MakePostFetch(End.master.workplace.modify, form)
                        .then(r => { });
                }
            }
        } else {
            this.setState({ errorState: true, errorMsg });
        }

    }

    render() {
        let form = <Form name="formWorkplace" id="formWorkplace" error={this.state.errorState}>
            <Header dividing>{(this.props.create) ? "Create Workplace" : "Modify Workplace"}</Header>
            <Form.Input required title="Name of Workplace e.g. Factory-1" label="Name" name="name" type="text" id="wrk_name" placeholder="WorkPlace Name" />
            <Form.Input required name="addr" label="Address" type="text" id="wrk_addr" placeholder="WorkPlace Address" />
            <Form.Field required>
                <label>Group</label>
                <CustomSelect id="gid" required placeholder="Choose Group" name="gid" options={this.state.GroupOptions} ></CustomSelect>
            </Form.Field>

            <Form.Group>
                <Form.Input required id="op_time" name="op_time" title="Opening Time e.g. 08:15:00" type="time" label="Opening Time" />
                <Form.Input required id="cl_time" name="cl_time" title="Opening Time e.g. 22:15:00" type="time" label="Closing Time" />
            </Form.Group>
            <Message error header="There is a Problem!!" content={this.state.errorMsg}></Message>
            <Button primary onClick={this.handleSubmit.bind(this)} loading={this.state.btnLoading} disabled={this.state.btnDisable} >{this.props.create ? "Create" : 'Modify'}</Button>
        </Form>;
        return (this.state.successState) ? <SuccessC group={getGroupname(this.state.GroupOptions, this.state.gid)} name={this.state.name} cl_time={this.state.cl_time} op_time={this.state.op_time} addr={this.state.addr} /> : form;
    }

}


function getGroupname(ar, value) {
    console.log(value, ar);
    let x = ar.filter(v => v.value == value)
    console.log(x);
    return (x.length > 0) ? x[0].text : ""
}


function SuccessC(props) {
    return (
        <SuccessMessage header={(props.create) ? "Workplace Created" : "Workplace Modified"} >
            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Location</Table.HeaderCell>
                        <Table.HeaderCell>Opening Time</Table.HeaderCell>
                        <Table.HeaderCell>Closing Time</Table.HeaderCell>
                        <Table.HeaderCell>Group</Table.HeaderCell>

                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>
                            {props.name}
                        </Table.Cell>
                        <Table.Cell>
                            {props.addr}
                        </Table.Cell>
                        <Table.Cell>
                            {props.op_time}
                        </Table.Cell>
                        <Table.Cell>
                            {props.cl_time}
                        </Table.Cell>
                        <Table.Cell>
                            {props.group}
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        </SuccessMessage>
    )
}