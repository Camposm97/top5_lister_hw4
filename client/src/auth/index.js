import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from '../api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    SET_LOGGED_IN: "SET_LOGGED_IN",
    REGISTER_USER: "REGISTER_USER"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn
                });
            }
            case AuthActionType.SET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true
                })
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true
                })
            }
            default:
                return auth;
        }
    }

    auth.loginUser = async function (payload, store) {
        try {
            const response = await api.loginUser(payload)
            console.log('response=' + response)
            if (response.status === 200) {
                console.log('happy boi :)');
                history.push('/')
                store.loadIdNamePairs()
            } else {
                console.log('sad boi :(')
            }
        } catch (err) {
            console.log('Failed to login...\n' + err)
        }
    }

    auth.getLoggedIn = async function () {
        try {
            const response = await api.getLoggedIn();
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.SET_LOGGED_IN,
                    payload: {
                        loggedIn: response.data.loggedIn,
                        user: response.data.user
                    }
                });
            }
        } catch (err) {
            console.log('Failed to get logged in... ' + err)
        }
    }

    auth.registerUser = async function (userData, store) {
        const response = await api.registerUser(userData);
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.REGISTER_USER,
                payload: {
                    user: response.data.user
                }
            })
            history.push("/");
            store.loadIdNamePairs();
        }
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };