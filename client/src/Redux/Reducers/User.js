const UserReducer = (
    state = {
        user: {},
    },
    action
) => {
    switch (action.type) {
        case "UPDATEUSER":
            return {
                ...state, user: action.payload,
            };
   

        default: return state;
    }
}
export default UserReducer;