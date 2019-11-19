//This contains code about user


import React, { Component } from "react";
import { Form, Header, Message, Select, Icon, Button, Card } from "semantic-ui-react";
import { MakePostFetch } from "../../network";
import End from "../../end";
import { UserPermTree } from "./userperms";

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

            <Form.Input required name="username" id="username" placeholder="Username" label="Username" />
            <Form.Input required name="password" id="password" placeholder="Password" label="Password" />
            <Form.Input required name="cpassword" id="cpassword" placeholder="Confirm Password" label="Confirm Password" />
            <Form.Field required>
                <label>Account Holder</label>
                <Select placeholder="Choose Account" name="aid" id="aid" options={this.state.AccountOptions} ></Select>
            </Form.Field>
            <Form.Field>
                <Header.Subheader>
                    <Icon name="user" />  User Permissions
                    </Header.Subheader>
                <Message info>
                    Check menu options you want to give to this user
                    </Message>
                <UserPermTree />
            </Form.Field>


            <Message error header="There is something wrong!!" content={this.state.errorMsg} />

            <Button primary onClick={this.handleSubmit.bind(this)} loading={this.state.btnLoading} disabled={this.state.btnDisable}>
                {props.create ? "Create" : "Modify"}
            </Button>
        </Form>;
        return form;
    }
}


function SuccessMessage(props) {
    return (
        <>
            <Message header="Success!!" content={(props.create) ? 'User Added' : "User Modified"} />
            <Card>
                <Card.Content>
                    <Card.Header>{props.username}</Card.Header>
                    <Card.Meta>User</Card.Meta>
                </Card.Content>
            </Card>
        </>
    )
}
