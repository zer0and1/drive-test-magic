// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

export const config = {
  "version": "v1",
  "config": {
    "visState": {
      "filters": [
        {
          "dataId": [
            "g47by6rho"
          ],
          "id": "k05jo6p48",
          "name": [
            "rssi"
          ],
          "type": "range",
          "value": [
            -120.92,
            -46
          ],
          "enlarged": false,
          "plotType": "histogram",
          "animationWindow": "free",
          "yAxis": null
        }
      ],
      "layers": [
        {
          "id": "vbcw2o",
          "type": "point",
          "config": {
            "dataId": "g47by6rho",
            "label": "RSSI ",
            "color": [
              179,
              173,
              158
            ],
            "columns": {
              "lat": "latitude",
              "lng": "longitude",
              "altitude": null
            },
            "isVisible": true,
            "visConfig": {
              "radius": 10,
              "fixedRadius": false,
              "opacity": 0.8,
              "outline": false,
              "thickness": 2,
              "strokeColor": null,
              "colorRange": {
                "name": "Custom Palette",
                "type": "custom",
                "category": "Custom",
                "colors": [
                  "#213E9A",
                  "#551EAD",
                  "#C019BD",
                  "#D31256",
                  "#E6470A",
                  "#F9E200",
                  "#26dd03",
                  "#136803",
                  "#105a02"
                ]
              },
              "strokeColorRange": {
                "name": "Global Warming",
                "type": "sequential",
                "category": "Uber",
                "colors": [
                  "#5A1846",
                  "#900C3F",
                  "#C70039",
                  "#E3611C",
                  "#F1920E",
                  "#FFC300"
                ]
              },
              "radiusRange": [
                0,
                50
              ],
              "filled": true
            },
            "hidden": false,
            "textLabel": [
              {
                "field": null,
                "color": [
                  255,
                  255,
                  255
                ],
                "size": 18,
                "offset": [
                  0,
                  0
                ],
                "anchor": "start",
                "alignment": "center"
              }
            ]
          },
          "visualChannels": {
            "colorField": {
              "name": "rssi",
              "type": "integer"
            },
            "colorScale": "quantile",
            "strokeColorField": null,
            "strokeColorScale": "quantile",
            "sizeField": null,
            "sizeScale": "linear"
          }
        },
        {
          "id": "67zlbgg",
          "type": "hexagon",
          "config": {
            "dataId": "g47by6rho",
            "label": "RSSI - hexbin",
            "color": [
              77,
              193,
              156
            ],
            "columns": {
              "lat": "latitude",
              "lng": "longitude"
            },
            "isVisible": true,
            "visConfig": {
              "opacity": 0.8,
              "worldUnitSize": 0.015,
              "resolution": 8,
              "colorRange": {
                "name": "Custom Palette",
                "type": "custom",
                "category": "Custom",
                "colors": [
                  "#213E9A",
                  "#551EAD",
                  "#C019BD",
                  "#D31256",
                  "#E6470A",
                  "#F9E200",
                  "#02e407",
                  "#039c07",
                  "#006302"
                ]
              },
              "coverage": 1,
              "sizeRange": [
                0,
                1
              ],
              "percentile": [
                0,
                100
              ],
              "elevationPercentile": [
                0.88,
                100
              ],
              "elevationScale": 5,
              "colorAggregation": "average",
              "sizeAggregation": "minimum",
              "enable3d": true
            },
            "hidden": false,
            "textLabel": [
              {
                "field": null,
                "color": [
                  255,
                  255,
                  255
                ],
                "size": 18,
                "offset": [
                  0,
                  0
                ],
                "anchor": "start",
                "alignment": "center"
              }
            ]
          },
          "visualChannels": {
            "colorField": {
              "name": "rssi",
              "type": "integer"
            },
            "colorScale": "quantile",
            "sizeField": {
              "name": "rssi",
              "type": "integer"
            },
            "sizeScale": "log"
          }
        },
        {
          "id": "f3ydzqr",
          "type": "line",
          "config": {
            "dataId": "g47by6rho",
            "label": "Serving BS",
            "color": [
              183,
              136,
              94
            ],
            "columns": {
              "lat0": "latitude",
              "lng0": "longitude",
              "lat1": "bs_latitude",
              "lng1": "bs_longitude"
            },
            "isVisible": true,
            "visConfig": {
              "opacity": 0.1,
              "thickness": 4,
              "colorRange": {
                "name": "UberPool 3",
                "type": "diverging",
                "category": "Uber",
                "colors": [
                  "#213E9A",
                  "#CA168E",
                  "#F9E200"
                ]
              },
              "sizeRange": [
                0,
                10
              ],
              "targetColor": null
            },
            "hidden": false,
            "textLabel": [
              {
                "field": null,
                "color": [
                  255,
                  255,
                  255
                ],
                "size": 18,
                "offset": [
                  0,
                  0
                ],
                "anchor": "start",
                "alignment": "center"
              }
            ]
          },
          "visualChannels": {
            "colorField": {
              "name": "cell_id",
              "type": "string"
            },
            "colorScale": "ordinal",
            "sizeField": null,
            "sizeScale": "linear"
          }
        }
      ],
      "interactionConfig": {
        "tooltip": {
          "fieldsToShow": {
            "g47by6rho": [
              {
                "name": "date",
                "format": null
              },
              {
                "name": "rssi",
                "format": null
              },
              {
                "name": "cell_id",
                "format": null
              },
              {
                "name": "cell_name",
                "format": null
              }
            ]
          },
          "compareMode": false,
          "compareType": "absolute",
          "enabled": true
        },
        "brush": {
          "size": 0.1,
          "enabled": false
        },
        "geocoder": {
          "enabled": false
        },
        "coordinate": {
          "enabled": false
        }
      },
      "layerBlending": "normal",
      "splitMaps": [],
      "animationConfig": {
        "currentTime": null,
        "speed": 1
      }
    },
    "mapState": {
      "bearing": 0,
      "dragRotate": false,
      "latitude": 50.03677807190906,
      "longitude": 22.00812137998123,
      "pitch": 0,
      "zoom": 16.82080489066417,
      "isSplit": false
    },
    "mapStyle": {
      "styleType": "6cgwjz",
      "topLayerGroups": {
        "3d building": false,
        "label": true
      },
      "visibleLayerGroups": {
        "label": true,
        "road": true,
        "building": true,
        "water": true,
        "land": true
      },
      "threeDBuildingColor": [
        21,
        38,
        41
      ],
      "mapStyles": {
        "6cgwjz": {
          "accessToken": null,
          "custom": true,
          "icon": "https://api.mapbox.com/styles/v1/xsherlock/ckfqkfzyr25n319rrqq7zb5y7/static/-122.3391,37.7922,9,0,0/400x300?access_token=pk.eyJ1IjoidWJlcmRhdGEiLCJhIjoiY2poczJzeGt2MGl1bTNkcm1lcXVqMXRpMyJ9.9o2DrYg8C8UWmprj-tcVpQ&logo=false&attribution=false",
          "id": "6cgwjz",
          "label": "Monochrome moj",
          "url": "mapbox://styles/xsherlock/ckfqkfzyr25n319rrqq7zb5y7"
        }
      }
    }
  }
};