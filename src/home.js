//This is the landing page after login
import React from 'react';
import { BaseMenu } from './comp/menu/menu';
import { MainContent } from './mainContent';
export function HomeWindow(props){
   
   
   return  <div>
           
                    <BaseMenu/>
                    <div>
                    
                        <MainContent/>
                    </div>
            </div>;
}