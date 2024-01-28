import {FontWeight, P, ShapeType, StrokeAlign, TextMode} from "../types/type"
import {FontFamily, TextAlign} from "../config/TextConfig"
import {HandleMirroring, PenConfig} from "../config/PenConfig"

export const fontFamilies = [
  {
    label: '思源黑体',
    value: FontFamily.SourceHanSansCN,
  },
  {
    label: '思源宋体',
    value: FontFamily.SourceHanSerifCN,
  }
]

export const fontWeight = [
  {label: 'Light', value: FontWeight.LIGHT,},
  {label: 'Regular', value: FontWeight.REGULAR,},
  {label: 'Normal', value: FontWeight.Normal},
  {label: 'Medium', value: FontWeight.MEDIUM},
  {label: 'Bold', value: FontWeight.BOLD,},
  {label: 'Heavy', value: FontWeight.HEAVY,},
]

export const fontSize = [
  {label: '10', value: 10,},
  {label: '12', value: 12,},
  {label: '14', value: 14,},
  {label: '16', value: 16,},
  {label: '18', value: 18,},
  {label: '20', value: 20,},
  {label: '24', value: 24,},
  {label: '32', value: 32,},
  {label: '36', value: 36,},
  {label: '40', value: 40,},
  {label: '48', value: 48,},
  {label: '64', value: 64,},
  {label: '96', value: 96,},
  {label: '128', value: 128,},
  {label: '256', value: 256,},
]

export const Colors = {
  Primary: '#4B75F6FF',
  Select: 'rgba(75,117,246,0.1)',
  Line: 'rgb(217,217,217)',
  Line2: 'rgb(140,140,140)',
  FillColor: 'rgb(241,238,238)',
  Border: 'rgb(140,140,140)',
  White: 'white',
  Transparent: 'transparent',
}

export const r = [
  {
    "x": 0,
    "y": 0,
    "w": 0,
    "h": 0,
    "rotation": 0,
    "lineWidth": 2,
    "type": "RULER",
    "color": "gray",
    "radius": 0,
    "children": [],
    "brokenTexts": [],
    "borderColor": "rgb(216,216,216)",
    "fillColor": "rgb(48,48,48)",
    "fontSize": 16,
    "fontWeight": 500,
    "fontFamily": "SourceHanSansCN",
    "texts": [],
    "name": "直尺-横",
    "flipHorizontal": false,
    "flipVertical": false,
    "nameWidth": 61.787109375,
    "data": {
      "direction": "horizontal"
    },
    "id": "14c8a103-bcdb-4b28-92c9-80fb0bc0d5d5",
    "percent": {
      "x": 0,
      "y": 0
    },
    "absolute": {
      "x": 0,
      "y": 0
    },
    "original": {
      "x": 0,
      "y": 0
    },
    "center": {
      "x": 0,
      "y": 0
    },
    "topLeft": {
      "x": 0,
      "y": 0
    },
    "topRight": {
      "x": 0,
      "y": 0
    },
    "bottomLeft": {
      "x": 0,
      "y": 0
    },
    "bottomRight": {
      "x": 0,
      "y": 0
    },
    "box": {
      "leftX": 0,
      "rightX": 0,
      "topY": 0,
      "bottomY": 0
    }
  },
  {
    "x": 0,
    "y": 0,
    "w": 0,
    "h": 0,
    "rotation": 0,
    "lineWidth": 2,
    "type": "RULER",
    "color": "gray",
    "radius": 0,
    "children": [],
    "brokenTexts": [],
    "borderColor": "rgb(216,216,216)",
    "fillColor": "rgb(48,48,48)",
    "fontSize": 16,
    "fontWeight": 500,
    "fontFamily": "SourceHanSansCN",
    "texts": [],
    "data": {
      "direction": "vertical"
    },
    "name": "直尺-竖",
    "flipHorizontal": false,
    "flipVertical": false,
    "nameWidth": 61.787109375,
    "id": "a3bf6f0e-e3f5-4553-845f-7ce6e0fdbe76",
    "percent": {
      "x": 0,
      "y": 0
    },
    "absolute": {
      "x": 0,
      "y": 0
    },
    "original": {
      "x": 0,
      "y": 0
    },
    "center": {
      "x": 0,
      "y": 0
    },
    "topLeft": {
      "x": 0,
      "y": 0
    },
    "topRight": {
      "x": 0,
      "y": 0
    },
    "bottomLeft": {
      "x": 0,
      "y": 0
    },
    "bottomRight": {
      "x": 0,
      "y": 0
    },
    "box": {
      "leftX": 0,
      "rightX": 0,
      "topY": 0,
      "bottomY": 0
    }
  },
  {
    "name": "容器",
    "x": 146.2634901753852,
    "y": 137.62670925627543,
    "w": 400,
    "h": 200,
    "rotation": 20,
    "lineWidth": 2,
    "type": "FRAME",
    "color": "gray",
    "radius": 0,
    "children": [
      {
        children: [
          {
            "x": 0,
            "y": 0,
            "w": 100,
            "h": 50,
            "rotation": 0,
            "lineWidth": 2,
            "type": "RECTANGLE",
            "radius": 0,
            "brokenTexts": [],
            "borderColor": "rgb(216,216,216)",
            "fillColor": "rgb(216,216,216)",
            "fontSize": 16,
            "fontWeight": 500,
            "fontFamily": "SourceHanSansCN",
            "texts": [],
            "name": "矩形",
            "leftX": 1396.6517760479487,
            "rightX": 1523.9908970134784,
            "topY": 107.21652274196168,
            "bottomY": 257.2165227419617,
            "points": [],
            "center": {
              "x": 234.2215165449864,
              "y": 276.05858996720315
            },
            "topLeft": {
              "x": 180.98513393363953,
              "y": 177.74334411764897
            },
            "topRight": {
              "x": 344.8155427914379,
              "y": 292.4586313878582
            },
            "bottomLeft": {
              "x": 123.62749029853492,
              "y": 259.65854854654816
            },
            "bottomRight": {
              "x": 287.45789915633327,
              "y": 374.3738358167574
            },
            "flipHorizontal": false,
            "flipVertical": false,
            "nameWidth": 36,
            "percent": {
              "x": 0.075,
              "y": 0.25
            },
            "absolute": {
              "x": 180.98513393363953,
              "y": 177.74334411764897
            },
            "original": {
              "x": 134.22151654498643,
              "y": 226.05858996720315
            },
            "box": {
              "leftX": 134.2215165449864,
              "rightX": 334.2215165449864,
              "topY": 226.05858996720315,
              "bottomY": 326.05858996720315
            },
          }
        ],
        "x": 46.34836962621918,
        "y": 25.82180417529449,
        "w": 200,
        "h": 100,
        "rotation": 15,
        "lineWidth": 2,
        "type": "FRAME",
        "color": "gray",
        "radius": 0,
        "brokenTexts": [],
        "borderColor": "rgb(216,216,216)",
        "fillColor": "rgb(199,145,145)",
        "fontSize": 16,
        "fontWeight": 500,
        "fontFamily": "SourceHanSansCN",
        "texts": [],
        "name": "容器1",
        "points": [],
        "center": {
          "x": 234.2215165449864,
          "y": 276.05858996720315
        },
        "topLeft": {
          "x": 180.98513393363953,
          "y": 177.74334411764897
        },
        "topRight": {
          "x": 344.8155427914379,
          "y": 292.4586313878582
        },
        "bottomLeft": {
          "x": 123.62749029853492,
          "y": 259.65854854654816
        },
        "bottomRight": {
          "x": 287.45789915633327,
          "y": 374.3738358167574
        },
        "flipHorizontal": false,
        "flipVertical": false,
        "nameWidth": 40,
        "percent": {
          "x": 0.075,
          "y": 0.25
        },
        "absolute": {
          "x": 180.98513393363953,
          "y": 177.74334411764897
        },
        "original": {
          "x": 134.22151654498643,
          "y": 226.05858996720315
        },
        "box": {
          "leftX": 134.2215165449864,
          "rightX": 334.2215165449864,
          "topY": 226.05858996720315,
          "bottomY": 326.05858996720315
        },
        "id": "bf820ba9-f8b4-4c28-b1c8-3b7536220dec"
      }
    ],
    "borderColor": "rgb(216,216,216)",
    "fillColor": "white",
    "center": {
      "x": 300,
      "y": 300
    },
    "leftX": 486,
    "rightX": 898,
    "topY": 72,
    "bottomY": 516,
    "topLeft": {
      "x": 146.2634901753852,
      "y": 137.62670925627543
    },
    "topRight": {
      "x": 522.1405384897486,
      "y": 274.4347665865429
    },
    "bottomLeft": {
      "x": 77.85946151025144,
      "y": 325.5652334134571
    },
    "bottomRight": {
      "x": 453.7365098246148,
      "y": 462.37329074372457
    },
    "nameWidth": 36,
    "percent": {
      "x": 0,
      "y": 0
    },
    "absolute": {
      "x": 146.2634901753852,
      "y": 137.62670925627543
    },
    "original": {
      "x": 100,
      "y": 200
    },
    "box": {
      "leftX": 100,
      "rightX": 500,
      "topY": 200,
      "bottomY": 400
    },
    "id": "7a0272a8-b433-464d-a09b-37c21e15fd0d"
  },
  {
    "x": 233,
    "y": 0,
    "w": 0,
    "h": 20,
    "rotation": 0,
    "lineWidth": 2,
    "type": "RULER_LINE",
    "radius": 0,
    "children": [],
    "borderColor": "rgb(216,216,216)",
    "fillColor": "red",
    "data": {
      "direction": "vertical"
    },
    "nameWidth": 87.7587890625,
    "id": "642f8440-e8f5-479c-9771-615c14784ce7",
    "percent": {
      "x": 0,
      "y": 0
    },
    "absolute": {
      "x": 233,
      "y": 0
    },
    "original": {
      "x": 233,
      "y": 0
    },
    "center": {
      "x": 233,
      "y": 10
    },
    "topLeft": {
      "x": 233,
      "y": 0
    },
    "topRight": {
      "x": 233,
      "y": 0
    },
    "bottomLeft": {
      "x": 233,
      "y": 20
    },
    "bottomRight": {
      "x": 233,
      "y": 20
    },
    "box": {
      "leftX": 233,
      "rightX": 233,
      "topY": 0,
      "bottomY": 20
    }
  },
  {
    "x": 299,
    "y": 0,
    "w": 0,
    "h": 20,
    "rotation": 0,
    "lineWidth": 2,
    "type": "RULER_LINE",
    "radius": 0,
    "children": [],
    "borderColor": "rgb(216,216,216)",
    "fillColor": "red",
    "data": {
      "direction": "vertical"
    },
    "nameWidth": 87.7587890625,
    "id": "54470592-43ba-4691-90f9-fcd71e14d392",
    "percent": {
      "x": 0,
      "y": 0
    },
    "absolute": {
      "x": 299,
      "y": 0
    },
    "original": {
      "x": 299,
      "y": 0
    },
    "center": {
      "x": 299,
      "y": 10
    },
    "topLeft": {
      "x": 299,
      "y": 0
    },
    "topRight": {
      "x": 299,
      "y": 0
    },
    "bottomLeft": {
      "x": 299,
      "y": 20
    },
    "bottomRight": {
      "x": 299,
      "y": 20
    },
    "box": {
      "leftX": 299,
      "rightX": 299,
      "topY": 0,
      "bottomY": 20
    }
  },
  {
    "x": 0,
    "y": 177,
    "w": 0,
    "h": 20,
    "rotation": 0,
    "lineWidth": 2,
    "type": "RULER_LINE",
    "radius": 0,
    "children": [],
    "borderColor": "rgb(216,216,216)",
    "fillColor": "red",
    "data": {
      "direction": "horizontal"
    },
    "nameWidth": 87.7587890625,
    "id": "350296d6-2452-4287-9a2a-f3c5197014a0",
    "percent": {
      "x": 0,
      "y": 0
    },
    "absolute": {
      "x": 0,
      "y": 177
    },
    "original": {
      "x": 0,
      "y": 177
    },
    "center": {
      "x": 0,
      "y": 187
    },
    "topLeft": {
      "x": 0,
      "y": 177
    },
    "topRight": {
      "x": 0,
      "y": 177
    },
    "bottomLeft": {
      "x": 0,
      "y": 197
    },
    "bottomRight": {
      "x": 0,
      "y": 197
    },
    "box": {
      "leftX": 0,
      "rightX": 0,
      "topY": 177,
      "bottomY": 197
    }
  },
  {
    "x": 287,
    "y": 0,
    "w": 0,
    "h": 20,
    "rotation": 0,
    "lineWidth": 2,
    "type": "RULER_LINE",
    "radius": 0,
    "children": [],
    "borderColor": "rgb(216,216,216)",
    "fillColor": "red",
    "data": {
      "direction": "vertical"
    },
    "nameWidth": 87.7587890625,
    "id": "0f15a57d-4186-4c25-99ee-60fe8dbcffbe",
    "percent": {
      "x": 0,
      "y": 0
    },
    "absolute": {
      "x": 287,
      "y": 0
    },
    "original": {
      "x": 287,
      "y": 0
    },
    "center": {
      "x": 287,
      "y": 10
    },
    "topLeft": {
      "x": 287,
      "y": 0
    },
    "topRight": {
      "x": 287,
      "y": 0
    },
    "bottomLeft": {
      "x": 287,
      "y": 20
    },
    "bottomRight": {
      "x": 287,
      "y": 20
    },
    "box": {
      "leftX": 287,
      "rightX": 287,
      "topY": 0,
      "bottomY": 20
    }
  }
]
const rule = [
  {
    "x": 0,
    "y": 0,
    "w": 0,
    "h": 0,
    "rotation": 0,
    "lineWidth": 2,
    "type": ShapeType.RULER,
    "color": "gray",
    "radius": 0,
    "children": [],
    "brokenTexts": [],
    "borderColor": "rgb(216,216,216)",
    "fillColor": "rgb(48,48,48)",
    "fontSize": 16,
    "fontWeight": 500,
    "fontFamily": "SourceHanSansCN",
    "texts": [],
    "name": "直尺-横",
    "flipHorizontal": false,
    "flipVertical": false,
    "nameWidth": 36,
    data: {
      direction: 'horizontal'
    }
  },
  {
    "x": 0,
    "y": 0,
    "w": 0,
    "h": 0,
    "rotation": 0,
    "lineWidth": 2,
    "type": ShapeType.RULER,
    "color": "gray",
    "radius": 0,
    "children": [],
    "brokenTexts": [],
    "borderColor": "rgb(216,216,216)",
    "fillColor": "rgb(48,48,48)",
    "fontSize": 16,
    "fontWeight": 500,
    "fontFamily": "SourceHanSansCN",
    "texts": [],
    data: {
      direction: 'vertical'
    },
    "name": "直尺-竖",
    "flipHorizontal": false,
    "flipVertical": false,
    "nameWidth": 36,
  },
]
let temp = {
  "name": "容器2-1",
  layout: {
    "x": 300,
    "y": 20,
    "w": 250,
    "h": 200,
  },
  "rotation": 0,
  "lineWidth": 2,
  "type": ShapeType.RECTANGLE,
  "color": "gray",
  "radius": 0,
  children: [],
  "borderColor": "rgb(216,216,216)",
  "fillColor": "rgb(241,238,238)",
  flipHorizontal: false,
  flipVertical: false
}
export const rects: any[] = [
  {
    use:false,
    "name": "矩形",
    "layout": {
      "x": 250,
      "y": 200,
      "w": 400,
      "h": 200
    },
    "rotation": 0,
    "lineWidth": 2,
    "type": "PEN",
    "radius": 0,
    "children": [],
    "borderColor": "rgb(0,0,0)",
    "fillColor": "#4C4C4C",
    "flipHorizontal": false,
    "flipVertical": false,
    "isComplete": true,
    "isCustom": true,
    "cornerRadius": 0,
    "realCornerRadius": 0,
    "penNetwork": {
      "ctrlNodes": [],
      "nodes": [
        {
          "x": -200,
          "y": -100,
          "cornerRadius": 100,
          "realCornerRadius": 100,
          "handleMirroring": "RightAngle",
          "cornerCps": [
            -1,
            -1
          ],
          "cps": [
            -1,
            -1
          ]
        },
        {
          "x": 200,
          "y": -100,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "RightAngle",
          "cornerCps": [
            -1,
            -1
          ],
          "cps": [
            -1,
            -1
          ]
        },
        {
          "x": 200,
          "y": 100,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "RightAngle",
          "cornerCps": [
            -1,
            -1
          ],
          "cps": [
            -1,
            -1
          ]
        },
        {
          "x": -200,
          "y": 100,
          "cornerRadius": 50,
          "realCornerRadius": 50,
          "handleMirroring": "RightAngle",
          "cornerCps": [
            -1,
            -1
          ],
          "cps": [
            -1,
            -1
          ]
        },
      ],
      "paths": [
        [0, 1, -1, -1, 1],
        [1, 2, -1, -1, 1],
        [2, 3, -1, -1, 1],
        [3, 0, -1, -1, 1],
      ],
      "regions": []
    },
    "percent": {
      "x": 0,
      "y": 0
    },
    "relativeCenter": {
      "x": 0,
      "y": 0
    },
    "realRotation": 0,
    "start": {
      "x": 700,
      "y": 100
    },
    "absolute": {
      "x": 250.05088174397093,
      "y": 187.15896142420058
    },
    "original": {
      "x": 250.05088174397093,
      "y": 187.15896142420058
    },
    "center": {
      "x": 461.02544087198544,
      "y": 282.0794807121003
    },
    "box": {
      "leftX": 250.05088174397093,
      "rightX": 672,
      "topY": 187.15896142420058,
      "bottomY": 377,
      "topLeft": {
        "x": 250.05088174397093,
        "y": 187.15896142420058
      },
      "topRight": {
        "x": 672,
        "y": 187.15896142420058
      },
      "bottomLeft": {
        "x": 250.05088174397093,
        "y": 377
      },
      "bottomRight": {
        "x": 672,
        "y": 377
      }
    },
    "strokeAlign": "INSIDE",
    "lineShapes": [],
    "commonPoints": [],
  },
  {
    "lineWidth": 2,
    "fillColor": "#4C4C4C",
    "borderColor": "rgb(0,0,0)",
    "children": [],
    "flipHorizontal": false,
    "flipVertical": false,
    "radius": 0,
    "lineShapes": [],
    "cacheLineShapes": [],
    "commonPoints": [],
    "rotation": 0,
    "layout": {
      "x": 174,
      "y": 29,
      "w": 359,
      "h": 148
    },
    "isCustom": true,
    "isVisible": false,
    "isLocked": false,
    "cornerSmooth": 0,
    "cornerRadius": 0,
    "topLeftRadius": 0,
    "topRightRadius": 0,
    "bottomLeftRadius": 0,
    "bottomRightRadius": 0,
    "opacity": 0,
    "blendMode": 0,
    "isMask": false,
    "effects": [],
    "isCache": true,
    "penNetwork": {
      "ctrlNodes": [],
      "paths": [
        [
          4,
          5,
          -1,
          -1,
          1
        ],
        [
          5,
          6,
          -1,
          -1,
          1
        ],
        [
          6,
          7,
          -1,
          -1,
          1
        ],
        [
          4,
          8,
          -1,
          -1,
          1
        ],
        [
          8,
          9,
          -1,
          -1,
          1
        ]
      ],
      "nodes": [
        {
          "x": -91.5,
          "y": 105,
          "cornerRadius": 100,
          "realCornerRadius": 100,
          "handleMirroring": "RightAngle",
          "cornerCps": [
            -1,
            -1
          ],
          "cps": [
            -1,
            -1
          ]
        },
        {
          "x": 308.5,
          "y": 105,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "RightAngle",
          "cornerCps": [
            -1,
            -1
          ],
          "cps": [
            -1,
            -1
          ]
        },
        {
          "x": 308.5,
          "y": 305,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "RightAngle",
          "cornerCps": [
            -1,
            -1
          ],
          "cps": [
            -1,
            -1
          ]
        },
        {
          "x": -91.5,
          "y": 305,
          "cornerRadius": 50,
          "realCornerRadius": 50,
          "handleMirroring": "RightAngle",
          "cornerCps": [
            -1,
            -1
          ],
          "cps": [
            -1,
            -1
          ]
        },
        {
          "x": -179.5,
          "y": -42,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "RightAngle",
          "cornerCps": [
            -1,
            -1
          ],
          "cps": [
            -1,
            -1
          ]
        },
        {
          "x": 179.5,
          "y": -40,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "RightAngle",
          "cornerCps": [
            -1,
            -1
          ],
          "cps": [
            -1,
            -1
          ]
        },
        {
          "x": 38.5,
          "y": 74,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "RightAngle",
          "cornerCps": [
            -1,
            -1
          ],
          "cps": [
            -1,
            -1
          ]
        },
        {
          "x": -19.5,
          "y": -74,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "RightAngle",
          "cornerCps": [
            -1,
            -1
          ],
          "cps": [
            -1,
            -1
          ]
        },
        {
          "x": 116.5,
          "y": 176,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "RightAngle",
          "cornerCps": [
            -1,
            -1
          ],
          "cps": [
            -1,
            -1
          ]
        },
        {
          "x": 110.5,
          "y": -6,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "RightAngle",
          "cornerCps": [
            -1,
            -1
          ],
          "cps": [
            -1,
            -1
          ]
        }
      ],
      "regions": []
    },
    "cache": {
      "ctrlNodes": [],
      "paths": [
        [
          4,
          10,
          -1,
          -1,
          1
        ],
        [
          10,
          5,
          -1,
          -1,
          1
        ],
        [
          5,
          11,
          -1,
          -1,
          1
        ],
        [
          11,
          6,
          -1,
          -1,
          1
        ],
        [
          6,
          10,
          -1,
          -1,
          1
        ],
        [
          10,
          7,
          -1,
          -1,
          1
        ],
        [
          4,
          8,
          -1,
          -1,
          1
        ],
        [
          8,
          11,
          -1,
          -1,
          1
        ],
        [
          11,
          9,
          -1,
          -1,
          1
        ]
      ],
      "nodes": [
        {
          "x": -91.5,
          "y": 105,
          "cornerRadius": 100,
          "realCornerRadius": 100,
          "handleMirroring": "RightAngle",
          "cornerCps": [
            -1,
            -1
          ],
          "cps": [
            -1,
            -1
          ]
        },
        {
          "x": 308.5,
          "y": 105,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "RightAngle",
          "cornerCps": [
            -1,
            -1
          ],
          "cps": [
            -1,
            -1
          ]
        },
        {
          "x": 308.5,
          "y": 305,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "RightAngle",
          "cornerCps": [
            -1,
            -1
          ],
          "cps": [
            -1,
            -1
          ]
        },
        {
          "x": -91.5,
          "y": 305,
          "cornerRadius": 50,
          "realCornerRadius": 50,
          "handleMirroring": "RightAngle",
          "cornerCps": [
            -1,
            -1
          ],
          "cps": [
            -1,
            -1
          ]
        },
        {
          "x": -179.5,
          "y": -42,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "RightAngle",
          "cornerCps": [
            -1,
            -1
          ],
          "cps": [
            -1,
            -1
          ]
        },
        {
          "x": 179.5,
          "y": -40,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "RightAngle",
          "cornerCps": [
            -1,
            -1
          ],
          "cps": [
            -1,
            -1
          ]
        },
        {
          "x": 38.5,
          "y": 74,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "RightAngle",
          "cornerCps": [
            -1,
            -1
          ],
          "cps": [
            -1,
            -1
          ]
        },
        {
          "x": -19.5,
          "y": -74,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "RightAngle",
          "cornerCps": [
            -1,
            -1
          ],
          "cps": [
            -1,
            -1
          ]
        },
        {
          "x": 116.5,
          "y": 176,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "RightAngle",
          "cornerCps": [
            -1,
            -1
          ],
          "cps": [
            -1,
            -1
          ]
        },
        {
          "x": 110.5,
          "y": -6,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "RightAngle",
          "cornerCps": [
            -1,
            -1
          ],
          "cps": [
            -1,
            -1
          ]
        },
        {
          "x": -6.581937528293338,
          "y": -41.03666817564509
        },
        {
          "x": 111.19961284445456,
          "y": 15.221589615121843
        }
      ],
      "regions": [],
      "areas": [
        {
          "id": 0,
          "area": [
            {
              "id": 1,
              "line": [
                10,
                5,
                -1,
                -1,
                1
              ]
            },
            {
              "id": 2,
              "line": [
                5,
                11,
                -1,
                -1,
                1
              ]
            },
            {
              "id": 3,
              "line": [
                11,
                6,
                -1,
                -1,
                1
              ]
            },
            {
              "id": 4,
              "line": [
                6,
                10,
                -1,
                -1,
                1
              ]
            }
          ]
        }
      ]
    },
    "name": "矩形",
    "type": "PEN",
    "isComplete": true,
    "realCornerRadius": 0,
    "percent": {
      "x": 0,
      "y": 0
    },
    "relativeCenter": {
      "x": 0,
      "y": 0
    },
    "realRotation": 0,
    "start": {
      "x": 250,
      "y": 200
    },
    "absolute": {
      "x": 174,
      "y": 29
    },
    "original": {
      "x": 174,
      "y": 29
    },
    "center": {
      "x": 353.5,
      "y": 103
    },
    "box": {
      "leftX": 174,
      "rightX": 533,
      "topY": 29,
      "bottomY": 177,
      "topLeft": {
        "x": 174,
        "y": 29
      },
      "topRight": {
        "x": 533,
        "y": 29
      },
      "bottomLeft": {
        "x": 174,
        "y": 177
      },
      "bottomRight": {
        "x": 533,
        "y": 177
      }
    },
    "strokeAlign": "INSIDE",
    "id": "208812ae-8364-4b6a-b61b-26f3ae44e920"
  }
]

const defaultCurrentMat = [
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1,
]
const defaultHandMove = {x: 0, y: 0}
export const defaultConfig = {
  // handScale: 3.0517578125,
  // handMove: {x: -1201.48828125, y: -872.4208984375},
  // currentMat: [3.0517578125, 0, 0, 0, 0, 3.0517578125, 0, 0, 0, 0, 1, 0, -1201.48828125, -872.4208984375, 0, 1],
  // handScale: 14.31452465057373,
  // handMove: {x: -6445.2578125, y: -3923.02783203125},
  // currentMat: [14.31452465057373, 0, 0, 0, 0, 14.31452465057373, 0, 0, 0, 0, 1, 0, -6445.2578125, -3923.02783203125, 0, 1],
  handScale: 1,
  currentMat: defaultCurrentMat,
  handMove: defaultHandMove,
  shapes: rects,
  lineWidth: 2,
  strokeStyle: Colors.Primary,
  fillStyle: Colors.FillColor
}