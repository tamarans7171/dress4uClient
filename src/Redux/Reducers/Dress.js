
const DressReducer = (
    state = {
        dress: {},
        dresses:[]
    },
    action
) => {
    switch (action.type) {
        case "UPDATEDRESS":
            return {
                ...state, dress: action.payload,
                
            }
        case "UPDATEDRESSES":
            return {
                ...state, dresses: action.payload
            }    
            // case "UPDATEDRESS":
            // return {
            //     ...state, dress: action.payload,
                
            // };

        // case 'REMOVE':
        //     console.log("remove")

        //     let l = state.products.find(x => x && x.serialNumber === action.payload);
        //     const indexToRemove = state.products.findIndex(p => p.serialNumber == action.payload)
        //     let newProducts = [...state.products]
        //     console.log("prods: " + newProducts)
        //     newProducts.splice(indexToRemove,1)
        //     return {
        //         ...state, products: newProducts, 
        //         total: [state.total - (l ? l.price : 0)]
        //     }

        default: return state;
    }
}
export default DressReducer;