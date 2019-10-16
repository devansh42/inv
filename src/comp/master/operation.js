//This file contains code to present an operation 

import React,{Component} from "react";
import { Form, TextArea, Card, Message } from "semantic-ui-react";

export  class OperationForm extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }


    render(){
        
        const {create}=this.state;

        let form=<Form id="operationForm">
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
            <Button primary onClick={this.handleClick.bind(this)}>{(create)?"Add":"Modify"}</Button>
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