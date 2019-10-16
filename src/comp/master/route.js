//This file contains code for Route

import React,{Component} from 'react';
import { Form, Select, Message, Card } from 'semantic-ui-react';

export class RouteForm extends Component{
    constructor(props){
        super(props);
        this.state={};
    }
    
    render(){
        const {create,successState,errorState}=this.state;
        const form=<Form id="routeForm">
            <Header dividing>{(create)?"Add Route":"Modify Route"}</Header>
            <Form.Input name="name" id="name" label="Name" placeholder="Name of Route" />
            <Form.Field required>
                <Select placeholder="Choose Group" name="gid" id="gid" options={this.state.GroupOptions}></Select>
            </Form.Field>
            <Form.Field required>
                <textarea name="description" placeholder="Add some notes or Description"  rows="5" id="description"></textarea>
            </Form.Field>
            <Button primary onClick={this.handleClick.bind(this)} >{(create)?"Add":"Modify"}</Button>
        </Form>;

        return (successState)?<SuccessCard/>:form;
    }

}

function SuccessCard({name,count,create}){
    return <>
        <Message success content={(create)?"Route Added":"Route Modified"} />
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