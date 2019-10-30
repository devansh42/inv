//This file contains bom of an product to manufacture

import React,{Component} from "react";
import { Message, Card, Header, Form, Table } from "semantic-ui-react";
import { Get, MakePostFetch } from "../../network";
import End from "../../end";


export function BomList(props){

    const mapFn=(v,i)=>{
        const {name,item_name,qty, route_name,description,id}=v;
    return <Table.Row key={i}>
            <Table.Cell>
            <Link title="Edit this Record" to={End.production.bom.modify+"/"+id}>
                <Icon name="edit"></Icon>
            </Link>
            </Table.Cell>
        <Table.Cell>
            {name}
        </Table.Cell>
        <Table.Cell>
          {item_name}
        </Table.Cell>
        <Table.Cell>
          {qty}
        </Table.Cell>
        <Table.Cell>
          {route_name}
        </Table.Cell>
        <Table.Cell>
          {description}
        </Table.Cell>
        </Table.Row>
    };
    const headers=[
        "","Name","Item","Quantity","Route","Description"
    ];
    const fetcher=()=>{
        return MakePostFetch(End.production.bom.read,new FormData(),true)
    }
   
    return <RecordList headers={headers} title="Bill of Material(s)" mapFn={mapFn}  fetchPromise={fetcher} />
  
}


export class BomForm extends Component{
    constructor(props){
        super(props);
        this.state={
            errorState:false,
            errorMsg:null,
            btnDisable:false,
            btnLoading:false,
            successState:false,
            RouteOperations:[],
            ItemOptions:[],
            RouteOptions:[]

        };

        this.pullResources();
    }

    pullResources(){
             Get.Item()
             .then(r=>{
                 this.setState({ItemOptions:r});
             })
             .catch(err=>{
                 this.setState({errorState:true,errorMsg:"Couldn't fetch Items"});
             });
             
             Get.Route()
             .then(r=>{
                 this.setState({RouteOptions:r})
             })
             .catch(err=>{
                this.setState({errorState:true,errorMsg:"Couldn't fetch Route"});
             });
            

    }

    handleRouteChange(e){
            const v=Number(e.target.value);
            const f=new FormData();
            f.append("route_operations",v);
            MakePostFetch(End.master.operation.read,f,true)
            .then(r=>{
                if(r.status==200){
                    this.setState({RouteOperations:r.result});
                }else throw Error("Couldn't fetch Route Operations");
            })
            .catch(err=>{
                this.setState({errorState:true,errorMsg:err.message});
            })
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
            <Form.Field>
                <label>Material Required</label>
                <RequireItemListChooser items={this.state.ItemOptions} /> 
            </Form.Field>
            <Form.Field required>
                <label>Route</label>
                <Select name="route" options={this.state.RouteOptions} id="route" placeholder="Choose from Routes" > </Select>
            </Form.Field>
            <Form.Field>
                <OperationListChooser readonly selectedOperations={this.state.RouteOperations} />
            </Form.Field>    
            <Form.Field required>
                <textarea name="description" id="description" rows="5" placeholder="Add some description" ></textarea>
            </Form.Field>
            <Button primary onClick={this.handleClick.bind(this)} >{(create)?"Add":"Modify"}</Button>
        </Form>;
        return (this.state.successState)?<SuccessCard/>:form;
    }

}


export class RequireItemListChooser extends Component{
    constructor(props){
        super(props);
        this.readonly='readonly' in props;
        this.state={
            selections:(this.readonly)?props.materialList:[]
        };
        
    }

    handleAdd(e){
        const d= document.getElementById;
       const o={
           item:Number(d("cur_item").value),
           qty:Number(d("cur_qty").value),
           rate:Number(d("cur_rate").value)
       };
       const ar=this.state.selections;
       
       const [i]=this.props.items.filter((v,i)=>{
           return v.id==o.item
       });

       const x={
           qty,rate,
            item_name:i.name,
           ...i
       };
       ar.push(x); //appending new entry
       this.setState({selections:ar});
       d("cur_item").value="";
       d("cur_qty").value="";
       d("cur_rate").value="";
       

    }

    render(){

        const rows=this.state.selections.map((v,i)=>{

            const handleRemove=x=>{
                    const ar=this.state.selections.filter((y,yx)=>{
                        return yx!=i;    
                    });

                    this.setState({selections:ar});
            }

            return <Table.Row key={i}>
                    <Table.Cell>
                        {v.item_name}
                    </Table.Cell>
                    <Table.Cell>
                        {v.qty}
                    </Table.Cell>
                    <Table.Cell>
                        {v.rate}
                    </Table.Cell>
                    <Table.Cell>
                        {v.rate*v.qty}
                    </Table.Cell>

                    {(this.readonly)?<></>:<Table.Cell>
                        <Icon name="times" onClick={handleRemove} /> 
                    </Table.Cell>}
            </Table.Row>   
        })
        const rowAdder=<Table.Row>
            <Table.Cell>
            <Select options={this.props.items} id="cur_item" placeholder='Choose Item/Sub Assembly' >
            </Select>   
            </Table.Cell>
            <Table.Cell>
                <Form.Input type="number" id="cur_qty" required label="Quantity"  name="qty" placeholder="Quantity Required" />
            </Table.Cell> 
            <Table.Cell>
                <Form.Input type="number"  id="cur_rate" label="Rate"  name="rate" placeholder="Rate" />
            </Table.Cell> 
            <Table.Cell>
                <Button onClick={this.handleAdd} primary>Add</Button>
            </Table.Cell>
        </Table.Row>


        return <Table>
            <Table.Row>
                <Table.Header>
                    <Table.Cell>
                       Item
                    </Table.Cell>
                    <Table.Cell>
                       Qty
                    </Table.Cell>
                    <Table.Cell>
                       Rate
                    </Table.Cell>
                    <Table.Cell>
                        Amount
                    </Table.Cell>
                </Table.Header>
            </Table.Row>
            <Table.Body>
                {(this.readonly)?<></>:rowAdder}
                {rows}
            </Table.Body>
        </Table>

    }
}

RequireItemListChooser.propTypes={
    /**
     * Array of items
     * 
     */
    items:PropTypes.array,
    /**
     * Specify is readonly or not
     */
    readonly:PropTypes.boolean,

    /**
     * List of Required Material Required List
     */
    materialList:PropTypes.array


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
