//This file contains code for job card related stuff
import React,{Component} from 'react';
import { Form, Header, Card } from 'semantic-ui-react';

export class JobForm extends Component{
    constructor(props){
        super(props);
        this.state={};
    }
    
    render(){

        const {props,state} =this;
        const {create}=props;
        const form=<Form id="jobcardForm">
            <Header dividing >{(create)?"Add Job":"Modify Job"}</Header>
            <Form.Group>
            <Form.Field required>
                <label>Workorder</label>
                <Select name="workorder" id="workorder" options={state.WorkOrderOptions} placeholder="Choose from Workorder"  />
            </Form.Field>
            <Form.Field required>
              <Form.Input label="Post Date" name="post_date" type="datetime" id="post_date" />  
            </Form.Field>
            </Form.Group>
         
            <Form.Group>
            <Form.Field required>
                <label>Operation</label>
                <Select name="operation" id='operation' options={state.OperationOptions}  placeholder="Choose from Operations" ></Select>
            </Form.Field>
            <Form.Field required>
                <Form.Input name="qty" placeholder="Quantity to be produces against this Job Card" id="qty" label="For Quantity" />
            </Form.Field>
            </Form.Group>
            <Form.Field required>
                <label>Worker/Employee</label>
                <Select name="worker" id="worker" options={state.WorkerOptions} placeholder="Choose Worker/Employee for this task" ></Select>
            </Form.Field>
            
            <Button primary onClick={this.handleClick.bind(this)}>{(create)?"Create":"Modify"}</Button>
        </Form>;

        return (this.state.successState)?<SuccessCard/>:form;

    }
}


function SuccessCard({create,jid,account_name}){
    return <>
            <Message success>{(create)?"Job Card Created":"Job Card Modified"}</Message>
            <Card>
                <Card.Content>
                    <Card.Header>
                        #{jid}
                    </Card.Header>
                    <Card.Meta>
                        Job Card
                    </Card.Meta>
                    <Card.Description>
                        Assigned to {account_name} 
                    </Card.Description>
                </Card.Content>
            </Card>
        </>
}