
//This file contains mapping for different endpoints

let p="http://localhost:3000";
const End={
    auth:p+"/auth",
    checkAuth:p+"/checkAuth",
    
    production:{
        bom:{
            create:p+"/app/production/bom/create",
            read:p+"/app/production/bom/read",
        },
        workorder:{
            create:p+"/app/production/workorder/create",
            read:p+"/app/production/workorder/read"
        },
        job:{
            create:p+"/app/production/job/create",
            read:p+"/app/production/job/read"
        },
        jobModifier:{
            create:p+"/app/production/jobModifier/create",
            read:p+"/app/production/jobModifier/read",
            delete:p+"/app/production/jobModifier/delete",
            add:p+"/app/production/jobModifier/add",        
            action:p+"/app/production/jobModifier/action"
        }
    },
    master:{
        group:{
            create:p+"/app/master/group/create",
            modify:p+"/app/master/group/modify",
            read:p+"/app/master/group/read"
        },
        workplace:{
            create:p+"/app/master/workplace/create",
            modify:p+"/app/master/workplace/modify",
            read:p+"/app/master/workplace/read",
            
        },
        unit:{
            create:p+"/app/master/unit/create",
            modify:p+"/app/master/unit/modify",
            read:p+"/app/master/unit/read",
            
        },
        item:{
            create:p+"/app/master/item/create",
            modify:p+"/app/master/item/modify",
            read:p+"/app/master/item/read",
            
        },
        user:{
            create:p+"/app/master/user/create",
            modify:p+"/app/master/user/modify",
            read:p+"/app/master/user/read",
            
        },account:{
            create:p+"/app/master/account/create",
            modify:p+"/app/master/account/modify",
            read:p+"/app/master/account/read",
            
        },operation:{
            create:p+"/app/master/operation/create",
            modify:p+"/app/master/operation/modify",
            read:p+"/app/master/operation/create",
        },route:{
            create:p+"/app/master/route/create",
            modify:p+"/app/master/route/modify",
            read:p+"/app/master/route/read"
        },
        kv:{
            create:p+"/app/master/kv/create",
            modify:p+"/app/master/kv/modify",
            read:p+"/app/master/kv/read",
            delete:p+"/app/master/kv/delete"
        
        }

    
    }

}
export default End;
