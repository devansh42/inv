//This file contains Fixed Constants

export const GroupType = [

    { key: 1, value: 1, text: "Account" },
    { key: 2, value: 2, text: "User" },
    { key: 3, value: 3, text: "Workplace" },
    { key: 4, value: 4, text: "Item" },
    { key: 5, value: 5, text: "Operation" },
    { key: 6, value: 6, text: "Route" }
];

export const GroupTypes = {
    Account: 1,
    User: 2,
    Workplace: 3,
    Item: 4,
    Operation: 5,
    Route: 6
}
export const Genders = [
    { key: 0, value: 0, text: "Male" },
    { key: 1, value: 1, text: "Female" }
]
export const IdProofs = [
    { key: 1, value: 1, text: "Aadhar" },
    { key: 2, value: 2, text: "Voter Id" },
    { key: 3, value: 3, text: "Passport" },
    { key: 4, value: 4, text: "Driving License" }

]
export const ProcessStates = [
    { key: 1, color: "grey", text: "Not Started" },
    { key: 2, color: "orange", text: "Processing" },
    { key: 3, color: "blue", text: "Processed" },
    { key: 4, color: "green", text: "Completed" },
    { key: 6, color: "red", text: "Interrupted" },

]

export function GetProcessStateColor(x) {
    const c = getprocessstate(x);
    return c == undefined ? "grey" : c.color;
}
export function GetProcessStateText(x) {
    const c = getprocessstate(x);
    return c == undefined ? "Not Started" : c.text;

}

function getprocessstate(x) {
    const c = ProcessStates.filter(v => v.key == x);
    return (x == undefined || x == null || c.length < 1) ? undefined : c.length > 0 ? c[0] : undefined;

}



export const MenuTree = [
    {
        name: "Master", value: "1",
        childs: [
            {
                name: "Account", value: "1.1", childs: [
                    { name: "Create", value: "1.1.1" },
                    { name: "Modify", value: "1.1.2",hidden:true },
                    { name: "Read", value: "1.1.3" },
                    { name: "Info", value: '1.1.4' }
                ]
            },
            {
                name: "User", value: "1.2", childs: [
                    { name: "Create", value: "1.2.1" },
                    { name: "Modify", value: "1.2.2",hidden:true },
                    { name: "Read", value: "1.2.3" },
                    { name: "Info", value: '1.2.4' }

                ]
            },
            {
                name: "Item", value: "1.3", childs: [
                    { name: "Create", value: "1.3.1" },
                    { name: "Modify", value: "1.3.2",hidden:true },
                    { name: "Read", value: "1.3.3" },
                    { name: "Info", value: '1.3.4' }

                ]
            },
            {
                name: "Group", value: "1.4", childs: [
                    { name: "Create", value: "1.4.1" },
                    { name: "Modify", value: "1.4.2",hidden:true },
                    { name: "Read", value: "1.4.3" },
                    { name: "Info", value: '1.4.4' }


                ]
            },
            {
                name: "Unit", value: "1.5", childs: [
                    { name: "Create", value: "1.5.1" },
                    { name: "Modify", value: "1.5.2",hidden:true },
                    { name: "Read", value: "1.5.3" },
                    { name: "Info", value: '1.5.4' }

                ]
            },
            {
                name: "Workplace", value: "1.6", childs: [
                    { name: "Create", value: "1.6.1" },
                    { name: "Modify", value: "1.6.2",hidden:true },
                    { name: "Read", value: "1.6.3" },
                    { name: "Info", value: '1.6.4' }

                ]
            },
            {
                name: 'Operation', value: "1.8", childs: [
                    { name: "Create", value: "1.8.1" },
                    { name: "Modify", value: "1.8.2",hidden:true },
                    { name: "Read", value: "1.8.3" },
                    { name: "Info", value: '1.8.4' }

                ]
            },
            {
                name: "Route", value: "1.7", childs: [
                    { name: "Create", value: "1.7.1" },
                    { name: "Modify", value: "1.7.2",hidden:true },
                    { name: "Read", value: "1.7.3" },
                    { name: "Info", value: '1.7.4' }

                ]
            }

        ]

    },
    {
        name: "Production", value: "2",
        childs: [
            {
                name: "Bill of Materials", value: "2.1", childs: [
                    { name: "Create", value: "2.1.1" },
                    { name: "Modify", value: "2.1.2",hidden:true },
                    { name: "Read", value: "2.1.3" },
                    { name: "Info", value: '2.1.4' }

                ]
            },
            {
                name: "WorkOrder", value: "2.2", childs: [
                    { name: "Create", value: "2.2.1" },
                    { name: "Modify", value: "2.2.2",hidden:true },
                    { name: "Read", value: "2.2.3" },
                    
                    { name: "Track", value: '2.2.4' }
                ]
            },
            {
                name: "Job", value: "2.3", childs: [
                    { name: "Create", value: "2.3.1" },
                    { name: "Modify", value: "2.3.2",hidden:true },
                    { name: "Read", value: "2.3.3" }
                ]
            }

        ]
    }
]
