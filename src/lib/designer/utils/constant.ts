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
export const rectsd: any[] = [
  {
    "name": "矩形",
    "layout": {
      "x": 700,
      "y": 100,
      "w": 300,
      "h": 300
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
          "x": -150,
          "y": -30,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "RightAngle",
          "cornerCps": [-1, -1],
          "cps": [-1, -1]
        },
        {
          "x": 150,
          "y": -30,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "NoMirror",
          "cornerCps": [-1, -1],
          "cps": [-1, -1]
        },
        {
          "x": 150,
          "y": 50,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "MirrorAngle",
          "cornerCps": [-1, -1],
          "cps": [-1, -1]
        },
        {
          "x": -150,
          "y": 50,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "NoMirror",
          "cornerCps": [-1, -1],
          "cps": [-1, -1]
        },
        {
          "x": 10,
          "y": -150,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "NoMirror",
          "cornerCps": [-1, -1],
          "cps": [-1, -1]
        },
        {
          "x": -10,
          "y": -150,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "NoMirror",
          "cornerCps": [-1, -1],
          "cps": [-1, -1]
        },
        {
          "x": 130,
          "y": 150,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "NoMirror",
          "cornerCps": [-1, -1],
          "cps": [-1, -1]
        },
        {
          "x": -130,
          "y": 150,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "NoMirror",
          "cornerCps": [-1, -1],
          "cps": [-1, -1]
        }
      ],
      "paths": [
        [0, 1, -1, -1, -1, -1, 1],
        [2, 3, -1, -1, -1, -1, 1],
        [4, 7, -1, -1, -1, -1, 1],
        [5, 6, -1, -1, -1, -1, 1],
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
      "x": 100,
      "y": 100
    },
    "absolute": {
      "x": 100,
      "y": 100
    },
    "original": {
      "x": 100,
      "y": 100
    },
    "center": {
      "x": 150,
      "y": 250
    },
    "box": {
      "leftX": 100,
      "rightX": 200,
      "topY": 100,
      "bottomY": 400,
      "topLeft": {
        "x": 100,
        "y": 100
      },
      "topRight": {
        "x": 200,
        "y": 100
      },
      "bottomLeft": {
        "x": 100,
        "y": 400
      },
      "bottomRight": {
        "x": 200,
        "y": 400
      }
    },
    "strokeAlign": "INSIDE",
    "lineShapes": [],
    "commonPoints": []
  }
]
export const rectse: any[] = [
  {
    "name": "矩形",
    "layout": {
      "x": 700,
      "y": 100,
      "w": 300,
      "h": 300
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
          "x": -305,
          "y": -50,
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
          "x": 150,
          "y": -50,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "NoMirror",
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
          "x": 154,
          "y": 106,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "MirrorAngle",
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
          "x": -291,
          "y": 106,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "NoMirror",
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
          "x": 162,
          "y": -102,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "NoMirror",
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
          "x": -239,
          "y": -168,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "NoMirror",
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
          "x": 170,
          "y": 165,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "NoMirror",
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
          "x": -310,
          "y": 246,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "NoMirror",
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
          "x": -220,
          "y": -174,
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
          "x": -275,
          "y": 262,
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
      "paths": [
        [
          0,
          1,
          -1,
          -1,
          -1,
          -1,
          1
        ],
        [
          2,
          3,
          -1,
          -1,
          -1,
          -1,
          1
        ],
        [
          4,
          7,
          -1,
          -1,
          -1,
          -1,
          1
        ],
        [
          5,
          6,
          -1,
          -1,
          -1,
          -1,
          1
        ],
        [
          8,
          9,
          -1,
          -1,
          -1,
          -1,
          1
        ]
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
      "x": 700,
      "y": 100
    },
    "original": {
      "x": 700,
      "y": 100
    },
    "center": {
      "x": 850,
      "y": 250
    },
    "box": {
      "leftX": 700,
      "rightX": 1000,
      "topY": 100,
      "bottomY": 400,
      "topLeft": {
        "x": 700,
        "y": 100
      },
      "topRight": {
        "x": 1000,
        "y": 100
      },
      "bottomLeft": {
        "x": 700,
        "y": 400
      },
      "bottomRight": {
        "x": 1000,
        "y": 400
      }
    },
    "strokeAlign": "INSIDE",
    "lineShapes": [],
    "commonPoints": [],
    "id": "df2ab59f-ca6d-4a7b-872a-af359d8b627b"
  }
]
export const rectsf: any[] = [
  {
    "name": "矩形",
    "layout": {
      "x": 700,
      "y": 100,
      "w": 300,
      "h": 300
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
          "x": -150,
          "y": -30,
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
          "x": 150,
          "y": -30,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "NoMirror",
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
          "x": 150,
          "y": 50,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "MirrorAngle",
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
          "x": -150,
          "y": 50,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "NoMirror",
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
          "x": 10,
          "y": -150,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "NoMirror",
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
          "x": -10,
          "y": -150,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "NoMirror",
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
          "x": 130,
          "y": 150,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "NoMirror",
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
          "x": -130,
          "y": 150,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "NoMirror",
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
          "x": -168,
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
          "x": 195,
          "y": 103,
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
      "paths": [
        [
          0,
          1,
          -1,
          -1,
          -1,
          -1,
          1
        ],
        [
          2,
          3,
          -1,
          -1,
          -1,
          -1,
          1
        ],
        [
          4,
          7,
          -1,
          -1,
          -1,
          -1,
          1
        ],
        [
          5,
          6,
          -1,
          -1,
          -1,
          -1,
          1
        ],
        [
          8,
          9,
          -1,
          -1,
          -1,
          -1,
          1
        ]
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
      "x": 700,
      "y": 100
    },
    "original": {
      "x": 700,
      "y": 100
    },
    "center": {
      "x": 850,
      "y": 250
    },
    "box": {
      "leftX": 700,
      "rightX": 1000,
      "topY": 100,
      "bottomY": 400,
      "topLeft": {
        "x": 700,
        "y": 100
      },
      "topRight": {
        "x": 1000,
        "y": 100
      },
      "bottomLeft": {
        "x": 700,
        "y": 400
      },
      "bottomRight": {
        "x": 1000,
        "y": 400
      }
    },
    "strokeAlign": "INSIDE",
    "lineShapes": [],
    "commonPoints": [],
    "id": "19fbc200-c966-4f54-8939-08bb9fb7b361"
  }
]
export const rectsj: any[] = [
  {
    "name": "矩形",
    "layout": {
      "x": 250.05088174397093,
      "y": 187.15896142420058,
      "w": 421.949118256029,
      "h": 189.84103857579942
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
      "ctrlNodes": [
        {
          "x": -357.02544087198544,
          "y": -31.079480712100228
        },
        {
          "x": 230.97455912801456,
          "y": -35.07948071210032
        },
        {
          "x": -107.2754408719855,
          "y": -192.8294807121003
        },
        {
          "x": -102.77544087198541,
          "y": 184.6705192878997
        }
      ],
      "nodes": [
        {
          "x": 10.974559128014562,
          "y": 13.920519287899708,
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
          "x": -63.02544087198544,
          "y": -33.07948071210029,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "MirrorAngleAndLength",
          "cornerCps": [
            -1,
            -1
          ],
          "cps": [
            1,
            0
          ]
        },
        {
          "x": -105.02544087198544,
          "y": -4.079480712100292,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "MirrorAngleAndLength",
          "cornerCps": [
            -1,
            -1
          ],
          "cps": [
            2,
            3
          ]
        },
        {
          "x": 210.97455912801456,
          "y": -68.07948071210029,
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
          "x": 159.97455912801456,
          "y": 94.92051928789971,
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
      "paths": [
        [
          0,
          1,
          -1,
          1,
          -1,
          -1,
          2
        ],
        [
          1,
          2,
          0,
          2,
          -1,
          -1,
          3
        ],
        [
          2,
          3,
          3,
          -1,
          -1,
          -1,
          2
        ],
        [
          3,
          4,
          -1,
          -1,
          -1,
          -1,
          1
        ]
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
    "id": "9476d326-889c-4195-8ceb-0be61ff5bdcb"
  }
]
export const rectsj2: any[] = [
  {
    "name": "矩形",
    "layout": {
      "x": 152,
      "y": 165,
      "w": 926,
      "h": 250.7243709679492
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
      "ctrlNodes": [
        {
          "x": -265,
          "y": -220.36218548397457
        },
        {
          "x": -117,
          "y": 193.63781451602537
        },
        {
          "x": -341.25,
          "y": 270.8878145160254
        },
        {
          "x": -62.75,
          "y": -109.6121854839746
        }
      ],
      "nodes": [
        {
          "x": 50,
          "y": 7.637814516025401,
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
          "x": -191,
          "y": -13.3621854839746,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "MirrorAngleAndLength",
          "cornerCps": [
            -1,
            -1
          ],
          "cps": [
            1,
            0
          ]
        },
        {
          "x": -202,
          "y": 80.6378145160254,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "MirrorAngleAndLength",
          "cornerCps": [
            -1,
            -1
          ],
          "cps": [
            2,
            3
          ]
        },
        {
          "x": 56,
          "y": 99.6378145160254,
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
      "paths": [
        [
          0,
          1,
          -1,
          1,
          -1,
          -1,
          2
        ],
        [
          1,
          2,
          0,
          2,
          -1,
          -1,
          3
        ],
        [
          2,
          3,
          3,
          -1,
          -1,
          -1,
          2
        ]
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
      "x": 152,
      "y": 165
    },
    "original": {
      "x": 152,
      "y": 165
    },
    "center": {
      "x": 615,
      "y": 290.3621854839746
    },
    "box": {
      "leftX": 152,
      "rightX": 1078,
      "topY": 165,
      "bottomY": 415.7243709679492,
      "topLeft": {
        "x": 152,
        "y": 165
      },
      "topRight": {
        "x": 1078,
        "y": 165
      },
      "bottomLeft": {
        "x": 152,
        "y": 415.7243709679492
      },
      "bottomRight": {
        "x": 1078,
        "y": 415.7243709679492
      }
    },
    "strokeAlign": "INSIDE",
    "lineShapes": [],
    "commonPoints": [],
  }
]
export const rectsj3: any[] = [
  {
    "name": "矩形",
    "layout": {
      "x": 152,
      "y": 86,
      "w": 926,
      "h": 352
    },
    "rotation": 0,
    "lineWidth": 2,
    "type": "PEN",
    "radius": 0,
    "children": [],
    "borderColor": "rgb(0,0,0)",
    "fillColor": "#989898",
    "flipHorizontal": false,
    "flipVertical": false,
    "isComplete": true,
    "isCustom": true,
    "cornerRadius": 0,
    "realCornerRadius": 0,
    "penNetwork": {
      "ctrlNodes": [
        {
          "x": -557,
          "y": 63.00000000000006
        },
        {
          "x": -107,
          "y": 58.99999999999997
        },
        {
          "x": -261.25000000000006,
          "y": -172.75
        },
        {
          "x": -256.75,
          "y": 204.75
        },
        {
          "x": 517,
          "y": -145
        },
        {
          "x": 517,
          "y": -145
        }
      ],
      "nodes": [
        {
          "x": 130,
          "y": -176,
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
          "x": -332,
          "y": 61,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "MirrorAngleAndLength",
          "cornerCps": [
            -1,
            -1
          ],
          "cps": [
            1,
            0
          ]
        },
        {
          "x": -259,
          "y": 16,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "MirrorAngleAndLength",
          "cornerCps": [
            -1,
            -1
          ],
          "cps": [
            2,
            3
          ]
        },
        {
          "x": 120,
          "y": 140,
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
          "x": 463,
          "y": 142,
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
          "x": -167,
          "y": -97,
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
          "x": -463,
          "y": 91,
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
          "x": -26,
          "y": -174,
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
          "x": 316,
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
          "x": 238,
          "y": -141,
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
          "x": 517,
          "y": -145,
          "cornerRadius": 0,
          "realCornerRadius": 0,
          "handleMirroring": "MirrorAngleAndLength",
          "cornerCps": [
            -1,
            -1
          ],
          "cps": [
            5,
            4
          ]
        },
        {
          "x": 261,
          "y": -39,
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
          "x": 559,
          "y": -36,
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
          "x": 337,
          "y": -201,
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
          "x": 342,
          "y": 2,
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
          "x": 411,
          "y": -219,
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
          "x": 454,
          "y": 15,
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
      "paths": [
        [
          0,
          1,
          -1,
          1,
          -1,
          -1,
          2
        ],
        [
          1,
          2,
          0,
          2,
          -1,
          -1,
          3
        ],
        [
          2,
          3,
          3,
          -1,
          -1,
          -1,
          2
        ],
        [
          3,
          4,
          -1,
          -1,
          -1,
          -1,
          1
        ],
        [
          5,
          6,
          -1,
          -1,
          -1,
          -1,
          1
        ],
        [
          7,
          8,
          -1,
          -1,
          -1,
          -1,
          1
        ],
        [
          9,
          10,
          -1,
          -1,
          -1,
          -1,
          1
        ],
        [
          11,
          12,
          -1,
          -1,
          -1,
          -1,
          1
        ],
        [
          13,
          14,
          -1,
          -1,
          -1,
          -1,
          1
        ],
        [
          15,
          16,
          -1,
          -1,
          -1,
          -1,
          1
        ]
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
      "x": 152,
      "y": 86
    },
    "original": {
      "x": 152,
      "y": 86
    },
    "center": {
      "x": 615,
      "y": 262
    },
    "box": {
      "leftX": 152,
      "rightX": 1078,
      "topY": 86,
      "bottomY": 438,
      "topLeft": {
        "x": 152,
        "y": 86
      },
      "topRight": {
        "x": 1078,
        "y": 86
      },
      "bottomLeft": {
        "x": 152,
        "y": 438
      },
      "bottomRight": {
        "x": 1078,
        "y": 438
      }
    },
    "strokeAlign": "INSIDE",
    "lineShapes": [],
    "commonPoints": [],
  }
]
export const rectsj4: any[] = [
  {
    "name": "矩形",
    "layout": {
      "x": 200,
      "y": 50,
      "w": 200,
      "h": 400
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
      "ctrlNodes": [
        {
          x: -100,
          y: 300
        }
      ],
      "nodes": [
        {
          "x": -100,
          "y": -200,
          "cornerRadius": 50,
          "realCornerRadius": 0,
          "handleMirroring": "RightAngle",
          "cornerCps": [-1, -1],
          "cps": [-1, -1]
        },
        {
          "x": 100,
          "y": -200,
          "cornerRadius": 50,
          "realCornerRadius": 0,
          "handleMirroring": "RightAngle",
          "cornerCps": [-1, -1],
          "cps": [-1, -1]
        },
        {
          "x": 100,
          "y": 200,
          "cornerRadius": 100,
          "realCornerRadius": 0,
          "handleMirroring": "RightAngle",
          "cornerCps": [-1, -1],
          "cps": [-1, -1]
        },
        {
          "x": -100,
          "y": 200,
          "cornerRadius": 100,
          "realCornerRadius": 0,
          "handleMirroring": "RightAngle",
          "cornerCps": [-1, -1],
          "cps": [0, -1]
        },
      ],
      "paths": [
        [0, 1, -1, -1, -1, -1, 1],
        [1, 2, -1, -1, -1, -1, 1],
        [2, 3, -1, 0, -1, -1, 2],
        [3, 0, -1, -1, -1, -1, 1],
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
      "x": 528,
      "y": 101
    },
    "original": {
      "x": 528,
      "y": 101
    },
    "center": {
      "x": 635.5094339622642,
      "y": 228.19540229885058
    },
    "box": {
      "leftX": 528,
      "rightX": 743.0188679245284,
      "topY": 101,
      "bottomY": 355.39080459770116,
      "topLeft": {
        "x": 528,
        "y": 101
      },
      "topRight": {
        "x": 743.0188679245284,
        "y": 101
      },
      "bottomLeft": {
        "x": 528,
        "y": 355.39080459770116
      },
      "bottomRight": {
        "x": 743.0188679245284,
        "y": 355.39080459770116
      }
    },
    "strokeAlign": "INSIDE",
    "lineShapes": [],
    "commonPoints": [],
  }
]
export const rects: any[] = [
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
      "x": 200,
      "y": 50,
      "w": 200,
      "h": 450
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
    "isCache": false,
    "penNetwork": {
      "ctrlNodes": [
        {
          "x": -50,
          "y": 248
        }
      ],
      "paths": [
        [
          0,
          1,
          -1,
          -1,
          -1,
          -1,
          1
        ],
        [
          1,
          2,
          -1,
          -1,
          -1,
          -1,
          1
        ],
        [
          2,
          3,
          -1,
          0,
          -1,
          -1,
          2
        ],
        [
          3,
          0,
          -1,
          -1,
          -1,
          -1,
          1
        ]
      ],
      "nodes": [
        {
          "x": -100,
          "y": -225,
          "cornerRadius": 50,
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
          "x": 100,
          "y": -225,
          "cornerRadius": 50,
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
          "x": 100,
          "y": 175,
          "cornerRadius": 100,
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
          "x": -100,
          "y": 148,
          "cornerRadius": 160,
          "realCornerRadius": 0,
          "handleMirroring": "RightAngle",
          "cornerCps": [
            -1,
            -1
          ],
          "cps": [
            0,
            -1
          ]
        }
      ],
      "regions": []
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
      "x": 200,
      "y": 50
    },
    "absolute": {
      "x": 200,
      "y": 50
    },
    "original": {
      "x": 200,
      "y": 50
    },
    "center": {
      "x": 300,
      "y": 275
    },
    "box": {
      "leftX": 200,
      "rightX": 400,
      "topY": 50,
      "bottomY": 500,
      "topLeft": {
        "x": 200,
        "y": 50
      },
      "topRight": {
        "x": 400,
        "y": 50
      },
      "bottomLeft": {
        "x": 200,
        "y": 500
      },
      "bottomRight": {
        "x": 400,
        "y": 500
      }
    },
    "strokeAlign": "INSIDE",
  }
]
export const rectsj5: any[] = [
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
      "x": 200,
      "y": 50,
      "w": 200,
      "h": 430.80346820809245
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
    "isCache": false,
    "penNetwork": {
      "ctrlNodes": [
        {
          "x": -49,
          "y": 258.5982658959538
        }
      ],
      "paths": [
        [
          0,
          1,
          -1,
          -1,
          -1,
          -1,
          1
        ],
        [
          1,
          2,
          -1,
          -1,
          -1,
          -1,
          1
        ],
        [
          2,
          3,
          -1,
          0,
          -1,
          -1,
          2
        ],
        [
          3,
          0,
          -1,
          -1,
          -1,
          -1,
          1
        ]
      ],
      "nodes": [
        {
          "x": -100,
          "y": -215.40173410404623,
          "cornerRadius": 50,
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
          "x": 100,
          "y": -215.40173410404623,
          "cornerRadius": 50,
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
          "x": 100,
          "y": 184.59826589595377,
          "cornerRadius": 100,
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
          "x": -99,
          "y": 158.59826589595377,
          "cornerRadius": 383,
          "realCornerRadius": 0,
          "handleMirroring": "RightAngle",
          "cornerCps": [
            -1,
            -1
          ],
          "cps": [
            0,
            -1
          ]
        }
      ],
      "regions": []
    },
    "cache": {
      "ctrlNodes": [
        {
          "x": -49,
          "y": 258.5982658959538
        },
        {
          "x": 100,
          "y": 184.59826589595377
        },
        {
          "x": -49,
          "y": 258.5982658959538
        },
        {
          "x": -64.65067883920352,
          "y": 56.31922980390122
        },
        {
          "x": 99.99999999999999,
          "y": 184.59826589595377
        },
        {
          "x": 99.99999999999997,
          "y": 184.59826589595377
        },
        {
          "x": -49,
          "y": 258.5982658959538
        },
        {
          "x": -64.65067883920352,
          "y": 56.31922980390121
        }
      ],
      "paths": [
        [
          0,
          1,
          -1,
          -1,
          -1,
          -1,
          1
        ],
        [
          1,
          6,
          -1,
          -1,
          -1,
          -1,
          1
        ],
        [
          6,
          2,
          -1,
          -1,
          -1,
          -1,
          1
        ],
        [
          2,
          4,
          1,
          -1,
          -1,
          -1,
          2
        ],
        [
          4,
          6,
          4,
          5,
          -1,
          -1,
          3
        ],
        [
          6,
          5,
          6,
          7,
          -1,
          -1,
          3
        ],
        [
          5,
          0,
          -1,
          -1,
          -1,
          -1,
          1
        ]
      ],
      "nodes": [
        {
          "x": -100,
          "y": -215.40173410404623,
          "cornerRadius": 50,
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
          "x": 100,
          "y": -215.40173410404623,
          "cornerRadius": 50,
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
          "x": 100,
          "y": 184.59826589595377,
          "cornerRadius": 100,
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
          "x": -99,
          "y": 158.59826589595377,
          "cornerRadius": 383,
          "realCornerRadius": 0,
          "handleMirroring": "RightAngle",
          "cornerCps": [
            -1,
            -1
          ],
          "cps": [
            0,
            -1
          ]
        },
        {
          "x": 100,
          "y": 184.59826589595377,
          "t": 1
        },
        {
          "x": -99.53660584988351,
          "y": -42.09232196048228,
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
          "x": 99.99999999999996,
          "y": 184.5982658959538,
          "t": 1.1102230246251565e-16
        }
      ],
      "regions": [],
      "areas": [
        {
          "id": 0,
          "area": [
            {
              "id": 2,
              "line": [
                6,
                2,
                -1,
                -1,
                -1,
                -1,
                1
              ]
            },
            {
              "id": 3,
              "line": [
                2,
                4,
                1,
                -1,
                -1,
                -1,
                2
              ]
            },
            {
              "id": 4,
              "line": [
                4,
                6,
                4,
                5,
                -1,
                -1,
                3
              ]
            }
          ]
        },
        {
          "id": 1,
          "area": [
            {
              "id": 0,
              "line": [
                0,
                1,
                -1,
                -1,
                -1,
                -1,
                1
              ]
            },
            {
              "id": 1,
              "line": [
                1,
                6,
                -1,
                -1,
                -1,
                -1,
                1
              ]
            },
            {
              "id": 5,
              "line": [
                6,
                5,
                6,
                7,
                -1,
                -1,
                3
              ]
            },
            {
              "id": 6,
              "line": [
                5,
                0,
                -1,
                -1,
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
      "x": 200,
      "y": 50
    },
    "absolute": {
      "x": 200,
      "y": 50
    },
    "original": {
      "x": 200,
      "y": 50
    },
    "center": {
      "x": 300,
      "y": 265.4017341040462
    },
    "box": {
      "leftX": 200,
      "rightX": 400,
      "topY": 50,
      "bottomY": 480.80346820809245,
      "topLeft": {
        "x": 200,
        "y": 50
      },
      "topRight": {
        "x": 400,
        "y": 50
      },
      "bottomLeft": {
        "x": 200,
        "y": 480.80346820809245
      },
      "bottomRight": {
        "x": 400,
        "y": 480.80346820809245
      }
    },
    "strokeAlign": "INSIDE",
    "id": "2820ad0e-4888-4e30-9fa8-3f8431ee0447"
  }
]
export const rectsj6: any[] = [
  {
    "name": "矩形",
    "layout": {
      "x": 200,
      "y": 50,
      "w": 200,
      "h": 400
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
      "ctrlNodes": [
        {
          x: -100,
          y: 200
        }
      ],
      "nodes": [
        {
          "x": -100,
          "y": -200,
          "cornerRadius": 50,
          "realCornerRadius": 0,
          "handleMirroring": "RightAngle",
          "cornerCps": [-1, -1],
          "cps": [-1, -1]
        },
        {
          "x": 100,
          "y": -200,
          "cornerRadius": 50,
          "realCornerRadius": 0,
          "handleMirroring": "RightAngle",
          "cornerCps": [-1, -1],
          "cps": [-1, -1]
        },
        {
          "x": 100,
          "y": 200,
          "cornerRadius": 150,
          "realCornerRadius": 0,
          "handleMirroring": "RightAngle",
          "cornerCps": [-1, -1],
          "cps": [-1, -1]
        },
        {
          "x": -100,
          "y": 200,
          "cornerRadius": 100,
          "realCornerRadius": 0,
          "handleMirroring": "RightAngle",
          "cornerCps": [-1, -1],
          "cps": [-1, -1]
        },
      ],
      "paths": [
        [0, 1, -1, -1, -1, -1, 1],
        [1, 2, -1, -1, -1, -1, 1],
        [2, 3, -1, -1, -1, -1, 1],
        [3, 0, -1, -1, -1, -1, 1],
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
      "x": 528,
      "y": 101
    },
    "original": {
      "x": 528,
      "y": 101
    },
    "center": {
      "x": 635.5094339622642,
      "y": 228.19540229885058
    },
    "box": {
      "leftX": 528,
      "rightX": 743.0188679245284,
      "topY": 101,
      "bottomY": 355.39080459770116,
      "topLeft": {
        "x": 528,
        "y": 101
      },
      "topRight": {
        "x": 743.0188679245284,
        "y": 101
      },
      "bottomLeft": {
        "x": 528,
        "y": 355.39080459770116
      },
      "bottomRight": {
        "x": 743.0188679245284,
        "y": 355.39080459770116
      }
    },
    "strokeAlign": "INSIDE",
    "lineShapes": [],
    "commonPoints": [],
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