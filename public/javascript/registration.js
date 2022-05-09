const Registration = (function() {
    // This function sends a register request to the server
    // * `username`  - The username for the sign-in
    // * `name`      - The name of the user
    // * `password`  - The password of the user
    // * `onSuccess` - This is a callback function to be called when the
    //                 request is successful in this form `onSuccess()`
    // * `onError`   - This is a callback function to be called when the
    //                 request fails in this form `onError(error)`
    const register = function(username, name, password, onSuccess, onError) {
        const user_data = {username, name, password}
        fetch("/register",{
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(user_data)
        }).then((res)=>res.json())
        .then((json)=>{
            if(json.status=='success'){
                onSuccess()
            }
            if(json.status=='error'){
                onError(json.error)
            }
        })
    };

    return { register };
})();
