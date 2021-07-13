import React from 'react';
import './window-menu.styles.sass';

const WindowMenu = () => {
    return (
        <nav id={'window-menu'}>
            <div id={'logo-container'}>K</div>
            <div id={'window-button-container'}>
                <button className={'window-button'} id={'window-minimize-button'}/>
                <button className={'window-button'} id={'window-maximize-button'}/>
                <button className={'window-button'} id={'window-close-button'}/>
            </div>
        </nav>
    )
};

export default WindowMenu;
