//code for handling account form
import React, { Component } from "react";
import { Card, Icon, Table, Form, Header,  Message, Button } from "semantic-ui-react";
import { Genders, IdProofs, GroupTypes } from "../../Fixed";
import { MakePostFetch, Get, FormResponseHandlerWithLoadingDisabler, FormErrorHandler } from "../../network";
import { Link } from 'react-router-dom';
import { RecordList } from "../common/recordList";
import End from "../../end";
import {CustomSelect} from "../common/select";
export function AccountList(props) {
    const mapFn = (v, i) => {
        const { name, group_name, id } = v;
        return <Table.Row key={i}>
            <Table.Cell>
                <Link title="Edit this Record" to={End.master.account.modify + "/" + id}>
                    <Icon name="edit"></Icon>
                </Link>
            </Table.Cell>
            <Table.Cell>
                {name}
            </Table.Cell>
            <Table.Cell>
                {group_name}
            </Table.Cell>
        </Table.Row>
    };
    const headers = [
        "", "Name", "Group"
    ];
    const fetcher = () => {
        return MakePostFetch(End.master.account.read, new FormData(), true)
    }

    return <RecordList headers={headers} title="Account(s)" mapFn={mapFn} fetchPromise={fetcher} />

}


export class AccountForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errorState: false,
            errorMsg: null,
            btnDisable: false,
            btnLoading: false,
            successState: false,
            name: props.name,
            gender: props.gender,
            dob: props.dob,
            mobile_no: props.mobile_no,
            email: props.email,
            addr: props.addr,
            town: props.town,
            pincode: props.pincode,
            id_proof: props.id_proof,
            id_proof_no: props.id_proof_no,
            join_date: props.join_date,
            gid: props.gid,
            AccountGroup: []
        };

        this.pullResources(); //pulls some resource from backend
    };

    pullResources() {
        Get.Group(GroupTypes.Account)
            .then(r => {
                
                this.setState({ AccountGroup: r });
            })
            .catch(err => {
                this.setState({ errorState: true, errorMsg: "Unable to fetch Account Groups" });
            })

    }


    handleSubmit(e) {
        let d = document.getElementById;
        let o = {
            name: d("name").value.trim(),
            addr: d("addr").value.trim(),
            town: d("town").value.trim(),
            pincode: d("pincode").value.trim(),
            gender: d("gender").value.trim(),
            dob: d("dob").value.trim(),
            email: d("email").value.trim(),
            mobile_no: d("mobile_no").value.trim(),
            join_date: d("join_date").value.trim(),
            id_proof_type: d("id_proof").value.trim(),
            id_proof_no: d("id_proof_no").value.trim(),
            gid: d("gid").value.trim()
        };

        let oe = {
            name: /\w{2,100}/,
            addr: /.{2,200}/,
            town: /.{2,20}/,
            pincode: /\d{6}/,
            gender: /^[0-1]$/,
            dob: /^\d{4}-\d{2}-\d{2}$/,
            mobile_no: /\d{10,15}/,
            join_date: /^\d{4}-\d{2}-\d{2}$/,
            id_proof_type: /\d{1,}/,
            id_proof_no: /.{,100}/,
            gid: /\d{1,}/,
            email: /.{,100}/
        };
        let valid, errorMsg = "";
        if (o.name.match(oe.name) === null) {
            errorMsg = "Invalid Name (2-100 Characters)";
        }
        else if (o.gender.match(oe.gender) === null) {
            errorMsg = "Choose Gender (Male|Female)";
        }
        else if (o.gid.match(oe.gid) === null) {
            errorMsg = "Invalid Group, Choose from the given list or create new";
        }
        else if (o.mobile_no.match(oe.mobile_no) === null) {
            errorMsg = "Invalid Mobile No.";
        }
        else if (o.addr.length > 0 && o.addr.match(oe.addr) === null) {
            errorMsg = "Invalid Address (2-200 Characters)";
        }
        else if (o.town.length > 0 && o.town.match(oe.town) === null) {
            errorMsg = "Invalid Town";
        }
        else if (o.pincode.length > 0 && o.pincode.match(oe.pincode) === null) {
            errorMsg = "Invalid Pincode (Require 6 Digits)";
        }
        else if (o.dob.length > 0 && o.dob.match(oe.dob) === null) {
            errorMsg = "Invalid Date of Birth (Choose a date before today)";
        }
        else if (o.email.length > 0 && o.email.match(oe.email) === null) {
            errorMsg = "Invalid Email, try another";
        }
        else if (o.join_date.length > 0 && o.join_date.match(oe.join_date) === null) {
            errorMsg = "Invalid Joining Date";
        }
        else if (o.id_proof_no.length > 0 && o.id_proof_type.match(oe.id_proof_type) === null) {
            errorMsg = "Choose Valid Id Proof";
        }
        else if (o.id_proof_no.length > 0 && o.id_proof_no.match(oe.id_proof_no) === null) {
            errorMsg = "Invalid Id Proof No."
        }
        else if (o.id_proof_type.length > 0 && o.id_proof_type.match(oe.id_proof_type) === null) {
            errorMsg = "Choose Valid Id Proof";
        }
        else if (o.id_proof_type.length > 0 && o.id_proof_no.match(oe.id_proof_no) === null) {
            errorMsg = "Enter Id Proof No.";
        }
        valid = errorMsg === "";

        if (valid) {
            let form = d("accountForm");
            this.setState({ btnDisable: true, btnLoading: true, errorState: false });
            if (this.props.create) {
                //create new account;
                MakePostFetch(End.master.account.create, form,true)
                .then(FormResponseHandlerWithLoadingDisabler.bind(this))
                .then(r=>{
                    this.setState({successState:true});

                })
                .catch(FormErrorHandler.bind(this));

            } else {
                //non creat request
                let p = this.props;
                let s = this.state;
                let ar = [p.name === s.name,
                p.addr === s.addr,
                s.town === p.town,
                s.gender === p.gender,
                s.dob = p.dob,
                s.mobile_no = p.mobile_no,
                s.email === p.email,
                s.town === p.town,
                s.id_proof_no === p.id_proof_no,
                s.id_proof_type === p.id_proof_type,
                s.join_date === p.join_date,
                s.gid === p.gid,
                s.pincode === p.pincode,

                ];
                if (ar.filter(v => v === false).length > 0) {
                    MakePostFetch(End.master.account.modify, form).then(r => r);
                }
                else {
                    this.setState({ successState: true });
                }
            }
        } else {
            this.setState({ errorState: true, errorMsg });
        }


    }

    render() {
        let form = <Form id="accountForm" error={this.state.errorState}>
            <Header dividing>
                {this.props.create ? "Create Account" : "Modify Account"}
            </Header>
            <Form.Input id="name" name="name" required label="Name" placeholder="Name" />
            <Form.Group>
            <Form.Field required>
                <label>Group</label>
                <CustomSelect id="gid" name="gid" placeholder="Choose Group.." options={this.state.AccountGroup}></CustomSelect>
            </Form.Field>
            <Form.Field required>
                <label>Gender</label>
                <CustomSelect name="gender" options={Genders} required id='gender' placeholder="Choose Gender"></CustomSelect>
            </Form.Field>
            
            <Form.Input name="dob" id="dob" label="Date of Birth" type="date" />
            </Form.Group>
            <Form.Group>
            <Form.Input name="email" placeholder="e.g. hello@web.com" id="email" label="Email" type="email" />
            <Form.Input required name="mobile_no" placeholder="9412xxxxxx" type="tel" id='mobile_no' label="Mobile No." />
            </Form.Group>
            <Form.Input id="addr" name="addr" required label="Address" placeholder="Address" />
            <Form.Input id="town" name="town" label="Town" placeholder="Town" />
            <Form.Input id='pincode' name="pincode" label="Pincode" placeholder="Pincode" />
            <Form.Group> 
            <Form.Input name="join_date" id='join_date' type="date" label="Joining Date" />
           
            <Form.Field>
            <label>Id Proof Type</label>
            <CustomSelect name="id_proof" id="id_proof" label="Id Proof Type" options={IdProofs} placeholder="Choose Id Proof Type"></CustomSelect>
            </Form.Field>
            <Form.Input name="id_proof_no" placeholder="Id Proof No." id="id_proof_no" type="tel" label="Id Proof No." />
            </Form.Group>
            <Message error header="There is something wrong!!" content={this.state.errorMsg} />

            <Button primary onClick={this.handleSubmit.bind(this)} loading={this.state.btnLoading} disabled={this.state.btnDisable}>
                {this.props.create ? "Create" : "Modify"}
            </Button>
        </Form>;
        return (this.state.successState) ? <SuccessMessage /> : form;
    }

}

function SuccessMessage(props) {
    return (
        <>
            <Message header="Success!!" content={(props.create) ? 'Group Added' : "Group Modified"} />
            <Card>
                <Card.Content>
                    <Card.Header><Icon name={(props.gender === "m") ? "male" : "female"} /> {props.name}</Card.Header>
                    <Card.Meta>Account</Card.Meta>
                </Card.Content>
            </Card>
        </>
    )
}


