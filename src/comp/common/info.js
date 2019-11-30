//This file contains code to render help docs
import React from 'react';
import { Segment, Header, Message } from 'semantic-ui-react';

export function InfoDoc({header,...props}){
    return <Segment>
       <Message size="large" info>
            <Header dividing>{header}</Header>
            {props.children}
       </Message>     
    </Segment>
}