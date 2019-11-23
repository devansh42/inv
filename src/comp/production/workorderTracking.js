//This component Rendered Workorder Tracking 
import React, { useState, useEffect } from "react";
import { MakePostFetch } from "../../network";
import { KVTable } from "../production/kv";
import End from "../../end";
import { Form, Statistic, Grid, Card, Feed, Icon, Step, Header, List, Segment, Tab, Menu, Table, Label } from "semantic-ui-react";
import PropType from "prop-types";
import { Link, Switch, Route } from "react-router-dom";
import { ProcessStates, GetProcessStateText, GetProcessStateColor } from "../../Fixed";
import Apm from "../../apm";



/**
 * Takes raw job card array associated with given workorder
 * and 
 * @returns array block of job cards group by entity 
 * @param {Array} js 
 */
const process_JobCard = js => {
    const p = [];
    js.forEach((v, i) => {
        //Retriving entity Ids 
        if (p.indexOf(v.entityId) == -1) p.push(v.entityId);
    });
    const units = [] //contains job card data unit wise
    p.forEach((v, i) => {
        units.push(js.filter(vv => vv.entityId == v))
    });
    return units

}

export function WorkorderTrackerWrapper(props) {
    const { match: { params } } = props;
    return <WorkorderTracker workorderId={params.wid} />
}


function WorkorderTracker({ workorderId }) {
    const fetched = true;
    const [units, setUnits] = useState([]);
    const [routing, setRouting] = useState([]);
    const [payload, setPayload] = useState({});

    useEffect(() => {
        const f = new FormData();
        f.append("id", workorderId);
        MakePostFetch(End.production.workorder.read, f, true)
            .then(r => {
                if (r.status == 200) {
                    return r.json();
                } else throw Error("Couldn't fetch Workorder Details");
            })
            .then(r => {
                const x = r.result instanceof Array ? r.result[0] : r.result;
                setPayload(x);
                return x;
            })
            .catch(err => {
                //handle errors so far
            })
            .then(payload => {
                console.log(payload);
                const f = new FormData();
                f.append("id", payload.bom);
                return MakePostFetch(End.production.bom.read, f, true)
            })
            .then(r => {
                if (r.status == 200) {
                    return r.json()
                } else throw Error("Couldn't fetch Routing Information");
            })
            .then(r => {
                return r.result;
            })
            .then(r => {
                const f = new FormData();
                f.append("id", r.routing);
                return MakePostFetch(End.master.route.read, f, true)

            })
            .then(r => {
                if (r.status == 200) return r.json();
                else throw Error("Couldn't fetch Routing Information");
            })
            .then(r => {
                setRouting(r.result.map(v => v.operation));
            })
            .catch(err => {
                //Handle Errors
            })

    }, [fetched, workorderId]);

    useEffect(() => {
        const f = new FormData();
        f.append("workorder", workorderId);
        MakePostFetch(End.production.job.read, f, true)
            .then(r => {
                if (r.status == 200) return r.json();
                else throw Error("Couldn't fetch Job Cards");
            })
            .then(r => {
                return r.result.map(v => {
                    v.entityId = (v.entityId == null) ? v.plId : v.entityId;
                    return v;
                });
            })
            .then(r => {
                setUnits(process_JobCard(r));
            })
            .catch(err => {
                //Handling error
            })
    }, [fetched, workorderId]);


    const toStr = (s) => {
        return (s == null) ? "" : new Date(s).toLocaleString();
    }
    const _color = ProcessStates.filter(v => v.key == payload.state)[0];
    const color = _color == undefined ? "grey" : _color.color;
    return <Grid centered>
        <Grid.Row>
            <Grid.Column >
                <Segment color={color}>
                    <Form>
                        <Header content={"Workorder Status - ".concat(GetProcessStateText(payload.state))} dividing />
                        <Form.Group>
                            <Form.Input readOnly label='Workorder' defaultValue={"#".concat(workorderId)} />
                            <Form.Input readOnly label="Item" defaultValue={payload.item_name} />
                            <Form.Input readOnly label="BOM" defaultValue={payload.bom_name} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Input readOnly label="Post Date" defaultValue={toStr(payload.post_date)} />
                            <Form.Input readOnly label="Start Time" defaultValue={toStr(payload.st_date)} />
                            <Form.Input readOnly label="Finish Time" defaultValue={toStr(payload.de_date)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Input readOnly label="Quantity" defaultValue={payload.qty} />
                            <Statistic>
                                <Statistic.Label>Completed Qty.</Statistic.Label>
                                <Statistic.Value >{payload.com_qty}</Statistic.Value>
                            </Statistic>
                        </Form.Group>

                    </Form>
                </Segment>

            </Grid.Column>
        </Grid.Row>

        <Item.UnitList routing={routing} units={units} item_name={payload.item_name} />

    </Grid>



}

WorkorderTracker.propTypes = {
    /**
     * This is the workorder id
     */
    workorderId: PropType.number
}


/**
 * List of Production Item unit
 * @param {ReactProps} props 
 */
function UnitList({ units, routing, item_name, ...props }) {

    const panes = units.map((v, i) => {
        return {
            key: i, menuItem: "Item - ".concat(v[0].entityId),
            render: () => {
                return <>
                    <Item.Routing operations={v} entityId={v[0].entityId} />
                    <Item.Properties key={i} entityId={v[0].entityId} />
                </>
            }
        }
    })

    return <Grid.Row>

        <Grid.Column>
            <Segment>
                <Header dividing>Unit wise Status/Properties</Header>
                <Tab grid={{ paneWidth: 12, tabWidth: 2 }} menu={{ fluid: true, vertical: true, pointing: true }} panes={panes} />
            </Segment>

        </Grid.Column>
    </Grid.Row>
}
UnitList.propTypes = {
    /**
     * name of the item under production
     */
    item_name: PropType.string,
    units: PropType.array

}


/**
 * Component for Item Unit
 * @param {*} param0 
 */
function ItemUnit({ entityId, routing, blob, ...props }) {
    const ops = blob.map(v => v.operation);
    const color = (x, y) => {
        return (x == y) ? "green" : (x == 0) ? "grey" : "yellow";
    }//(ops.length,routing.length);

    return <Menu.Item>
        <Icon name="circle" color={color(ops.length, routing.length)} />
        Item -
    {"#".concat(entityId)}
    </Menu.Item>


}
ItemUnit.propTypes = {
    entityId: PropType.number,
    plId: PropType.number
}

const Item = {
    Routing: ItemRouting,
    Operation: ItemOperation,
    Unit: ItemUnit,
    UnitList: UnitList,
    Properties: ItemProps

}



/**
 *List of Job card associated with given unit in routing order   
 * @param {ReactProps} props 
 */
function ItemRouting({ operations, entityId, ...props }) {

    return <Segment>
        <Header content={`Operation(s) Status`} />
        <Table >
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>
                        Operation
                </Table.HeaderCell>
                    <Table.HeaderCell>
                        Status
                </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>

                {operations.map(v => <Item.Operation state={v.state} name={v.operation_name} job_card={v.id} />)}

            </Table.Body>
        </Table>
    </Segment>
}

/**
 * 
 * @param {*} props 
 */
function ItemOperation({ name, job_card, state }) {

    return <Table.Row >
        <Table.Cell>
            <Link to={Apm.production.job.concat("/track/").concat(job_card)} >{name}</Link>
        </Table.Cell>
        <Table.Cell >
           <Label color={GetProcessStateColor(state)} > {GetProcessStateText(state)}
           </Label>
        </Table.Cell>
    </Table.Row>


}


function ItemProps({ entityId, ...props }) {
    const [kvPairs, setKvPairs] = useState([]);
    useEffect(() => {
        const f = new FormData();
        f.append("id", entityId);
        MakePostFetch(End.master.kv.read, f, true)
            .then(r => {
                if (r.status === 200) {
                    return r.json();
                } else throw Error("Couldn't fetch Properties of Item");
            })
            .then(r => r.result)
            .then(r => {
                setKvPairs(r);
            })
            .catch(err => {
                //Handle Error
            });
    }, [entityId])

    return <KVTable header="Properties" entityId={entityId} readOnly kv_pairs={kvPairs} />
}