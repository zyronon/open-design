import {FontWeight, ShapeType, StrokeAlign} from "./type"
import {FontFamily} from "../config/TextConfig"

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
  Line: 'rgb(217,217,217)',
  Line2: 'rgb(140,140,140)',
  FillColor: 'rgb(241,238,238)',
  Border: 'rgb(140,140,140)',
  White: 'white',
}

export const rects2 = [
  {
    "x": 1248,
    "y": 50,
    "rx": 1248,
    "ry": 50,
    "w": 280,
    "h": 580,
    "rotation": 0,
    "lineWidth": 2,
    "type": 102,
    "color": "gray",
    "radius": 40,
    "children": [
      {
        "rx": -58,
        "ry": 7,
        "x": 1190,
        "y": 57,
        "w": 200,
        "h": 400,
        "rotation": 0,
        "lineWidth": 2,
        "type": 102,
        "color": "gray",
        "radius": 40,
        "children": [
          {
            "rx": 20,
            "ry": 10,
            "x": 1210,
            "y": 67,
            "w": 100,
            "h": 200,
            "rotation": 0,
            "lineWidth": 2,
            "type": 102,
            "color": "gray",
            "radius": 40,
            "children": [
              {
                "rx": 20,
                "ry": 10,
                "x": 1230,
                "y": 77,
                "w": 50,
                "h": 100,
                "rotation": 0,
                "lineWidth": 2,
                "type": 102,
                "color": "gray",
                "radius": 20,
                "children": [],
                "brokenTexts": [],
                "borderColor": "rgb(216,216,216)",
                "fillColor": "rgb(216,216,216)",
                "fontSize": 0,
                "texts": [],
                "name": "孙矩形111111",
                "leftX": 1230,
                "rightX": 1280,
                "topY": 77,
                "bottomY": 177,
                "id": "bb3b6d65-008b-431a-92f3-55f3d4f987b1",
                "centerX": 1255,
                "centerY": 127
              }
            ],
            "brokenTexts": [],
            "borderColor": "rgb(216,216,216)",
            "fillColor": "rgb(216,216,216)",
            "fontSize": 0,
            "texts": [],
            "name": "子组件111111111",
            "leftX": 1210,
            "rightX": 1310,
            "topY": 67,
            "bottomY": 267,
            "id": "207d7573-5d38-46ec-b80f-ef73fdd25573",
            "centerX": 1260,
            "centerY": 167
          },
          {
            "rx": 20,
            "ry": 250,
            "x": 1210,
            "y": 307,
            "w": 100,
            "h": 200,
            "rotation": 0,
            "lineWidth": 2,
            "type": 102,
            "color": "gray",
            "radius": 40,
            "children": [
              {
                "rx": -40.80000000000001,
                "ry": 95.39999999999998,
                "x": 1169.2,
                "y": 402.4,
                "w": 183,
                "h": 100,
                "rotation": 10,
                "lineWidth": 2,
                "type": 102,
                "color": "gray",
                "radius": 20,
                "children": [],
                "brokenTexts": [],
                "borderColor": "rgb(216,216,216)",
                "fillColor": "rgb(216,216,216)",
                "fontSize": 0,
                "texts": [],
                "name": "孙矩形222222222",
                "leftX": 1169.2,
                "rightX": 1352.2,
                "topY": 402.4,
                "bottomY": 502.4,
                "id": "997d0f37-4f52-4bc4-a081-ac8a305722d0",
                "centerX": 1260.7,
                "centerY": 452.4
              }
            ],
            "brokenTexts": [],
            "borderColor": "rgb(216,216,216)",
            "fillColor": "rgb(216,216,216)",
            "fontSize": 0,
            "texts": [],
            "name": "子组件222222",
            "leftX": 1210,
            "rightX": 1310,
            "topY": 307,
            "bottomY": 507,
            "id": "3c8bb38f-b1ec-43a0-b149-dcb169404773",
            "centerX": 1260,
            "centerY": 407
          }
        ],
        "brokenTexts": [],
        "borderColor": "rgb(216,216,216)",
        "fillColor": "rgb(216,216,216)",
        "fontSize": 0,
        "texts": [],
        "name": "父组件",
        "leftX": 1190,
        "rightX": 1390,
        "topY": 57,
        "bottomY": 457,
        "id": "9c2ed082-7b4e-4798-8a2a-addaf01c3b95",
        "centerX": 1290,
        "centerY": 257
      }
    ],
    "brokenTexts": [],
    "borderColor": "rgb(216,216,216)",
    "fillColor": "rgb(216,216,216)",
    "fontSize": 16,
    "fontWeight": 500,
    "fontFamily": "SourceHanSansCN",
    "texts": [],
    "name": "容器",
    "leftX": 1248,
    "rightX": 1528,
    "topY": 50,
    "bottomY": 630,
    "id": "cd973e70-08e8-471a-814d-61966b891d5a",
    "centerX": 1388,
    "centerY": 340
  },
  {
    "x": 300,
    "y": 100,
    "rx": 338,
    "ry": 104,
    "w": 500,
    "h": 500,
    "rotation": 0,
    "lineWidth": 2,
    "type": 102,
    "color": "gray",
    "radius": 10,
    "children": [
      {
        "rx": 34,
        "ry": 43,
        "x": 334,
        "y": 143,
        "w": 150,
        "h": 170,
        "rotation": 351,
        "lineWidth": 2,
        "type": 102,
        "color": "gray",
        "radius": 10,
        "children": [
          {
            "rx": 22,
            "ry": 35,
            "x": 356,
            "y": 178,
            "w": 40,
            "h": 56,
            "rotation": 344,
            "lineWidth": 2,
            "type": 102,
            "color": "gray",
            "radius": 10,
            "brokenTexts": [],
            "borderColor": "rgb(216,216,216)",
            "fillColor": "rgb(216,216,216)",
            "fontSize": 0,
            "texts": [],
            "name": "子组件2----111111111",
            "leftX": 356,
            "rightX": 396,
            "topY": 178,
            "bottomY": 234,
            "children": [],
            "id": "7e7b6267-0c82-422b-9b62-1232483da749",
            "centerX": 376,
            "centerY": 206
          }
        ],
        "brokenTexts": [],
        "borderColor": "rgb(216,216,216)",
        "fillColor": "rgb(216,216,216)",
        "fontSize": 0,
        "texts": [],
        "name": "父组件1",
        "leftX": 334,
        "rightX": 484,
        "topY": 143,
        "bottomY": 313,
        "id": "bfe543b4-2ffa-4f22-9b75-efa13b00b834",
        "centerX": 409,
        "centerY": 228
      }
    ],
    "brokenTexts": [],
    "borderColor": "rgb(216,216,216)",
    "fillColor": "rgb(216,216,216)",
    "fontSize": 16,
    "fontWeight": 500,
    "fontFamily": "SourceHanSansCN",
    "texts": [],
    "name": "容器2",
    "leftX": 300,
    "rightX": 800,
    "topY": 100,
    "bottomY": 600,
    "id": "8e45d15c-28ca-452d-80f5-766f870c854a",
    "centerX": 550,
    "centerY": 350
  }
]
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
const noId = [
  {
    "name": "容器",
    "x": 800,
    "y": 250,
    "w": 700,
    "h": 400,
    "rotation": 0,
    "lineWidth": 2,
    "type": "FRAME",
    "color": "gray",
    "radius": 0,
    "children": [],
    "borderColor": "rgb(216,216,216)",
    "fillColor": "white",
    flipHorizontal: false
  },
]
const children = [
  {
    "name": "矩形",
    "x": 50,
    "y": 70,
    "w": 500,
    "h": 250,
    "rotation": 15,
    "lineWidth": 2,
    "type": "FRAME",
    "color": "gray",
    "radius": 0,
    "brokenTexts": [],
    "borderColor": "rgb(216,216,216)",
    "fillColor": "rgb(252,230,230)",
    "children": [
      {
        "name": "矩形2",
        "x": 30,
        "y": 50,
        "w": 200,
        "h": 150,
        "rotation": 15,
        "lineWidth": 2,
        "type": "RECTANGLE",
        "color": "gray",
        "radius": 0,
        "children": [],
        "brokenTexts": [],
        "borderColor": "rgb(216,216,216)",
        "fillColor": "rgb(255,82,82)",
      }
    ],
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
    "name": "容器",
    layout: {
      "x": 470,
      "y": 180,
      // "w": 60,
      w: 600,
      "h": 400,
    },
    clip: false,
    "rotation": 0,
    "lineWidth": 2,
    "type": "FRAME",
    "color": "gray",
    "radius": 10,
    children1: [],
    "children": [
      {
        "name": "容器2",
        layout: {
          "x": 10,
          "y": 200,
          "w": 250,
          "h": 200,
        },
        "rotation": 0,
        "lineWidth": 2,
        "type": "FRAME",
        "color": "gray",
        "radius": 0,
        children: [],
        "children1": [
          {
            "name": "容器3",
            layout: {
              "x": 40,
              "y": 40,
              "w": 150,
              "h": 100,
            },
            "rotation": 0,
            "lineWidth": 2,
            "type": "FRAME",
            "color": "gray",
            "radius": 0,
            "children": [],
            "borderColor": "rgb(216,216,216)",
            "fillColor": "#e1e1e1",
            flipHorizontal: false,
            flipVertical: false
          },
        ],
        "borderColor": "rgb(216,216,216)",
        "fillColor": "rgb(241,238,238)",
        flipHorizontal: false,
        flipVertical: false
      },
      {
        "name": "容器2-1",
        "layout": {
          "x": 290.7905098677362,
          "y": -13.194770842966278,
          "w": 275,
          "h": 221
        },
        "rotation": 11.5,
        "lineWidth": 2,
        "type": "RECTANGLE",
        "color": "gray",
        "radius": 0,
        "children": [],
        "borderColor": "rgb(216,216,216)",
        "fillColor": "rgb(241,238,238)",
        "flipHorizontal": false,
        "flipVertical": false,
        "id": "ae48f0bf-5fe8-494b-9beb-5a3db565151c",
        "realRotation": 11.5,
        "percent": {
          "x": 0.5,
          "y": 0.05
        },
        "relativeCenter": {
          "x": 403.5,
          "y": 122.5
        },
        "start": {
          "x": 770,
          "y": 200
        },
        "absolute": {
          "x": 760.7905098677362,
          "y": 166.80522915703372
        },
        "original": {
          "x": 736,
          "y": 192
        },
        "center": {
          "x": 873.5,
          "y": 302.5
        },
        "box": {
          "leftX": 736,
          "rightX": 1011,
          "topY": 192,
          "bottomY": 413,
          "topLeft": {
            "x": 760.7905098677362,
            "y": 166.80522915703372
          },
          "topRight": {
            "x": 1030.2698036384643,
            "y": 221.63141112176294
          },
          "bottomLeft": {
            "x": 716.7301963615357,
            "y": 383.36858887823706
          },
          "bottomRight": {
            "x": 986.2094901322638,
            "y": 438.19477084296625
          }
        },
        "strokeAlign": "INSIDE",
        "points": [],
        "lineShapes": [
          [
            {
              "cp1": {
                "use": false,
                "x": 0,
                "y": 0,
                "px": 0,
                "py": 0,
                "rx": 0,
                "ry": 0
              },
              "center": {
                "use": true,
                "x": -137.5,
                "y": -5.5,
                "px": 0,
                "py": 0,
                "rx": 0,
                "ry": 0
              },
              "cp2": {
                "use": false,
                "x": 0,
                "y": 0,
                "px": 0,
                "py": 0,
                "rx": 0,
                "ry": 0
              },
              "type": "RightAngle"
            },
            {
              "cp1": {
                "use": false,
                "x": 0,
                "y": 0,
                "px": 0,
                "py": 0,
                "rx": 0,
                "ry": 0
              },
              "center": {
                "use": true,
                "x": -94.5,
                "y": -85.5,
                "px": 0,
                "py": 0,
                "rx": 0,
                "ry": 0
              },
              "cp2": {
                "use": false,
                "x": 0,
                "y": 0,
                "px": 0,
                "py": 0,
                "rx": 0,
                "ry": 0
              },
              "type": "RightAngle"
            },
            {
              "cp1": {
                "use": false,
                "x": 0,
                "y": 0,
                "px": 0,
                "py": 0,
                "rx": 0,
                "ry": 0
              },
              "center": {
                "use": true,
                "x": 137.5,
                "y": -110.5,
                "px": 0,
                "py": 0,
                "rx": 0,
                "ry": 0
              },
              "cp2": {
                "use": false,
                "x": 0,
                "y": 0,
                "px": 0,
                "py": 0,
                "rx": 0,
                "ry": 0
              },
              "type": "RightAngle"
            },
            {
              "cp1": {
                "use": false,
                "x": 0,
                "y": 0,
                "px": 0,
                "py": 0,
                "rx": 0,
                "ry": 0
              },
              "center": {
                "use": true,
                "x": 135.5,
                "y": 110.5,
                "px": 0,
                "py": 0,
                "rx": 0,
                "ry": 0
              },
              "cp2": {
                "use": false,
                "x": 0,
                "y": 0,
                "px": 0,
                "py": 0,
                "rx": 0,
                "ry": 0
              },
              "type": "RightAngle"
            },
            {
              "cp1": {
                "use": false,
                "x": 0,
                "y": 0,
                "px": 0,
                "py": 0,
                "rx": 0,
                "ry": 0
              },
              "center": {
                "use": true,
                "x": -103.5,
                "y": 97.5,
                "px": 0,
                "py": 0,
                "rx": 0,
                "ry": 0
              },
              "cp2": {
                "use": false,
                "x": 0,
                "y": 0,
                "px": 0,
                "py": 0,
                "rx": 0,
                "ry": 0
              },
              "type": "RightAngle"
            }
          ]
        ],
        "commonPoints": [],
        "isCustom": true
      },
      {
        "name": "容器2-2",
        layout: {
          "x": 10,
          "y": 20,
          "w": 200,
          "h": 150,
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
      },
    ],
    "borderColor": "rgb(197,197,197)",
    "fillColor": "#e1e1e1",
    flipHorizontal: false,
    flipVertical: false
  },
]
export const rects4: any[] = [
  {
    "name": "容器",
    "layout": {
      "x": 458.42193523737706,
      "y": 124.0099796680513,
      "w": 444.4611206230538,
      "h": 323.1772558708096
    },
    "rotation": 2.98,
    "lineWidth": 2,
    "type": "FRAME",
    "color": "gray",
    "radius": 0,
    "children1": [],
    "children": [
      {
        "name": "容器2",
        "layout": {
          "x": 64.74283979375934,
          "y": 31.560266422991504,
          "w": 219.62271781824626,
          "h": 200
        },
        "rotation": 0,
        "lineWidth": 2,
        "type": "FRAME",
        "color": "gray",
        "radius": 0,
        "children2": [],
        "children": [
          {
            "name": "容器3",
            "layout": {
              "x": 77.58423971406512,
              "y": 22.188815622558877,
              "w": 108.6130613327184,
              "h": 100
            },
            "rotation": 27.37,
            "lineWidth": 2,
            "type": "FRAME",
            "color": "gray",
            "radius": 0,
            "children": [],
            "borderColor": "rgb(216,216,216)",
            "fillColor": "#e1e1e1",
            "flipHorizontal": false,
            "flipVertical": false,
            "id": "3fdf1e41-36a6-48b0-b07a-16ff19422dac",
            "realRotation": 30.35,
            "percent": {
              "x": 0.16,
              "y": 0.2
            },
            "relativeCenter": {
              "x": 102.82474911369411,
              "y": 91.55823221419132
            },
            "absolute": {
              "x": 597.7622787214076,
              "y": 185.0855890364257
            },
            "original": {
              "x": 565.0557925679219,
              "y": 205.67338791171358
            },
            "center": {
              "x": 619.3623232342811,
              "y": 255.67338791171358
            },
            "box": {
              "leftX": 565.0557925679219,
              "rightX": 673.6688539006403,
              "topY": 205.67338791171358,
              "bottomY": 305.6733879117136,
              "topLeft": {
                "x": 597.7622787214076,
                "y": 185.0855890364257
              },
              "topRight": {
                "x": 691.4904563836326,
                "y": 239.96569293741376
              },
              "bottomLeft": {
                "x": 547.2341900849297,
                "y": 271.38108288601336
              },
              "bottomRight": {
                "x": 640.9623677471546,
                "y": 326.26118678700146
              }
            },
            "nameWidth": 46.5556640625
          }
        ],
        "borderColor": "rgb(216,216,216)",
        "fillColor": "rgb(241,238,238)",
        "flipHorizontal": false,
        "flipVertical": false,
        "id": "8e9639b9-4513-44eb-9aa2-d8470e9d314b",
        "realRotation": 2.98,
        "percent": {
          "x": 0.05,
          "y": 0.06666666666666667
        },
        "relativeCenter": {
          "x": 174.55419870288245,
          "y": 131.56026642299148
        },
        "absolute": {
          "x": 521.4364909387612,
          "y": 158.89337816945527
        },
        "original": {
          "x": 516.0892611577167,
          "y": 164.46695569233907
        },
        "center": {
          "x": 625.9006200668398,
          "y": 264.46695569233907
        },
        "box": {
          "leftX": 516.0892611577167,
          "rightX": 735.7119789759629,
          "topY": 164.46695569233907,
          "bottomY": 364.46695569233907,
          "topLeft": {
            "x": 521.4364909387612,
            "y": 158.89337816945527
          },
          "topRight": {
            "x": 740.7622223136688,
            "y": 170.31098469336578
          },
          "bottomLeft": {
            "x": 511.0390178200108,
            "y": 358.6229266913124
          },
          "bottomRight": {
            "x": 730.3647491949184,
            "y": 370.04053321522287
          }
        },
        "nameWidth": 46.5556640625
      }
    ],
    "borderColor": "rgb(216,216,216)",
    "fillColor": "#e1e1e1",
    "flipHorizontal": false,
    "flipVertical": false,
    "id": "fb2dc422-c23f-4f28-bc55-096141412418",
    "percent": {
      "x": 0,
      "y": 0
    },
    "relativeCenter": {
      "x": 0,
      "y": 0
    },
    "realRotation": 2.98,
    "absolute": {
      "x": 458.42193523737706,
      "y": 124.0099796680513
    },
    "original": {
      "x": 449.72085524348256,
      "y": 135.34465163668986
    },
    "center": {
      "x": 671.9514155550095,
      "y": 296.93327957209465
    },
    "box": {
      "leftX": 449.72085524348256,
      "rightX": 894.1819758665364,
      "topY": 135.34465163668986,
      "bottomY": 458.52190750749946,
      "topLeft": {
        "x": 458.42193523737706,
        "y": 124.0099796680513
      },
      "topRight": {
        "x": 902.2820300251831,
        "y": 147.11634243809056
      },
      "bottomLeft": {
        "x": 441.6208010848359,
        "y": 446.7502167060988
      },
      "bottomRight": {
        "x": 885.4808958726419,
        "y": 469.856579476138
      }
    },
    "nameWidth": 36
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
  strokeStyle: Colors.Primary
}