const GlobalReducer = (state, action) => {
    switch (action.type) {
        case 'logout':
            return {
                ...state,
                isSessionActive: false
            };
        case 'error':
            return {
                ...state,
                error: action.payload
            };
        default:
            return state;
    }
};

export default GlobalReducer;
