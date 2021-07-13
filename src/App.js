import React from "react";
import './App.styles.sass';
import WindowMenu from "./components/window-menu/window-menu.component";
import WindowContent from "./components/window-content/window-content.component";
import MainSideMenu from "./components/main-side-menu/main-side-menu.component";

const App = () => {
    return (
        <div id={'app'}>
            <WindowMenu/>
            <WindowContent>
                <MainSideMenu/>
            </WindowContent>
        </div>
    );
};

export default App;
