//This file contains bom of an product to manufacture

import React, { Component } from "react";
import { Message, Card, Header, Icon, Button, Form, Select, Table, Divider } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Get, MakePostFetch, FormErrorHandler, FormResponseHandlerWithLoadingDisabler } from "../../network";
import End from "../../end";
import { RecordList } from "../common/recordList";
import { OperationListChooser } from "../master/route";
import PropTypes from "prop-types";

export function BomList(_) {

    const mapFn = (v, i) => {
        const { name, item_name, qty, route_name, description, id } = v;
        return <Table.Row key={i}>
            <Table.Cell>
                <Link title="Edit this Record" to={End.production.bom.modify + "/" + id}>
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
    const headers = [
        "", "Name", "Item", "Quantity", "Route", "Description"
    ];
    const fetcher = () => {
        return MakePostFetch(End.production.bom.read, new FormData(), true)
    }

    return <RecordList headers={headers} title="Bill of Material(s)" mapFn={mapFn} fetchPromise={fetcher} />

}


export class BomForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorState: false,
            errorMsg: null,
            btnDisable: false,
            btnLoading: false,
            successState: false,
            RouteOperations: [],
            ItemOptions: [],
            RouteOptions: []

        };

        this.pullResources();
    }

    pullResources() {
        Get.Item()
            .then(r => {
                this.setState({ ItemOptions: r });
            })
            .catch(err => {
                this.setState({ errorState: true, errorMsg: "Couldn't fetch Items" });
            });

        Get.Route()
            .then(r => {
                this.setState({ RouteOptions: r })

            })
            .catch(err => {
                this.setState({ errorState: true, errorMsg: "Couldn't fetch Route" });
            });


    }

    handleRouteChange(e) {
        const v = Number(e.target.value);
        const f = new FormData();
        f.append("route_operations", v);
        MakePostFetch(End.master.operation.read, f, true)
            .then(r => {
                if (r.status === 200) {
                    this.setState({ RouteOperations: r.result });
                } else throw Error("Couldn't fetch Route Operations");
            })
            .catch(err => {
                this.setState({ errorState: true, errorMsg: err.message });
            })
    }
    handleClick(e) {
        const d = x => document.getElementById(x);
        let errorState = false;
        let errorMsg = null;
        const o = {
            name: [d("name".value.trim()), /^\w+$/],
            item: [d("item").value.trim(), /^\d+$/],
            route: [d("route").value.trim(), /^\d+$/],
            qty: [d("qty").value.trim(), /^\d+$/]
        }
        if (o.name[0].match(o.name[1]) == null) {
            errorMsg = "Please enter a valid name";
        }
        else if (o.item[0].match(o.item[1]) == null) {
            errorMsg = "Please choose a valid Item to Produce";
        }
        else if (this.state.ItemOptions.filter(v => v.value ===  Number(o.item[0])).length < 1) {
            errorMsg = "Please choose Items from the list";
        }
        else if(o.qty[0].match(o.qty[1])===null || Number(o.qty[0])<=0 ){
            errorMsg="Please enter a valid Qty to produce";
        }
        else if (o.route[0].match(o.route[1]) === null) {
            errorMsg = "Please choose valid Route for Production"
        }
        else if (this.state.RouteOptions.filter(v => v.value === Number(o.route[0])).length < 1) {
            errorMsg = "Please route from the list";
        }
        errorState = errorMsg !== null;
        if(errorState){
            this.setState({errorMsg,errorState});
        }else{
                this.setState({btnLoading:true,btnDisable:true});
            if(this.props.create){
                MakePostFetch(End.production.bom.create,d("bomForm"),true)
                .then(FormResponseHandlerWithLoadingDisabler.bind(this))
                .then(r=>{
                    //Handling success
                    this.setState({successState:true});
                })
                .catch(FormErrorHandler.bind(this)); //Handling any kind of faliure
            }
        }
    }

    render() {
        const { create } = this.props;
        const form = <Form id="bomForm">
            <Header dividing>{(create) ? "Add BOM" : "Modify BOM"}</Header>
            <Form.Input required name="name" id="name" label="Name" placeholder="BOM Name" title="Unique name of your BOM" />
            <Form.Field required>
                <label>Item</label>
                <Select name="item" id="item" placeholder="Choose from Items" options={this.state.ItemOptions}></Select>
            </Form.Field>
            <Form.Input required name="qty" id="qty" label="Quantity" placeholder="Quantity to Manufacture" type="number" />
            <Divider />
            <Form.Field>
                <label>Material Required</label>
                <RequireItemListChooser items={this.state.ItemOptions} />
            </Form.Field>
            <Divider />

            <Form.Field required>
                <label>Route</label>
                <Select name="route" options={this.state.RouteOptions} id="route" placeholder="Choose from Routes" />
                <OperationListChooser readonly selectedOperations={this.state.RouteOperations} />
            </Form.Field>
            <Divider />

            <Form.Field >
            <label>Description</label>
                <textarea name="description" id="description" rows="5" placeholder="Add some description" ></textarea>
            </Form.Field>
            <Divider />

            <Button primary onClick={this.handleClick.bind(this)} >{(create) ? "Add BOM" : "Modify BOM"}</Button>
        </Form>;
        return (this.state.successState) ? <SuccessCard /> : form;
    }



}


export class RequireItemListChooser extends Component {
    constructor(props) {
        super(props);
        this.readonly = 'readonly' in props;
        this.state = {
            selections: (this.readonly) ? props.materialList : []
        };

    }

    handleAdd(e) {
        const d = document.getElementById;
        const o = {
            item: Number(d("cur_item").value),
            qty: Number(d("cur_qty").value),
            rate: Number(d("cur_rate").value)
        };
        const ar = this.state.selections;

        const [i] = this.props.items.filter((v, i) => {
            return v.id === o.item
        });

        const x = {
            qty: o.qty, rate: o.rate,
            item_name: i.name,
            ...i
        };
        ar.push(x); //appending new entry
        this.setState({ selections: ar });
        d("cur_item").value = "";
        d("cur_qty").value = "";
        d("cur_rate").value = "";


    }

    render() {

        const rows = this.state.selections.map((v, i) => {

            const handleRemove = x => {
                const ar = this.state.selections.filter((_, yx) => {
                    return yx !== i;
                });

                this.setState({ selections: ar });
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
                    {v.rate * v.qty}
                </Table.Cell>

                {(this.readonly) ? <></> : <Table.Cell>
                    <Icon name="times" onClick={handleRemove} />
                </Table.Cell>}
            </Table.Row>
        })
        const rowAdder = (this.readonly) ? <></> : <Table.Row>
            <Table.Cell>
                <Select options={this.props.items} id="cur_item" placeholder='Choose Item/Sub Assembly' >
                </Select>
            </Table.Cell>
            <Table.Cell>
                <Form.Input type="number" id="cur_qty" name="qty" placeholder="Quantity Required" />
            </Table.Cell>
            <Table.Cell>
                <Form.Input type="number" id="cur_rate" name="rate" placeholder="Rate" />
            </Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell>
                <Button onClick={this.handleAdd} primary>Add</Button>
            </Table.Cell>
        </Table.Row>


        return <Table><Table.Header>
            <Table.Row>
                <Table.HeaderCell>
                    Item
                    </Table.HeaderCell>
                <Table.HeaderCell>
                    Qty
                    </Table.HeaderCell>
                <Table.HeaderCell>
                    Rate
                    </Table.HeaderCell>
                <Table.HeaderCell>
                    Amount
                    </Table.HeaderCell>

            </Table.Row> </Table.Header>
            <Table.Body>
                {(this.readonly) ? <></> : rowAdder}
                {rows}
            </Table.Body>
        </Table>

    }
}

RequireItemListChooser.propTypes = {
    /**
     * Array of items
     * 
     */
    items: PropTypes.array,
    /**
     * Specify is readonly or not
     */
    readonly: PropTypes.bool,

    /**
     * List of Required Material Required List
     */
    materialList: PropTypes.array


}








function SuccessCard({ name, create }) {
    return <>
        <Message success content={(create) ? "BOM Added" : "BOM Modified"}>

        </Message>
        <Card>
            <Card.Content>
                <Card.Header>{name}</Card.Header>
                <Card.Meta>Bill of Materials</Card.Meta>
            </Card.Content>
        </Card>
    </>
}
