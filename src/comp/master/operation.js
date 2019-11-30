//This file contains code to present an operation 

import React, { Component } from "react";
import { Form, Table, Icon, Header, Card, Message, Button, Segment } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Get, MakePostFetch, FormErrorHandler, FormResponseHandlerWithLoadingDisabler } from "../../network";
import { GroupTypes } from "../../Fixed";
import { RecordList } from "../common/recordList";
import End from "../../end";
import { CustomSelect, $, HeaderLink } from "../common/form";
import Apm from "../../apm";
import { withReadOnlySupport } from "../common/readOnly";
import { InfoDoc } from "../common/info";

/**
 * This component renders operations list
 * @param {ReactProps} props 
 */
export function OperationList(props) {

    const mapFn = (v, i) => {
        const {gid,workplace, name, group_name, workplace_name, description, id } = v;
        return <Table.Row key={i}>
            <Table.Cell width={1}>
                <Link title="Edit this Record" to={Apm.master.operation + "/modify/" + id}>
                    <Icon name="edit"></Icon>
                </Link>
            </Table.Cell>
            <Table.Cell>
            <HeaderLink header={name} link={Apm.master.operation+"/info/"+id} />
           
            </Table.Cell>
            <Table.Cell>
            <HeaderLink header={group_name} link={Apm.master.group+"/info/"+gid} />
           
            </Table.Cell>
            <Table.Cell>
            <HeaderLink header={workplace_name} link={Apm.master.workplace+"/info/"+workplace} />
           
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
        "", "Name", 
        <HeaderLink header="Group" link={Apm.master.group.concat("/read")} />,
        <HeaderLink header="Workplace" link={Apm.master.workplace.concat("/read")} />
       , "Description"
    ];

    return <RecordList headers={headers} title="Operation" mapFn={mapFn} fetchPromise={fetcher} />


}



export function DocOperation(props){
    return <InfoDoc header="Operation">
        <p>
            Operation(s) are jobs in Production Lifecycle of a Product.<br/>
             e.g While manufaturing a Car, Fabrication is an operation in its production process.
            <br/>We have to specify the <b>Workplace</b> which tells about the place where operation executes. We can also use group to make special kind of operation Group.
           <br/> e.g. If we have painting of 3 Colors, We can  make seperate operation of each paint color, Paint-Red, Paint-Black and Paint-Blue. We then can hold these operation in <b>Paint</b> group of operation.
        </p>
    </InfoDoc>
}


export function ReadOnlyOperationWrapper({ match: { params: { id } } }) {
    const f = new FormData();
    f.append("id", id);

    const d = ({ payload, ...props }) => {
        return <>
          <Form.Input label="name" readOnly defaultValue={payload.name} />   
          <Form.Group>
                <Form.Input readOnly label="Group" defaultValue={payload.group_name} />
                <Form.Input readOnly label="Workplace" defaultValue={payload.workplace_name} />
          </Form.Group>
          <Form.Field>
              <label>Description</label>
              <textarea readOnly defaultValue={payload.description} placeholder="Add Some Description" ></textarea>
      
          </Form.Field>
        </>
    }
    const E = withReadOnlySupport(d, "Operation", End.master.operation.read, f);
    return <Segment.Group><E/></Segment.Group>
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