import React from "react";
import './App.sass';
import WindowMenu from './components/window-menu/window-menu.component';
import WindowContent from './components/window-content/window-content.component';
import MainSideMenu from './components/main-side-menu/main-side-menu.component';
import Dashboard from "./components/dashboard/dashboard.component";
import {GlobalProvider} from "./contexts/GlobalContext";

const App = () => {
    return (
        <div id={'app'}>
            <GlobalProvider>
                <WindowMenu/>
                <WindowContent>
                    <MainSideMenu/>
                    <Dashboard/>
                </WindowContent>
            </GlobalProvider>
        </div>
    );
};

export default App;
