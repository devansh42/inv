import React,{Component} from "react";
import { Table, Message } from "semantic-ui-react";
import PropTypes from "prop-types";





/**
 * This component renders basic list view for entity used in master
 * @param {ReactProp} props 
 */
  function masterEntityList(props){
      const hf=(v,i)=>{ //for printing header
          return <Table.Cell key={i}>{v}</Table.Cell>
      }
      const errMsg=<Message error>
            {props.errorMsg}
      </Message>
      
      return (props.errorState)?<errMsg/>:<Table sortable={"sortable" in props}>
                <Table.Header>
                    <Table.Row>
                        {props.headers.map(hf)}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
               {props.children}
                </Table.Body>
        </Table>;
    

 }

 masterEntityList.propTypes={
     sortable:PropTypes.bool,
     headers:PropTypes.array
 }


export const MasterEntity={
    List:masterEntityList
}