import { RssFeed } from "@mui/icons-material";
import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from '../api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    SET_LOGGED_IN: "SET_LOGGED_IN",
    SET_LOGGED_OUT: "SET_LOGGED_OUT",
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
            case AuthActionType.SET_LOGGED_OUT: {
                return setAuth({
                    user: null,
                    loggedIn: false
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
                authReducer({
                    type: AuthActionType.SET_LOGGED_IN,
                    payload: {
                        user: response.data.user,
                        loggedIn: true
                    }
                })
                store.loadIdNamePairs()
            } else {
                console.log('sad boi :(')
            }
        } catch (err) {
            console.log('Failed to login...\n' + err)
        }
    }

    auth.logoutUser = async function() {
        console.log('logging out user...')
        api.logoutUser()
        authReducer({
            type: AuthActionType.SET_LOGGED_OUT
        })
    }

    auth.getLoggedIn = async function () {
        try {
            const res = await api.getLoggedIn();
            if (res.status === 200) {
                authReducer({
                    type: AuthActionType.SET_LOGGED_IN,
                    payload: {
                        loggedIn: res.data.loggedIn,
                        user: res.data.user
                    }
                });
                console.log('Logged in as: ' + res.data.user.email + ', ' + res.data.loggedIn)
            }
        } catch (err) {
            console.log('Failed to get logged in... ' + err)
        }
    }

    auth.registerUser = async function (userData, store) {
        try {
            const res = await api.registerUser(userData);
            if (res.status === 200) {
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: res.data.user
                    }
                })
                history.push("/");
                store.loadIdNamePairs();
            } else {
                console.log('depressed boi :((((')
            }
        } catch (err) {
            console.log(err)
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