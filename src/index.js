import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import theme from './theme';
import {CssBaseline, ThemeProvider} from "@mui/material";
import {setContext} from '@apollo/client/link/context';
import {
    ApolloProvider,
    ApolloClient,
    createHttpLink,
    InMemoryCache
} from '@apollo/client';


const authLink = setContext((_, {headers}) => {
    return {
        headers: {
            ...headers,
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            // accessControlAllowOrigin: '*',
            // accessControlAllowHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
        }
    };
});

const hostname = window.location.hostname;
const baseUrl = `http://${hostname}:3000`
let gqlUrl = `${baseUrl}/api/v1/graphql`;

const gqlHTTPLink = createHttpLink({
    uri: gqlUrl,
});

const client = new ApolloClient({
    link: authLink.concat(gqlHTTPLink),
    cache: new InMemoryCache({
    },),
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
        <CssBaseline />

            <App/>

    </ThemeProvider>
    </ApolloProvider>
);
reportWebVitals(console.log);