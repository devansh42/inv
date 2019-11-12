//This file contains component  definition for key/value pair
import React,{useState} from "react";

/**
 * 
 * @param {ReactProps} props 
 */
function KVTable({ kv_pairs, entityId, header }) {
    const [kvpair, setKvpair] = useState(kv_pairs);
    const [errorState, setErrorState] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const addRow = e => {
        let x = kvpair;
        x.push({ mutable: true });
        setKvpair(x);
    };
    const removeRow = (i, backend) => {
        setKvpair(kvpair.filter((v, xi) => xi !== i));
        const { id } = kvpair[i];
        const f = new FormData();
        f.append("id", id);
        if (backend) {
            MakePostFetch(End.master.kv.delete, f, true)
                .then(r => {
                    if (r.status == 200) {
                        return r.json()
                    } else throw Error("Couldn't delete key value pair");
                })
                .then(r => {

                })
                .catch(err => {
                    setErrorState(true);
                    setErrorMsg(err.message);
                })
        }
    }
    const addKV = (k, v, index) => {
        const x = {
            kv_pairs: [
                { id: entityId, kv_key: k, kv_value: v }
            ]
        };
        MakePostFetch(End.master.kv.create, JSON.stringify(x), true)
            .then(r => {
                if (r.status == 200) {
                    return r.json();
                }
                else throw Error("Couldn't create Property");
            })
            .then(r => { //new prop added

                kvpair[index] = { kv_key: k, kv_value: v, mutable: false };
                setKvpair(kvpair); //rendering component

                return r.result
            })
            .catch(err => {
                setErrorState(true);
                setErrorMsg(err.message);
            });
    }

    return <>
        <Header content={header} />
        <Table>
            <Table.Row>
                <Table.Header>
                    <Table.Cell>
                        <Button onClick={addRow}>Add Row</Button>
                    </Table.Cell>
                    <Table.Cell>
                        Key
                </Table.Cell>
                    <Table.Cell>
                        Value
                </Table.Cell>
                </Table.Header>
                {kvpair.map((v, i) => <KVTableRow setErrorMsg={setErrorMsg} setErrorState={setErrorState} addKV={addKV} key={i} kv_key={v.key} removeRow={removeRow} kv_value={v.value} mutable={v.mutable} />)}

            </Table.Row>

        </Table>
        {(errorState) ? <Message error content={errorMsg} /> : <></>}
    </>
}


KVTable.propTypes = {
    /**
     * These are the kv pairs pf previously completed actions
     */
    kvPairs: PropTypes.arrayOf(PropTypes.array),
    /**
     * Element to render as KV Table header
     */
    header: PropTypes.element,
    /**
     * Unique id of entity, for which kv pair table is constructed
     */
    entityId: PropTypes.number
}



/**
 * 
 * @param {ReactProps} props 
 */
function KVTableRow({ setErrorMsg, setErrorState, key, removeRow, mutable, kv_key, kv_value, addKV }) {

    const [_key, set_key] = useState("");
    const [_value, set_value] = useState("");

    /**
     * 
     * @param {EventObject} e 
     * @param {Boolean} f should u post remove action to the backend or not 
     */
    const handleRemove = (e, f) => {
        removeRow(key, f);
    }


    const inputKey = e => {
        set_key(e.target.value);
    }
    const inputValue = e => {
        set_value(e.target.value);
    }
    const handleSave = e => { //appends kv to the submission queue
        if (_key.trim().length == 0 || _value.trim().length) {
            setErrorState(true);
            setErrorMsg("Empty key/value");
        } else addKV(_key, _value, key); //no problem 

    }
    return (mutable) ? <Table.Row>
        <Table.Cell>
            <Form.Input onInput={inputKey} name={"kv_key_".concat(key)} placeholder="Key of Attribute" />
        </Table.Cell>
        <Table.Cell>
            <Form.Input onInput={inputValue} name={"kv_value_".concat(key)} placeholder="Value of Attribute" />
        </Table.Cell>
        <Table.Cell>
            <Icon name="save" color="green" title="Save" onClick={handleSave} />
        </Table.Cell>
        <Table.Cell>
            <Icon name="times" color="red" title="Remove" onClick={handleRemove.bind(this, false)} />
        </Table.Cell>
    </Table.Row> : <Table.Row>
            <Table.Cell>
                {kv_key}
            </Table.Cell>
            <Table.Cell>
                {kv_value}
            </Table.Cell>
            <Table.Cell>
                <Icon name="times" color="red" title="Remove" onClick={handleRemove.bind(this, true)} />
            </Table.Cell>

        </Table.Row>;
}

KVTableRow.propTypes = {

    kv_key: PropTypes.string,
    kv_value: PropTypes.string,
    mutable: PropTypes.bool,
    /**
     * Removes a row in the kv table
     */
    removeRow: PropTypes.func,
    /**
     * Appends kv pair to the list of kv pair to be submited
     */
    addKV: PropTypes.func,
    /**
     * function to set error msg
     */
    setErrorMsg: PropTypes.func,
    /**
     * function to set error state
     */
    setErrorState: PropTypes.func

}
