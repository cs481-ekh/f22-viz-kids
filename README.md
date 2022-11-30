# Movilo ![CI/CD](https://github.com/cs481-ekh/f22-viz-kids/workflows/CI/badge.svg)
BSU CS481 Capstone project


#### Deployment:
https://ptlux1517.github.io/Movilo/

#### Sample Input Data:
From a cloned copy of this repository, sample data can be loaded into Movilo from the following paths:
* `f22-viz-kids/test/fixtures/Trial001_Markers.tsv`
* `f22-viz-kids/test/fixtures/Trial001_Forces.tsv`

#### Controls:
<div style="display: flex">
  <img style="width: 49%" src="https://drive.google.com/uc?export=view&id=135LMeLqVZnSw4XF3rZUNIKb8eYWk_JEH">
  <img style="width: 49%" src="https://drive.google.com/uc?export=view&id=1ni-JPzob-sEZ13NW87M2_qgh4ondY16M">
</div>

#### Wireframe:
<img src="https://drive.google.com/uc?export=view&id=17jPsTX7J_bDDp0DaTn-C0XWKU70Gkpin">

# Movilo ![CI/CD](https://github.com/cs481-ekh/f22-viz-kids/workflows/CI/badge.svg)
BSU CS481 Capstone project


#### Deployments:
* Official: https://sdp.boisestate.edu/movilo/ 
* Development: https://ptlux1517.github.io/Movilo/

#### Building Locally:
From a cloned copy of this repository, run the following as root
```bash
echo && \
./install.sh && \
./build.sh
```
The install script needs to be run as root, since it installs node.js and npm before fetching Movilo's dependencies.

The resulting build products will be output by Webpack to the `dist` directory. Here Movilo can be opened in the browser
from `index.html`.

#### Sample Input Data:
From a cloned copy of this repository, sample data can be loaded into Movilo from the following paths:
* `f22-viz-kids/test/fixtures/Trial001_Markers.tsv`
* `f22-viz-kids/test/fixtures/Trial001_Forces.tsv`

#### Screenshot:
<img src="https://drive.google.com/uc?export=view&id=1I4wJNoIRwK4d2MxqjrB8FhFpgrLrh6Tm">

#### Controls:
<div style="display: flex">
  <img style="width: 49%" src="https://drive.google.com/uc?export=view&id=135LMeLqVZnSw4XF3rZUNIKb8eYWk_JEH">
  <img style="width: 49%" src="https://drive.google.com/uc?export=view&id=1ni-JPzob-sEZ13NW87M2_qgh4ondY16M">
</div>
<img src="https://drive.google.com/uc?export=view&id=1asx5ZW87TkxnURmaJDAUauoT30o-Oy_p">

#### Manifest:
* .github/
  * ISSUE_TEMPLATE/
    * `bug_report.md`
    * `story-template.md`
    * `task-template.md`
  * workflows/
    * `cd.yml` continuous delivery GitHub Action
    * `ci.yml` continuous integration GitHub Action
* assets/
  * images/
    * `camera-controls.png`
    * `sdp-logo-3.png`
    * `selection-controls.png`
* docs/
  * `_config.yml` Jekyll theme configuration for GitHub page 
  * `index.md` GitHub page content
* src/
  * modules/
    * `Calculations.ts` functions for computing angles, gait events, etc. from the data
    * `Export.ts` functions for exporting files, i.e. computed joint angle across a cropped gait cycle
    * `Parser.ts` functions for parsing marker and force files
  * views/
    * `FileUploadView.tsx` React component containing the file upload buttons and file name labels
    * `PopupView.tsx` React component containing the file upload error, main menu, and sdp info popups
    * `RenderView.tsx` React component containing the Three.js scene/rendering
    * `SelectionInfoView.tsx` React component containing the selected marker/force metadata output
    * `TimelineTextView.tsx` React component containing the play button, its options, the timeline, and suggested gait event buttons
    * `TimelineTrackView.tsx` React component containing the start, current, end frame/time output
  * `App.scss` master stylesheet
  * `App.tsx` main app component
  * `custom.d.ts` custom type definition for png files
  * `dataTypes.ts` interfaces for parsed marker and force data
  * `icons.tsx` icon svg elements
  * `index.tsx` app entry point
  * `segmentsConfig.ts` body segment definitions
  * `setupTests.ts` additional Jest configuration
  * `useStateRef.ts` custom React hook
* test/
  * fixtures/
    * `Trial001_Forces.tsv` full trial of force data
    * `Trial001_Markers.tsv` full trial of marker data
    * `invalid.bin` unsupported file/extension containing binary
    * `invalid.csv` supported extension, but wrong data format compared to Vicon or OpenSim output
    * `invalid.txt` supported extension, but contains mismatched quote (violating TSV standard in RFC 4180)
    * `invalid.unknown` unsupported/unidentifiable file/extension
    * `valid.csv` supported file with alternate accepted extension containing one frame of marker data
    * `valid.mot` supported file with alternate accepted extension containing one frame of force data
  * `Calculations.test.ts` Jest tests for the Calculations module functions
  * `Export.test.ts` Jest tests for the Export module functions
  * `Parser.test.ts` Jest tests for the Parser module functions
* `.eslintrc.js` ESLint configuration
* `.gitignore`
* `CONTRIBUTORS`
* `LICENSE`
* `README.md`
* `build.sh` build script (to be run after install script) which runs Webpack
* `clean.sh` script for removing build products
* `install.sh` script (to be run first) for installing all dependencies
* `jest.config.js` Jest configuration
* `package-lock.json`
* `package.json`
* `test.sh` test script which runs Jest
* `tsconfig.json` Typescript configuration
* `webpack.config.js` Webpack configuration
