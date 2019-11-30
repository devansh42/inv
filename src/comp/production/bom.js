//This file contains bom of an product to manufacture

import React, { Component } from "react";
import { Message, Card, Header, Icon, Button, Form, Table, Divider, Segment } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Get, MakePostFetch, FormErrorHandler, FormResponseHandlerWithLoadingDisabler } from "../../network";
import End from "../../end";
import { RecordList } from "../common/recordList";
import { CustomSelect, HeaderLink, $$, $, SuccessMessage } from "../common/form";
import { OperationListChooser } from "../master/route";
import PropTypes from "prop-types";
import Apm from "../../apm";
import { withReadOnlySupport } from "../common/readOnly";
import { InfoDoc } from "../common/info";

export function BomList(_) {

    const mapFn = (v, i) => {
        const { routing, name, item_name, qty,item, route_name, description, id } = v;
        return <Table.Row key={i}>
            <Table.Cell width={1}>
                <Link title="Edit this Record" to={Apm.production.bom + "/modify/" + id}>
                    <Icon name="edit"></Icon>
                </Link>
            </Table.Cell>
            <Table.Cell>
            <HeaderLink header={name} link={Apm.production.bom+"/info/"+id} />
           
            </Table.Cell>
            <Table.Cell>
            <HeaderLink header={item_name} link={Apm.master.item+"/info/"+item} />
           
            </Table.Cell>
            <Table.Cell>
                {qty}
            </Table.Cell>
            <Table.Cell>
            <HeaderLink header={route_name} link={Apm.master.route+ "/info/"+routing} />
           
            </Table.Cell>
            <Table.Cell>
                {description}
            </Table.Cell>
        </Table.Row>
    };
    const headers = [
        "", "Name",
        <HeaderLink header="Item" link={Apm.master.item.concat("/read")} />

        , "Quantity",
        , <HeaderLink header="Route" link={Apm.master.route.concat("/read")} />

        , "Description"
    ];
    const fetcher = () => {
        return MakePostFetch(End.production.bom.read, new FormData(), true)
    }

    return <RecordList headers={headers} title="Bill of Material(s)" mapFn={mapFn} fetchPromise={fetcher} />

}


export function DocBOM(props){
    return <InfoDoc header="Bill of Material(s)">
        BOM is the Document which contains production detail to manufacture items.
       <br/>It contains <b>Route</b> to follow Production Flow. It also contains Material List (The list of <b>Item</b> to be used in production).
        It depends on <b>Item</b>, <b>Route</b>, <b>Operation</b>
    </InfoDoc>
}

export function ReadOnlyBOMWrapper({ match: { params: { id } } }) {
    const f = new FormData();
    f.append("id", id);
    const f1 = new FormData();
    f1.append("bom_material", id);
    const f2 = new FormData();
    f2.append("operation", id);
    const d = ({ payload, ...props }) => {
        const p = payload;
        return <>

            <Form.Input defaultValue={p.name} readOnly name="name" id="name" label="Name" placeholder="BOM Name" title="Unique name of your BOM" />
            <Form.Group>
                <Form.Input width={8} defaultValue={p.item_name} label='Item' readOnly />
                <Form.Input width={8} readOnly defaultValue={p.qty} name="qty" id="qty" label="Quantity" placeholder="Quantity to Manufacture" type="number" />
            </Form.Group>
            <Form.Input label="Route" readOnly defaultValue={p.route_name} />
            <Form.Field >
                <label>Description</label>
                <textarea name="description" readOnly id="description" rows="5" placeholder="Add some description" ></textarea>
            </Form.Field>

            <Divider />





        </>
    }

    const dd = ({ payload, ...props }) => {
        return <>

            <Form.Field readOnly>
                <RequireItemListChooser materialList={payload} readOnly />
            </Form.Field>
            <Divider />
        </>
    }

    const ddd = ({ payload, ...props }) => {
        return <Form.Field >
            <OperationListChooser readOnly selectedOperations={payload} />
        </Form.Field>



    }


    const E = withReadOnlySupport(d, "Bill of Material (BOM)", End.production.bom.read, f);
    const F = withReadOnlySupport(dd, "Required Material", End.production.bom.read, f1);
   const G = withReadOnlySupport(ddd, "Route Operation(s)", End.production.bom.read, f2);

    return <Segment.Group>
         <E/><F/><G/>
    </Segment.Group>
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
        this.requiredMaterialList = [];
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

    setRequiredMaterialList(ar) {
        this.requiredMaterialList = ar;
    }
    handleRouteChange(e, d) {
        const v = Number(d.value);
        const f = new FormData();
        f.append("route_operations", v);
        MakePostFetch(End.master.operation.read, f, true)
            .then(r => {
                if (r.status === 200) {
                    return r.json();
                } else throw Error("Couldn't fetch Route Operations");
            })
            .then(r => {
                console.log(r.result);
                this.setState({ RouteOperations: r.result });

            })
            .catch(FormErrorHandler.bind(this))
    }
    handleClick(e) {
        const d = $;
        let errorState = false;
        let errorMsg = null;
        const o = {
            name: [d("name").value.trim(), /^\w+$/],
            item: [d("item").value.trim(), /^\d+$/],
            route: [d("route").value.trim(), /^\d+$/],
            qty: [d("qty").value.trim(), /^\d+$/]
        }
        if (o.name[0].length < 1) {
            errorMsg = "Please enter a valid name";
        }
        else if (isNaN(Number(o.item[0]))) {
            errorMsg = "Please choose a valid Item to Produce";
        }
        else if (this.state.ItemOptions.filter(v => v.value === Number(o.item[0])).length < 1) {
            errorMsg = "Please choose Items from the list";
        }
        else if (o.qty[0].match(o.qty[1]) === null || Number(o.qty[0]) <= 0) {
            errorMsg = "Please enter a valid Qty to produce";
        }
        else if (o.route[0].match(o.route[1]) === null) {
            errorMsg = "Please choose valid Route for Production"
        }
        else if (this.state.RouteOptions.filter(v => v.value === Number(o.route[0])).length < 1) {
            errorMsg = "Please route from the list";
        }
        errorState = errorMsg !== null;
        if (errorState) {
            this.setState({ errorMsg, errorState });
            console.log("Error");
        } else {
            this.setState({ btnLoading: true, name: o.name[0], btnDisable: true });
            if (this.props.create) {
                const l = {
                    name: o.name[0],
                    item: Number(o.item[0]),
                    qty: Number(o.qty[0]),
                    route: Number(o.route[0]),
                    description: $$("description").value.trim(),
                    materialList: this.requiredMaterialList
                };
                MakePostFetch(End.production.bom.create, JSON.stringify(l), true)
                    .then(FormResponseHandlerWithLoadingDisabler.bind(this))
                    .then(r => {
                        //Handling success
                        this.setState({ successState: true });
                    })
                    .catch(FormErrorHandler.bind(this)); //Handling any kind of faliure
            }
        }
    }


    render() {
        const { create } = this.props;
        const form = <Form error={this.state.errorState} noValidate id="bomForm" name="bomForm"  >
            <Header dividing>{(create) ? "Add BOM" : "Modify BOM"}</Header>

            <Form.Input required name="name" id="name" label="Name" placeholder="BOM Name" title="Unique name of your BOM" />
            <Form.Group>
                <Form.Field width={8} required>
                    <label>Item</label>
                    <CustomSelect name="item" id="item" placeholder="Choose from Items" options={this.state.ItemOptions}></CustomSelect>
                </Form.Field>
                <Form.Input width={8} required name="qty" id="qty" label="Quantity" placeholder="Quantity to Manufacture" type="number" />
            </Form.Group>

            <Divider />
            <Form.Field required>
                <label>Material Required</label>
                <RequireItemListChooser setError={this.setState.bind(this)} setRequiredMaterialList={this.setRequiredMaterialList.bind(this)} items={this.state.ItemOptions} />
            </Form.Field>
            <Divider />

            <Form.Field required>
                <label>Route</label>
                <CustomSelect name="route" onChange={this.handleRouteChange.bind(this)} options={this.state.RouteOptions} id="route" placeholder="Choose from Routes" />
                <OperationListChooser readOnly selectedOperations={this.state.RouteOperations} />
            </Form.Field>
            <Divider />

            <Form.Field >
                <label>Description</label>
                <textarea name="description" id="description" rows="5" placeholder="Add some description" ></textarea>
            </Form.Field>
            <Divider />
            <Message header="There is something wrong!!" error content={this.state.errorMsg}></Message>
            <Button primary disabled={this.state.btnDisable} loading={this.state.btnLoading} onClick={this.handleClick.bind(this)} >{(create) ? "Add BOM" : "Modify BOM"}</Button>
        </Form>;
        return (this.state.successState) ? <SuccessC create={this.props.create} name={this.state.name} /> : form;
    }



}


export class RequireItemListChooser extends Component {
    constructor(props) {
        super(props);
        this.readOnly = 'readOnly' in props;
        this.state = {
            selections: (this.readOnly) ? props.materialList : []
        };

    }

    handleAdd(e) {
        const d = $;
        const o = {
            item: Number(d("cur_item").value),
            qty: Number(d("cur_qty").value),
            rate: Number(d("cur_rate").value)
        };
        let errorMsg = null;
        if (isNaN(o.item) || o.item < 1 || this.props.items.filter((v, i) => v.id == o.item).length < 1) {
            errorMsg = "Please choose valid item from List";
        }
        else if (isNaN(o.qty) || o.qty < 0) {
            errorMsg = "Please enter valid Qty.";
        }
        else if (isNaN(o.rate) || o.rate < 0) {
            errorMsg = "Please enter valid rate of item";
        }
        if (errorMsg !== null) {
            this.props.setError({ errorMsg, errorState: true });
            return;

        } else {
            this.props.setError({ errorState: false });
        }

        const ar = this.state.selections;

        const [i] = this.props.items.filter((v, i) => {

            return v.value === Number(o.item)
        });
        const x = {
            qty: o.qty, rate: o.rate,
            item_name: i.name,
            ...i
        };
        ar.push(x); //appending new entry
        this.setState({ selections: ar });
        this.props.setRequiredMaterialList(ar);
        d("cur_item").value = "";
        d("cur_qty").value = "";
        d("cur_rate").value = "";


    }

    render() {
        const ar = (this.props.readOnly) ? this.props.materialList : this.state.selections;
        const rows = ar.map((v, i) => {

            const handleRemove = x => {
                const ar = this.state.selections.filter((_, yx) => {
                    return yx !== i;
                });

                this.setState({ selections: ar });
            }

            return <Table.Row key={v.id}>
                <Table.Cell>
                    {v.item_name}
                </Table.Cell>
                <Table.Cell >
                    {v.qty}
                </Table.Cell>
                <Table.Cell>
                    {v.unit_name}
                </Table.Cell>
                <Table.Cell>
                    {v.rate.toFixed(2)}
                </Table.Cell>
                <Table.Cell>
                    {(v.rate * v.qty).toFixed(2)}
                </Table.Cell>

                {(this.readOnly) ? <></> : <Table.Cell>
                    <Icon name="times" color="red" onClick={handleRemove} />
                </Table.Cell>}
            </Table.Row>
        })
        const rowAdder = (this.readOnly) ? <></> : <Table.Row>
            <Table.Cell>
                <CustomSelect options={this.props.items} name="cur_item" id="cur_item" placeholder='Choose Item/Sub Assembly' >
                </CustomSelect>
            </Table.Cell>
            <Table.Cell>
                <Form.Input type="number" id="cur_qty" name="cur_qty" placeholder="Quantity Required" />
            </Table.Cell>
            <Table.Cell>
                <Form.Input type="number" id="cur_rate" name="cur_rate" placeholder="Rate" />
            </Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell>
                <Button onClick={this.handleAdd.bind(this)} color={"grey"}  >Add</Button>
            </Table.Cell>
        </Table.Row>


        return <Table><Table.Header>
            <Table.Row>
                <Table.HeaderCell>
                    Item
                    </Table.HeaderCell>
                <Table.HeaderCell >
                    Qty
                    </Table.HeaderCell>
                <Table.HeaderCell>
                    Unit
                </Table.HeaderCell>
                <Table.HeaderCell>
                    Rate
                    </Table.HeaderCell>

                <Table.HeaderCell>
                    Amount
                    </Table.HeaderCell>

            </Table.Row> </Table.Header>
            <Table.Body>
                {(this.readOnly) ? <></> : rowAdder}
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
     * Specify is readOnly or not
     */
    readOnly: PropTypes.bool,

    /**
     * List of Required Material Required List
     */
    materialList: PropTypes.array,
    /**
     * sets required material list
     */
    setRequiredMaterialList: PropTypes.func

    , setError: PropTypes.func,


}








function SuccessC({ name, create }) {
    return <SuccessMessage header={(create) ? "BOM Added" : "BOM Modified"} >
        <Card>
            <Card.Content>
                <Card.Header>{name}</Card.Header>
                <Card.Meta>Bill of Materials</Card.Meta>
            </Card.Content>
        </Card>
    </SuccessMessage>
}
