import * as React from "react";

interface Props {
    error: Error|null;
}

export default function ErrorPopup(props: Props) {
    return <div id={"error-popup"} style={props.error ? {visibility: 'visible'} : {visibility: 'hidden'}}>
        {'Error: ' + props.error?.message}
    </div>
}