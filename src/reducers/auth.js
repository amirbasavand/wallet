const INITIAL_STATE={
    isSignIn:null,
    userId : null,
    currentUser:null
}
export  const Auth=(state=INITIAL_STATE,action)=>{
    switch (action.type){
        case 'SIGN_IN':
            return {...state,isSignIn:true,userId:action.payload.userId,currentUser:action.payload.currentUser}
        case 'SIGN_OUT':
            return {...state,isSignIn:false,userId: null,currentUser: null}
        default : 
            return state
    }
}