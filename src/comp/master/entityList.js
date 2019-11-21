import React from "react";
import { Table, Message } from "semantic-ui-react";
import PropTypes from "prop-types";





/**
 * This component renders basic list view for entity used in master
 * @param {ReactProp} props 
 */
  function masterEntityList(props){
      const hf=(v,i)=>{ //for printing header
          return <Table.HeaderCell key={i}>{v}</Table.HeaderCell>
      }
      const errMsg=<Message error>
            {props.errorMsg}
      </Message>
      
      return (props.errorState)?errMsg:<Table selectable sortable={"sortable" in props}>
                <Table.Header>
                    <Table.Row>
                        {props.headers.map(hf)}
                    </Table.Row>
                </Table.Header>
               {props.children}
               
        </Table>;
    

 }

 masterEntityList.propTypes={
     sortable:PropTypes.bool,
     headers:PropTypes.array
 }


export const MasterEntity={
    List:masterEntityList
}