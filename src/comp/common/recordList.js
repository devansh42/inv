//This file contains code to render record list
import React, { Component, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Header, Label, Table, Loader } from "semantic-ui-react";
import { MasterEntity } from "../master/entityList";
/**
 * RecordList, is the generic component to render of given list to the backend
 * @param {ReactProps} props 
 */
export function RecordList(props) {


    const [contentLoaded, setContentLoaded] = useState(false);
    const [recordCount, setRecordCount] = useState(0);
    const [errorState, setErrorState] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const dataList = [];
    useEffect(() => {
        props.fetchPromise()
            .then(r => {
                if (r.status == 200) return r.json();
                else throw Error("Couldn't fetch the content");
            })
            .then(r => {
                dataList = r.results.map(props.mapFn); //performs map operation on fetched content
                return [true, dataList.length]; //return true (i.e. content is loaded from the background), and length of fetched content
            })
            .then(([loaded, len]) => {
                setContentLoaded(loaded);
                setRecordCount(len);

            })
            .catch(err => {
                setErrorMsg(err.message);
                setErrorState(true);
            })
    });


    return <div>
        <Header dividing>{props.title} <Label floating>{recordCount}</Label> </Header>
        <MasterEntity.List errorState={errorState} errorMsg={errorMsg} sortable headers={props.headers}>
            <Table.Body>
                {(contentLoaded) ? dataList : <Loader />}
            </Table.Body>
        </MasterEntity.List>
    </div>
}



RecordList.propTypes = {
    /**
     * Title of the Record List
     */
    title: PropTypes.string.isRequired,
    /**
     * Header of column names of record List
     */
    headers: PropTypes.arrayOf(PropTypes.string).isRequired,
    /**
     * map function to map over fetched records
     */
    mapFn: PropTypes.func.isRequired,

    /**
     * function that returns promise to fetching content from backend server
     */
    fetchPromise: PropTypes.func.isRequired



}