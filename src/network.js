
import End from "./end";
import { IdProofs } from "./Fixed";

//This file contains code network

/**
 * 
 * @param {string} path 
 * @param {HTMLFormElement|String|FormData} body 
 * @param {boolean} auth
 */
export let MakePostFetch = (path, body, auth) => {
    let opt = {
        body: (typeof body === "string" || body instanceof FormData) ? body : new FormData(body),
        method: "post",
        'credentials': "include",
        headers: {
            "Access-Control-Allow-Origin": "http://localhost:3001",
         }
    };

    if (auth) {
        let t = localStorage.getItem("jwt_token");
        if (t === null) {
            throw Error("No Authorization Token Provided");
        }
        opt.headers["Authorization"] = "Bearer ".concat(t); //adding auth token
    }

    return fetch(path, opt);


};

/**
 * Standard error handler used in react forms
 * It just set form state to error and pass errorMsg string
 * It function should be bind with 'this'
 * @param {Error} err 
 */
export function FormErrorHandler(err) {
    this.setState({ errorState: true, errorMsg: err.message });
}

/**
 * This function does some regular stuff , like it disable btn loading and disable status
 * @param {Any} r, value tp resolved against form submission response
 *  
 */
export async function FormResponseHandlerWithLoadingDisabler(r) {
    return Promise.resolve(r)
        .then(r => {
            this.setState({ btnLoading: false, btnDisable: false });
            if (r.status === 200) return r.json();
            else throw Error("Couldn't complete your request");
        })
        .then(r => {
            if (r.error) {
                throw Error(r.errorMsg); //This will return the final promise
            } else return r.result; //This also will return the final promise
        })

}


/**
 * Contain function to pull common entities from backend server
 */
export const Get = {

    Group: getgroup,
    IdProof: getidproof,
    Unit: getunits,
    Workplace: getworkplace,
    Item: getitem,
    Route: getroute,
    Account: getaccount,
    KV: getkvpairs

};


async function getunits() {
    const r = await MakePostFetch(End.master.unit.read, new FormData(), true);
    if (r.status === 200) {
        let json = await r.json();
        return json.result.map(v => { return { id: v.id, key: v.id, text: v.name, symbol: v.symbol } })
    } else {
        throw Error("unable to fetch units");
    }
}

/**
 * Returns valid id proof options
 */
async function getidproof() {
    return IdProofs;
}

/**
 * Returns Options for the Select list
 * @param {string} type 
 */
async function getgroup(type) {
    let f = new FormData();
    if (type !== undefined) f.append("type", type);
    const r = await MakePostFetch(End.master.group.read, f, true)
    if (r.status === 200) {
        const json = await r.json();
        if (type !== undefined) {
            return json.result.map(v => {
                return { key: v.id, value: v.id, text: v.name }
            });
        } else {
            return json.result.map(v => {
                return { key: v.id, value: v.id, text: v.name, type: v.type, type_name: v.type_name }
            })
        }
    }
    else throw Error("unable to fullfill this request");
}


/**
 * Returns Options for the Select list
 * @param {string} type 
 */
async function getworkplace(type) {
    let f = new FormData();
    if (type !== undefined) f.append("type", type);
    const r = await MakePostFetch(End.master.workplace.read, f, true)
    if (r.status === 200) {
        const json = await r.json();
        return json.result.map(v => {
            return { key: v.id, value: v.id, text: v.name, gid: v.gid, group_name: v.group_name }
        })
    }
    else throw Error("unable to fullfill this request");
}






/**
 * Returns Options for the Select list
 * @param {string} type 
 */
async function getitem(type) {
    let f = new FormData();
    if (type !== undefined) f.append("gid", type);
    const r = await MakePostFetch(End.master.item.read, f, true)
    if (r.status === 200) {
        const json = await r.json();
        return json.result.map(v => { return { key: v.id, value: v.id, text: v.name, gid: v.gid, name: v.name, unit: v.unit, unit_name: v.unit_name, group_name: v.group_name } });
    }
    else throw Error("unable to fullfill this request");
}


/**
 * Returns Options for the Select list
 * @param {string} type 
 */
async function getroute(type) {
    let f = new FormData();
    if (type !== undefined) f.append("gid", type);
    const r = await MakePostFetch(End.master.route.read, f, true);
    if (r.status === 200) {
        const json = await r.json();
        return json.result.map(v => { return { key: v.id, value: v.id, text: v.name, gid: v.gid, group_name: v.group_name, name: v.name, description: v.description } });
    }
    else throw Error("unable to fullfill this request");
}



/**
 * Returns Options for Select list
 * @param {number} aid 
 */
async function getaccount(aid) {
    const f = new FormData();
    if (aid !== undefined) f.append("id", aid);
    const r = await MakePostFetch(End.master.account.read, f, true);
    if (r.status === 200) {
        const json = await r.json();
        return json.result.map((v, i) => {
            return { key: i, text: v.account_name, ...v }
        });
    }
    else throw Error("unable to fullfill this request");
}

/**
 * This returns kv pair array with given id , response array returned remain untouched
 * @param {number} id of the item record to fetch 
 */
async function getkvpairs(id) {
    const f = new FormData();
    if (id !== undefined) f.append("id", id);
    const r = await MakePostFetch(End.master.kv.read, f, true);
    if (r.status === 200) {
        const json = await r.json();
        return json.result;
    }
    else throw Error("unable to fullfill this request");

}