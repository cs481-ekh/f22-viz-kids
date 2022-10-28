import * as React from "react";
import * as cameraControlsImg from "../../assets/images/camera-controls.png";
import * as selectionControlsImg from "../../assets/images/selection-controls.png";

interface Props {
    error: Error|null,
    menu: boolean,
    sdpInfo: boolean,

    controlsHelpImgNum: number,
    setControlsHelpImgNum: React.Dispatch<React.SetStateAction<number>>,
}

export default function PopupView(
    {
        error, menu, sdpInfo, controlsHelpImgNum, setControlsHelpImgNum
    }: Props
) {
    return <div id={"popup-view"}>

        <div id={"error-popup"} style={error ? {visibility: 'visible'} : {visibility: 'hidden'}}>
            Error: {error?.message}
        </div>

        <div id={"main-menu-popup"} style={menu ? {visibility: 'visible'} : {visibility: 'hidden'}}>
            <div id={"menu-image-container"}>
                <img src={cameraControlsImg} alt={"camera controls help image"}
                     style={controlsHelpImgNum===0 ? {display: "block"} : {display: "none"}}
                />
                <img src={selectionControlsImg} alt={"selection controls help image"}
                     style={controlsHelpImgNum===1 ? {display: "block"} : {display: "none"}}
                />
            </div>
            <div id={"menu-dropdown-container"}>
                <div id={"menu-title"}>Main Menu</div>
                <dl id={"menu-options"}>
                    <dt>Controls Help</dt>
                    <dd onMouseOver={()=>setControlsHelpImgNum(0)}>camera</dd>
                    <dd onMouseOver={()=>setControlsHelpImgNum(1)}>selection</dd>
                </dl>
            </div>
        </div>

        <div id={"sdp-info-popup"} style={sdpInfo ? {visibility: 'visible'} : {visibility: 'hidden'}}>
            {`This website was created for a Boise State University
            Computer Science Senior Design Project by
            
            Colin Reeder
            Connor Jackson
            Cory Tomlinson
            Javier Trejo
            William Kenny
            
            For information about sponsoring a project, go to
            `}
            <a href={"https://www.boisestate.edu/coen-cs/community/cs481-senior-design-project/"} target={'_blank'}>
                https://www.boisestate.edu/coen-cs/community/cs481-senior-design-project/
            </a>
        </div>

    </div>;
}