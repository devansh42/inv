//This contains code about user


import React, { Component } from "react";
import { Form, Header, Table,Segment, Message, Icon, Button, Card, Divider } from "semantic-ui-react";
import { MakePostFetch, FormResponseHandlerWithLoadingDisabler, FormErrorHandler } from "../../network";
import End from "../../end";
import { Link } from "react-router-dom";
import { UserPermTree } from "./userperms";
import Apm from "../../apm";
import { RecordList } from "../common/recordList";
import { CustomSelect, SuccessMessage, $, HeaderLink } from "../common/form";
import { InfoDoc } from "../common/info";
import {withReadOnlySupport} from "../common/readOnly";

export function UserList(props) {
    const mapFn = (v, i) => {
        const { username, uid, aid, account_name } = v;
        return <Table.Row key={i}>
            <Table.Cell>
                <Link title="Edit this Record" to={End.master.user.modify + "/" + uid}>
                    <Icon name="edit"></Icon>
                </Link>
            </Table.Cell>
            <Table.Cell>
                <HeaderLink header={username} link={Apm.master.user+"/info/"+uid} />
            
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

export function DocUser(props) {
    return <InfoDoc header="User">
        <p>User is entity to provide Access Control and User authentication. You can set <b>Username</b> and <b>Password</b> for each user.<br />
            It also provide a method of Access Control using <b>User Permission tree</b>.
        <b>User(s)</b> are a great way to contol access of this application, you can make seperate User account for your Employees/Managers etc.<br /> To restrict them to use certain application functionalities.
        </p>
    </InfoDoc>
}

export function ReadOnlyUserWrapper({ match: { params: { id } } }) {
    const f = new FormData();
    f.append("id", id);
    const f1 = new FormData();
    f1.append("perms", id);
    const d = ({ payload, ...props }) => {
        return <Form.Group>

            <Form.Input readOnly defaultValue={payload.username} name="username" id="username" placeholder="Username" label="Username" />
            <Form.Input readOnly defaultValue={payload.account_name} label="Account Holder" />


        </Form.Group>
    };

    const dd = ({ payload, ...props }) => {
        return <UserPermTree perms={payload} readOnly />

    }


    const E = withReadOnlySupport(d, "User", End.master.user.read, f);
    const F = withReadOnlySupport(dd, "User Permission", End.master.user.read, f1);
    return <Segment.Group>
        <E />
        <F />
    </Segment.Group>
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
            .then(FormResponseHandlerWithLoadingDisabler.bind(this))
            .then(r => {
                const l = r.map(v => {
                    const { name, id } = v;
                    return { text: name, id, key: id, value: id }
                });
                this.setState({ AccountOptions: l });
            })
            .catch(FormErrorHandler.bind(this));
    }

    handleSubmit(e) {
        let d = $;
        let o = {
            username: d("username").value.trim(),
            password: d("password").value.trim(),
            cpassword: d("cpassword").value.trim(),
            aid: d("aid").value.trim()
        };
        let oe = {
            username: /\w{1,20}/,
            password: /.{8,}/,
            cpassword: /.{8,}/,
            aid: /\d{1,}/
        };
        let errorMsg = null;
        if (o.username.match(oe.username) === null) {
            errorMsg = "Provide a valid username (upto 20 characters) Alpha numeric charcters and _ is allowed";

        }
        else if (o.password.length < 8) {
            errorMsg = "Provide a strong Password (8 Characters Required) ";
        }
        else if (o.cpassword != o.password) {
            errorMsg = "Confirm Password should be same as Password";
        }
        else if (isNaN(Number(o.aid))) {
            errorMsg = "Choose a valid Account to assign User Role";
        }
        else if (this.state.AccountOptions.filter(v => v.value == o.aid).length < 1) {
            errorMsg = "Choose a valid Account from given list";

        }
        const valid = errorMsg === null;
        if (valid) {
            //making request to backend server
            const p = End.master.user;
            const form = d("userForm");
            this.setState({ username: o.username });

            MakePostFetch((this.props.create) ? p.create : p.modify, form, true)
                .then(FormResponseHandlerWithLoadingDisabler.bind(this))
                .then(r => {
                    this.setState({ successState: true });

                })
                .catch(FormErrorHandler.bind(this));

        } else {
            this.setState({ errorMsg, errorState: true });
        }
    }

    render() {

        const { props } = this;

        let form = <Form id='userForm' name="userForm" error={this.state.errorState}>
            <Header dividing>
                {props.create ? "Create User" : "Modify User"}
            </Header>
            <Form.Group>

                <Form.Input required name="username" id="username" placeholder="Username" label="Username" />
                <Form.Field required>
                    <label>Account Holder</label>
                    <CustomSelect placeholder="Choose Account" name="aid" id="aid" options={this.state.AccountOptions} ></CustomSelect>
                </Form.Field>

            </Form.Group>
            <Form.Group>
                <Form.Input required type="password" name="password" id="password" placeholder="Password" label="Password" />
                <Form.Input required type="password"  name="cpassword" id="cpassword" placeholder="Confirm Password" label="Confirm Password" />
            </Form.Group>
            <Divider />
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
        return (this.state.successState) ? <SC create={this.props.create} username={this.state.username} /> : form;
    }
}


function SC({ create, username, ...props }) {
    return <SuccessMessage header={(create) ? 'User Added' : "User Modified"} >
        <Card>
            <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>User</Card.Meta>
            </Card.Content>
        </Card>

    </SuccessMessage>;

}
