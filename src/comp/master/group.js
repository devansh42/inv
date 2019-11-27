//This contains code to Different Activities for group
import React, { Component } from "react";
import { Icon, Form, Button, Message, Header, Card, Table, Segment, Loader, Divider } from "semantic-ui-react";
import End from "../../end";
import { MakePostFetch, FormResponseHandlerWithLoadingDisabler, FormErrorHandler } from "../../network";

import { Link } from 'react-router-dom';
import { CustomSelect, $, $$ } from "../common/form"

import { RecordList } from '../common/recordList';
import { withReadOnlySupport } from "../common/readonly";

export function GroupList(props) {
    const mapFn = (v, i) => {
        const { name, type_name, id } = v;
        return <Table.Row key={i}>
            <Table.Cell width={1}>
                <Link title="Edit this Record" to={End.master.group.modify + "/" + id}>
                    <Icon name="edit"></Icon>
                </Link>
            </Table.Cell>
            <Table.Cell>
                {name}
            </Table.Cell>
            <Table.Cell>
                {type_name}
            </Table.Cell>
        </Table.Row>
    };

    const fetcher = () => {
        return MakePostFetch(End.master.group.read, new FormData(), true)
    }
    const headers = [
        "", "Name", "Type"
    ];

    return <RecordList headers={headers} title="Group(s)" mapFn={mapFn} fetchPromise={fetcher} />


}




export function ReadOnlyGroupWrapper({ match:{params} }) {

    const f = new FormData();
    f.append("id", params.id);

    const Readonlygroup = ({ payload, ...props }) => {
        return <>
            <Form.Input readonly defaultValue={payload.name} placeholder="Group Name" title="Group Name" label="Group Name" autoFocus />
            <Form.Field>
                <label>Group Type</label>
                <CustomSelect readonly defaultValue={payload.type} placeholder="Select Group Type" name="type" id="group_type" options={GroupType}></CustomSelect>
            </Form.Field>
        </>
    };

    const E = withReadOnlySupport(Readonlygroup, 'Group', End.master.group.read, f);
    return <E />;

};




/**
 * Creates basic form group creation/modify
 */
export class GroupForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorState: false,
            errorMsg: null,
            btnDisable: false,
            btnLoading: false,
            successState: false,
            name: props.name,
            type: props.type
        };
    }

    handleSubmit(e) {
        let valid = true;
        let errorMsg = "";
        let o = { name: $("name").value, type: $("type").value };
        let or = { name: /[a-zA-Z0-9]{2,100}/, type: /\d{1,2}/ };
        if (o.name.trim().match(or.name) === null) {
            valid = false;
            errorMsg = "Invalid Group (2-100) Characters\n";

        }
        else if (o.type.match(or.type) === null) {
            valid = false;
            errorMsg = "Invalid Group Type/Choose from given List";
        }


        if (valid) {
            this.setState({ name: o.name, type: o.type, btnDisable: true, btnLoading: true, errorState: false });
            let form = $("groupForm");
            if (this.props.create) {

                MakePostFetch(End.master.group.create, form, true)
                    .then(FormResponseHandlerWithLoadingDisabler.bind(this))
                    .then(r => {
                        this.setState({ successState: true });
                    })
                    .catch(FormErrorHandler.bind(this));


            } else {
                //check user didn't modify anything
                if (o.name === this.props.name && o.type === this.props.type) {
                    this.setState({ successState: true });
                } else {
                    MakePostFetch(End.master.group.modify, form)
                        .then(r => {

                        });
                }

            }



        } else {
            this.setState({ errorState: true, errorMsg });
        }
    }
    render() {
        let formEle = <Segment>
            <Header dividing>
                {this.props.create ? "Create Group" : "Modify Group"}
            </Header>

            <Form name="groupForm" id="groupForm" error={this.state.errorState}>
                <Form.Input required id="group_name" placeholder="Group Name" name="name" title="Group Name" label="Group Name" autoFocus />
                <Form.Field required>
                    <label>Group Type</label>
                    <CustomSelect placeholder="Select Group Type" name="type" id="group_type" options={GroupType}></CustomSelect>
                </Form.Field>
                <Message error header="There is something wrong!!" content={this.state.errorMsg} />

                <Button primary onClick={this.handleSubmit.bind(this)} loading={this.state.btnLoading} disabled={this.state.btnDisable}>
                    {this.props.create ? "Create" : "Modify"}
                </Button>
            </Form></Segment>;
        return (this.state.successState) ? <SuccessMessage name={this.state.name} type={this.state.type} create={this.props.create} /> : formEle;

    }

}

function SuccessMessage(props) {
    return (<Segment compact>
        <Header content={(props.create) ? 'Group Added' : "Group Modified"} />

        <Card color="green">
            <Card.Content>
                <Card.Header>{props.name}</Card.Header>
                <Card.Meta>Group</Card.Meta>
                <Card.Description>
                    {typename(props.type)}
                </Card.Description>
            </Card.Content>
        </Card>
    </Segment>
    );
}


let typename = type => {
    for (let y = 0; y < GroupType.length; y++) {
        if (GroupType[y].value === type) {
            return GroupType[y].text
        }
    }
    return ""
}