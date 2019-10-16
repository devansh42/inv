//This file contains bom of an product to manufacture

import React,{Component} from "react";
import { Message, Card, Header, Form } from "semantic-ui-react";

export class BomForm extends Component{
    constructor(props){
        super(props);
        this.state={};
    }

    render(){
        const form=<Form id="bomForm">
            <Header dividing>{(create)?"Add BOM":"Modify BOM"}</Header>
            <Form.Input required name="name" id="name" label="Name" placeholder="BOM Name" title="Unique name of your BOM" />
            <Form.Field required>
            <label>Item</label>
                <Select name="item" id="item" placeholder="Choose from Items" options={this.state.ItemOptions}></Select>
            </Form.Field>
            <Form.Input required name="qty" id="qty" label="Quantity" placeholder="Quantity to Manufacture" type="number" />
            <Form.Field required>
                <label>Route</label>
                <Select name="route" options={this.state.RouteOptions} id="route" placeholder="Choose from Routes" > </Select>
            </Form.Field>
            <Form.Field required>
                <textarea name="description" id="description" rows="5" placeholder="Add some description" ></textarea>
            </Form.Field>
            <Button primary onClick={this.handleClick.bind(this)} >{(create)?"Add":"Modify"}</Button>
        </Form>;
        return (this.state.successState)?<SuccessCard/>:form;
    }

}

function SuccessCard({name,create}){
    return <>
        <Message success content={(create)?"BOM Added":"BOM Modified"}>
        
        </Message>
        <Card>
            <Card.Content>
                <Card.Header>{name}</Card.Header>
                <Card.Meta>Bill of Materials</Card.Meta>
            </Card.Content>
        </Card>
    </>
}