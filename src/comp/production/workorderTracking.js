//This component Rendered Workorder Tracking 
import React from "react";
import { MakePostFetch } from "../../network";
import { KVTable } from "../production/kv";
import End from "../../end";
import { Form, Statistic, Grid, Card, Feed, Icon, Step, Item } from "semantic-ui-react";
import PropType from "prop-types";
import { Link, Switch, Route } from "react-router-dom";



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

function WorkorderTracker({ workorderId }) {

    const payload = useEffect(() => {
        const f = new FormData();
        f.append("id", workorderId);
        return MakePostFetch(End.production.workorder.read, f, true)
            .then(r => {
                if (r.status == 200) {
                    return r.json();
                } else throw Error("Couldn't fetch Workorder Details");
            })
            .then(r => {
                return r.result;
            })
            .catch(err => {
                //handle error
            })


    }, [true]);
    const routing = useEffect(() => {
        const f = new FormData();
        f.append("id", payload.bom);
        return MakePostFetch(End.production.bom.read, f, true)
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
                return r.result.map(v => v.operation);
            })
            .catch(err => {
                //Handle Errors
            })
    }, [true]);

    const units = useEffect(() => {
        const f = new FormData();
        f.append("workorder", workorderId);
        return MakePostFetch(End.production.job.read, f, true)
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
                return process_JobCard(r);
            })
            .catch(err => {
                //Handling error
            })
    }, [true]);

    process_JobCard(job_cards);


    const toStr = (s) => {
        return (s == null) ? "" : new Date(s).toLocaleString();
    }

    return <div>
        <Form>
            <Form.Group>
                <Form.Input disabled label='Workorder' defaultValue={"#".concat(payload.id)} />
                <Form.Input disabled label="Item" defaultValue={payload.item_name} />
                <Form.Input disabled label="BOM" defaultValue={payload.bom_name} />
            </Form.Group>
            <Form.Group>
                <Form.Input disabled label="Post Date" defaultValue={toStr(payload.post_date)} />
                <Form.Input disabled label="Start Time" defaultValue={toStr(payload.st_date)} />
                <Form.Input disabled label="Due Time" defaultValue={toStr(payload.de_date)} />

                <Form.Input disabled label="Quantity" defaultValue={payload.qty} />
                <Statistic>
                    <Statistic.Label>Completed Qty.</Statistic.Label>
                    <Statistic.Value >{payload.com_qty}</Statistic.Value>
                </Statistic>

            </Form.Group>
        </Form>
        <div>

            <Grid>

                <Item.UnitList routing={routing} units={units} item_name={payload.item_name} />

            </Grid>

        </div>
    </div>

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
function unitList({ units, routing, item_name, ...props }) {

    return <>

        <Grid.Column>
            <Card>
                <Card.Content>
                    <Card.Header >
                        {item_name}
                    </Card.Header>
                </Card.Content>
                <Card.Content>
                    <Feed>
                        {units.map((v, i) => <Item.Unit routing={routing} key={i} blob={v} entityId={v[0].entityId} />)}
                    </Feed>
                </Card.Content>
            </Card></Grid.Column>
        <Grid.Column>
            <Switch>
                {units.map((v, i) => <Item.Routing key={i} operations={v} entityId={v[0].entityId} />)}
            </Switch>
        </Grid.Column>
        <Grid.Column>
            <Switch>
                {units.map((v, i) => <Item.Properties key={i} entityId={v[0].entityId} />)}
            </Switch>
        </Grid.Column>
    </>

}
unitList.propTypes = {
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
function itemUnit({ entityId, routing, blob, ...props }) {
    const ops = blob.map(v => v.operation);
    const color = (x, y) => {
        return (x == y) ? "green" : (x == 0) ? "grey" : "yellow";
    }//(ops.length,routing.length);

    return <Feed.Event>
        <Feed.Label>
            <Icon name="circle" color={color(ops.length, routing.length)} />
        </Feed.Label>
        <Feed.Content>
            <Link to={"/app/production/workorder/item/".concat(entityId)}>  {"#".concat(entityId)}</Link>
        </Feed.Content>
    </Feed.Event>

}
ItemUnit.propTypes = {
    entityId: PropType.number,
    plId: PropType.number
}

const Item = {
    Routing: itemRouting,
    Operation: itemOperation,
    Unit: itemUnit,
    UnitList: unitList,
    Properties: itemProps

}



/**
 *List of Job card associated with given unit in routing order   
 * @param {ReactProps} props 
 */
function itemRouting({ operations, entityId, ...props }) {
    return <Route path={"/app/production/workorder/item/".concat(entityId)}  ><Step.Group vertical>
        {operations.map(v => <Item.Operation state={v.state} name={v.operation_name} job_card={v.id} />)}
    </Step.Group></Route>

}

/**
 * 
 * @param {*} props 
 */
function itemOperation({ name, job_card, state }) {
    return <Step active={state === 2} completed={state === 4} disabled={state === 1} >
        <Step.Content>
            <Step.Title>
                {name}
            </Step.Title>
            <Step.Description>
                <Link to="">{"#".concat(job_card)}</Link>
            </Step.Description>
        </Step.Content>
    </Step>

}


function itemProps({ entityId, ...props }) {
    const kvPairs = useEffect(async () => {
        const f = new FormData();
        f.append("id", entityId);
        return MakePostFetch(End.master.kv.read, f, true)
            .then(r => {
                if (r.status === 200) {
                    return r.json();
                } else throw Error("Couldn't fetch Properties of Item");
            })
            .then(r => r.result)
            .catch(err => {
                //Handle Error
            },[true]);
    })

    return <Route path={"/app/production/workorder/item/".concat(entityId)}>
        <KVTable header="Properties" entityId={entityId} readOnly kv_pairs={kvPairs} />
    </Route>
}