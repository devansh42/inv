//This is the landing page after login
import React,{Component} from 'react';
import {Route,Switch,BrowserRouter as Router} from "react-router-dom";
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