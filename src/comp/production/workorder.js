//This file contains code for workorder creation
import React,{Component} from "react";
import { Form } from "semantic-ui-react";
import { Get, MakePostFetch, FormErrorHandler } from "../../network";
import End from "../../end";
import { OperationListChooser } from "../master/route";

export class WorkOrderForm extends Component{
    constructor(props){
        super(props);
        this.state={
            errorState:false,
            errorMsg:null,
            btnDisable:false,
            btnLoading:false,
            successState:false,
            ItemOptions:[],
            BomOptions:[],
            SubAssembyList:[],
            RouteOperations:[]



        };
   
        this.pullResources();
    }

    pullResources(){
        Get.Item()
        .then(r=>{
            this.setState({ItemOptions:r});
        })
        .catch(err=>{
            this.setState({errorState:true,errorMsg:err.message});
        })
    }

    handleItemSelection(e){
        const v=Number(e.target.value);
        const f=new FormData();
        f.append("item",v);
            
        MakePostFetch(End.production.bom.read,f,true)
        .then(r=>{
                if(r.status==200){
                    this.setState({BomOptions:r.result.map(v=>{
                        return {key:v.id, value:v.id,...v}
                    })
                    });
                }
                else throw Error("Couldn't fetch BOMs for item");
                
        })
        .catch(FormErrorHandler.bind(this))
    }
    
    bomChanger(e){
        const v=Number(e.target.value);
    
        const f=new FormData();
        f.append("bom_material",v);
        MakePostFetch(End.production.bom.read,f,true)
        .then(r=>{
            if(r.status==200){
                return r.json()
            }
            else throw Error("Couldn't fetch Sub Assembly/Required Items List")
        })
        .then(r=>{
            this.setState({SubAssembyList:r.result});
        })
        .catch(FormErrorHandler.bind(this));

        f.delete("bom_material");
        
        const [bom]=this.state.BomOptions.filter(x=>{
            return v==x.id;
        });
        
        f.append("route_operations",bom.routing);
        MakePostFetch(End.master.route.read,f,true)
        .then(r=>{
                if(r.status==200){
                  return r.json()  
                }
        })
        .then(r=>{
            this.setState({RouteOperations:r.result})
        })
        .catch(FormErrorHandler.bind(this))


    }


    render(){
        const {create}=this.props;
        const form=<Form id='woForm'>
            <Header dividing> {(create)?'Add WorkOrder':"Modify Workorder"} </Header>
            <Form.Field required>
                <Select name="item" onChange={this.handleItemSelection} id='item' placeholder="Choose Item to manufacture" options={this.state.ItemOptions}></Select>
            </Form.Field>
            <Form.Input required name="qty" type="number" placeholder="Quantity to Manage" id="qty" />
            <Form.Field required>
            <label>Bill of Material</label>
                <Select name="bom" id="bom" onChange={this.bomChanger} options={this.state.BomOptions}  placeholder="Choose BOM"></Select>
            </Form.Field>
            <Form.Field>
                <label>Sub Assembly/Required Item</label>
                <RequireItemListChooser readonly materialList={this.state.SubAssembyList} />
            </Form.Field>

            <Form.Field>
                <label>Route/Operations</label>
                <OperationListChooser readonly selectedOperations={this.state.RouteOperations}   />
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