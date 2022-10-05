import * as React from "react";

function Icon(props: React.HTMLAttributes<SVGElement>) {
	return <svg viewBox="0 0 36 36" fill="currentColor" stroke="currentColor" {...props} />;
}

export function PlayIcon() {
	return <Icon>
		<path d="M 2 1 l 32 17 l -32 17 z" />
	</Icon>;
}

export function PauseIcon() {
	return <Icon>
		<rect x="2" y="1" width="12" height="34" />
		<rect x="22" y="1" width="12" height="34" />
	</Icon>;
}
