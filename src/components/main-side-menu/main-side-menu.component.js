import React from 'react';
import './main-side-menu.styles.sass';
import {Dashboard, Settings, AccountCircle, ArrowLeft, ArrowRight} from '@material-ui/icons';

const initialState = {
    expanded: true,
    width: '200px',
    showText: true,
    showIcons: true,
    theme: 'light'
};

const MainSideMenu = () => {
    const [state, setState] = React.useState(initialState);

    const toggleIcons = {
        collapse: <ArrowLeft className={'icons'}/>,
        expand: <ArrowRight className={'icons'}/>
    };

    const toggleWidth = () => {
        if (state.expanded) {
            setState(prev => ({...prev, width: '60px', expanded: false}));
        } else {
            setState(prev => ({...prev, width: '200px', expanded: true}));
        }
    };

    return (
        <nav id={'main-side-menu'} style={{width: state.width}}>
            <ul>
                <li className={`${state.expanded ? '' : 'collapsed'}`}>
                    <Dashboard className={'icon'}/>
                    <span>Mis archivos</span>
                </li>
                <li className={`${state.expanded ? '' : 'collapsed'}`}>
                    <Settings className={'icon'}/>
                    <span>Configuración</span>
                </li>
                <li className={`${state.expanded ? '' : 'collapsed'}`}>
                    <AccountCircle className={'icon'}/>
                    <span>Mi cuenta</span>
                </li>
            </ul>

            <div id={'collapse-side-menu-button'}
                 className={`${state.expanded ? '' : 'collapsed'}`}
                 onClick={toggleWidth}>
                {state.expanded ? toggleIcons.collapse : toggleIcons.expand}
                <span>Colapsar</span>
            </div>
        </nav>
    )
};

export default MainSideMenu;
