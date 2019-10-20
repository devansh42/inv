
import End from "./end";
import {IdProofs} from "./Fixed";

//This file contains code network

/**
 * 
 * @param {string} path 
 * @param {HTMLFormElement} body 
 * @param {boolean} auth
 */
export let MakePostFetch=(path,body,auth)=>{
    let opt={
        body:(body instanceof FormData)?body:new FormData(body),
        method:"post",
        'credentials':"include",
        headers:{
            "Access-Control-Allow-Origin":"http://localhost:3001"
        }
    };

    if(auth){
        let t=localStorage.getItem("jwt_token");
        if(t==null){
            throw Error("No Authorization Token Provided");
        }
        opt.headers["Authorization"]="Bearer ".concat(t); //adding auth token
    }
    
    return fetch(path,opt);


};

/**
 * Standard error handler used in react forms
 * It just set form state to error and pass errorMsg string
 * @param {Error} err 
 */
export function FormErrorHandler(err){
    this.setState({errorState:true,errorMsg:err.message});
}


/**
 * Contain function to pull common entities from backend server
 */
export const Get={

    Group:getgroup,
    IdProof:getidproof,
    Unit:getunits,
    Workplace:getworkplace,
    Item:getitem,
    Route:getroute


};


async function getunits(){
    const r= await MakePostFetch(End.master.unit.read,new FormData(),true);
    if(r.status==200){
      let json=await r.json();
      return json.result.map(v=>{return {id:v.id,key:v.id,text:v.name,symbol:v.symbol}})  
    }else{
        throw Error("unable to fetch units");
    }
}

/**
 * Returns valid id proof options
 */
async function getidproof(){
    return IdProofs;
}

/**
 * Returns Options for the Select list
 * @param {string} type 
 */
async function getgroup(type){
    let f=new FormData();
    if(type!=undefined)f.append("type",type);
    const r=await MakePostFetch(End.master.group.read,f,true)
    if(r.status==200){
        const json= await r.json();
        if(type!=undefined){
           return  json.result.map(v=>{
                return {key:v.id,value:v.id,text:v.name} 
            });
        }else{
            return json.result.map(v=>{
                return {key:v.id,value:v.id,text:v.name,type:v.type,type_name:v.type_name}
            })
        }
    }
    else throw Error("unable to fullfill this request");
}


/**
 * Returns Options for the Select list
 * @param {string} type 
 */
async function getworkplace(type){
    let f=new FormData();
    if(type!=undefined)f.append("type",type);
    const r=await MakePostFetch(End.master.workplace.read,f,true)
    if(r.status==200){
        const json= await r.json();
        return json.result.map(v=>{
            return {key:v.id,value:v.id,text:v.name,gid:v.gid,group_name:v.group_name}
        })
    }
    else throw Error("unable to fullfill this request");
}






/**
 * Returns Options for the Select list
 * @param {string} type 
 */
async function getitem(type){
    let f=new FormData();
    if(type!=undefined)f.append("gid",type);
    const r=await MakePostFetch(End.master.item.read,f,true)
    if(r.status==200){
        const json= await r.json();
        return json.map(v=>{ return {key:v.id,value:v.id,text:v.name,gid:v.gid,name:v.name,unit:v.unit,unit_name:v.unit_name,group_name:v.group_name}});
    }
    else throw Error("unable to fullfill this request");
}


/**
 * Returns Options for the Select list
 * @param {string} type 
 */
async function getroute(type){
    let f=new FormData();
    if(type!=undefined)f.append("gid",type);
    const r=await MakePostFetch(End.master.route.read,f,true)
    if(r.status==200){
        const json= await r.json();
        return json.map(v=>{return {key:v.id,value:v.id,text:v.name,gid:v.gid,group_name:v.group_name,name:v.name,description:v.description}});
    }
    else throw Error("unable to fullfill this request");
}


