//code of item form
import React, { Component } from "react";
import { Header, Icon, Form, List, Message, Button, Table, Divider, Segment, } from "semantic-ui-react";
import { MakePostFetch, FormResponseHandlerWithLoadingDisabler, FormErrorHandler } from "../../network";
import End from "../../end";
import { Get } from "../../network";
import { GroupTypes } from "../../Fixed";
import { Link } from "react-router-dom";
import { RecordList } from "../common/recordList";
import { CustomSelect, CustomCheckbox, $, SuccessMessage, HeaderLink } from "../common/form";
import Apm from "../../apm";
import { withReadOnlySupport } from "../common/readOnly";
export function ItemList(props) {
    const mapFn = (v, i) => {
        const { gid, unit, name, group_name, unit_name, id } = v;
        return <Table.Row key={i}>
            <Table.Cell width={1} >
                <Link title="Edit this Record" to={Apm.master.item + "/modify/" + id}>
                    <Icon name="edit"></Icon>
                </Link>
            </Table.Cell>
            <Table.Cell>
                <HeaderLink header={name} link={Apm.master.item + "/info/" + id} />

            </Table.Cell>
            <Table.Cell>
                <HeaderLink header={group_name} link={Apm.master.group + "/info/" + gid} /></Table.Cell>

            <Table.Cell>
                <HeaderLink header={unit_name} link={Apm.master.unit + "/info/" + unit} />

            </Table.Cell>
        </Table.Row>
    }

    const fetcher = () => {
        return MakePostFetch(End.master.item.read, new FormData(), true)
    }
    const headers = [
        "",
        "Name",
        <HeaderLink header="Group" link={Apm.master.group.concat("/read")} />,
        <HeaderLink header="Unit" link={Apm.master.unit.concat("/read")} />,

    ];

    return <RecordList headers={headers} title="Item(s)" mapFn={mapFn} fetchPromise={fetcher} />

}


export function ReadOnlyItemWrapper({ match: { params: { id } } }) {
    const f = new FormData();
    f.append("id", id);

    const d = ({ payload, ...props }) => {
        return <>
            <Form.Input  readOnly defaultValue={payload.name} label="Name" />
            <Form.Group>
                <Form.Input readOnly label="Unit" name="Unit" defaultValue={payload.unit_name} />
                <Form.Input readOnly name="Group" label="Group" defaultValue={payload.group_name} />
            </Form.Group>
            {(payload.hser == 1) ? <>
                
                <Header dividing>Serial Code Sequence</Header>
                <Form.Group>
                    <Form.Input readOnly label="Serial Prefix" defaultValue={payload.prefix} placeholder="e.g. ABDxxxxx" maxLength="20" />
                    <Form.Input readOnly label="Serial Suffix" defaultValue={payload.suffix} placeholder="e.g. xxxxxxABD" maxLength="20" />
                </Form.Group>
                <Form.Group>
                    <Form.Input readOnly label="Serial Intial Value" placeholder="e.g. 1" defaultValue={payload.initialValue} type="number" name="ser_ini" id="ser_ini" />
                    <Form.Input readOnly label="Serial Step" placeholder="e.g. 1" defaultValue={payload.step} type="number" name="ser_step" id="ser_step" />

                    <Form.Input readOnly label="Max Digit in Dynamic Part" placeholder="e.g. 5" defaultValue={payload.digits} type='number' name="ser_digit" id="ser_digit" />
                </Form.Group>

            </> : <></>}
        </>
    }
    const E = withReadOnlySupport(d, "Item", End.master.item.read, f);
    return <Segment.Group><E/></Segment.Group> 
}




export class ItemForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorState: false,
            errorMsg: null,
            btnDisable: false,
            btnLoading: false,
            successState: false,
            name: props.name,
            unit: props.unit,
            gid: props.gid,
            hser: false,
            UnitOptions: [],
            GroupOptions: []
        }

        this.pullResources();
    }

    pullResources() {
        Get.Group(GroupTypes.Item)
            .then(r => { this.setState({ GroupOptions: r }) })
            .catch(err => { this.setState({ errorState: true, errorMsg: "Unable to fetch Item Groups" }) });

        Get.Unit()
            .then(r => { this.setState({ UnitOptions: r }) })
            .catch(err => { this.setState({ errorState: true, errorMsg: "Unable to fetch Units" }) });

    }

    handleSubmit(e) {
        let valid = false, errorMsg = null;
        let d = $;
        let o = {
            name: d("name").value.trim(),
            unit: d("unit").value.trim(),
            gid: d("gid").value.trim(),
            hser: d("hser").checked
        };
        let oe = {
            name: /\w{2,100}/,
            unit: /^\d{1,}$/,
            gid: /^\d{1,}$/
        }
        if (o.name.length < 1) {
            errorMsg = "Invalid Item Name";
        }
        else if (o.unit.match(oe.unit) === null) {
            errorMsg = "Invalid Unit ";
        }
        else if (o.gid.match(oe.gid) === null) {
            errorMsg = "Invalid Group";
        }
        valid = errorMsg === null;
        if (valid) {
            //Form is valid so far
            if (o.hser) {
                const n = /^\d+$/;
                const p = {
                    pre: [d("ser_prefix").value.trim(), /^\w*$/],
                    suf: [d("ser_suffix").value.trim(), /^\w*$/],
                    ini: [d("ser_ini").value.trim(), n],
                    step: [d("ser_step").value.trim(), n],
                    digit: [d("ser_digit").value.trim(), n]
                };
                if (p.pre[0].match(p.pre[1]) == null) {
                    errorMsg = "Please enter a valid Prefix, it can include alpha numeric characters and underscore(_)";
                }

                else if (p.suf[0].match(p.suf[1]) == null) {
                    errorMsg = "Please enter a valid Suffix, it can include alpha numeric characters and underscore(_)";
                }
                else if (p.ini[0].match(p.ini[1]) == null || isNaN(Number(p.ini[0])) || Number(p.ini[0]) <= 0) {
                    errorMsg = "Please enter a valid initial serial number to start with, it should be non zero integer, e.g. 1";

                }
                else if (p.step[0].match(p.step[1]) == null || isNaN(Number(p.step[0])) || Number(p.step[0]) <= 0) {
                    errorMsg = "Please enter a valid step, it should be non zero integer, e.g. 1";

                } else if (p.digit[0].match(p.digit[1]) == null || isNaN(Number(p.digit[0])) || Number(p.digit[0]) <= 0) {
                    errorMsg = "Please enter a valid no of  serial number digits, it should be non zero integer, e.g. 5";

                }

            }

        }
        valid = errorMsg === null;
        if (valid) {
            let form = d("itemForm");
            this.setState({ btnDisable: true, btnLoading: true, name: o.name, unit: o.unit, group: o.gid });
            if (this.props.create) {
                MakePostFetch(End.master.item.create, form, true)
                    .then(FormResponseHandlerWithLoadingDisabler.bind(this))
                    .then(r => {
                        this.setState({ successState: true });
                    })
                    .catch(FormErrorHandler.bind(this));

            } else {
                let p = this.props;
                if (o.name === p.name && o.gid === p.gid && o.unit === p.unit) {
                    this.setState({ successState: true });
                } else {
                    MakePostFetch(End.master.item.modify, form, true).then(r => r);
                }
            }
        } else {
            this.setState({ errorState: true, errorMsg });
        }
    };



    handleChange(e) {
        this.setState({
            hser: e.target.checked
        });
    }


    render() {

        const serailHelper = [
            "Serial Prefix is fixed value to be prepend before new serial no (e.g. ABCD##, ABCD is prefix ) ",
            "Serial Suffix is fixed value to be append after new serial no (e.g. ##ABCD, ABCD is suffix )",
            'Serial Initial Value is the value of starting',
            "Serial Step is the value to be added in previous no to generate new one",
            "Digit Count is the no of digit you want in number part of serial no. (e.g. if this is serial no is 5 and digit count is 6 then the serial no will become 000006 )"
        ];
        const serialCreator = <>  <Header>Serial No. Sequence</Header>
            <Form.Group>
                <Form.Input label="Serial Prefix" placeholder="e.g. ABDxxxxx" maxLength="20" name="ser_prefix" id="ser_prefix" />
                <Form.Input label="Serial Suffix" placeholder="e.g. xxxxxxABD" maxLength="20" name="ser_suffix" id="ser_suffix" />
            </Form.Group>
            <Form.Group>
                <Form.Input label="Serial Intial Value" placeholder="e.g. 1" type="number" name="ser_ini" id="ser_ini" />
                <Form.Input label="Serial Step" placeholder="e.g. 1" type="number" name="ser_step" id="ser_step" />

                <Form.Input label="Max Digit in Dynamic Part" placeholder="e.g. 5" type='number' name="ser_digit" id="ser_digit" />
            </Form.Group>
            <Message info>
                <Message.Header >Info about Serial No.</Message.Header>
                <List>
                    {serailHelper.map((v, i) => {
                        return <List.Item key={i}>{v}</List.Item>
                    })}
                </List>
            </Message>
        </>



        let form = <Form id='itemForm' name="itemForm" error={this.state.errorState}>
            <Header content={this.props.create ? "Create Item" : "Modify Item"} />
            <Form.Input required type="text" id="name" name="name" label="Item Name" placeholder="Name" />
            <Form.Group>
                <Form.Field required>
                    <label>Unit</label>
                    <CustomSelect placeholder="Choose Unit" id="unit" name="unit" options={this.state.UnitOptions} ></CustomSelect>
                </Form.Field>
                <Form.Field required>
                    <label>Group</label>
                    <CustomSelect placeholder="Choose Group" id="gid" name="gid" options={this.state.GroupOptions} ></CustomSelect>
                </Form.Field>
            </Form.Group>
            <CustomCheckbox inline label="Has Serial Code" name='hser' id="hser" onChange={this.handleChange.bind(this)} title="Check, if this item have a serial no." />
            {this.state.hser ? <><Divider /> {serialCreator}</> : <></>}
            <Message error header="There is a Problem!!" content={this.state.errorMsg}></Message>
            <Button primary onClick={this.handleSubmit.bind(this)} loading={this.state.btnLoading} disabled={this.state.btnDisable} >{this.props.create ? "Create" : 'Modify'} Item</Button>
        </Form>;
        return (this.state.successState) ? <SuccessC name={this.state.name} unit={getfromArray(this.state.UnitOptions, this.state.unit)} group={getfromArray(this.state.GroupOptions, this.state.group)} create={this.props.create} /> : form;

    }
}


function getfromArray(ar, y) {
    let x = ar.filter((v, i) => v.value == y);
    return x.length > 0 ? x[0].text : "";
}


function SuccessC(props) {
    return <SuccessMessage header={(props.create) ? "Item Created" : "Item Modified"} >
        <Table>
            <Table.Header>
                <Table.Row>
                    {["Name", "Unit", "Group"].map((v, i) => <Table.HeaderCell content={v} key={i} />)}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                <Table.Row>
                    <Table.Cell>
                        {props.name}
                    </Table.Cell>
                    <Table.Cell>
                        {props.unit}
                    </Table.Cell>
                    <Table.Cell>
                        {props.group}
                    </Table.Cell>
                </Table.Row>
            </Table.Body>
        </Table>
    </SuccessMessage>

}

