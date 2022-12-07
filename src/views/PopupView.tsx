import * as React from "react";
import * as cameraControlsImg from "../../assets/images/camera-controls.png";
import * as selectionControlsImg from "../../assets/images/selection-controls.png";
import * as timelineControlsImg from "../../assets/images/timeline-controls.png";
import * as sampleDataMarkers from "../../assets/sampleData/Trial001_Markers.tsv";
import * as sampleDataForces from "../../assets/sampleData/Trial001_Forces.tsv";
import {useState} from "react";

interface Props {
    error: Error|null,
    menu: boolean,
    sdpInfo: boolean,

    showSegments: boolean,
    setShowSegments: React.Dispatch<React.SetStateAction<boolean>>,

    exportAngles(): void;
}

export default function PopupView(
    {
        error, menu, sdpInfo, showSegments, setShowSegments, exportAngles
    }: Props
) {
    const [controlsHelpImgNum, setControlsHelpImgNum] = useState(0);

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
                <img src={timelineControlsImg} alt={"timeline controls help image"} style={controlsHelpImgNum===2 ? {display: "block"} : {display: "none"}}
                />
                <div style={controlsHelpImgNum===3 ? {display: "block"} : {display: "none"}}>
                    File Upload Area
                    <ul>
                        <li>Marker file upload is required</li>
                        <li>Force file upload is optional</li>
                        <li>Ensuring force data is from the same trial as the marker data is up to the user;
                            unsynchronized data is not currently detected by Movilo</li>
                        <li>If an error is encountered upon file upload, the error may be cleared by uploading a correct
                            file or refreshing the page</li>
                    </ul>
                    Render Area
                    <ul>
                        <li>The ground grid squares are 1 meter in width</li>
                        <li>The axis helper colors, RGB, correspond to positive XYZ in Vicon's coordinate system</li>
                        <li>A screenshot of the currently rendered frame can be downloaded by right clicking anywhere in
                            the render area and selecting "save image as"</li>
                        <li>Body segments may be toggled on/off in the main menu</li>
                    </ul>
                    Selection Info Area
                    <ul>
                        <li>From top to bottom, all possible data that may be displayed includes:
                            <ul>
                                <li>Angle between 3 selected markers, labeled according to which marker is theta</li>
                                <li>Each selected marker, in the order selected</li>
                                <li>Force data for up to 2 vectors (automatically displayed whenever a non-zero force is
                                    present)</li>
                            </ul>
                        </li>
                        <li>All displayed data is shown as-is from the uploaded file(s); marker coordinates use Vicon's
                            coordinate system, but vector coordinates use OpenSim's</li>
                    </ul>
                    Timeline Track Area
                    <ul>
                        <li>The playback rate may be adjusted below the play button (after left clicking the current
                            number) by either:
                            <ul>
                                <li>Typing any positive decimal value, such as 0.02</li>
                                <li>Typing the up/down arrow keys to increment/decrement the number by 0.1</li>
                            </ul>
                        </li>
                        <li>Suggested gait events should appear below the timeline track upon marker file upload</li>
                        <li>To crop the animation start, left click any gait event button</li>
                        <li>To crop the animation end, right click any gait event button</li>
                        <li>Fine adjustments to the resulting crop may be made in the timeline text area</li>
                        <li>To reset the current crop, right click anywhere in the timeline track</li>
                    </ul>
                    Timeline Text Area
                    <ul>
                        <li>The top row numbers are the frame numbers</li>
                        <li>The bottom row numbers are the corresponding time in seconds</li>
                        <li>Start refers to the cropped beginning frame of the data/animation (initially frame 0)</li>
                        <li>End refers to the cropped ending frame of the data/animation (initially the last frame of the
                            uploaded marker data)</li>
                        <li>It is recommended to crop the end before cropping the start. Upon typing, cropping is applied
                            immediately, so an interim end crop of frame 2 while typing 225 will be rejected if the crop
                            start is greater than or equal to frame 2 to ensure there is always at least one frame to
                            animate. Setting the end crop first avoids this issue. If needed, you can always right click
                            the timeline track to reset the crop and start over.</li>
                    </ul>
                </div>
            </div>
            <div id={"menu-dropdown-container"}>
                <div id={"menu-title"}>Main Menu</div>
                <dl id={"menu-options"}>
                    <dt>Controls Help</dt>
                    <dd onMouseOver={()=>setControlsHelpImgNum(0)}>camera</dd>
                    <dd onMouseOver={()=>setControlsHelpImgNum(1)}>selection</dd>
                    <dd onMouseOver={()=>setControlsHelpImgNum(2)}>timeline</dd>
                    <dd onMouseOver={()=>setControlsHelpImgNum(3)}>more</dd>
                    
                    <dt>Body Segments</dt>
                    <dd><input type={"checkbox"} checked={showSegments} onChange={()=>setShowSegments(!showSegments)} /></dd>
                    <dt>Export</dt>
                    <dd><button onClick={exportAngles}>angles</button></dd>
                    <dt>Sample Data</dt>
                    <dd><a href={sampleDataMarkers}>Markers</a></dd>
                    <dd><a href={sampleDataForces}>Forces</a></dd>
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
