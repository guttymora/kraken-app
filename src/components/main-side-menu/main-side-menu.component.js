import React, {useState} from 'react';
import './main-side-menu.styles.sass';

const configuration = {
    expanded: true,
    width: '200px',
    showText: true,
    showIcons: true,
    theme: 'light'
};

const MainSideMenu = () => {
    const [config, setConfig] = useState(configuration);

    const toggleWidth = () => {
        if (config.expanded) {
            setConfig(prev => ({...prev, width: '60px', expanded: false}));
        } else {
            setConfig(prev => ({...prev, width: '200px', expanded: true}));
        }
    };

    return (
        <nav id={'main-side-menu'} style={{width: config.width}}>
            <ul>
                <li>Mis archivos</li>
                <li>Configuración</li>
                <li>Mi cuenta</li>
            </ul>

            <div id={'collapse-side-menu-button'} onClick={toggleWidth}>Colapsar</div>
        </nav>
    )
};

export default MainSideMenu;
