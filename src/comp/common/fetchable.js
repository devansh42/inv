//This file contains component definition for fetchable component

import React,{Component} from "react";

export class FetchAble extends Component{
    constructor(props){
        super(props);
        this.state={contentLoaded:false,recordCount:0};
        this.dataList=props.dataList;
        
        
    }
}