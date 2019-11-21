//This file contains code to present an operation 

import React, { Component } from "react";
import { Form, Table, Icon, Header, Card, Message, Button, Segment } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Get, MakePostFetch, FormErrorHandler, FormResponseHandlerWithLoadingDisabler } from "../../network";
import { GroupTypes } from "../../Fixed";
import { RecordList } from "../common/recordList";
import End from "../../end";
import { CustomSelect, $ } from "../common/form";

/**
 * This component renders operations list
 * @param {ReactProps} props 
 */
export function OperationList(props) {

    const mapFn = (v, i) => {
        const { name, group_name, workplace_name, description, id } = v;
        return <Table.Row key={i}>
            <Table.Cell width={1}>
                <Link title="Edit this Record" to={End.master.operation.modify + "/" + id}>
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
                {workplace_name}
            </Table.Cell>
            <Table.Cell>
                {description}
            </Table.Cell>
        </Table.Row>
    }

    const fetcher = () => {
        return MakePostFetch(End.master.operation.read, new FormData(), true)
    }
    const headers = [
        "", "Name", "Group", "Workplace", "Description"
    ];

    return <RecordList headers={headers} title="Operation" mapFn={mapFn} fetchPromise={fetcher} />


}



export class OperationForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorState: false,
            errorMsg: null,
            btnDisable: false,
            btnLoading: false,
            successState: false,
            GroupOptions: [],
            WorkplaceOptions: []

        }
        this.pullResources();
    }

    pullResources() {
        Get.Group(GroupTypes.Operation)
            .then(GroupOptions => {
                this.setState({ GroupOptions })
            })
            .catch(err => {
                this.setState({ errorState: true, errorMsg: "Couldn't fetch Operation Groups" });
            });

        Get.Workplace()
            .then(WorkplaceOptions => {
                this.setState({ WorkplaceOptions });
            })
            .catch(err => {
                this.setState({ errorState: true, errorMsg: "Couldn't fetch Workplace" });
            });

    }

    handleClick(e) {
        const d = $;
        const xe = {
            name: [d("name").value.trim(), /^\w+$/],
            gid: [d("gid").value, /^\d+$/],
            workplace: [d("workplace").value, /^\d+$/]
        };
        let errorMsg = null;
        let errorState = false;
        if (xe.name[0].length<1) {
            errorMsg = "Not a valid Operation Name";
        }
        else if (xe.gid[0].match(xe.gid[1]) == null) {
            errorMsg = 'Not a valid Group Name'
        }
        else if (this.state.GroupOptions.filter(v => v.value == xe.gid[0]).length < 1) {
            errorMsg = "Please choose group from the List";
        }
        else if (xe.workplace[0].match(xe.workplace[1]) == null) {
            errorMsg = 'Not a valid Workplace'
        }
        else if (this.state.WorkplaceOptions.filter(v => v.value == xe.workplace[0]).length < 1) {
            errorMsg = "Please choose workplace from the List";
        }
        errorState = errorMsg !== null;
        if (errorState) {
            this.setState({ errorState, errorMsg });//Showing Current Error States
        } else {
            //No Error, We can proceed Further, for now we are just considering just creation option and not modify action
            this.setState({ name: xe.name[0], workplace_name: this.state.WorkplaceOptions.filter(x => x.value == xe.gid[0])[0].text })

            if (this.props.create) {
                this.setState({ btnLoading: true, btnDisable: true });
                MakePostFetch(End.master.operation.create, d("operationForm"), true)
                    .then(FormResponseHandlerWithLoadingDisabler.bind(this))
                    .then(r => {
                        //the result
                        //changing state to success state
                        this.setState({ successState: true });
                    })
                    .catch(FormErrorHandler.bind(this))
            } else {
                //Case to handle Modification
            }
        }
    }


    render() {

        const { create } = this.props;

        let form = <Form name="operationForm" id="operationForm" error={this.state.errorState}>
            <Header dividing>{(create) ? "Add Operation" : "Modify Operation"}</Header>
            <Form.Input required name="name" label="Name" placeholder="Operation Name" title="Name of the operation to be performed" id="name" />
            <Form.Group>
                <Form.Field required >
                    <label>Group</label>
                    <CustomSelect name="gid" placeholder="Choose Group" id="gid" options={this.state.GroupOptions} ></CustomSelect>
                </Form.Field>
                <Form.Field required >
                    <label>Workplace</label>
                    <CustomSelect name="workplace" placeholder="Choose Workplace" id="workplace" options={this.state.WorkplaceOptions} ></CustomSelect>
                </Form.Field>
            </Form.Group>
            <Form.Field >
                <label>Description</label>
                <textarea name="description" id="description" placeholder="Add Some Description" ></textarea>
            </Form.Field>
            <Message error header="There is something wrong!!" content={this.state.errorMsg} />
            <Button primary loading={this.state.btnLoading} disabled={this.state.btnDisable} onClick={this.handleClick.bind(this)}>{(create) ? "Add" : "Modify"}</Button>
        </Form>;
        return (this.state.successState) ? <SuccessCard name={this.state.name} workplace={this.state.workplace_name} create={this.props.create} /> : form;

    }
}



function SuccessCard({ name, workplace, create }) {
    return <Segment compact color="green">
        <Header success content={(create) ? "Operation Created" : "Operation Modified"}  />
        <Card>
            <Card.Content>
                <Card.Header>
                    {name}
                </Card.Header>
                <Card.Meta>
                    Operation
            </Card.Meta>
                <Card.Description>
                    At {workplace}
                </Card.Description>
            </Card.Content>
        </Card>
    </Segment>;
}