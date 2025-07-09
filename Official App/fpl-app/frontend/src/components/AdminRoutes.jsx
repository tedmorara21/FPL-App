import { Navigate } from "react-router-dom";

import { getUserRole } from "../utils/get-user-roles";

const AdminRoute = ( {children} ) => {
    const role = getUserRole();

    if ( role !=="admin" ) {
        return <Navigate to="/" />
    }

    return children;
}

export default AdminRoute;
