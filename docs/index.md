# Members

- Colin Reeder
- Connor Jackson
- Cory Tomlinson
- Javi Trejo
- William Kenny

# Abstract

<!-- Project statement: ~200 words; descriptive enough for outsider to understand (employers & future contributors) -->

Movilo is a web app we built for Boise State University's
[Center For Othopaedic & Biomechanics Research Lab](https://www.boisestate.edu/cobr/)
that takes motion capture data in the form of a CSV/TSV file and displays it in a 3D environment. It is displayed as a
dot cloud with connected body segments that resemble the human body. There are many software programs similar to Movilo
such as Vicon Nexus, however they are very difficult for the average person to use. Movilo on the other hand can be
accessed via a link to the website it is hosted on and access data as easily as placing the data in a folder on any
computer and uploading it through the press of a button.

COBR has local high school students visit their lab to learn how they collect data about biomechanics, which was
difficult for them to demonstrate effectively using very sophisticated programs, especially to someone that is
completely new to the field. So, they wanted something simpler for scenarios like this; a program that could open a data
file and a visual could be rendered in a quick and efficient manner. Movilo does just that, it has simplicity and ease
of usability such that a high school student could swiftly begin using it, or anyone that has never seen the data or the
more complex systems the lab uses.

# Project Description

<!-- What we built -->

Movilo is built as a frontend-only webapp using React & TypeScript, with 3D rendering implemented using Three.js. Users
can load files to visualize from their local filesystem, and all processing is done in the browser itself.

<!-- How it works & Screenshots -->

Movilo accepts exported reflective marker data from Vicon Nexus and ground reaction force data from
OpenSim in TSV/CSV format. Upon marker file upload, body segments are estimated according to Vicon's plug-in gait model,
and gait events are detected and suggested below the animation timeline to enable rapid cropping of the animation. The
area to the right of the timeline also displays the time associated with the start, current, and end frames from the
loaded data.

<img src="https://drive.google.com/uc?export=view&id=19m_-A74W_B1zWyDcxXbmMVJJLT0x8sFD" alt="file upload gif">

Reflective markers are selectable for inspecting their position data corresponding to the current animation frame. Also,
upon selecting three or more markers, the resulting angle about the first marker is calculated and output to the
Selection Info area. This enables viewing key measurements, such as the hip-knee-ankle angle, both while the subject is
static and during movement.

<img src="https://drive.google.com/uc?export=view&id=1kjyfqBLoUxYX303JKAFAjzyq7a005GD0" alt="marker selection gif">

The main menu provides several help graphics, a checkbox for turning body segment rendering on and off, a selected angle
export button for generating a TSV file with the angle data from the currently cropped gait cycle, as well as a
centrally-located space for more features to be added in the future. Additionally, we see, when a force plate data file
is loaded, ground reaction force data is automatically output to the Selection Info area whenever forces are present.

<img src="https://drive.google.com/uc?export=view&id=1RSxZ0iQ2DjIVMu_cO2y1gbCkNLq3ANJw" alt="main menu gif">

Finally, the animation playback rate is adjustable below the play button to enable observing the subject's motion at an
appropriate speed for the given movement, length of trial, and measurements under observation. The animation below
demonstrates a single gait cycle with the right hip-knee-ankle angle being observed at 0.3 times speed.

<img src="https://drive.google.com/uc?export=view&id=1jPBvFOVrIarbKkUwLiE6jshbl6JIe9n0" alt="gait cycle animation gif">
