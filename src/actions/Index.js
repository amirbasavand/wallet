export const signIn =(item)=>{
    return {
        type : 'SIGN_IN',
        payload:item
    }
}
export const signOut =()=>{
    return {
        type : 'SIGN_OUT'
    }
}
