//This file contains code for workorder creation

import React, { Component } from "react";
import { Form, Table, Icon, Header, Select, Button, Divider } from "semantic-ui-react";
import { Get, MakePostFetch, FormErrorHandler } from "../../network";
import End from "../../end";
import { OperationListChooser } from "../master/route";
import { ProcessStates } from "../../Fixed";
import { Link } from "react-router-dom";
import { RecordList } from "../common/recordList";
import { RequireItemListChooser } from "./bom";
export function WorkOrderList(props) {


    const getorderStatus = v => {
        for (let x in ProcessStates) {
            if (v === ProcessStates[x].key) return ProcessStates[x].text;
        }
        return "";
    }

    const mapFn = (v, i) => {
        const { item_name, qty, bom_name, state, id } = v;
        return <Table.Row key={i}>
            <Table.Cell>
                <Link title="Edit this Record" to={End.production.workorder.modify + "/" + id}>
                    <Icon name="edit"></Icon>
                </Link>
            </Table.Cell>
            <Table.Cell>
                {"#".concat(id)}
            </Table.Cell>
            <Table.Cell>
                {item_name}
            </Table.Cell>
            <Table.Cell>
                {qty}
            </Table.Cell>
            <Table.Cell>
                {bom_name}
            </Table.Cell>
            <Table.Cell>
                {getorderStatus(state)}
            </Table.Cell>
        </Table.Row>
    };
    const headers = [
        "", "Id", "Item", "Quantity", "Bill of Matreial", "State"
    ];
    const fetcher = () => {
        return MakePostFetch(End.production.workorder.read, new FormData(), true)
    }

    return <RecordList headers={headers} title="Account(s)" mapFn={mapFn} fetchPromise={fetcher} />

}

export class WorkOrderForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorState: false,
            errorMsg: null,
            btnDisable: false,
            btnLoading: false,
            successState: false,
            ItemOptions: [],
            BomOptions: [],
            SubAssemblyList: [],
            RouteOperations: []



        };

        this.pullResources();
    }

    pullResources() {
        Get.Item()
            .then(r => {
                this.setState({ ItemOptions: r });
            })
            .catch(err => {
                this.setState({ errorState: true, errorMsg: err.message });
            })
    }

    handleItemSelection(e) {
        const v = Number(e.target.value);
        const f = new FormData();
        f.append("item", v);

        MakePostFetch(End.production.bom.read, f, true)
            .then(r => {
                if (r.status === 200) {
                    return r.json();
                }
                else throw Error("Couldn't fetch BOMs for item");

            })
            .then(r=>{
                return r.result.map(v => {
                    return { key: v.id, value: v.id, ...v }
                });
            
            })
            .then(r=>{
                this.setState({BomOptions:r});
            })
            .catch(FormErrorHandler.bind(this))
    }

    bomChanger(e) {
        const v = Number(e.target.value);

        const f = new FormData();
        f.append("bom_material", v);
        MakePostFetch(End.production.bom.read, f, true)
            .then(r => {
                if (r.status === 200) {
                    return r.json()
                }
                else throw Error("Couldn't fetch Sub Assembly/Required Items List")
            })
            .then(r => {
                this.setState({ SubAssemblyList: r.result });
            })
            .catch(FormErrorHandler.bind(this));

        f.delete("bom_material");

        const [bom] = this.state.BomOptions.filter(x => {
            return v === x.id;
        });

        f.append("route_operations", bom.routing);
        MakePostFetch(End.master.route.read, f, true)
            .then(r => {
                if (r.status === 200) {
                    return r.json()
                }
            })
            .then(r => {
                this.setState({ RouteOperations: r.result })
            })
            .catch(FormErrorHandler.bind(this))


    }
    handleClick(e){
        
    }

    render() {
        const { create } = this.props;
        const form = <Form id='woForm'>
            <Header dividing> {(create) ? 'Add WorkOrder' : "Modify Workorder"} </Header>
            <Form.Field required>
                <label>Item to Manufacture</label>
                <Select name="item" onChange={this.handleItemSelection} id='item' placeholder="Choose Item to manufacture" options={this.state.ItemOptions}></Select>
            </Form.Field>
            <Divider/>
            <Form.Input required name="qty"  label="Quantity" type="number" placeholder="Quantity to Manage" id="qty" />
            <Form.Field required>
                <label>Bill of Material</label>
                <Select name="bom" id="bom" onChange={this.bomChanger} options={this.state.BomOptions} placeholder="Choose BOM"></Select>
            </Form.Field>
            <Form.Field>
                <label>Sub Assembly/Required Item</label>
                <RequireItemListChooser readonly materialList={this.state.SubAssemblyList} />
            </Form.Field>

            <Form.Field>
                <label>Route/Operations</label>
                <OperationListChooser readonly selectedOperations={this.state.RouteOperations} />
            </Form.Field>
            <Divider/>
            
            <Form.Group>
                    <Form.Input required name="post_date"  label="Post Date" id="post_date" type="datetime" title="Work order Post date" />
                    <Form.Checkbox label="Enable Multilevel BOM" name="nbom" id="nbom" inline />

            </Form.Group>

            <Form.Group>
                    <Form.Input label="Expected Start Date" type='datetime' name="st_date" id="st_date" />
                    <Form.Input label="Expected Delivery Date" name="de_date" type='datetime' id="de_date" />
            </Form.Group>
            <Divider/>
            
            <Button onClick={this.handleClick.bind(this)} primary>
                {(create) ? "Add" : "Modify"} WorkOrder
            </Button>
        </Form>
        return form;
    }

}