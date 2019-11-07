//code of item form
import React, { Component } from "react";
import { Header, Select, Icon, Form, List, Message, Button, Table, Loader } from "semantic-ui-react";
import { MakePostFetch } from "../../network";
import End from "../../end";
import { Get } from "../../network";
import { GroupTypes } from "../../Fixed";
import { MasterEntity } from "./entityList";
import { Link } from "react-router-dom";
import { RecordList } from "../common/recordList";
export function ItemList(props) {
    const mapFn = (v, i) => {
        const { name, group_name, unit, id } = v;
        return <Table.Row key={i}>
            <Table.Cell>
                <Link title="Edit this Record" to={End.master.item.modify + "/" + id}>
                    <Icon name="edit"></Icon>
                </Link>
            </Table.Cell>
            <Table.Cell>
                {name}
            </Table.Cell>
            <Table.Cell>
                <small>{group_name}</small>
            </Table.Cell>
            <Table.Cell>
                {unit}
            </Table.Cell>
        </Table.Row>
    }

    const fetcher = () => {
        return MakePostFetch(End.master.item.read, new FormData(), true)
    }
    const headers = [
        "", "Name", "Group", "Unit"
    ];

    return <RecordList headers={headers} title="Item(s)" mapFn={mapFn} fetchPromise={fetcher} />

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
            hser: false
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
        let valid, errorMsg;
        let d = document.getElementById;
        let o = {
            name: d("name").value.trim(),
            unit: d("unit").value.trim(),
            gid: d("group").value.trim()
        };
        let oe = {
            name: /\w{2,100}/,
            unit: /^\d{1,}$/,
            gid: /^\d{1,}$/
        }
        if (o.name.match(oe.name) == null) {
            errorMsg = "Invalid Item Name";
        }
        else if (o.unit.match(oe.unit) == null) {
            errorMsg = "Invalid Unit ";
        }
        else if (o.gid.match(oe.gid) == null) {
            errorMsg = "Invalid Group";
        }
        valid = errorMsg === null;
        if (valid) {
            let form = d("itemForm");
            this.setState({ name: o.name, unit: o.unit, gid: o.gid });
            if (this.props.create) {
                MakePostFetch(End.master.item.create, form).then(r => r);
            } else {
                let p = this.props;
                if (o.name == p.name && o.gid == p.gid && o.unit == p.unit) {
                    this.setState({ successState: true });
                } else {
                    MakePostFetch(End.master.item.modify, form).then(r => r);
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

        const serialCreator = () => {
            return <Form.Group>
                <Header.Subheader>Serial No. Sequence</Header.Subheader>
                <Form.Field label="Serial Prefix" maxLength="20" name="ser_prefix" id="ser_prefix" />
                <Form.Field label="Serial Suffix" maxLength="20" name="ser_suffix" id="ser_suffix" />
                <Form.Field label="Serial Intial Value" defaultValue={1} type="number" name="ser_ini" id="ser_ini" />
                <Form.Field label="Serial Step" defaultValue={1} type="number" name="ser_step" id="ser_step" />
                <Form.Field label="Max Digit in Dynamic Part" defaultValue={5} type='number' name="ser_digit" id="ser_digit" />
                <Message icon="info" header="Info about Serial No." info>
                    <List>
                        {serailHelper.map((v, i) => {
                            return <List.Item key={i}>{v}</List.Item>
                        })}
                    </List>
                </Message>
            </Form.Group>
        };
        const serailHelper = [
            "Serial Prefix is fixed value to be prepend before new serial no (e.g. ABCD##, ABCD is prefix ) ",
            "Serial Suffix is fixed value to be append after new serial no (e.g. ##ABCD, ABCD is suffix )",
            'Serial Initial Value is the value of starting',
            "Serial Step is the value to be added in previous no to generate new one",
            "Digit Count is the no of digit you want in number part of serial no. (e.g. if this is serial no is 5 and digit count is 6 then the serial no will become 000006 )"
        ];

        let form = <Form id='itemForm' error={this.state.errorState}>
            <Header content={this.props.create ? "Create Item" : "Modify Item"} />
            <Form.Input required type="text" id="name" name="name" label="Item Name" placeholder="Name" />
            <Form.Field required>
                <label>Unit</label>
                <Select placeholder="Choose Unit" id="unit" name="unit" options={this.state.UnitOptions} ></Select>
            </Form.Field>
            <Form.Field required>
                <Select placeholder="Choose Group" id="group" name="group" options={this.state.GroupOptions} ></Select>
            </Form.Field>
            <Form.Input label="Has Serial Code" type="checkbox" name='hser' id="hser" onChange={this.handleChange.bind(this)} title="Check, if this item have a serial no." />
            {this.state.hser ? <serialCreator /> : <></>}
            <Message error header="There is a Problem!!" content={this.state.errorMsg}></Message>
            <Button primary onClick={this.handleSubmit.bind(this)} loading={this.state.btnLoading} disabled={this.state.btnDisable} >{this.props.create ? "Create" : 'Modify'}</Button>
        </Form>;
        return (this.state.successState) ? <SuccessMessage unit={getfromArray(this.state.UnitOptions, this.state.unit)} group={getfromArray(this.state.GroupOptions, this.state.group)} create={this.props.create} /> : form;

    }
}


function getfromArray(ar, y) {
    let x = ar.filter((v, i) => v.value === y);
    return x.length > 0 ? x[0].text : "";
}


function SuccessMessage(props) {
    return (
        <>
            <Message success header="Success!!" content={(props.create) ? "Item Created" : "Item Modified"} />
            <Table>
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
            </Table>
        </>
    )
}

