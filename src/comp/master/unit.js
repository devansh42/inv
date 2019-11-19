//This file contains code for unit createion

import React, { Component } from "react";
import { Form, Icon, Message, Button, Card, Header, Table } from "semantic-ui-react";
import { Link } from 'react-router-dom';
import { MakePostFetch } from "../../network";
import End from "../../end";
import { RecordList } from '../common/recordList';
export function UnitList(props) {
    const mapFn = (v, i) => {
        const { name, symbol, id } = v;
        return <Table.Row key={i}>
            <Table.Cell>
                <Link title="Edit this Record" to={End.master.unit.modify + "/" + id}>
                    <Icon name="edit"></Icon>
                </Link>
            </Table.Cell>
            <Table.Cell>
                {name}
            </Table.Cell>
            <Table.Cell>
                {symbol}
            </Table.Cell>

        </Table.Row>
    }

    const fetcher = () => {
        return MakePostFetch(End.master.unit.read, new FormData(), true)
    }
    const headers = [
        "", "Name", "Symbol"
    ];

    return <RecordList headers={headers} title="Unit(s)" mapFn={mapFn} fetchPromise={fetcher} />

}


export class UnitForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorState: false,
            errorMsg: null,
            btnDisable: false,
            btnLoading: false,
            successState: false,
            name: props.name,
            symbol: props.symbol
        };
    }


    handleSubmit(e) {
        let valid, errorMsg = null;
        let d = document.getElementById;
        let o = {
            name: d("name").value,
            symbol: d("symbol").value
        };
        let oe = {
            name: /\w{2,30}/,
            symbol: /\w{1,5}/
        };
        if (o.name.match(oe.name) === null) {
            errorMsg = "Invalid Name (2-30) Character, e.g. Meter";
        }
        else if (o.symbol.match(oe.symbol) === null) {
            errorMsg = "Invalid Symbol (1-5) Character, e.g. Mtr";
        }
        valid = errorMsg === null;
        if (valid) {
            let form = d("unitForm");
            this.setState({ name: o.name, symbol: o.symbol });

            if (this.props.create) {
                MakePostFetch(End.master.unit.create, form).then(r => { });
            } else {
                let p = this.props;
                if (p.name === o.name && p.symbol === o.symbol) {
                    //no need to modify
                    this.setState({ successState: true });
                } else {
                    MakePostFetch(End.master.unit.modify, form).then(r => { });
                }
            }

        } else {
            this.setState({ errorState: true, errorMsg });
        }
    }

    render() {
        let form = <Form id='unitForm' error={this.state.errorState}>
            <Header header={(this.props.create) ? "Create Unit" : "Modify Unit"} dividing></Header>
            <Form.Input required name="name" title="Unit Name" type="text" label="Unit Name" placeholder='e.g. Meter' />
            <Form.Input required name="symbol" tilte="Unit Symbol" type="text" label="Unit Symbol" placeholder="e.g. Mtr" />
            <Message error header="There is a Problem!!" content={this.state.errorMsg}></Message>
            <Button onClick={this.handleSubmit.bind(this)} primary loading={this.state.btnLoading} disabled={this.state.btnDisable} >{this.props.create ? "Create" : "Modify"}</Button>
        </Form>;

        return (this.state.successState) ? <SuccessMessage name={this.state.name} symbol={this.state.symbol} /> : form;

    }
}

function SuccessMessage(props) {
    return (
        <>
            <Message header="Success!!" content={this.props.create ? "Unit Created" : 'Unit Modified'}></Message>
            <Card>
                <Card.Content>
                    <Card.Header>
                        {props.name}
                    </Card.Header>
                    <Card.Meta>
                        Unit
               </Card.Meta>
                    <Card.Description>
                        {props.symbol}
                    </Card.Description>
                </Card.Content>
            </Card>
        </>
    )
}