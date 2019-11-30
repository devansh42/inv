//This file contains code to render controlled ui according to user permission, provided by User Access Control Mechanism
export const shouldRender = (menuId) => {
    const perms = JSON.parse(localStorage.getItem("perms"));
    return perms.indexOf(menuId) !== -1
}