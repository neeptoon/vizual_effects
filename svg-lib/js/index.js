console.log('hellog')

import {SVG} from '../libraries/svg.js';


var draw = SVG().addTo('body').size(300, 300)
var rect = draw.rect(100, 100).attr({ fill: '#f06' })
