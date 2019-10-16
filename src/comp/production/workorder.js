//This file contains code for workorder creation
import React,{Component} from "react";
import { Form } from "semantic-ui-react";

export class WorkOrderForm extends Component{
    constructor(props){
        super(props);
        this.state={};
    }

    render(){
        const {create}=this.props;
        const form=<Form id='woForm'>
            <Header dividing> {(create)?'Add WorkOrder':"Modify Workorder"} </Header>
            <Form.Field required>
                <Select name="item" id='item' placeholder="Choose Item to manufacture" options={this.state.ItemOptions}></Select>
            </Form.Field>
            <Form.Input required name="qty" type="number" placeholder="Quantity to Manage" id="qty" />
            <Form.Field required>
            <label>Bill of Material</label>
                <Select name="bom" id="bom" placeholder="Choose BOM"></Select>
            </Form.Field>
            <Form.Group>
            <Form.Field required>
            <Form.Input name="post_date" defaultValue={new Date().getUTCDate()} id="post_date" type="datetime" title="Work order Post date" />
            </Form.Field>
            
            <Form.Field>
                <Form.Checkbox name="nbom" id="nbom"  inline />
                <label>Enable Multilevel BOM</label>
            </Form.Field>

            </Form.Group>
            <Form.Group>
                <Form.Field>
                    <label>Expected Start Date</label>
                    <Form.Input type='datetime' name="st_date" id="st_date" />
                </Form.Field>
                <Form.Field>
                    <label>Expected Delivery Date</label>
                    <Form.Input name="de_date" type='datetime' id="de_date" />
                </Form.Field>
            </Form.Group>

           <Button onClick={this.handleClick.bind(this)}  primary>
            {(create)?"Add":"Modify"}
           </Button>  
        </Form>
    }

}