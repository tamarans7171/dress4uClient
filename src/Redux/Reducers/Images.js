const ImagesReducer = (
    state = {
        images: {},
        arrOfImages:[]
    },
    action
) => {
    switch (action.type) {
        case "UPDATEIMAGES":
            return {
                ...state, images: action.payload, 
            };
            case "UPDATEARRIMAGES":
            return {
                ...state, arrOfImages: action.payload,
                
            };
   

        default: return state;
    }
}
export default ImagesReducer;