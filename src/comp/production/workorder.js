//This file contains code for workorder creation

import React, { Component } from "react";
import { Form, Table, Icon, Message, Card, Header, Button, Divider } from "semantic-ui-react";
import { Get, MakePostFetch, FormErrorHandler, FormResponseHandlerWithLoadingDisabler } from "../../network";
import End from "../../end";
import { OperationListChooser } from "../master/route";
import { ProcessStates } from "../../Fixed";
import { Link } from "react-router-dom";
import { RecordList } from "../common/recordList";
import { RequireItemListChooser } from "./bom";
import { CustomSelect,CustomCheckbox, HeaderLink, $, SuccessMessage } from "../common/form";
import Apm from "../../apm";
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
            <Table.Cell width={1}>
                <Link title="Edit this Record" to={End.production.workorder.modify + "/" + id}>
                    <Icon name="edit"></Icon>
                </Link>
            </Table.Cell>
            <Table.Cell>
                    <Link to={Apm.production.workorder.concat("/track/").concat(id)} >
                 {"#".concat(id)}
                 </Link>
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
        "", "Id", 
            <HeaderLink header="Item" link={Apm.master.item.concat("/read")} />
        , "Quantity", 
        <HeaderLink header="Bill of Matreial" link={Apm.production.bom.concat("/read")} />
        , "State"
    ];
    const fetcher = () => {
        return MakePostFetch(End.production.workorder.read, new FormData(), true)
    }

    return <RecordList headers={headers} title="WorkOrder(s)" mapFn={mapFn} fetchPromise={fetcher} />

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

    handleItemSelection(e,d) {
     const v = Number(d.value);
        const f = new FormData();
        f.append("item", v);

        MakePostFetch(End.production.bom.read, f, true)
            .then(r => {
                if (r.status === 200) {
                    return r.json();
                }
                else throw Error("Couldn't fetch BOMs for item");

            })
            .then(r => {
                return r.result.map(v => {
                    return { key: v.id, text:v.name ,value: v.id, ...v }
                });

            })
            .then(r => {
                this.setState({ BomOptions: r });
            })
            .catch(FormErrorHandler.bind(this))
    }

    bomChanger(e,d) {
        const v = Number(d.value);

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
            return v == x.id;
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
    handleClick(e) {
        let errorState = false;
        let errorMsg = null;
        const d = $;
        const number = /^\d+$/
        const o = {
            item: [d("item").value.trim(), number],
            qty: [d("qty").value.trim(), number],
            bom: [d("bom").value.trim(), number],
            postdate: [d("post_date").valueAsNumber],
        }
        if (o.item[0].match(o.item[1]) == null) {
            errorMsg = "Please choose an item";
        }
        else if (this.state.ItemOptions.filter(v => v.value === Number(o.item[0])).length < 1) {
            errorMsg = "Please choose an item from List";

        }
        else if ( isNaN(Number(o.qty[0]))) {
            errorMsg = "Please enter valid quantity";
        }
        else if (o.bom[0].match(o.bom[1]) === null) {
            errorMsg = "Please choose valid BOM ";
        }
        else if (this.state.BomOptions.filter(v => v.value === Number(o.bom[0])).length < 1) {
            errorMsg = "Please choose BOM from given List"
        }
        else if (isNaN(Number(o.postdate[0]))) {
            errorMsg = "Please set a Workorder Posting Date";
        }
        errorState = errorMsg !== null;
        if (errorState) {
            this.setState({ errorState, errorMsg });
        } else {
            this.setState({ btnDisable: true, btnLoading: true });
            if (this.props.create) {
                MakePostFetch(End.production.workorder.create, d("woForm"), true)
                    .then(FormResponseHandlerWithLoadingDisabler.bind(this))
                    .then(r => {
                        this.setState({ successState: true,id:r.wid });
                    })
                    .catch(FormErrorHandler.bind(this));

                //

            } else {

                //Modification case
            }
        }
    }

    render() {
        const { create } = this.props;
        const form = <Form error={this.state.errorState} name="woForm" id='woForm'>
            <Header dividing> {(create) ? 'Add WorkOrder' : "Modify Workorder"} </Header>
            <Form.Field required>
                <label>Item to Manufacture</label>
                <CustomSelect name="item" onChange={this.handleItemSelection.bind(this)} id='item' placeholder="Choose Item to manufacture" options={this.state.ItemOptions}></CustomSelect>
            </Form.Field>
            <Divider />
                <Form.Group>
            <Form.Input width={8} required name="qty" label="Quantity" type="number" placeholder="Quantity to Manage" id="qty" />
            <Form.Input required width={8} name="post_date" label="Post Date/Time" id="post_date" type="datetime-local" title="Work order Post date" />
            </Form.Group>
            <Form.Field required>
                <label>Bill of Material</label>
                <CustomSelect name="bom" id="bom"  onChange={this.bomChanger.bind(this)} options={this.state.BomOptions} placeholder="Choose BOM"></CustomSelect>
            </Form.Field>
            <Form.Field>
                <label>Sub Assembly/Required Item</label>
                <RequireItemListChooser readonly materialList={this.state.SubAssemblyList} />
            </Form.Field>

            <Form.Field>
                <label>Route/Operations</label>
                <OperationListChooser readonly selectedOperations={this.state.RouteOperations} />
            </Form.Field>
            <Divider />

                 <CustomCheckbox label="Enable Multilevel BOM" name="nbom" id="nbom" inline />


                 <Divider />

                <Message error header="There is a problem!!" content={this.state.errorMsg} />
            
            <Divider />

            <Button onClick={this.handleClick.bind(this)} loading={this.state.btnLoading} disabled={this.state.btnDisable} primary>
                {(create) ? "Add" : "Modify"} WorkOrder
            </Button>
        </Form>
        return (this.state.successState) ? <SuccessC id={this.state.id}  create={this.props.create} /> : form;
    }

}



function SuccessC({ id, create }) {
    return <SuccessMessage header={(create) ? "Workorder Added" : "Workorder Modified"}>
        <Card>
            <Card.Content>
                <Card.Header>{"#".concat(id)}</Card.Header>
                <Card.Meta>WorkOrder</Card.Meta>

            </Card.Content>
        </Card>
    </SuccessMessage>
}
