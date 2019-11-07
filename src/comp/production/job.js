//This file contains code for job card related stuff
import React,{Component} from 'react';
import { Form, Header, Card, Button } from 'semantic-ui-react';
import {MakePostFetch, FormErrorHandler} from "../../network";
import End from '../../end';


export function JobCardList(props){

    const mapFn=(v,i)=>{
        const {id,workorder,operation_name,qty}=v;
    return <Table.Row key={i}>
            <Table.Cell>
            <Link title="Edit this Record" to={End.production.job.modify+"/"+id}>
                <Icon name="edit"></Icon>
            </Link>
            </Table.Cell>
        <Table.Cell>
           <Link title="JOB Card Id" to={End.production.job.modify+"/"+id}>
            {"#".concat(id)}
           </Link>
        </Table.Cell>
        <Table.Cell>
          {"#".concat(workorder)}
        </Table.Cell>
        <Table.Cell>
          {operation_name}
        </Table.Cell>
        <Table.Cell>
          {qty}
        </Table.Cell>
        </Table.Row>
    };
    const headers=[
        "","JOB Id","Workorder","Operation","Qty"
    ];
    const fetcher=()=>{
        return MakePostFetch(End.production.job.read,new FormData(),true)
    }
   
    return <RecordList headers={headers} title="JOB Card(s)" mapFn={mapFn}  fetchPromise={fetcher} />
  
}




export class JobForm extends Component{
    constructor(props){
        super(props);
        this.state={
            errorState:false,
            errorMsg:null,
            btnDisable:false,
            btnLoading:false,
            successState:false,
            OperationOptions:[],
            WorkOrderOptions:[],
            WorkerOptions:[]
        };
        this.pullResources();
    }
    
    pullResources(){

        MakePostFetch(End.production.workorder.read,null,true)
        .then(r=>{
            if(r.status==200){
                return r.json();
            }
            else throw Error("Couldn't fetch Work Orders");
        })
        .then(r=>{
            const WorkOrderOptions=r.result.map(v=>{
                return {id:v.id,key:v.id,text:"#".concat(v.id),...v};
            });
            this.setState({WorkOrderOptions});
        })
        .catch(FormErrorHandler.bind(this));

        
        
        
        
        
        MakePostFetch(End.master.account.read,null,true)
        .then(r=>{
            if(r.status==200){
                return r.json();
            }
            else throw Error("Couldn't fetch Worker List");

        })
        .then(r=>{
            const WorkerOptions=r.result.map(v=>{
                return {id:v.id,key:v.id,text:v.name,...v}
            });
            this.setState({WorkerOptions});
            
        })
        .catch(FormErrorHandler.bind(this));

    }

    handleChange(e){
        [b]=this.state.WorkOrderOptions.filter(v=>{
            return v.id==e.target.value;
        });
        const f=new FormData();//for requesting about routing
        f.append('operation',b.bom);
        MakePostFetch(End.production.bom.read,f,true)
            .then(r=>{
            if(r.status==200)return r.json();
            else throw Error("Couldn't fetch Operation Details");
            })
                .then(r=>{
                    const  WorkOrderOptions= r.result.map(v=>{
                        return {id:v.id,text:v.name,key:v.id,...v};
                    })
                    this.setState({ WorkOrderOptions});
                })
            .catch(FormErrorHandler.bind(this));
    }

    
    render(){

        const {props,state} =this;
        const {create}=props;
        const form=<Form id="jobcardForm">
            <Header dividing >{(create)?"Add Job":"Modify Job"}</Header>
            <Form.Group>
            <Form.Field required>
                <label>Workorder</label>
                <Select name="workorder" onChange={this.handleChange.bind(this)} id="workorder" options={state.WorkOrderOptions} placeholder="Choose from Workorder"  />
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
            <Message error header="There is something wrong!!" content={this.state.errorMsg}/>
          
            <Button primary loading={this.state.btnLoading} disabled={this.state.btnDisable} onClick={this.handleClick.bind(this)}>{(create)?"Create":"Modify"}</Button>
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