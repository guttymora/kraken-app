export const GlobalReducer = (state, action) => {
    switch(action) {
        case 'logout':
            return {
                ...state,
                isSessionActive: false
            };
        default:
            return state;
    }
};
