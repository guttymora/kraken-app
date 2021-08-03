import React, {useState, useContext} from 'react';
import './main-side-menu.styles.sass';
import {
    Dashboard as DashboardIcon,
    Settings as SettingsIcon,
    AccountCircle as AccountIcon,
    ArrowLeft as ArrowLeftIcon,
    ArrowRight as ArrowRightIcon
} from '@material-ui/icons';
import {GlobalContext} from "../../contexts/GlobalContext";

const initialState = {
    expanded: true,
    width: '180px',
    showText: true,
    showIcons: true,
    theme: 'light'
};

const MainSideMenu = () => {
    const [state, setState] = useState(initialState);
    const [globalState, dispatch] = useContext(GlobalContext);

    const toggleIcons = {
        collapse: <ArrowLeftIcon className={'icons'}/>,
        expand: <ArrowRightIcon className={'icons'}/>
    };

    const toggleWidth = () => {
        if (state.expanded) {
            setState(prev => ({...prev, width: '60px', expanded: false}));
        } else {
            setState(prev => ({...prev, width: '180px', expanded: true}));
        }
    };

    return (
        <nav id={'main-side-menu'} style={{width: state.width}}
             className={globalState.theme === 'dark' ? 'dark-theme' : ''}>
            <ul>
                <li className={state.expanded ? '' : 'collapsed'}>
                    <DashboardIcon className={'icon'}/>
                    <span>Mis archivos</span>
                </li>
                <li className={state.expanded ? '' : 'collapsed'}>
                    <SettingsIcon className={'icon'}/>
                    <span>Configuración</span>
                </li>
                <li className={state.expanded ? '' : 'collapsed'}>
                    <AccountIcon className={'icon'}/>
                    <span>Mi cuenta</span>
                </li>
            </ul>

            <div id={'collapse-side-menu-button'}
                 className={state.expanded ? '' : 'collapsed'}
                 onClick={toggleWidth}>
                {state.expanded ? toggleIcons.collapse : toggleIcons.expand}
                <span>Colapsar</span>
            </div>
        </nav>
    )
};

export default MainSideMenu;
