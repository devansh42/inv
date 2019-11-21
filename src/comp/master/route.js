//This file contains code for Route

import React, { Component } from 'react';
import { Form, Header, Message, Card, Button, Table, Icon } from 'semantic-ui-react';
import { Get, MakePostFetch, FormResponseHandlerWithLoadingDisabler, FormErrorHandler } from '../../network';
import { GroupTypes } from '../../Fixed';
import End from '../../end';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { RecordList } from '../common/recordList';
import { CustomSelect } from "../common/select";
/**
* This component renders List of Route List
* @param {ReactProp} props 
*/
export function RouteList(props) {
    const mapFn = (v, i) => {
        const { name, group_name, description, id } = v;
        return <Table.Row key={i}>
            <Table.Cell>
                <Link title="Edit this Record" to={End.master.route.modify + "/" + id}>
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
                {description}
            </Table.Cell>
        </Table.Row>
    }

    const fetcher = () => {
        return MakePostFetch(End.master.route.read, new FormData(), true)
    }
    const headers = [
        "", "Name", "Group", "Workplace", "Description"
    ];

    return <RecordList headers={headers} title="Route(s)" mapFn={mapFn} fetchPromise={fetcher} />


}



export class RouteForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorState: false,
            errorMsg: null,
            btnLoading: false,
            btnDisable: false,
            successState: false,
            operations: [],
            GroupOptions: []
        };
        this.selectedOperations = [];
        this.pullResources();

    }

    pullResources() {

        Get.Group(GroupTypes.Route)
            .then(GroupOptions => {
                this.setState({ GroupOptions });
            })
            .catch(FormErrorHandler.bind(this));
        /*
    MakePostFetch(End.master.route.read, new FormData(), true)
        .then(r => {
            if (r.status === 200) {
                return r.result
            } else {
                throw Error("Couldn't fetch Operations");
            }
        })
        .catch(FormErrorHandler.bind(this));
*/

        MakePostFetch(End.master.operation.read, new FormData(), true)
            .then(r => {
                if (r.status === 200) {
                    return r.json();
                }
                else throw Error("Couldn't fetch operations")
            })
            .then(r => {
                this.setState({ operations: r.result });

            })
            .catch(err => {
                this.setState({ errorState: true, errorMsg: err.message });
            });

    }



    handleClick(e) {
        let errorState = false;
        let errorMsg = null;
        const d = x => document.getElementById(x);
        const x = {
            name: [d("name").value.trim(), /^\w+$/],
            gid: [d("gid").value.trim(), /^\d+$/],
            description: [d('description').value.trim()]

        }
        if (x.name[0].match(x.name[1]) === null) {
            errorMsg = "Please enter a valid Route Name";
        }
        else if (x.gid[0].match(x.gid[1]) === null) {
            errorMsg = "Please choose a valid Group";
        }
        else if (this.state.GroupOptions.filter(v => v.value === x.gid[0]).length < 1) {
            errorMsg = "Please choose group from list";
        }
        errorState = errorMsg !== null;
        if (errorState) {
            this.setState({ errorState, errorMsg });
        } else {
            //No error
            this.setState({ btnDisable: true, btnLoading: true, name: x.name[0], count: this.selectedOperations.length });
            if (this.props.create) {
                let payload = {
                    name: x.name[0],
                    gid: x.gid[0],
                    description: x.description[0],
                    operation: this.selectedOperations.map(v => v.value)
                };

                MakePostFetch(End.master.route.create, JSON.stringify(payload), true)
                    .then(FormResponseHandlerWithLoadingDisabler.bind(this))
                    .then(r => {
                        //Success state
                        this.setState({ successState: true });
                    })
                    .catch(FormErrorHandler.bind(this));
            } else {
                //Modification case
            }
        }
    }
    /**
     * Sets selected operation list
     * @param {Array} opers is the array, which contains choosen operations in the ordered manner 
     */
    setSelectedOperations(opers) {
        this.selectedOperations = opers;
    }

    render() {
        const { successState, errorState, btnDisable, btnLoading } = this.state;
        const { create } = this.props;
        const form = <Form error={errorState} id="routeForm">

            <Header dividing>{(create) ? "Add Route" : "Modify Route"}</Header>
            <Form.Input name="name" id="name" label="Name" placeholder="Name of Route" />
            <Form.Field required>
                <label>Group</label>
                <CustomSelect placeholder="Choose Group" name="gid" id="gid" options={this.state.GroupOptions}></CustomSelect>
            </Form.Field>
            <Form.Field>
                <OperationListChooser setSelectedOperations={this.setSelectedOperations.bind(this)} operations={this.state.operations} />
            </Form.Field>
            <Form.Field required>
                <label>Add some Note</label>
                <textarea name="description" placeholder="Add some notes or Description" rows="5" id="description"></textarea>
            </Form.Field>
            <Message error header="There is something wrong!!" content={this.state.errorMsg} />
            <Button primary loading={btnLoading} disabled={btnDisable} onClick={this.handleClick.bind(this)} >{(create) ? "Add" : "Modify"}</Button>
        </Form>;

        return (successState) ? <SuccessCard create={this.props.create} name={this.state.name} count={this.state.count} /> : form;
    }

}



export class OperationListChooser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            seletedOperations: ('selectedOperations' in props) ? props.selectedOperations : []
        };
        this.readonly = ('readonly' in props);
    }

    handleOnChange(e) {
        this.currentChoice = Number(e.target.value);
    }

    handleChooseClick(e) {
        const value = this.currentChoice;
        const { operations } = this.props;
        let [ar] = operations.filter(({ id }) => {
            return id === value;
        });
        let br = this.state.seletedOperations;
        br.push(ar) //assuming only one match
        this.setState({ seletedOperations: br });
        this.props.setSelectedOperations(br);
    }

    rowFn(v, i) {

        const removeRow = e => {
            const op = this.state.seletedOperations;
            const x = op.filter((v, ix) => {
                return ix !== i;
            });
            this.setState({ seletedOperations: x });

        };

        return <Table.Row key={i}>
            {(this.readonly) ? <input name="operation" hidden value={v.id} /> : <></>}
            <Table.Cell>
                {v.name}
            </Table.Cell>
            <Table.Cell>
                {v.group_name}
            </Table.Cell>
            <Table.Cell>
                {v.workplace_name}
            </Table.Cell>
            <Table.Cell>
                {v.description}
            </Table.Cell>
            {(this.readonly) ? <></> : <Table.Cell>
                <Icon name="times" onClick={removeRow} title="Remove" color="red" />
            </Table.Cell>}

        </Table.Row>

    };


    render() {

        const rows = this.state.seletedOperations.map(this.rowFn.bind(this));

        return <>
            <Table><Table.Header>
                <Table.Row>

                    <Table.HeaderCell>
                        Name
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        Group
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        Workplace
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        Description
                    </Table.HeaderCell>

                </Table.Row>  </Table.Header>
                <Table.Body>
                    {this.readonly ? <></> : <Table.Row>
                        <Table.Cell>
                            <Button primary onClick={this.handleChooseClick.bind(this)} >
                                Add New
                 </Button>
                        </Table.Cell>
                        <Table.Cell>
                            <CustomSelect placeholder="Choose Operation" onChange={this.handleOnChange} options={this.props.operations} ></CustomSelect>
                        </Table.Cell>
                    </Table.Row>}


                    {rows}
                </Table.Body>

            </Table>
        </>;


    }
}



OperationListChooser.propTypes = {
    /**
     * Array of elements to displayed initially in Table
     */
    selectedOperations: PropTypes.array,
    /**
     * Specify if it is a Readonly List or not
     */
    readonly: PropTypes.bool,
    /**
     * List of all available Operations
     */
    operations: PropTypes.array,
    /**
     * This is the render prop to set choosen operations
     */
    setSelectedOperations: PropTypes.func

}



function SuccessCard({ name, count, create }) {
    return <>
        <Message success content={(create) ? "Route Added" : "Route Modified"} />
        <Card>
            <Card.Content>
                <Card.Header>{name}</Card.Header>
                <Card.Meta>Route</Card.Meta>
                <Card.Description>
                    {count} Operation(s)
                </Card.Description>
            </Card.Content>
        </Card>
    </>
}