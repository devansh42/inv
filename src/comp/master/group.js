//This contains code to Different Activities for group
import React,{Component} from "react";
import { Select, Form, Button, Message, Header, Card } from "semantic-ui-react";
import End from "../../end";
import { MakePostFetch } from "../../network";

export class GroupList extends Component{
    constructor(props){
        super(props);
        this.state={contentLoaded:false,recordCount:0};
        this.dataList=[];
        this.fetchContent();

    }

    fetchContent(){
        MakePostFetch(End.master.group.read,new FormData(),true)
        .then(r=>{
            if(r.status==200)return r.json();
            else throw Error("Couldn't fetch the content");
        })
        .then(r=>{
               
            this.dataList= r.results.map((v,i)=>{
                const {name,text,id}=v;
            return <Table.Row key={i}>
                    <Table.Cell>
                    <Link title="Edit this Record" to={"/app/master/group/modify/"+id}>
                        <Icon name="edit"></Icon>
                    </Link>
                    </Table.Cell>
                <Table.Cell>
                    {name}
                </Table.Cell>
                <Table.Cell>
                    {text}
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
        let {recordCount,contentLoaded}=this.state;

        const headers=[
            "","Name","Type"
        ];
        return <div>
            <Header dividing>Group <Label floating>{recordCount}</Label> </Header>
            <MasterEntity.List sortable headers={headers}>
                <Table.Body>
                    {(contentLoaded)?this.dataList:<Loader/>}
                </Table.Body>
            </MasterEntity.List>
        </div>
    }

}


/**
 * Creates basic form group creation/modify
 */
export class GroupForm extends Component{
    constructor(props){
        super(props);
        this.state={
            errorState:false,
            errorMsg:null,
            btnDisable:false,
            btnLoading:false,
            successState:false,
            name:props.name,
            type:props.type
        };
    }

    handleClick(e){
        this.handleSubmit(e);
    }

    handleSubmit(e){
        let valid=true;
        let errorMsg="";
        let d=document.getElementById;
        let o={name:d("group_name").value,type:d("group_type").value};
        let or={name:/[a-zA-Z0-9]{2,100}/,type:/\d{1,2}/};
        if(o.name.trim().match(or.name)==null){
            valid=false;
            errorMsg="Invalid Group (2-100) Characters\n";

        }
        else if(o.type.match(or.type)==null ){
            valid=false;
            errorMsg="Invalid Group Type/Choose from given List";
        }
        

        if(valid){
            this.setState({name:o.name,type:o.type,btnDisable:true,btnLoading:true,errorState:false});
            let  form=d("groupForm");
            if(this.props.create){
            
                MakePostFetch(End.master.group.create,form)
                .then(r=>{
                    
                })
        

            }else{
                //check user didn't modify anything
                if(o.name==this.props.name && o.type==this.props.type){
                    this.setState({successState:true});
                }else{
                    MakePostFetch(End.master.group.modify,form)
                    .then(r=>{

                    });
                }

            }
            


        }else{
            this.setState({errorState:true,errorMsg});
        }
    }

    render(){
         let formEle=   <Form id="groupForm" error={this.state.errorState}>
            <Header dividing>
            {this.props.create?"Create Group":"Modify Group"}
            </Header>
                <Form.Input required id="group_name" placeholder="Group Name" name="name" title="Group Name" label="Group Name" autoFocus  />
                <Form.Field required>
                <label>Group</label>
                <Select  placeholder="Select Group Type" name="type" id="group_type" options={GroupType}></Select>
                </Form.Field>
                <Message error header="There is something wrong!!" content={this.state.errorMsg}/>
                
                <Button primary onClick={this.handleClick.bind(this)} loading={this.state.btnLoading} disabled={this.state.btnDisable}>
                    {this.props.create?"Create":"Modify"}
                </Button>
            </Form>;
          return (this.state.successState)?<SuccessMessage name={this.state.name} type={this.state.type} create={this.props.create}/>:formEle;      
        
    }

}

function SuccessMessage(props){
 return (<>
    <Message header="Success!!" content={(props.create)?'Group Added':"Group Modified"} />
    <Card>
        <Card.Content>
            <Card.Header>{props.name}</Card.Header>
            <Card.Meta>Group</Card.Meta>
            <Card.Description>
                {typename(props.type)}
            </Card.Description>
        </Card.Content>
    </Card>
    </>
);
}


let typename=type=>{
    for(let y=0;y<GroupType.length;y++){
        if(GroupType[y].value==type){
            return GroupType[y].text
        }
    }
    return ""
}
const GroupType=[
  
    {key:1,value:1,text:"Account"},
    {key:2,value:2,text:"User"},
    {key:3,value:3,text:"Workplace"},
    {key:4,value:4,text:"Item"}
];