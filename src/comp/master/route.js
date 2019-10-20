//This file contains code for Route

import React,{Component} from 'react';
import { Form, Select, Message, Card, Button, Table, Icon } from 'semantic-ui-react';
import { Get, MakePostFetch } from '../../network';
import { GroupTypes } from '../../Fixed';
import End from '../../end';
import PropTypes from 'prop-types';
export class RouteForm extends Component{
    constructor(props){
        super(props);
        this.state={
            errorState:false,
            errorMsg:null,
            btnLoading:false,
            btnDisable:false,
            successState:false,
            operations:[]
        };
        this.pullResources();

    }

    pullResources(){

        Get.Group(GroupTypes.Route)
        .then(GroupOptions=>{
            this.setState({GroupOptions});
        })
        .catch(err=>{
            this.setState({errorState:true,errorMsg:"Couldn't fetch groups"});

        });

        MakePostFetch(End.master.route.read,new FormData(),true)
        .then(r=>{
            if(r.status==200){
                    r.result
            }else{
                throw Error("Couldn't fetch Operations");
            }
        })
        .catch(err=>{
            this.setState({errorState:true,errorMsg:err.message});
        });

        MakePostFetch(End.master.operation.read,new FormData(),true)
        .then(r=>{
            if(r.status==200){
                this.setState({operations:r.result});     
            }
            else throw Error("Couldn't fetch operations")
        })
        .catch(err=>{
            this.setState({errorState:true,errorMsg:err.message});
        });

    }



    handleClick(e){

    }
    
    render(){
        const {create,successState,errorState}=this.state;
        const form=<Form error={errorState} id="routeForm">
            <Header dividing>{(create)?"Add Route":"Modify Route"}</Header>
            <Form.Input name="name" id="name" label="Name" placeholder="Name of Route" />
            <Form.Field required>
                <Select placeholder="Choose Group" name="gid" id="gid" options={this.state.GroupOptions}></Select>
            </Form.Field>
            <Form.Field>
            <OperationListChooser operations={this.state.operations}  />
            </Form.Field>
            <Form.Field required>
                <textarea name="description" placeholder="Add some notes or Description"  rows="5" id="description"></textarea>
            </Form.Field>
            <Message error header="There is something wrong!!" content={this.state.errorMsg}/>
            <Button primary loading={btnLoading} disabled={btnDisable} onClick={this.handleClick.bind(this)} >{(create)?"Add":"Modify"}</Button>
        </Form>;

        return (successState)?<SuccessCard/>:form;
    }

}



export class OperationListChooser extends Component{
    constructor(props){
        super(props);
        this.state={
            seletedOperations:('selectedOperations' in props)?props.selectedOperations:[]
        };
        this.readonly=('readonly' in props);
    }
    
    handleOnChange(e){
        this.currentChoice=Number(e.target.value);
    }

    handleChooseClick(e){
        const value=this.currentChoice;
        let [ar]=operations.filter(({id})=>{
            return id==value;
        });
        let br=this.state.seletedOperations;
        br.push(ar) //assuming only one match
        this.setState({seletedOperations:br});
        
    }

    rowFn(v,i){
    
        const removeRow=e=>{
            const op=this.state.seletedOperations;
            const x=op.filter((v,ix)=>{
                return ix!=i;
            });
            this.setState({seletedOperations:x});
            
        };

        return <Table.Row key={i}>
         {(this.readonly)?<input name="operation" hidden value={v.id} />:<></>}
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
           {(this.readonly)?<></>:<Table.Cell>
                <Icon name="times" onClick={removeRow} title="Remove" color="red" /> 
            </Table.Cell>}

        </Table.Row>

    };


    render(){

        const rows=this.state.seletedOperations.map(this.rowFn);
        const selector= <Table.Row>
                <Table.Cell>
                 <Button primary onClick={this.handleChooseClick} >
                    Add New
                 </Button>
                </Table.Cell>
                <Table.Cell>
                 <Select placeholder="Choose Operation"   onChange={this.handleOnChange} options={this.props.operations} ></Select>
                </Table.Cell> 
            </Table.Row>;

        return  <>
        <Table>
            <Table.Row>
                <Table.Header>
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
                </Table.Header>         
            </Table.Row>
           <Table.Body>
                {this.readonly?<></>:selector}
                {rows}
           </Table.Body>
           
        </Table>
        </>;
    

    }
}



OperationListChooser.propTypes={
    /**
     * Array of elements to displayed initially in Table
     */
    selectedOperations:PropTypes.array,
    /**
     * Specify if it is a Readonly List or not
     */
    readonly:PropTypes.bool,
    /**
     * List of all available Operations
     */
    operations:PropTypes.array   
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