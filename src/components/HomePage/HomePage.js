import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { Fab, Paper, Stack, styled } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { useScrollDirection } from 'react-use-scroll-direction';

const Item = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.primary,
    maxWidth: '50%', // Set the maximum width for each post item
    flexBasis: '50%', // Set the flex basis to 50% for each post item
}));

let email = "ramon.johns@lang.co"; // Replace with the user's email

const GET_DATA = gql`
  query {
    user(email: "${email}") {
      firstName
      email
      posts {
        id
        title
        body
        # Add other fields as needed
      }
    }
  }
`;


function HomePage(props) {
    const { loading, error, data } = useQuery(GET_DATA);
    const [extended, setExtended] = useState(true);
    const [newPost, setNewPost] = useState(true);

    const { isScrollingUp, isScrollingDown } = useScrollDirection();

    let ext = extended ? "extended" : "circular";
    let np = newPost ? 'New Post' : "";

    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            if (isScrollingUp) {
                setExtended(true);
                setNewPost(true);
            }
            if (isScrollingDown) {
                setExtended(false);
                setNewPost(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isScrollingUp, isScrollingDown]);

    if (loading) return <CircularProgress />;
    if (error) return <h1>Error: {error.message}</h1>;

    return (
        <>
            <div className={"GroupStack"}>
                <Fab color="primary" aria-label="add" className={"NewPostFab"} id={"NewPost"} variant={ext}>
                    <AddIcon /> <div id={"NewPostText"} >{np}</div>
                </Fab>
                <Stack
                    direction="row" // Display posts in a row
                    justifyContent="center" // Center the posts horizontally
                    alignItems="flex-start" // Align the posts to the top
                    spacing={2}
                    overflow={"scroll"}
                    sx={{ mx: 5, mt: '60px' }} // Add margin-top here
                >
                    {/* ... */}
               
                
                    <React.Fragment>
                        {data?.user?.posts?.map((post) => (
                            <Item key={post.id} onClick={() => navigate(`/post/${post.id}`)}>
                                <h2>{post.title}</h2>
                                <p>{post.body}</p>
                            </Item>
                        ))}
                    </React.Fragment>
                </Stack>
            </div>
        </>
    );
}

export default HomePage;