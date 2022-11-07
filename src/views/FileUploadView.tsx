import * as React from "react";

interface Props {
    openMarkerFileSelector: () => void,
    markerFile: File,
    markerParsingError: boolean,

    openForceFileSelector: () => void,
    forceFile: File,
    forceParsingError: boolean,
}

export default function FileUploadView(
    {
        openMarkerFileSelector, markerFile, markerParsingError,
        openForceFileSelector, forceFile, forceParsingError
    }: Props
) {
    return <div id={"file-upload-view"}>
        <div>
            <input className={"file-upload-button"} type={"button"} value={"Choose Marker Data File"} onClick={openMarkerFileSelector} />
            <span className={"file-chosen-name"}>{markerFile && !markerParsingError ? markerFile.name : "No file chosen"}</span>
        </div>
        <div>
            <input className={"file-upload-button"} type={"button"} value={"Choose Force Plate Data File"} onClick={openForceFileSelector} />
            <span className={"file-chosen-name"}>{forceFile && !forceParsingError ? forceFile.name : "No file chosen"}</span>
        </div>
    </div>;
}