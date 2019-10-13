//code of item form
import React,{Component} from "react";
import { Header,Select, Form, Message, Button, Table, Loader } from "semantic-ui-react";
import { MakePostFetch } from "../../network";
import End from "../../end";
import {Get} from "../../network";
import { GroupTypes } from "../../Fixed";
import { MasterEntity } from "./entityList";



export class ItemList extends Component{
    constructor(props){
        super(props);
        this.state={recordCount:0,contentLoaded:false};
        this.dataList=[];
        this.fetchContent();    
    }

    fetchContent(){
        MakePostFetch(End.master.item.read,new FormData(),true)
        .then(r=>{
            if(r.status==200)return r.json();
            else throw Error("Couldn't fetch the content");
        })
        .then(r=>{
                this.dataList= r.results.map((v,i)=>{
                    const {name,group_name,id,unit_name}=v;
                return <Table.Row key={i}>
                        <Table.Cell>
                        <Link title="Edit this Record" to={"/app/master/item/modify/"+id}>
                            <Icon name="edit"></Icon>
                        </Link>
                        </Table.Cell>
                    <Table.Cell>
                        {name}
                    </Table.Cell>
                    <Table.Cell>
                        {group_name}
                    </Table.Cell>
                    <Table.Cell>
                        {unit_name}
                    </Table.Cell>
                    </Table.Row>
                });
                this.setState({contentLoaded:true,recordCount:r.results.length});
        })
        .catch(err=>{
            this.setState({errorState:true,errorMsg:err.message});
        })
    }

    render(){
        const {recordCount,contentLoaded}=this.state;
        const headers=["","Name","Group","Unit"]
        return <div>
            <Header>Item List <Label>{recordCount}</Label></Header>
        <MasterEntity.List sortable headers={headers}>
            <Table.Body>
            {contentLoaded?this.dataList:<Loader/>}     
            </Table.Body>
        </MasterEntity.List>
        </div>
    }

}

export class ItemForm extends Component{
    constructor(props){
        super(props);
        this.state={
            errorState:false,
            errorMsg:null,
            btnDisable:false,
            btnLoading:false,
            successState:false,
            name:props.name,
            unit:props.unit,
            gid:props.gid
        }

        this.pullResources();
    }

    pullResources(){
        Get.Group(GroupTypes.Item)
        .then(r=>{this.setState({GroupOptions:r})})
        .catch(err=>{this.setState({errorState:true,errorMsg:"Unable to fetch Item Groups"})});
       
        Get.Unit()
        .then(r=>{this.setState({UnitOptions:r})})
        .catch(err=>{this.setState({errorState:true,errorMsg:"Unable to fetch Units"})});
    
    }

    handleSubmit(e){
        let valid,errorMsg;
        let d=document.getElementById;
        let o={
            name:d("name").value.trim(),
            unit:d("unit").value.trim(),
            gid:d("group").value.trim()
        };
        let oe={
            name:/\w{2,100}/,
            unit:/^\d{1,}$/,
            gid:/^\d{1,}$/
        }
        if(o.name.match(oe.name)==null){
            errorMsg="Invalid Item Name";
        }
        else if(o.unit.match(oe.unit)==null){
            errorMsg="Invalid Unit ";
        }
        else if(o.gid.match(oe.gid)==null){
            errorMsg="Invalid Group";
        }
        valid=errorMsg===null;
        if(valid){
                let form=d("itemForm");
                this.setState({name:o.name,unit:o.unit,gid:o.gid});
                if(this.props.create){
                    MakePostFetch(End.master.item.create,form).then(r=>r);
                }else{
                    let p=this.props;
                    if(o.name==p.name && o.gid==p.gid && o.unit==p.unit){
                        this.setState({successState:true});
                    }else{
                        MakePostFetch(End.master.item.modify,form).then(r=>r);
                    }
                }
        }else{
            this.setState({errorState:true,errorMsg});
        }
    }


    render(){
        let form=<Form id='itemForm' error={this.state.errorState}>
            <Header content={this.props.create?"Create Item":"Modify Item"} />
            <Form.Input  required type="text" id="name" name="name" label="Item Name" placeholder="Name" />
            <Form.Field required>
            <label>Unit</label>
            <Select placeholder="Choose Unit" id="unit" name="unit" options={this.state.UnitOptions} ></Select>
            </Form.Field>
            <Form.Field required>
            <labe>Group</labe>
            <Select placeholder="Choose Group" id="group" name="group" options={this.state.GroupOptions} ></Select>
            </Form.Field>
            <Message error header="There is a Problem!!" content={this.state.errorMsg}></Message>
            <Button primary onClick={this.handleSubmit.bind(this)} loading={this.state.btnLoading} disabled={this.state.btnDisable} >{this.props.create?"Create":'Modify'}</Button>    
                 
          </Form>;
          return (this.state.successState)?<SuccessMessage unit={getfromArray(this.state.UnitOptions,this.state.unit)} group={getfromArray(this.state.GroupOptions,this.state.group)} create={this.props.create}/>:form;

}
}


function getfromArray(ar,y){
    let x= ar.filter((v,i)=>v.value===y);
    return x.length>0?x[0].text:"";
}


function SuccessMessage(props){
    return (
        <>
        <Message success header="Success!!" content={(props.create)?"Item Created":"Item Modified"} />
        <Table>
            <Table.Row>
                <Table.Cell>
                {props.name}
                </Table.Cell>
                <Table.Cell>
                {props.unit}
                </Table.Cell>
                <Table.Cell>
                {props.group}
                </Table.Cell>                    
            </Table.Row>
        </Table>
        </>
    )
}