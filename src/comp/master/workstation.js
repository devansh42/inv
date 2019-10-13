//This file Workplace


import React,{Component} from "react";
import { Button, Select, Form, Message, Table, Header, Label, Loader, Icon } from "semantic-ui-react";
import { MakePostFetch, Get } from "../../network";
import End from "../../end";
import { GroupTypes } from "../../Fixed";
import { MasterEntity } from "./entityList";



export class WorkplaceList extends Component{
    constructor(props){
        super(props);
        this.state={contentLoaded:false,recordCount:0}
        this.dataList=[];
        this.fetchContent();
    
    }
    
    fetchContent(){
        MakePostFetch(End.master.workplace.read,new FormData(),true)
        .then(r=>{
            if(r.status==200){
                return r.json()
            }
            else throw Error("Something was went wrong");
        })
        .then(r=>{
            this.dataList=r.results.map(v=>{
                const {name,addr,op_time,id,cl_time,group_name}=v;
                return <Table.Row key={id}>
                    <Table.Cell>
                        <Link title="Modify this Record" to={"/app/master/account/workplace/modify/"+id}>
                        <Icon name="edit" ></Icon>
                        </Link>    
                    </Table.Cell>
                    <Table.Cell>
                        {name}
                    </Table.Cell>
                    <Table.Cell>
                        {group_name}
                    </Table.Cell>
                    <Table.Cell>
                        {this.timeSecToString(op_time)}
                    </Table.Cell>
                    <Table.Cell>
                        {this.timeSecToString(cl_time)}
                    </Table.Cell>
                    <Table.Cell>
                        {addr}
                    </Table.Cell>
                    
                </Table.Row>

            });
            this.setState({contentLoaded:true,recordCount:r.results.length});
        })
        .catch(err=>{
            this.setState({errorState:true,errorMsg:err.message});
        })
    
    }   

    timeSecToString(s){
        let x="";
        let h=s/3600;
        h=parseInt(h);
        x+=((h>9)?"0"+h:h);
        x+=":";
        s-=(h*3600);
        let m=parseInt(s/60);
        x+=((m>9)?m:"0"+m);
        return x;
    }


    render(){
        let {recordCount,contentLoaded}=this.state;

        const headers=[
            "","Name","Group","Opeing Time","Closing Time","Location"
        ];
        return <div>
            <Header dividing>Workplace <Label floating>{recordCount}</Label> </Header>
            <MasterEntity.List sortable headers={headers}>
                <Table.Body>
                    {(contentLoaded)?this.dataList:<Loader/>}
                </Table.Body>
            </MasterEntity.List>
        </div>
    }
}

export class WorkplaceForm extends Component{
    constructor(props){
        super(props);
        this.state={
            errorState:false,
            errorMsg:null,
            btnDisable:false,
            btnLoading:false,
            successState:false,
            name:this.props.name,
            addr:this.props.addr,
            op_time:this.props.op_time,
            cl_time:this.props.cl_time,
            gid:this.props.gid,
            GroupOptions:[]
        }


        this.pullResource();
        
    }
    
    pullResource(){
        Get.Group(GroupTypes.Workplace)
        .then(r=>{this.setState({GroupOptions:r})})
        .catch(err=>{this.setState({errorState:true,errorMsg:"Unable to fetch Workplace Groups"})});

    }


    handleSubmit(e){
        let d=document.getElementById;
        let o={
            name:d("wrk_name").value,
            addr:d("wrk_addr").value,
            op_time:d("op_time").value,
            cl_time:d("cl_time").value,
            gid:d("gid").value
        };
        let oe={
            name:/\w{2,200}/,
            addr:/.{2,500}/,
            op_time:/\d{2}:\d{2}/,
            cl_time:/\d{2}:\d{2}/,
            gid:/\d{1,}/
        };
        let valid=true,errorMsg=null;
        if(o.name.trim().match(oe.name)==null){
            errorMsg="Invalid Name (2-200) Character\n";

        }
        else if(o.addr.trim().match(oe.addr)==null){
            errorMsg="Invalid Address\n";

        }
        else if(o.op_time.trim().match(oe.op_time)==null){
            errorMsg="Invalid Opening Time\n";
        }
        else if(o.cl_time.trim().match(oe.cl_time)==null){
            errorMsg="Invalid Closing Time\n";
        }
        else if(o.gid.trim().match(oe.gid)==null){
            errorMsg="Choose valid Group";
        }
        valid=errorMsg===null;

        if(valid){
                let form=d("formWorkplace");

                if(this.props.create){
                    MakePostFetch(End.master.workplace.create,form)
                    .then(r=>{});

                }else{
                    let p=this.props;
                    //no change of content
                    if(p.name==o.name && p.addr==o.addr&& p.op_time==o.op_time && p.cl_time==o.cl_time && p.gid==o.gid){
                        this.setState({successState:true});
                    }else{
                        MakePostFetch(End.master.workplace.modify,form)
                        .then(r=>{});
                    }
                }
        }else{
            this.setState({errorState:true,errorMsg});
        }

    }

    render(){
        let form=<Form id="formWorkplace" error={this.state.errorState}>
                <Header header={(this.props.create)?"Create Workplace":"Modify Workplace"} dividing></Header>
                    <Form.Input required title="Name of Workplace e.g. Factory-1" label="Name" name="name" type="text" id="wrk_name" placeholder="WorkPlace Name" />
                    <Form.Input required name="addr" type="text" id="wrk_addr" placeholder="WorkPlace Address" />
                    <Form.Input required id="op_time" name="op_time"  title="Opening Time e.g. 08:15:00" type="time" label="Opening Time" />
                    <Form.Input required id="cl_time" name="cl_time" title="Opening Time e.g. 22:15:00" type="time" label="Closing Time" />
                    <Form.Field required>
                    <label>Group</label>
                    <Select id="gid" required  placeholder="Choose Group" options={this.state.GroupOptions} ></Select>
                    </Form.Field>
                    <Message error header="There is a Problem!!" content={this.state.errorMsg}></Message>
                    <Button primary onClick={this.handleSubmit.bind(this)} loading={this.state.btnLoading} disabled={this.state.btnDisable} >{this.props.create?"Create":'Modify'}</Button>    
                    </Form>;
              return (this.state.successState)?<SuccessMessage group={getGroupname(this.state.GroupOptions,this.state.gid)} name={this.state.name} cl_time={this.state.cl_time} op_time={this.state.op_time}  addr={this.state.addr}  />:form;      
    }

}


function getGroupname(ar,value){
    let x=ar.filter((v,i)=>v.value===value)
    return (x.length>0)?x[0].text:""
}


function SuccessMessage(props){
    return (
        <>
        <Message success header="Success!!" content={(props.create)?"Workplace Created":"Workplace Modified"} />
        <Table>
            <Table.Row>
                <Table.Cell>
                {props.name}
                </Table.Cell>
                <Table.Cell>
                {props.addr}
                </Table.Cell>
                <Table.Cell>
                {props.op_time}
                </Table.Cell>
                <Table.Cell>
                {props.cl_time}
                </Table.Cell>
                <Table.Cell>
                {props.group}
                </Table.Cell>                    
            </Table.Row>
        </Table>
        </>
    )
}