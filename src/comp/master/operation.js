//This file contains code to present an operation 

import React,{Component} from "react";
import { Form, TextArea, Card, Message, Button } from "semantic-ui-react";
import {MasterEntity} from "./entityList";
import { Get } from "../../network";
import {GroupTypes} from "../../Fixed";
import { RecordList } from "../common/recordList";


/**
 * This component renders operations list
 * @param {ReactProps} props 
 */
export function OperationList(props){
  
    const mapFn=(v,i)=>{
        const {name,group_name,workplace_name,description,id}=v;
        return <Table.Row key={i}>
            <Table.Cell>
            <Link title="Edit this Record" to={End.master.operation.modify+"/"+id}>
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

    const fetcher=()=>{
        return MakePostFetch(End.master.operation.read,new FormData(),true)
    }
    const headers=[
        "","Name","Group","Workplace","Description"
    ];
  
    return <RecordList headers={headers} title="Operation" mapFn={mapFn}  fetchPromise={fetcher} />
  
  
}



export  class OperationForm extends Component{
    constructor(props){
        super(props);
        this.state={
            errorState:false,
            errorMsg:null,
            btnDisable:false,
            btnLoading:false,
            successState:false,
        }
        this.pullResources();
    }

    pullResources(){
               Get.Group(GroupTypes.Operation)
               .then(GroupOptions=>{
                   this.setState({GroupOptions})
               })  
               .catch(err=>{
                    this.setState({errorState:true,errorMsg:"Couldn't fetch Operation Groups"});
               });
               
               Get.Workplace()
               .then(WorkplaceOptions=>{
                    this.setState({WorkplaceOptions});
               })
               .catch(err=>{
                    this.setState({errorState:true,errorMsg:"Couldn't fetch Workplace"});
               });

    }


    render(){
        
        const {create}=this.state;

        let form=<Form id="operationForm" error={this.state.errorState}>
            <Header dividing>{(create)?"Add Operation":"Modify Operation"}</Header>
            <Form.Input required name="name" label="Name" placeholder="Operation Name" title="Name of the operation to be performed" id="name" />
            <Form.Field required >
                <label>Group</label>
                <Select name="gid" placeholder="Choose Group" id="gid" options={this.state.GroupOptions} ></Select>
            </Form.Field>
            <Form.Field required >
                <label>Workplace</label>
                <Select name="workplace" placeholder="Choose Workplace" id="workplace" options={this.state.WorkplaceOptions} ></Select>
            </Form.Field>
    
            <Form.Field required>
                <label>Description</label>
                <textarea name="description" id="description" placeholder="Add Some Description" ></textarea>
            </Form.Field>
        <Message error header="There is something wrong!!" content={this.state.errorMsg}/>
            <Button primary loading={this.state.btnLoading} disabled={this.state.btnDisable}  onClick={this.handleClick.bind(this)}>{(create)?"Add":"Modify"}</Button>
        </Form>;
        return (this.state.successState)?<SuccessCard/>:form;
        
    }
}



function SuccessCard({name,workplace,create}){
    return <>
       <Message success content={(create)?"Operation Created":"Operation Modified"} ></Message>
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
    </>;
}