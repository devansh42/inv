//This contains code about user


import React, { Component } from "react";
import { Form, Header,Table, Message, Select, Icon, Button, Card, Divider } from "semantic-ui-react";
import { MakePostFetch } from "../../network";
import End from "../../end";
import {Link} from "react-router-dom";
import { UserPermTree } from "./userperms";
import Apm from "../../apm";
import {RecordList} from "../common/recordList";


export function UserList(props){
    const mapFn = (v, i) => {
        const { username, uid, aid,account_name } = v;
        return <Table.Row key={i}>
            <Table.Cell>
                <Link title="Edit this Record" to={End.master.user.modify + "/" + uid}>
                    <Icon name="edit"></Icon>
                </Link>
            </Table.Cell>
            <Table.Cell>
                {username}
            </Table.Cell>
            <Table.Cell>
               <Link to={Apm.master.account.concat("/id/").concat(aid)}> {account_name}</Link>
            </Table.Cell>

        </Table.Row>
    }

    const fetcher = () => {
        return MakePostFetch(End.master.user.read, new FormData(), true)
    }
    const headers = [
        "", "Username", "Account Name"
    ];

    return <RecordList headers={headers} title="User(s)" mapFn={mapFn} fetchPromise={fetcher} />

}


export class UserForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorState: false,
            errorMsg: null,
            btnDisable: false,
            btnLoading: false,
            successState: false,
            username: props.username,
            AccountOptions: [],

        };
        this.fetchContent();
    }


    fetchContent() {
        MakePostFetch(End.master.account.read, new FormData(), true)
            .then(r => {
                if (r.status === 200) return r.json();
                else throw Error("Couldn't Fetch Account List");

            })
            .then(r => {
                const l = r.results.map(v => {
                    const { name, id } = v;
                    return { text: name, id, key: id }
                });
                this.setState({ AccountOptions: l });
            })
            .catch(err => {
                this.setState({ errorMsg: err.message, errorState: true });
            })
    }

    handleSubmit(e) {
        let d = document.getElementById;
        let o = {
            username: d("username").value.trim(),
            password: d("password").value.trim(),
            cpassword: d("cpassword").value.trim(),
            aid: d("aid").value.trim()
        };
        let oe = {
            username: /[a-zA-Z0-9_]{,20}/,
            password: /.{8,}/,
            cpassword: /.{8,}/,
            aid: /\d{1,}/
        };
        let errorMsg = null;
        if (o.username.match(oe.username) === null) {
            errorMsg = "Provide a valid username (upto 20 characters) Alpha numeric charcters and _ is allowed";

        }
        else if (o.password.match(oe.password) === null) {
            errorMsg = "Provide a strong Password (8 Characters Required) ";
        }
        else if (o.cpassword.match(oe.cpassword) === null || o.password !== o.cpassword) {
            errorMsg = "Confirm Password should be same as Password";
        }
        else if (o.aid.match(oe.aid) === null) {
            errorMsg = "Choose a valid Account to assign User Role";
        }
        const valid = errorMsg === null;
        if (valid) {
            //making request to backend server
            const p = End.master.user;
            const form = d("userForm");
            this.setState({ username: o.username });
            
            MakePostFetch((this.props.create) ? p.create : p.modify, form, true)
                .then(r => {
                    switch (r.status) {
                        case 200://ok
                            this.setState({ successState: true });
                            break;
                        default:
                            throw Error("Some internal error");

                    }
                })
                .catch(err => {
                    this.setState({ errorMsg: err.message, errorState: true });
                })

        } else {
            this.setState({ errorMsg, errorState: true });
        }
    }

    render() {

        const { props } = this;

        let form = <Form id='userForm' error={this.state.errorState}>
            <Header dividing>
                {props.create ? "Create User" : "Modify User"}
            </Header>
            <Form.Group>

            <Form.Input required name="username" id="username" placeholder="Username" label="Username" />
            <Form.Field required>
                <label>Account Holder</label>
                <Select placeholder="Choose Account" name="aid" id="aid" options={this.state.AccountOptions} ></Select>
            </Form.Field>
           
            </Form.Group>
            <Form.Group>
            <Form.Input required name="password" id="password" placeholder="Password" label="Password" />
            <Form.Input required name="cpassword" id="cpassword" placeholder="Confirm Password" label="Confirm Password" />
            </Form.Group>
            <Divider/>
            <Form.Field>
                <Header dividing>
                   User Permissions
                    </Header>
                <Message info>
                    <Message.Header><Icon name="info" />   Info</Message.Header>
                    <Message.Content>
                    Check menu options you want to give to this user
                    </Message.Content>
                    </Message>
                <UserPermTree />
            </Form.Field>


            <Message error header="There is something wrong!!" content={this.state.errorMsg} />

            <Button primary onClick={this.handleSubmit.bind(this)} loading={this.state.btnLoading} disabled={this.state.btnDisable}>
                {props.create ? "Create" : "Modify"} User
            </Button>
        </Form>;
        return (this.state.successState)?   <SuccessMessage create={this.props.create} username={this.state.username}  /> :   form;
    }
}


function SuccessMessage({create,username,...props}) {
    return (
        <>
            <Message header="Success!!" content={(create) ? 'User Added' : "User Modified"} />
            <Card>
                <Card.Content>
                    <Card.Header>{username}</Card.Header>
                    <Card.Meta>User</Card.Meta>
                </Card.Content>
            </Card>
        </>
    )
}
