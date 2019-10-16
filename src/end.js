
//This file contains mapping for different endpoints

let p="http://localhost:3000";
let End={
    auth:p+"/auth",
    checkAuth:p+"/checkAuth",
    
    production:{
        bom:{
            create:"/app/production/bom/create",
            read:"/app/production/bom/read",
        },
        workorder:{
            create:"/app/production/workorder/create",
            read:"/app/production/workorder/read"
        },
        job:{
            create:"/app/production/job/create",
            read:"/app/production/job/read"
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
        }

    
    }

}
export default End;
