//This file contains code for a hoc to render submitable forms (semantic ui forms with some event handlers)

import React,{Component} from "react";
import { Form, Button } from "semantic-ui-react";

export class SubmitableForm extends Component{
    constructor(props){
        super(props);
        this.state={};
    }

    render(){
         const {props,state}=this;   

         const form=<Form error={state.errorState}  id={('id' in props)?props.id:''}>
                    {props.children}             
             </Form>;
        if('onSuccess' in props){
            return (this.state.successState)?props.onSuccess:form;
        
        }else return form;
    }


}

export function SubmitButton(props){
    const {children,clickHandler,btnLoading,btnDisabled}=props;
    
    return <Button loading={btnLoading} disabled={btnDisabled} primary onClick={clickHandler}>
                {children}
            </Button>
}


/*
export function SubmitableForm(props){
    const {id}=props;    
    const form=<Form id={id}>
                
            </Form>





}


*/