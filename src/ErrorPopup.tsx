import * as React from "react";

interface Props {
    error: Error|null;
}

const style: React.CSSProperties = {
    zIndex: 2,
    padding: 15,
    whiteSpace: 'pre',
    overflow: 'scroll',
    color: '#AA0000',
    backgroundColor: '#202020CC',
    height: 420,
    fontFamily: 'monospace, sans-serif',
    fontSize: 12,
    cursor: 'text'
}

export default function ErrorPopup(props: Props) {
    return <div style={props.error ? {visibility: 'visible',...style} : {visibility: 'hidden',...style}}>
        {'Error: ' + props.error?.message}
    </div>
}