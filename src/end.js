
//This file contains mapping for different endpoints

let p="http://localhost:3000";
let End={
    auth:p+"/auth",
    checkAuth:p+"/checkAuth",
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
            
        },
    
    }

}
export default End;