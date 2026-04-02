import React, { useState, useEffect, useRef, useCallback } from "react";

const FBMT_CSS_B64 = [
  "KiwqOjpiZWZvcmUsKjo6YWZ0ZXJ7Ym94LXNpemluZzpib3JkZXItYm94O21hcmdpbjowO3BhZGRpbmc6MDt9CmJvZHl7Zm9udC1m",
  "YW1pbHk6J1NvdXJjZSBTYW5zIDMnLHNhbnMtc2VyaWY7fQouYXBwe2ZvbnQtZmFtaWx5OidTb3VyY2UgU2FucyAzJyxzYW5zLXNl",
  "cmlmO2JhY2tncm91bmQ6I2Y5ZjVmNTttaW4taGVpZ2h0OjEwMHZoO2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47",
  "fQoudG9wLWJhcntiYWNrZ3JvdW5kOiM2QjBFMUU7Y29sb3I6d2hpdGU7cGFkZGluZzoxMnB4IDI0cHg7ZGlzcGxheTpmbGV4O2Fs",
  "aWduLWl0ZW1zOmNlbnRlcjtnYXA6MTJweDt9Ci50b3AtYmFyIC5iYW5rLW5hbWV7Zm9udC1mYW1pbHk6J1BsYXlmYWlyIERpc3Bs",
  "YXknLHNlcmlmO2ZvbnQtc2l6ZToxLjFyZW07bGV0dGVyLXNwYWNpbmc6LjA0ZW07fQoudG9wLWJhciAuZGl2aWRlcntvcGFjaXR5",
  "Oi40O2ZvbnQtc2l6ZToxLjJyZW07fQoudG9wLWJhciAudG9vbC1uYW1le2ZvbnQtc2l6ZTouODVyZW07b3BhY2l0eTouNzU7dGV4",
  "dC10cmFuc2Zvcm06dXBwZXJjYXNlO2xldHRlci1zcGFjaW5nOi4xZW07fQoudGFiLWJhcntkaXNwbGF5OmZsZXg7YmFja2dyb3Vu",
  "ZDojNGEwODEwO3BhZGRpbmc6MCAyNHB4O2dhcDo0cHg7fQoudGFiLWJ0bntiYWNrZ3JvdW5kOm5vbmU7Ym9yZGVyOm5vbmU7Y29s",
  "b3I6cmdiYSgyNTUsMjU1LDI1NSwuNik7Zm9udC1mYW1pbHk6J1NvdXJjZSBTYW5zIDMnLHNhbnMtc2VyaWY7Zm9udC1zaXplOi45",
  "cmVtO2ZvbnQtd2VpZ2h0OjYwMDtwYWRkaW5nOjEycHggMjJweDtjdXJzb3I6cG9pbnRlcjtib3JkZXItYm90dG9tOjNweCBzb2xp",
  "ZCB0cmFuc3BhcmVudDt0cmFuc2l0aW9uOmFsbCAuMTVzO30KLnRhYi1idG46aG92ZXJ7Y29sb3I6cmdiYSgyNTUsMjU1LDI1NSwu",
  "OSk7fQoudGFiLWFjdGl2ZXtjb2xvcjp3aGl0ZSFpbXBvcnRhbnQ7Ym9yZGVyLWJvdHRvbS1jb2xvcjojZThhMGFhIWltcG9ydGFu",
  "dDtiYWNrZ3JvdW5kOnJnYmEoMjU1LDI1NSwyNTUsLjA4KTtib3JkZXItcmFkaXVzOjZweCA2cHggMCAwO30KLnByb2dyZXNzLWJh",
  "ci13cmFwe2JhY2tncm91bmQ6IzVhMGMxODtwYWRkaW5nOjAgMjRweCAxMHB4O30KLnByb2dyZXNzLWxhYmVse2NvbG9yOnJnYmEo",
  "MjU1LDI1NSwyNTUsLjYpO2ZvbnQtc2l6ZTouNzJyZW07dGV4dC10cmFuc2Zvcm06dXBwZXJjYXNlO2xldHRlci1zcGFjaW5nOi4x",
  "ZW07cGFkZGluZy10b3A6NnB4O21hcmdpbi1ib3R0b206NHB4O30KLnByb2dyZXNzLXRyYWNre2hlaWdodDo0cHg7YmFja2dyb3Vu",
  "ZDpyZ2JhKDI1NSwyNTUsMjU1LC4xNSk7Ym9yZGVyLXJhZGl1czoycHg7b3ZlcmZsb3c6aGlkZGVuO30KLnByb2dyZXNzLWZpbGx7",
  "aGVpZ2h0OjEwMCU7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQoOTBkZWcsI2MwMzk0ZCwjZThhMGFhKTtib3JkZXItcmFkaXVz",
  "OjJweDt0cmFuc2l0aW9uOndpZHRoIC40cyBlYXNlO30KLm1haW57ZGlzcGxheTpmbGV4O2ZsZXg6MTtnYXA6MjBweDttYXgtd2lk",
  "dGg6MTQwMHB4O21hcmdpbjowIGF1dG87d2lkdGg6MTAwJTtwYWRkaW5nOjI0cHggMTZweDt9Ci5zaWRlYmFye3dpZHRoOjIwMHB4",
  "O2ZsZXgtc2hyaW5rOjA7b3ZlcmZsb3cteTphdXRvO30KLnNpZGViYXItc2VjdGlvbnttYXJnaW4tYm90dG9tOjE2cHg7fQouc2lk",
  "ZWJhci1zZWN0aW9uLWxhYmVse2ZvbnQtc2l6ZTouNjhyZW07dGV4dC10cmFuc2Zvcm06dXBwZXJjYXNlO2xldHRlci1zcGFjaW5n",
  "Oi4xMmVtO2NvbG9yOiM4ODg7cGFkZGluZzo0cHggMTBweDttYXJnaW4tYm90dG9tOjRweDtmb250LXdlaWdodDo3MDA7fQouc2lk",
  "ZWJhci1pdGVte3BhZGRpbmc6NnB4IDEwcHg7Ym9yZGVyLXJhZGl1czo2cHg7Zm9udC1zaXplOi44MnJlbTtjb2xvcjojNTU1O2N1",
  "cnNvcjpwb2ludGVyO3RyYW5zaXRpb246YWxsIC4xNXM7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O30K",
  "LnNpZGViYXItaXRlbTpob3ZlcntiYWNrZ3JvdW5kOnJnYmEoMCwwLDAsLjA2KTt9Ci5zaWRlYmFyLWl0ZW0uYWN0aXZle2JhY2tn",
  "cm91bmQ6IzZCMEUxRTtjb2xvcjp3aGl0ZTtmb250LXdlaWdodDo2MDA7fQouc2lkZWJhci1pdGVtLmRvbmV7Y29sb3I6IzZCMEUx",
  "RTt9Ci5zaWRlYmFyLWl0ZW0uZG9uZTo6YmVmb3Jle2NvbnRlbnQ6ImNoZWNrbWFyayAiO2ZvbnQtc2l6ZTouN3JlbTt9Ci5jYXJk",
  "e2ZsZXg6MTtiYWNrZ3JvdW5kOndoaXRlO2JvcmRlci1yYWRpdXM6MTJweDtib3gtc2hhZG93OjAgMnB4IDIwcHggcmdiYSgwLDAs",
  "MCwuMDgpO2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47bWluLWhlaWdodDo1MjBweDt9Ci5jYXJkLWJvZHl7Zmxl",
  "eDoxO3BhZGRpbmc6MjhweCAzNnB4O292ZXJmbG93LXk6YXV0bzt9Ci5jYXJkLW5hdntkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6",
  "Y2VudGVyO2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2dhcDoxMnB4O3BhZGRpbmctYm90dG9tOjE2cHg7bWFyZ2luLWJv",
  "dHRvbToyMHB4O2JvcmRlci1ib3R0b206MXB4IHNvbGlkICNlZWU7fQouY2FyZC1jb250ZW50e2ZsZXg6MTt9Ci5jYXJkLWZvb3Rl",
  "cntib3JkZXItdG9wOjFweCBzb2xpZCAjZWVlO3BhZGRpbmc6MTZweCAzMnB4O2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50",
  "ZXI7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47Z2FwOjEycHg7fQoucmlnaHQtcGFuZWx7d2lkdGg6MjAwcHg7ZmxleC1z",
  "aHJpbms6MDt9Ci5ydW5uaW5nLXRvdGFse2JhY2tncm91bmQ6IzZCMEUxRTtib3JkZXItcmFkaXVzOjEwcHg7cGFkZGluZzoxNnB4",
  "O2NvbG9yOndoaXRlO3Bvc2l0aW9uOnN0aWNreTt0b3A6MjRweDt9Ci5ydC1pdGVte2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlv",
  "bjpjb2x1bW47bWFyZ2luLWJvdHRvbToxMnB4O30KLnJ0LWl0ZW0gc3Bhbntmb250LXNpemU6LjcycmVtO29wYWNpdHk6LjY1O3Rl",
  "eHQtdHJhbnNmb3JtOnVwcGVyY2FzZTtsZXR0ZXItc3BhY2luZzouMDhlbTt9Ci5ydC1pdGVtIHN0cm9uZ3tmb250LXNpemU6MS4w",
  "NXJlbTtmb250LXdlaWdodDo2MDA7fQoucnQtaXRlbS5uZXR7Ym9yZGVyLXRvcDoxcHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwu",
  "Mik7cGFkZGluZy10b3A6MTBweDt9Ci5ydC1pdGVtLm5ldCBzdHJvbmd7Zm9udC1zaXplOjEuMnJlbTt9Ci5ncmVlbntjb2xvcjoj",
  "ZThhMGFhO30KLnJlZHtjb2xvcjojZmZhYWFhO30KLnN0ZXAtY29udGVudHtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29s",
  "dW1uO2dhcDoxNnB4O30KLnNlY3Rpb24taGVhZGVye2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpmbGV4LXN0YXJ0O2dhcDoxNHB4",
  "O2JvcmRlci1sZWZ0OjRweCBzb2xpZCAjNkIwRTFFO3BhZGRpbmctbGVmdDoxNHB4O21hcmdpbi1ib3R0b206OHB4O30KLnNlY3Rp",
  "b24taWNvbntmb250LXNpemU6MS42cmVtO2xpbmUtaGVpZ2h0OjE7bWFyZ2luLXRvcDoycHg7fQouc2VjdGlvbi1oZWFkZXIgaDJ7",
  "Zm9udC1mYW1pbHk6J1BsYXlmYWlyIERpc3BsYXknLHNlcmlmO2ZvbnQtc2l6ZToxLjNyZW07Y29sb3I6IzFhMWExYTtmb250LXdl",
  "aWdodDo2MDA7fQouc3VidGl0bGV7Zm9udC1zaXplOi44NXJlbTtjb2xvcjojNjY2O21hcmdpbi10b3A6M3B4O30KLmlucHV0LWdy",
  "b3Vwe2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjRweDt9Ci5pbnB1dC1ncm91cCBsYWJlbHtmb250LXNp",
  "emU6LjhyZW07dGV4dC10cmFuc2Zvcm06dXBwZXJjYXNlO2xldHRlci1zcGFjaW5nOi4wN2VtO2NvbG9yOiM1NTU7Zm9udC13ZWln",
  "aHQ6NjAwO30KLmhpbnR7Zm9udC1zaXplOi43NXJlbTtjb2xvcjojODg4O30KLmlucHV0LXdyYXB7ZGlzcGxheTpmbGV4O2FsaWdu",
  "LWl0ZW1zOmNlbnRlcjtib3JkZXI6MS41cHggc29saWQgI2RkZDtib3JkZXItcmFkaXVzOjdweDtvdmVyZmxvdzpoaWRkZW47YmFj",
  "a2dyb3VuZDojZmFmYWZhO30KLmlucHV0LXdyYXA6Zm9jdXMtd2l0aGlue2JvcmRlci1jb2xvcjojNkIwRTFFO2JhY2tncm91bmQ6",
  "d2hpdGU7fQoucHJlZml4e3BhZGRpbmc6MTBweCAxMnB4O2JhY2tncm91bmQ6I2Y5ZjVmNTtib3JkZXItcmlnaHQ6MS41cHggc29s",
  "aWQgI2RkZDtmb250LXNpemU6Ljk1cmVtO2NvbG9yOiM2NjY7Zm9udC13ZWlnaHQ6NjAwO30KLmlucHV0LXdyYXAgaW5wdXR7Zmxl",
  "eDoxO2JvcmRlcjpub25lO2JhY2tncm91bmQ6dHJhbnNwYXJlbnQ7cGFkZGluZzoxMHB4IDE0cHg7Zm9udC1zaXplOjFyZW07Zm9u",
  "dC1mYW1pbHk6J1NvdXJjZSBTYW5zIDMnLHNhbnMtc2VyaWY7Y29sb3I6IzFhMWExYTtvdXRsaW5lOm5vbmU7fQppbnB1dC50ZXh0",
  "LWlucHV0e2JvcmRlcjoxLjVweCBzb2xpZCAjZGRkO2JvcmRlci1yYWRpdXM6N3B4O3BhZGRpbmc6MTBweCAxNHB4O2ZvbnQtc2l6",
  "ZToxcmVtO2ZvbnQtZmFtaWx5OidTb3VyY2UgU2FucyAzJyxzYW5zLXNlcmlmO2NvbG9yOiMxYTFhMWE7b3V0bGluZTpub25lO3dp",
  "ZHRoOjEwMCU7YmFja2dyb3VuZDojZmFmYWZhO30KaW5wdXQudGV4dC1pbnB1dDpmb2N1c3tib3JkZXItY29sb3I6IzZCMEUxRTti",
  "YWNrZ3JvdW5kOndoaXRlO30KLnJvdy1lbnRyeXtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6ZmxleC1lbmQ7Z2FwOjEycHg7cGFk",
  "ZGluZzoxNHB4IDEycHg7YmFja2dyb3VuZDojZjhmNmYyO2JvcmRlci1yYWRpdXM6OHB4O2JvcmRlcjoxcHggc29saWQgI2U4ZTRk",
  "YztmbGV4LXdyYXA6d3JhcDt9Ci5yb3ctbnVte3dpZHRoOjIwcHg7dGV4dC1hbGlnbjpjZW50ZXI7Zm9udC1zaXplOi43NXJlbTtj",
  "b2xvcjojOTk5O2ZvbnQtd2VpZ2h0OjcwMDtwYWRkaW5nLWJvdHRvbToxMHB4O2ZsZXgtc2hyaW5rOjA7fQoucm93LWVudHJ5ID4g",
  "LmlucHV0LWdyb3Vwe2ZsZXg6MTttaW4td2lkdGg6MTIwcHg7fQoucmVtb3ZlLWJ0bntiYWNrZ3JvdW5kOm5vbmU7Ym9yZGVyOjFw",
  "eCBzb2xpZCAjZGRkO2JvcmRlci1yYWRpdXM6NXB4O3BhZGRpbmc6NXB4IDhweDtjdXJzb3I6cG9pbnRlcjtjb2xvcjojYzQ0O2Zv",
  "bnQtc2l6ZTouNzVyZW07ZmxleC1zaHJpbms6MDttYXJnaW4tYm90dG9tOjFweDt9Ci5yZW1vdmUtYnRuOmhvdmVye2JhY2tncm91",
  "bmQ6I2ZlZTtib3JkZXItY29sb3I6I2M0NDt9Ci5hZGQtYnRue2FsaWduLXNlbGY6ZmxleC1zdGFydDtiYWNrZ3JvdW5kOm5vbmU7",
  "Ym9yZGVyOjEuNXB4IGRhc2hlZCAjNkIwRTFFO2JvcmRlci1yYWRpdXM6N3B4O3BhZGRpbmc6OHB4IDE2cHg7Y29sb3I6IzZCMEUx",
  "RTtmb250LXNpemU6Ljg1cmVtO2ZvbnQtZmFtaWx5OidTb3VyY2UgU2FucyAzJyxzYW5zLXNlcmlmO2N1cnNvcjpwb2ludGVyO2Zv",
  "bnQtd2VpZ2h0OjYwMDt0cmFuc2l0aW9uOmFsbCAuMTVzO30KLmFkZC1idG46aG92ZXJ7YmFja2dyb3VuZDojNkIwRTFFO2NvbG9y",
  "OndoaXRlO30KLnN1YnRvdGFsLXJvd3tkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRl",
  "bXM6Y2VudGVyO3BhZGRpbmc6OHB4IDEycHg7YmFja2dyb3VuZDojZjlmNWY1O2JvcmRlci1yYWRpdXM6NnB4O2ZvbnQtc2l6ZTou",
  "OXJlbTtjb2xvcjojNDQ0O2JvcmRlci1sZWZ0OjNweCBzb2xpZCAjY2NjO30KLnN1YnRvdGFsLXJvdy50b3RhbHtiYWNrZ3JvdW5k",
  "OiNmNWU4ZWE7Ym9yZGVyLWxlZnQtY29sb3I6IzZCMEUxRTtmb250LXdlaWdodDo3MDA7Zm9udC1zaXplOi45NXJlbTt9Ci5zdWJ0",
  "b3RhbC1yb3cgc3Ryb25ne2ZvbnQtd2VpZ2h0OjcwMDt9Ci5maWVsZC1ub3Rle2ZvbnQtc2l6ZTouODJyZW07Y29sb3I6Izc3Nztm",
  "b250LXN0eWxlOml0YWxpYztiYWNrZ3JvdW5kOiNmOGY2ZjI7cGFkZGluZzo4cHggMTJweDtib3JkZXItcmFkaXVzOjZweDt9Ci5w",
  "aGFzZS1iYWRnZXtmb250LXNpemU6Ljc4cmVtO2JhY2tncm91bmQ6IzZCMEUxRTtjb2xvcjp3aGl0ZTtwYWRkaW5nOjRweCAxMnB4",
  "O2JvcmRlci1yYWRpdXM6MjBweDtkaXNwbGF5OmlubGluZS1ibG9jaztmb250LXdlaWdodDo2MDA7bGV0dGVyLXNwYWNpbmc6LjA0",
  "ZW07fQouaW50cm8tdGV4dHtmb250LXNpemU6Ljk1cmVtO2NvbG9yOiM1NTU7bGluZS1oZWlnaHQ6MS42O30KLmZwLWhlYWRlci1y",
  "b3d7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6OHB4O3BhZGRpbmc6MCA0cHg7fQouZnAtY29sLWxhYmVse2Zv",
  "bnQtc2l6ZTouNjhyZW07dGV4dC10cmFuc2Zvcm06dXBwZXJjYXNlO2xldHRlci1zcGFjaW5nOi4wOGVtO2NvbG9yOiM4ODg7Zm9u",
  "dC13ZWlnaHQ6NzAwO30KLmZwLXJvd3tkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7cGFkZGluZzoxMnB4",
  "O2JhY2tncm91bmQ6I2Y4ZjZmMjtib3JkZXItcmFkaXVzOjhweDtib3JkZXI6MXB4IHNvbGlkICNlOGU0ZGM7fQoudW5pdC1zZWxl",
  "Y3R7d2lkdGg6MTAwJTtib3JkZXI6MS41cHggc29saWQgI2RkZDtib3JkZXItcmFkaXVzOjdweDtwYWRkaW5nOjEwcHggNnB4O2Zv",
  "bnQtc2l6ZTouOTVyZW07Zm9udC1mYW1pbHk6J1NvdXJjZSBTYW5zIDMnLHNhbnMtc2VyaWY7YmFja2dyb3VuZDojZmFmYWZhO2Nv",
  "bG9yOiMxYTFhMWE7b3V0bGluZTpub25lO2N1cnNvcjpwb2ludGVyO30KLnVuaXQtc2VsZWN0OmZvY3Vze2JvcmRlci1jb2xvcjoj",
  "NkIwRTFFO2JhY2tncm91bmQ6d2hpdGU7fQouZnAtY2FsYy10b3RhbHtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dh",
  "cDo0cHg7YmFja2dyb3VuZDojZjVlOGVhO2JvcmRlci1yYWRpdXM6NnB4O3BhZGRpbmc6OHB4IDEwcHg7fQouZnAtZXF1YWxze2Nv",
  "bG9yOiM4ODg7Zm9udC1zaXplOi44NXJlbTt9Ci5mcC1yZXN1bHR7Zm9udC13ZWlnaHQ6NzAwO2ZvbnQtc2l6ZTouODhyZW07Y29s",
  "b3I6IzZCMEUxRTt9Ci5tYWNoLXRhYmxle2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjRweDt9Ci5tYWNo",
  "LWhlYWRlcntkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7cGFkZGluZzo0cHggNnB4O30KLm1hY2gtaGVh",
  "ZGVyIHNwYW57Zm9udC1zaXplOi42OHJlbTt0ZXh0LXRyYW5zZm9ybTp1cHBlcmNhc2U7bGV0dGVyLXNwYWNpbmc6LjA4ZW07Y29s",
  "b3I6Izg4ODtmb250LXdlaWdodDo3MDA7fQoubWFjaC1yb3d7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6OHB4",
  "O3BhZGRpbmc6MTJweCAxMHB4O2JhY2tncm91bmQ6I2Y4ZjZmMjtib3JkZXItcmFkaXVzOjdweDtib3JkZXI6MXB4IHNvbGlkICNl",
  "OGU0ZGM7ZmxleC13cmFwOndyYXA7fQoubWFjaC1jb2x7ZGlzcGxheTpmbGV4O30KLm1hY2gtY29sIC50ZXh0LWlucHV0e3dpZHRo",
  "OjEwMCU7fQoubWFjaC1jb2wgLmlucHV0LXdyYXB7d2lkdGg6MTAwJTt9Ci5zdW1tYXJ5LWdyaWR7ZGlzcGxheTpncmlkO2dyaWQt",
  "dGVtcGxhdGUtY29sdW1uczoxZnIgMWZyO2dhcDoyMHB4O21hcmdpbi10b3A6OHB4O30KLmNvbC1oZWFke2ZvbnQtZmFtaWx5OidQ",
  "bGF5ZmFpciBEaXNwbGF5JyxzZXJpZjtmb250LXNpemU6MXJlbTtmb250LXdlaWdodDo3MDA7bGV0dGVyLXNwYWNpbmc6LjA1ZW07",
  "dGV4dC10cmFuc2Zvcm06dXBwZXJjYXNlO3BhZGRpbmc6OHB4IDEycHg7bWFyZ2luLWJvdHRvbToxMHB4O2JvcmRlci1yYWRpdXM6",
  "NnB4O30KLmFzc2V0cy1oZWFke2JhY2tncm91bmQ6I2Y1ZThlYTtjb2xvcjojNkIwRTFFO30KLmxpYWItaGVhZHtiYWNrZ3JvdW5k",
  "OiNmY2U4ZTg7Y29sb3I6IzRhMDgxMDt9Ci5zdW1tYXJ5LXNlY3Rpb257bWFyZ2luLWJvdHRvbToxMnB4O30KLnNzLWxhYmVse2Zv",
  "bnQtc2l6ZTouNzJyZW07dGV4dC10cmFuc2Zvcm06dXBwZXJjYXNlO2xldHRlci1zcGFjaW5nOi4xZW07Y29sb3I6Izk5OTtmb250",
  "LXdlaWdodDo3MDA7bWFyZ2luLWJvdHRvbTo2cHg7cGFkZGluZzowIDRweDt9Ci5zcy1yb3d7ZGlzcGxheTpmbGV4O2p1c3RpZnkt",
  "Y29udGVudDpzcGFjZS1iZXR3ZWVuO2ZvbnQtc2l6ZTouODJyZW07Y29sb3I6IzQ0NDtwYWRkaW5nOjNweCA2cHg7Ym9yZGVyLWJv",
  "dHRvbToxcHggc29saWQgI2YwZWNlNDt9Ci5zcy1yb3cuc3Vie2NvbG9yOiM4ODg7Zm9udC1zaXplOi43OHJlbTtwYWRkaW5nLWxl",
  "ZnQ6MTZweDt9Ci5zcy1zdWJ0b3RhbHtkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47Zm9udC1zaXpl",
  "Oi44NXJlbTtmb250LXdlaWdodDo3MDA7Y29sb3I6IzMzMztwYWRkaW5nOjVweCA2cHg7YmFja2dyb3VuZDojZjVmM2VmO2JvcmRl",
  "ci1yYWRpdXM6NHB4O21hcmdpbi10b3A6NHB4O30KLnNzLXRvdGFse2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2Ut",
  "YmV0d2Vlbjtmb250LXNpemU6MXJlbTtmb250LXdlaWdodDo3MDA7cGFkZGluZzoxMHB4IDhweDtib3JkZXItcmFkaXVzOjZweDtt",
  "YXJnaW4tdG9wOjhweDt9Ci5ncmVlbi10b3RhbHtiYWNrZ3JvdW5kOiNmNWU4ZWE7Y29sb3I6IzZCMEUxRTt9Ci5yZWQtdG90YWx7",
  "YmFja2dyb3VuZDojZmNlOGU4O2NvbG9yOiM0YTA4MTA7fQoubmV0LXNlY3Rpb257bWFyZ2luLXRvcDoxNnB4O2JvcmRlci10b3A6",
  "MnB4IHNvbGlkICNlZWU7cGFkZGluZy10b3A6MTJweDtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO2dhcDo4cHg7",
  "fQoubmV0LXJvd3tkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO3Bh",
  "ZGRpbmc6NHB4IDZweDt9Ci5uZXQtcm93Lm53e2ZvbnQtc2l6ZToxLjFyZW07Zm9udC13ZWlnaHQ6NzAwO2NvbG9yOiMxYTFhMWE7",
  "fQoubmV0LXJvdyAuZ3JlZW57Y29sb3I6IzZCMEUxRTt9Ci5uZXQtcm93IC5yZWR7Y29sb3I6I2M0NDt9Ci5zYXZlLWJhcntkaXNw",
  "bGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDoxMnB4O21hcmdpbi10b3A6MTRweDtwYWRkaW5nOjE0cHggMTZweDtiYWNr",
  "Z3JvdW5kOiNmNWU4ZWE7Ym9yZGVyLXJhZGl1czoxMHB4O2JvcmRlcjoxcHggc29saWQgI2UwYzBjNTtmbGV4LXdyYXA6d3JhcDt9",
  "Ci5zYXZlLWRhdGUtd3JhcHtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7ZmxleDoxO30KLnNhdmUtZGF0",
  "ZS13cmFwIGxhYmVse2ZvbnQtc2l6ZTouNzhyZW07Zm9udC13ZWlnaHQ6NzAwO3RleHQtdHJhbnNmb3JtOnVwcGVyY2FzZTtsZXR0",
  "ZXItc3BhY2luZzouMDdlbTtjb2xvcjojNkIwRTFFO3doaXRlLXNwYWNlOm5vd3JhcDt9Ci5idG57cGFkZGluZzoxMHB4IDI0cHg7",
  "Ym9yZGVyLXJhZGl1czo4cHg7Zm9udC1mYW1pbHk6J1NvdXJjZSBTYW5zIDMnLHNhbnMtc2VyaWY7Zm9udC1zaXplOi45cmVtO2Zv",
  "bnQtd2VpZ2h0OjYwMDtjdXJzb3I6cG9pbnRlcjt0cmFuc2l0aW9uOmFsbCAuMTVzO2JvcmRlcjpub25lO30KLmJ0bi1wcmltYXJ5",
  "e2JhY2tncm91bmQ6IzZCMEUxRTtjb2xvcjp3aGl0ZTt9Ci5idG4tcHJpbWFyeTpob3ZlcntiYWNrZ3JvdW5kOiM1YTBjMTg7fQou",
  "YnRuLXNlY29uZGFyeXtiYWNrZ3JvdW5kOiNmOWY1ZjU7Y29sb3I6IzU1NTtib3JkZXI6MXB4IHNvbGlkICNkZGQ7fQouYnRuLXNl",
  "Y29uZGFyeTpob3ZlcntiYWNrZ3JvdW5kOiNmMGVjZTQ7fQouYnRuLXN1Y2Nlc3N7YmFja2dyb3VuZDojMmQ3YTNhO2NvbG9yOndo",
  "aXRlO30KLmJ0bi1zdWNjZXNzOmhvdmVye2JhY2tncm91bmQ6IzI1NjAzMDt9Ci5idG4tc2F2ZXtiYWNrZ3JvdW5kOiM2QjBFMUU7",
  "Y29sb3I6d2hpdGU7Ym9yZGVyOm5vbmU7fQouYnRuLXNhdmU6aG92ZXJ7YmFja2dyb3VuZDojNWEwYzE4O30KLmJ0bi1zYXZlOmRp",
  "c2FibGVke29wYWNpdHk6LjY7Y3Vyc29yOmRlZmF1bHQ7fQouc3RlcC1pbmZve2ZvbnQtc2l6ZTouNzhyZW07Y29sb3I6Izk5OTt9",
  "Ci5wcmludC1ub3Rle2ZvbnQtc2l6ZTouODJyZW07Y29sb3I6Izc3NztiYWNrZ3JvdW5kOiNmOGY2ZjI7cGFkZGluZzoxMnB4IDE2",
  "cHg7Ym9yZGVyLXJhZGl1czo4cHg7bWFyZ2luLXRvcDo4cHg7Ym9yZGVyLWxlZnQ6M3B4IHNvbGlkICNjY2M7fQouaG9tZS10b3B7",
  "YmFja2dyb3VuZDojNkIwRTFFO2NvbG9yOndoaXRlO3BhZGRpbmc6MjBweCAzMnB4O2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpj",
  "ZW50ZXI7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47fQouaG9tZS10b3AtdGl0bGV7Zm9udC1mYW1pbHk6J1BsYXlmYWly",
  "IERpc3BsYXknLHNlcmlmO2ZvbnQtc2l6ZToxLjNyZW07bGV0dGVyLXNwYWNpbmc6LjA0ZW07fQouaG9tZS10b3Atc3Vie2ZvbnQt",
  "c2l6ZTouOHJlbTtvcGFjaXR5Oi43O21hcmdpbi10b3A6MnB4O3RleHQtdHJhbnNmb3JtOnVwcGVyY2FzZTtsZXR0ZXItc3BhY2lu",
  "ZzouMWVtO30KLmhvbWUtYm9keXttYXgtd2lkdGg6ODAwcHg7bWFyZ2luOjAgYXV0bztwYWRkaW5nOjQwcHggMjRweDt3aWR0aDox",
  "MDAlO30KLmhvbWUtbmV3LWJ0bntiYWNrZ3JvdW5kOiM2QjBFMUU7Y29sb3I6d2hpdGU7Ym9yZGVyOm5vbmU7Ym9yZGVyLXJhZGl1",
  "czoxMHB4O3BhZGRpbmc6MTZweCAzMnB4O2ZvbnQtc2l6ZToxcmVtO2ZvbnQtZmFtaWx5OidTb3VyY2UgU2FucyAzJyxzYW5zLXNl",
  "cmlmO2ZvbnQtd2VpZ2h0OjcwMDtjdXJzb3I6cG9pbnRlcjtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDoxMHB4",
  "O21hcmdpbi1ib3R0b206MzZweDt0cmFuc2l0aW9uOmJhY2tncm91bmQgLjE1czt9Ci5ob21lLW5ldy1idG46aG92ZXJ7YmFja2dy",
  "b3VuZDojNWEwYzE4O30KLmhvbWUtc2VjdGlvbi1sYWJlbHtmb250LXNpemU6LjcycmVtO3RleHQtdHJhbnNmb3JtOnVwcGVyY2Fz",
  "ZTtsZXR0ZXItc3BhY2luZzouMTJlbTtjb2xvcjojODg4O2ZvbnQtd2VpZ2h0OjcwMDttYXJnaW4tYm90dG9tOjEycHg7fQouaG9t",
  "ZS1lbXB0eXtiYWNrZ3JvdW5kOndoaXRlO2JvcmRlci1yYWRpdXM6MTJweDtwYWRkaW5nOjMycHg7dGV4dC1hbGlnbjpjZW50ZXI7",
  "Y29sb3I6I2FhYTtmb250LXNpemU6Ljk1cmVtO2JvcmRlcjoycHggZGFzaGVkICNlMGQ4ZDg7fQouc2hlZXQtY2FyZHtiYWNrZ3Jv",
  "dW5kOndoaXRlO2JvcmRlci1yYWRpdXM6MTBweDtib3JkZXI6MXB4IHNvbGlkICNlOGUwZTA7cGFkZGluZzoxOHB4IDIwcHg7bWFy",
  "Z2luLWJvdHRvbToxMHB4O2N1cnNvcjpwb2ludGVyO2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjE2cHg7dHJh",
  "bnNpdGlvbjphbGwgLjE1cztib3gtc2hhZG93OjAgMXB4IDRweCByZ2JhKDAsMCwwLC4wNSk7fQouc2hlZXQtY2FyZDpob3Zlcnti",
  "b3JkZXItY29sb3I6IzZCMEUxRTtib3gtc2hhZG93OjAgMnB4IDEycHggcmdiYSgxMDcsMTQsMzAsLjEyKTt0cmFuc2Zvcm06dHJh",
  "bnNsYXRlWSgtMXB4KTt9Ci5zaGVldC1pY29ue2ZvbnQtc2l6ZToxLjhyZW07ZmxleC1zaHJpbms6MDt9Ci5zaGVldC1pbmZve2Zs",
  "ZXg6MTt9Ci5zaGVldC1uYW1le2ZvbnQtc2l6ZToxcmVtO2ZvbnQtd2VpZ2h0OjcwMDtjb2xvcjojMWExYTFhO21hcmdpbi1ib3R0",
  "b206M3B4O30KLnNoZWV0LW1ldGF7Zm9udC1zaXplOi44cmVtO2NvbG9yOiM4ODg7fQouc2hlZXQtZGF0ZXtmb250LXNpemU6Ljgy",
  "cmVtO2ZvbnQtd2VpZ2h0OjYwMDtjb2xvcjojNkIwRTFFO30KLnNoZWV0LWRlbGV0ZXtiYWNrZ3JvdW5kOm5vbmU7Ym9yZGVyOjFw",
  "eCBzb2xpZCAjZGRkO2JvcmRlci1yYWRpdXM6NnB4O3BhZGRpbmc6NnB4IDEwcHg7Y3Vyc29yOnBvaW50ZXI7Y29sb3I6I2M0NDtm",
  "b250LXNpemU6Ljc1cmVtO2ZsZXgtc2hyaW5rOjA7dHJhbnNpdGlvbjphbGwgLjE1czt9Ci5zaGVldC1kZWxldGU6aG92ZXJ7YmFj",
  "a2dyb3VuZDojZmVlO2JvcmRlci1jb2xvcjojYzQ0O30KLnNoZWV0LWxvYWQtYnRue2JhY2tncm91bmQ6IzZCMEUxRTtjb2xvcjp3",
  "aGl0ZTtib3JkZXI6bm9uZTtib3JkZXItcmFkaXVzOjZweDtwYWRkaW5nOjdweCAxNnB4O2ZvbnQtc2l6ZTouODJyZW07Zm9udC1m",
  "YW1pbHk6J1NvdXJjZSBTYW5zIDMnLHNhbnMtc2VyaWY7Zm9udC13ZWlnaHQ6NjAwO2N1cnNvcjpwb2ludGVyO2ZsZXgtc2hyaW5r",
  "OjA7dHJhbnNpdGlvbjpiYWNrZ3JvdW5kIC4xNXM7fQouc2hlZXQtbG9hZC1idG46aG92ZXJ7YmFja2dyb3VuZDojNWEwYzE4O30K",
  "LmJ1ZGdldC1wYWdle2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47ZmxleDoxO292ZXJmbG93OmhpZGRlbjt9Ci5i",
  "dWRnZXQtdG9wLWJhcntiYWNrZ3JvdW5kOndoaXRlO2JvcmRlci1ib3R0b206MXB4IHNvbGlkICNlOGUwZTA7cGFkZGluZzoxMnB4",
  "IDI0cHg7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6MjBweDtmbGV4LXdyYXA6d3JhcDt9Ci5idWRnZXQtY2xp",
  "ZW50e2ZvbnQtZmFtaWx5OidQbGF5ZmFpciBEaXNwbGF5JyxzZXJpZjtmb250LXNpemU6MXJlbTtmb250LXdlaWdodDo2MDA7Y29s",
  "b3I6IzFhMWExYTt9Ci5idWRnZXQtdG9wLXRvdGFsc3tkaXNwbGF5OmZsZXg7Z2FwOjIwcHg7fQouYnR0LWl0ZW17ZGlzcGxheTpm",
  "bGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjthbGlnbi1pdGVtczpjZW50ZXI7fQouYnR0LWl0ZW0gc3Bhbntmb250LXNpemU6LjY4",
  "cmVtO3RleHQtdHJhbnNmb3JtOnVwcGVyY2FzZTtsZXR0ZXItc3BhY2luZzouMDhlbTtjb2xvcjojODg4O30KLmJ0dC1pdGVtIHN0",
  "cm9uZ3tmb250LXNpemU6MXJlbTtmb250LXdlaWdodDo3MDA7fQouYnR0LW5ldHtib3JkZXItbGVmdDoxcHggc29saWQgI2VlZTtw",
  "YWRkaW5nLWxlZnQ6MjBweDt9Ci5idWRnZXQtYm9keXtmbGV4OjE7b3ZlcmZsb3cteTphdXRvO3BhZGRpbmc6MjBweCAyNHB4O30K",
  "LmJ1ZGdldC13cmFwe2Rpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6MWZyIDFmcjtnYXA6MjBweDt9Ci5idWRnZXQt",
  "c2VjdGlvbntiYWNrZ3JvdW5kOndoaXRlO2JvcmRlci1yYWRpdXM6MTJweDtib3gtc2hhZG93OjAgMnB4IDEycHggcmdiYSgwLDAs",
  "MCwuMDcpO292ZXJmbG93OmhpZGRlbjtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1uO30KLmJ1ZGdldC1zZWN0aW9u",
  "LWhlYWR7ZGlzcGxheTpmbGV4O2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOmNlbnRlcjtwYWRkaW5n",
  "OjE0cHggMThweDtmb250LWZhbWlseTonUGxheWZhaXIgRGlzcGxheScsc2VyaWY7Zm9udC1zaXplOjFyZW07Zm9udC13ZWlnaHQ6",
  "NzAwO2xldHRlci1zcGFjaW5nOi4wNGVtO30KLmluY29tZS1oZWFke2JhY2tncm91bmQ6I2U4ZjVlYTtjb2xvcjojMWE1YzI1O2Jv",
  "cmRlci1ib3R0b206MnB4IHNvbGlkICNiOGRmYzA7fQouZXhwZW5zZS1oZWFke2JhY2tncm91bmQ6I2ZjZThlODtjb2xvcjojN2Ex",
  "YTFhO2JvcmRlci1ib3R0b206MnB4IHNvbGlkICNmMGMwYzA7fQouYnNoLXRvdGFse2ZvbnQtc2l6ZToxLjFyZW07fQouYnVkZ2V0",
  "LXN1YnNlY3Rpb257cGFkZGluZzoxNHB4IDE2cHg7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgI2YwZWNlODt9Ci5idWRnZXQtc3Vi",
  "LWxhYmVse2ZvbnQtc2l6ZTouN3JlbTt0ZXh0LXRyYW5zZm9ybTp1cHBlcmNhc2U7bGV0dGVyLXNwYWNpbmc6LjFlbTtjb2xvcjoj",
  "ODg4O2ZvbnQtd2VpZ2h0OjcwMDttYXJnaW4tYm90dG9tOjEwcHg7fQouYmctaGVhZGVyLXJvd3tkaXNwbGF5OmZsZXg7YWxpZ24t",
  "aXRlbXM6Y2VudGVyO2dhcDo2cHg7cGFkZGluZzowIDRweDttYXJnaW4tYm90dG9tOjRweDt9Ci5iZy1jb2wtbGFiZWx7Zm9udC1z",
  "aXplOi42NXJlbTt0ZXh0LXRyYW5zZm9ybTp1cHBlcmNhc2U7bGV0dGVyLXNwYWNpbmc6LjA4ZW07Y29sb3I6I2FhYTtmb250LXdl",
  "aWdodDo3MDA7fQouYmctcm93e2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjhweDtwYWRkaW5nOjExcHggOHB4",
  "O2JhY2tncm91bmQ6I2Y4ZjZmMjtib3JkZXItcmFkaXVzOjdweDtib3JkZXI6MXB4IHNvbGlkICNlZGU4ZTI7bWFyZ2luLWJvdHRv",
  "bTo1cHg7fQouYnVkZ2V0LXN1YnRvdGFse2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjtwYWRkaW5n",
  "OjhweCAxMHB4O2JhY2tncm91bmQ6I2Y1ZjNlZjtib3JkZXItcmFkaXVzOjZweDtmb250LXNpemU6Ljg1cmVtO2ZvbnQtd2VpZ2h0",
  "OjYwMDtjb2xvcjojNDQ0O21hcmdpbi10b3A6OHB4O30KLmJ1ZGdldC1ncmFuZHtkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50",
  "OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVyO3BhZGRpbmc6MTRweCAxOHB4O2ZvbnQtd2VpZ2h0OjcwMDtmb250LXNp",
  "emU6MXJlbTtsZXR0ZXItc3BhY2luZzouMDNlbTt9Ci5pbmNvbWUtZ3JhbmR7YmFja2dyb3VuZDojMWE1YzI1O2NvbG9yOndoaXRl",
  "O30KLmV4cGVuc2UtZ3JhbmR7YmFja2dyb3VuZDojN2ExYTFhO2NvbG9yOndoaXRlO30KLmJ1ZGdldC1uZXR7ZGlzcGxheTpmbGV4",
  "O2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOmNlbnRlcjtwYWRkaW5nOjE0cHggMThweDtmb250LXdl",
  "aWdodDo3MDA7Zm9udC1zaXplOjEuMDVyZW07Ym9yZGVyLXRvcDoycHggc29saWQgI2VlZTt9Ci5uZXQtcG9zaXRpdmV7YmFja2dy",
  "b3VuZDojZThmNWVhO2NvbG9yOiMxYTVjMjU7fQoubmV0LW5lZ2F0aXZle2JhY2tncm91bmQ6I2ZjZThlODtjb2xvcjojN2ExYTFh",
  "O30KLm1hcmdpbi1kZXRhaWx7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6M3B4O30KLm1hcmdpbi1sYWJl",
  "bHtmb250LXNpemU6Ljk1cmVtO2ZvbnQtd2VpZ2h0OjcwMDt9Ci5tYXJnaW4tY2FsY3tmb250LXNpemU6LjcycmVtO2ZvbnQtd2Vp",
  "Z2h0OjQwMDtvcGFjaXR5Oi43O30KLm1hcmdpbi12YWx1ZXtmb250LXNpemU6MS4ycmVtO2ZvbnQtd2VpZ2h0OjgwMDt9Ci5kZWJ0",
  "LWVtcHR5e2ZvbnQtc2l6ZTouOHJlbTtjb2xvcjojYWFhO2ZvbnQtc3R5bGU6aXRhbGljO3BhZGRpbmc6OHB4IDRweDt9Ci5kZWJ0",
  "LWNhdGVnb3J5LWxhYmVse2ZvbnQtc2l6ZTouNjhyZW07dGV4dC10cmFuc2Zvcm06dXBwZXJjYXNlO2xldHRlci1zcGFjaW5nOi4w",
  "OGVtO2NvbG9yOiM5OTk7Zm9udC13ZWlnaHQ6NzAwO21hcmdpbjo4cHggMCA0cHg7cGFkZGluZzowIDRweDt9Ci5kZWJ0LXJvd3tk",
  "aXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo4cHg7cGFkZGluZzo1cHggOHB4O2JhY2tncm91bmQ6I2YwZWNlODti",
  "b3JkZXItcmFkaXVzOjZweDttYXJnaW4tYm90dG9tOjNweDtib3JkZXItbGVmdDozcHggc29saWQgIzZCMEUxRTt9Ci5kZWJ0LWNy",
  "ZWRpdG9ye2ZsZXg6MTtmb250LXNpemU6Ljg1cmVtO2ZvbnQtd2VpZ2h0OjYwMDtjb2xvcjojMmEyYTJhO30KLmRlYnQtZGV0YWls",
  "e2ZvbnQtc2l6ZTouNzVyZW07Y29sb3I6Izg4ODt9Ci5kZWJ0LWFtb3VudHtmb250LXNpemU6Ljg4cmVtO2ZvbnQtd2VpZ2h0Ojcw",
  "MDtjb2xvcjojNkIwRTFFO21pbi13aWR0aDo4MHB4O3RleHQtYWxpZ246cmlnaHQ7fQouY29tcC1wYWdle2Rpc3BsYXk6ZmxleDtm",
  "bGV4LWRpcmVjdGlvbjpjb2x1bW47ZmxleDoxO292ZXJmbG93OmhpZGRlbjt9Ci5jb21wLXBhZ2UtaGVhZGVye2JhY2tncm91bmQ6",
  "d2hpdGU7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgI2U4ZTBlMDtwYWRkaW5nOjE0cHggMjRweDtkaXNwbGF5OmZsZXg7YWxpZ24t",
  "aXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO30KLmNvbXAtcGFnZS10aXRsZXtmb250LWZhbWlseTon",
  "UGxheWZhaXIgRGlzcGxheScsc2VyaWY7Zm9udC1zaXplOjEuMDVyZW07Zm9udC13ZWlnaHQ6NzAwO2NvbG9yOiMxYTFhMWE7fQou",
  "Y29tcC1wYWdlLXN1Yntmb250LXNpemU6Ljc4cmVtO2NvbG9yOiM4ODg7bWFyZ2luLXRvcDoycHg7fQouY29tcC1zY3JvbGx7Zmxl",
  "eDoxO292ZXJmbG93LXk6YXV0bztvdmVyZmxvdy14OmF1dG87cGFkZGluZzoyMHB4IDI0cHg7fQouY29tcC13cmFwe2Rpc3BsYXk6",
  "ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjI0cHg7fQouY29tcC1sb2FkaW5ne3BhZGRpbmc6NDBweDt0ZXh0LWFsaWdu",
  "OmNlbnRlcjtjb2xvcjojODg4O2ZvbnQtc2l6ZTouOTVyZW07fQouY29tcC1lbXB0eXtiYWNrZ3JvdW5kOndoaXRlO2JvcmRlci1y",
  "YWRpdXM6MTBweDtwYWRkaW5nOjMycHg7dGV4dC1hbGlnbjpjZW50ZXI7Y29sb3I6Izg4ODtib3JkZXI6MnB4IGRhc2hlZCAjZTBk",
  "OGQ4O30KLmNvbXAtZW1wdHkgcHttYXJnaW4tYm90dG9tOjhweDtmb250LXNpemU6LjlyZW07bGluZS1oZWlnaHQ6MS42O30KLmNv",
  "bXAtdGFibGUtd3JhcHtvdmVyZmxvdy14OmF1dG87Ym9yZGVyLXJhZGl1czoxMHB4O2JveC1zaGFkb3c6MCAycHggMTJweCByZ2Jh",
  "KDAsMCwwLC4wNyk7fQouY29tcC10YWJsZXt3aWR0aDoxMDAlO2JvcmRlci1jb2xsYXBzZTpjb2xsYXBzZTtiYWNrZ3JvdW5kOndo",
  "aXRlO2ZvbnQtc2l6ZTouODJyZW07fQouY29tcC10aHtiYWNrZ3JvdW5kOiM2QjBFMUU7Y29sb3I6d2hpdGU7cGFkZGluZzoxMHB4",
  "IDE0cHg7Zm9udC1zaXplOi43NXJlbTt0ZXh0LXRyYW5zZm9ybTp1cHBlcmNhc2U7bGV0dGVyLXNwYWNpbmc6LjA3ZW07Zm9udC13",
  "ZWlnaHQ6NzAwO3doaXRlLXNwYWNlOm5vd3JhcDt9Ci5jb21wLWxhYmVsLXRoe3RleHQtYWxpZ246bGVmdDttaW4td2lkdGg6MTgw",
  "cHg7fQouY29tcC15ZWFyLXRoe3RleHQtYWxpZ246cmlnaHQ7bWluLXdpZHRoOjExMHB4O30KLmNvbXAtY2hnLXRoe3RleHQtYWxp",
  "Z246cmlnaHQ7bWluLXdpZHRoOjEyMHB4O2ZvbnQtc2l6ZTouNjhyZW07bGluZS1oZWlnaHQ6MS4zO30KLmNvbXAtdHJlbmQtdGh7",
  "dGV4dC1hbGlnbjpjZW50ZXI7bWluLXdpZHRoOjYwcHg7fQouY29tcC1zZWN0aW9uLWhlYWQgdGR7YmFja2dyb3VuZDojZjVlOGVh",
  "O2NvbG9yOiM2QjBFMUU7Zm9udC1zaXplOi42OHJlbTt0ZXh0LXRyYW5zZm9ybTp1cHBlcmNhc2U7bGV0dGVyLXNwYWNpbmc6LjFl",
  "bTtmb250LXdlaWdodDo4MDA7cGFkZGluZzo1cHggMTRweDtib3JkZXItdG9wOjJweCBzb2xpZCAjZTBjMGM1O30KLmNvbXAtcm93",
  "e2JvcmRlci1ib3R0b206MXB4IHNvbGlkICNmNWYwZjA7fQouY29tcC1yb3c6aG92ZXJ7YmFja2dyb3VuZDojZmRmOWY5O30KLmNv",
  "bXAtYm9sZC1yb3d7YmFja2dyb3VuZDojZjVlOGVhIWltcG9ydGFudDt9Ci5jb21wLWJvbGQtcm93OmhvdmVye2JhY2tncm91bmQ6",
  "I2YwZTBlMyFpbXBvcnRhbnQ7fQouY29tcC1icmVhay1yb3cgdGR7Ym9yZGVyLWJvdHRvbToycHggc29saWQgI2QwYTBhODt9Ci5j",
  "b21wLWxhYmVse3BhZGRpbmc6N3B4IDE0cHg7Y29sb3I6IzMzMztmb250LXNpemU6LjgycmVtO3doaXRlLXNwYWNlOm5vd3JhcDt9",
  "Ci5jb21wLWJvbGQtcm93IC5jb21wLWxhYmVse2ZvbnQtd2VpZ2h0OjcwMDtjb2xvcjojNkIwRTFFO2ZvbnQtc2l6ZTouODVyZW07",
  "fQouY29tcC12YWx7cGFkZGluZzo3cHggMTRweDt0ZXh0LWFsaWduOnJpZ2h0O2ZvbnQtZmFtaWx5Om1vbm9zcGFjZTtmb250LXNp",
  "emU6LjgycmVtO2NvbG9yOiMxYTFhMWE7d2hpdGUtc3BhY2U6bm93cmFwO30KLmNvbXAtYm9sZC12YWx7Zm9udC13ZWlnaHQ6NzAw",
  "O2ZvbnQtc2l6ZTouODhyZW07fQouY29tcC16ZXJve2NvbG9yOiNjY2M7fQouY29tcC1uZWd7Y29sb3I6I2M0NDt9Ci5jb21wLWNo",
  "Z3twYWRkaW5nOjdweCAxNHB4O3RleHQtYWxpZ246cmlnaHQ7d2hpdGUtc3BhY2U6bm93cmFwO30KLmNoZy1hbXR7Zm9udC1mYW1p",
  "bHk6bW9ub3NwYWNlO2ZvbnQtc2l6ZTouODJyZW07Zm9udC13ZWlnaHQ6NzAwO30KLmNoZy1wY3R7Zm9udC1zaXplOi42OHJlbTtv",
  "cGFjaXR5Oi43NTttYXJnaW4tdG9wOjFweDt9Ci5jb21wLXVwIC5jaGctYW10e2NvbG9yOiMxYTVjMjU7fQouY29tcC1kbiAuY2hn",
  "LWFtdHtjb2xvcjojYzQ0O30KLmNvbXAtZmxhdCAuY2hnLWFtdHtjb2xvcjojODg4O30KLmNvbXAtdHJlbmR7dGV4dC1hbGlnbjpj",
  "ZW50ZXI7Zm9udC1zaXplOjEuMXJlbTtmb250LXdlaWdodDo3MDA7cGFkZGluZzo3cHggMTBweDt9Ci50cmVuZC11cHtjb2xvcjoj",
  "MWE1YzI1O30KLnRyZW5kLWRue2NvbG9yOiNjNDQ7fQoudHJlbmQtZmxhdHtjb2xvcjojODg4O30KLmluc2lnaHQtcGFuZWx7YmFj",
  "a2dyb3VuZDp3aGl0ZTtib3JkZXItcmFkaXVzOjEycHg7Ym94LXNoYWRvdzowIDJweCAxMnB4IHJnYmEoMCwwLDAsLjA3KTtvdmVy",
  "ZmxvdzpoaWRkZW47fQouaW5zaWdodC1oZWFkZXJ7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRl",
  "bnQ6c3BhY2UtYmV0d2VlbjtwYWRkaW5nOjE2cHggMjBweDtib3JkZXItYm90dG9tOjFweCBzb2xpZCAjZjBlOGU4O2JhY2tncm91",
  "bmQ6I2ZkZjhmODt9Ci5pbnNpZ2h0LXRpdGxle2ZvbnQtZmFtaWx5OidQbGF5ZmFpciBEaXNwbGF5JyxzZXJpZjtmb250LXNpemU6",
  "MXJlbTtmb250LXdlaWdodDo3MDA7Y29sb3I6IzFhMWExYTt9Ci5pbnNpZ2h0LXN1Yntmb250LXNpemU6Ljc1cmVtO2NvbG9yOiM4",
  "ODg7bWFyZ2luLXRvcDoycHg7fQouYnRuLWluc2lnaHR7YmFja2dyb3VuZDojNkIwRTFFO2NvbG9yOndoaXRlO2JvcmRlcjpub25l",
  "O3BhZGRpbmc6MTBweCAyMHB4O2JvcmRlci1yYWRpdXM6OHB4O2ZvbnQtZmFtaWx5OidTb3VyY2UgU2FucyAzJyxzYW5zLXNlcmlm",
  "O2ZvbnQtc2l6ZTouODVyZW07Zm9udC13ZWlnaHQ6NzAwO2N1cnNvcjpwb2ludGVyO3RyYW5zaXRpb246YmFja2dyb3VuZCAuMTVz",
  "O30KLmJ0bi1pbnNpZ2h0OmhvdmVye2JhY2tncm91bmQ6IzVhMGMxODt9Ci5idG4taW5zaWdodDpkaXNhYmxlZHtvcGFjaXR5Oi42",
  "O2N1cnNvcjpkZWZhdWx0O30KLmluc2lnaHQtbG9hZGluZ3tkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDoxMnB4",
  "O3BhZGRpbmc6MjRweCAyMHB4O2NvbG9yOiM4ODg7Zm9udC1zaXplOi45cmVtO30KLmluc2lnaHQtc3Bpbm5lcnt3aWR0aDoyMHB4",
  "O2hlaWdodDoyMHB4O2JvcmRlcjoycHggc29saWQgI2YwZThlODtib3JkZXItdG9wLWNvbG9yOiM2QjBFMUU7Ym9yZGVyLXJhZGl1",
  "czo1MCU7YW5pbWF0aW9uOnNwaW4gLjhzIGxpbmVhciBpbmZpbml0ZTtmbGV4LXNocmluazowO30KQGtleWZyYW1lcyBzcGlue3Rv",
  "e3RyYW5zZm9ybTpyb3RhdGUoMzYwZGVnKTt9fQouaW5zaWdodC1wcm9tcHR7cGFkZGluZzoyNHB4IDIwcHg7Y29sb3I6I2FhYTtm",
  "b250LXNpemU6Ljg4cmVtO2ZvbnQtc3R5bGU6aXRhbGljO30KLmluc2lnaHQtYm9keXtwYWRkaW5nOjIwcHg7ZGlzcGxheTpmbGV4",
  "O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6NnB4O30KLmluc2lnaHQtaGVhZGluZ3tmb250LWZhbWlseTonUGxheWZhaXIgRGlz",
  "cGxheScsc2VyaWY7Zm9udC1zaXplOi45NXJlbTtmb250LXdlaWdodDo3MDA7Y29sb3I6IzZCMEUxRTttYXJnaW4tdG9wOjEwcHg7",
  "cGFkZGluZy1ib3R0b206NHB4O2JvcmRlci1ib3R0b206MXB4IHNvbGlkICNmMGU4ZTg7fQouaW5zaWdodC1saW5le2ZvbnQtc2l6",
  "ZTouODhyZW07Y29sb3I6IzMzMztsaW5lLWhlaWdodDoxLjY7fQouaW5zaWdodC1idWxsZXR7Zm9udC1zaXplOi44OHJlbTtjb2xv",
  "cjojMzMzO2xpbmUtaGVpZ2h0OjEuNjtwYWRkaW5nLWxlZnQ6MTZweDtwb3NpdGlvbjpyZWxhdGl2ZTt9Ci5pbnNpZ2h0LWJ1bGxl",
  "dDo6YmVmb3Jle2NvbnRlbnQ6ImJ1bGxldCI7cG9zaXRpb246YWJzb2x1dGU7bGVmdDo0cHg7Y29sb3I6IzZCMEUxRTtmb250LXNp",
  "emU6LjZyZW07fQouaW5zaWdodC1nYXB7aGVpZ2h0OjZweDt9Cg==",
].join("");
const FBMT_CSS = atob(FBMT_CSS_B64);

const fmt = (v) => v === "" || v === null || v === undefined
  ? "$0"
  : "$" + Number(v || 0).toLocaleString("en-US", { maximumFractionDigits: 0 });
const numVal = (v) => Number((v || "").toString().replace(/[^0-9.-]/g, "")) || 0;

const STORAGE_PREFIX = "fbmt_bs:";

const STEPS = [
  "intro","cash_glacier","cash_other","receivables","federal_payments",
  "livestock_market","farm_products","crop_investment","supplies","other_current",
  "breeding_stock","real_estate","re_contracts","vehicles","machinery","other_assets",
  "liab_intro","operating_notes","accounts_due","intermediate_debt","re_current",
  "taxes_due","other_current_liab","re_mortgages","other_liabilities","summary"
];
const STEP_LABELS = {
  intro:"Client Info", cash_glacier:"Glacier Bank", cash_other:"Other Banks",
  receivables:"Receivables", federal_payments:"Federal Payments",
  livestock_market:"Market Livestock", farm_products:"Farm Products",
  crop_investment:"Crop Investment", supplies:"Supplies", other_current:"Other Current",
  breeding_stock:"Breeding Stock", real_estate:"Real Estate", re_contracts:"RE Contracts",
  vehicles:"Vehicles", machinery:"Machinery", other_assets:"Other Assets",
  liab_intro:"Liabilities", operating_notes:"Operating Notes", accounts_due:"Accounts Due",
  intermediate_debt:"Term Debt", re_current:"RE Current", taxes_due:"Taxes Due",
  other_current_liab:"Other Curr. Liab", re_mortgages:"RE Mortgages",
  other_liabilities:"Other Liabilities", summary:"Summary"
};
const ASSET_STEPS = ["cash_glacier","cash_other","receivables","federal_payments",
  "livestock_market","farm_products","crop_investment","supplies","other_current",
  "breeding_stock","real_estate","re_contracts","vehicles","machinery","other_assets"];
const LIAB_STEPS = ["operating_notes","accounts_due","intermediate_debt","re_current",
  "taxes_due","other_current_liab","re_mortgages","other_liabilities"];

function emptyData() {
  return {
    clientName:"", asOfDate: new Date().toISOString().slice(0,10),
    cashGlacier:"", cashOther:[{institution:"",amount:""}],
    receivables:[{description:"",amount:""}], receivablesSecured:"",
    federalPayments:"",
    livestockMarket:[{number:"",kind:"",value:""}],
    farmProducts:[{quantity:"",kind:"",pricePerUnit:"",unit:"bu",share:"100"}],
    cropInvestment:[{cropType:"",acres:"",valuePerAcre:""}],
    supplies:[{description:"",value:""}], otherCurrent:[{description:"",amount:""}],
    breedingStock:[{number:"",kind:"",value:""}],
    realEstate:[{acres:"",reType:"",description:"",valuePerAcre:""}],
    reContracts:[{description:"",amount:""}],
    vehicles:[{year:"",make:"",vin:"",condition:"",value:""}],
    machinery:[{year:"",make:"",size:"",serial:"",condition:"",value:""}],
    otherAssets:[{description:"",amount:""}],
    operatingNotes:[{creditor:"",dueDate:"",pmt:"",balance:"",security:""}],
    accountsDue:[{creditor:"",amount:""}],
    intermediatDebt:[{creditor:"",security:"",dueDate:"",annualPmt:"",principal:"",rate:""}],
    reCurrent:[{creditor:"",annualPmt:"",rate:""}],
    taxesDue:"", otherCurrentLiab:[{description:"",amount:""}],
    reMortgages:[{lienHolder:"",terms:"",principal:"",rate:""}],
    otherLiabilities:[{description:"",balance:""}],
    budgetCrops:[{acres:"",crop:"",yieldPerAcre:"",unit:"bu",price:"",share:"100"}],
    budgetLivestock:[{head:"",type:"",lbs:"",price:""}],
    budgetMisc:[{description:"Government Payments (FSA/ARC/PLC)",amount:""}],
    budgetExpenses:[{description:"",amount:""}],
  };
}

// Tiny reusable components
function Inp({ label, value, onChange, placeholder, prefix }) {
  return (
    <div className="input-group">
      {label && <label>{label}</label>}
      <div className="input-wrap">
        {prefix && <span className="prefix">{prefix}</span>}
        <input type="text" value={value} placeholder={placeholder || "0"}
          onChange={e => onChange(e.target.value.replace(/[^0-9.]/g, ""))} />
      </div>
    </div>
  );
}
function TxtInp({ label, value, onChange, placeholder }) {
  return (
    <div className="input-group">
      {label && <label>{label}</label>}
      <input className="text-input" type="text" value={value}
        placeholder={placeholder || ""} onChange={e => onChange(e.target.value)} />
    </div>
  );
}
function SecHdr({ icon, title, subtitle, color }) {
  return (
    <div className="section-header" style={{ borderColor: color || "#6B0E1E" }}>
      <div className="section-icon">{icon}</div>
      <div>
        <h2>{title}</h2>
        {subtitle && <p className="subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}
function CalcRow({ label, value, style }) {
  return (
    <div className="fp-calc-total" style={style}>
      <span className="fp-equals">=</span>
      <span className="fp-result">{value > 0 ? fmt(value) : "—"}</span>
    </div>
  );
}
function RunningTotal({ assets, liabilities }) {
  const nw = assets - liabilities;
  return (
    <div className="running-total">
      <div className="rt-item"><span>Total Assets</span><strong className="green">{fmt(assets)}</strong></div>
      <div className="rt-item"><span>Total Liabilities</span><strong className="red">{fmt(liabilities)}</strong></div>
      <div className="rt-item net"><span>Net Worth</span>
        <strong className={nw >= 0 ? "green" : "red"}>{fmt(nw)}</strong>
      </div>
    </div>
  );
}


// ─── BudgetView ───────────────────────────────────────────────────────────────
function BudgetView({
  data, budgetCropTotal, budgetLivestockTotal, budgetMiscTotal,
  budgetTotalIncome, budgetOperatingExpenses,
  debtServiceTerms, debtServiceRE,
  budgetTotalDebtService, budgetTotalExpenses, budgetNetIncome,
  setArr, removeRow, addRow
}) {
  return (
    <div className="budget-wrap">
      <div className="budget-section">
        <div className="budget-section-head income-head">
          <span>INCOME</span>
          <span className="bsh-total">{fmt(budgetTotalIncome)}</span>
        </div>
        <div className="budget-subsection">
          <div className="budget-sub-label">Crop Income</div>
          <div className="bg-header-row">
            <span style={{width:20}}></span>
            <span className="bg-col-label" style={{width:75}}>Acres</span>
            <span className="bg-col-label" style={{flex:1}}>Crop</span>
            <span className="bg-col-label" style={{width:90}}>Yield/Acre</span>
            <span className="bg-col-label" style={{width:65}}>Unit</span>
            <span className="bg-col-label" style={{width:100}}>Price</span>
            <span className="bg-col-label" style={{width:70}}>Share %</span>
            <span className="bg-col-label" style={{width:115}}>Your Value</span>
            <span style={{width:32}}></span>
          </div>
          {data.budgetCrops.map((r, i) => {
            const share = numVal(r.share || "100");
            const rv = numVal(r.acres) * numVal(r.yieldPerAcre) * numVal(r.price) * (share / 100);
            return (
              <div key={i} className="bg-row" data-rowkey={`budgetCrops-${i}`}>
                <span className="row-num">{i+1}</span>
                <div className="input-group" style={{width:75,flexShrink:0}}>
                  <div className="input-wrap">
                    <input type="text" value={r.acres} placeholder="0"
                      onChange={e => setArr("budgetCrops",i,"acres",e.target.value.replace(/[^0-9.]/g,""))} />
                  </div>
                </div>
                <div className="input-group" style={{flex:1}}>
                  <input className="text-input" type="text" value={r.crop}
                    placeholder="e.g., winter wheat"
                    onChange={e => setArr("budgetCrops",i,"crop",e.target.value)} />
                </div>
                <div className="input-group" style={{width:90,flexShrink:0}}>
                  <div className="input-wrap">
                    <input type="text" value={r.yieldPerAcre} placeholder="0"
                      onChange={e => setArr("budgetCrops",i,"yieldPerAcre",e.target.value.replace(/[^0-9.]/g,""))} />
                  </div>
                </div>
                <div className="input-group" style={{width:65,flexShrink:0}}>
                  <select className="unit-select" value={r.unit}
                    onChange={e => setArr("budgetCrops",i,"unit",e.target.value)}>
                    <option>bu</option><option>lbs</option>
                    <option>ton</option><option>cwt</option><option>bale</option>
                  </select>
                </div>
                <div className="input-group" style={{width:100,flexShrink:0}}>
                  <div className="input-wrap">
                    <span className="prefix">$</span>
                    <input type="text" value={r.price} placeholder="0.00"
                      onChange={e => setArr("budgetCrops",i,"price",e.target.value.replace(/[^0-9.]/g,""))} />
                  </div>
                </div>
                <div className="input-group" style={{width:70,flexShrink:0}}>
                  <div className="input-wrap">
                    <input type="text" value={r.share ?? "100"} placeholder="100"
                      onChange={e => setArr("budgetCrops",i,"share",e.target.value.replace(/[^0-9.]/g,""))} />
                    <span className="prefix" style={{borderLeft:"1.5px solid #ddd",borderRight:"none"}}>%</span>
                  </div>
                </div>
                <CalcRow value={rv} style={{width:115}} />
                <button className="remove-btn" onClick={() => removeRow("budgetCrops",i)}>x</button>
              </div>
            );
          })}
          <button className="add-btn"
            onClick={() => addRow("budgetCrops",{acres:"",crop:"",yieldPerAcre:"",unit:"bu",price:"",share:"100"})}>
            + Add Crop
          </button>
          <div className="budget-subtotal">
            <span>Crop Income Subtotal</span><strong>{fmt(budgetCropTotal)}</strong>
          </div>
        </div>
        <div className="budget-subsection">
          <div className="budget-sub-label">Livestock Income</div>
          <div className="bg-header-row">
            <span style={{width:20}}></span>
            <span className="bg-col-label" style={{width:80}}># Head</span>
            <span className="bg-col-label" style={{flex:1}}>Type / Variety</span>
            <span className="bg-col-label" style={{width:90}}>Lbs/Head</span>
            <span className="bg-col-label" style={{width:110}}>Price / Lb</span>
            <span className="bg-col-label" style={{width:115}}>Value</span>
            <span style={{width:32}}></span>
          </div>
          {data.budgetLivestock.map((r, i) => {
            const rv = numVal(r.head) * numVal(r.lbs) * numVal(r.price);
            return (
              <div key={i} className="bg-row" data-rowkey={`budgetLivestock-${i}`}>
                <span className="row-num">{i+1}</span>
                <div className="input-group" style={{width:80,flexShrink:0}}>
                  <div className="input-wrap">
                    <input type="text" value={r.head} placeholder="0"
                      onChange={e => setArr("budgetLivestock",i,"head",e.target.value.replace(/[^0-9.]/g,""))} />
                  </div>
                </div>
                <div className="input-group" style={{flex:1}}>
                  <input className="text-input" type="text" value={r.type}
                    placeholder="e.g., 800 lb steers"
                    onChange={e => setArr("budgetLivestock",i,"type",e.target.value)} />
                </div>
                <div className="input-group" style={{width:90,flexShrink:0}}>
                  <div className="input-wrap">
                    <input type="text" value={r.lbs} placeholder="0"
                      onChange={e => setArr("budgetLivestock",i,"lbs",e.target.value.replace(/[^0-9.]/g,""))} />
                  </div>
                </div>
                <div className="input-group" style={{width:110,flexShrink:0}}>
                  <div className="input-wrap">
                    <span className="prefix">$</span>
                    <input type="text" value={r.price} placeholder="0.00"
                      onChange={e => setArr("budgetLivestock",i,"price",e.target.value.replace(/[^0-9.]/g,""))} />
                  </div>
                </div>
                <CalcRow value={rv} style={{width:115}} />
                <button className="remove-btn" onClick={() => removeRow("budgetLivestock",i)}>x</button>
              </div>
            );
          })}
          <button className="add-btn"
            onClick={() => addRow("budgetLivestock",{head:"",type:"",lbs:"",price:""})}>
            + Add Livestock
          </button>
          <div className="budget-subtotal">
            <span>Livestock Income Subtotal</span><strong>{fmt(budgetLivestockTotal)}</strong>
          </div>
        </div>
        <div className="budget-subsection">
          <div className="budget-sub-label">Miscellaneous Income</div>
          {data.budgetMisc.map((r, i) => (
            <div key={i} className="bg-row" data-rowkey={`budgetMisc-${i}`}>
              <span className="row-num">{i+1}</span>
              <div className="input-group" style={{flex:1}}>
                <input className="text-input" type="text" value={r.description}
                  placeholder="e.g., Government Payments, CRP"
                  onChange={e => setArr("budgetMisc",i,"description",e.target.value)} />
              </div>
              <div className="input-group" style={{width:150,flexShrink:0}}>
                <div className="input-wrap">
                  <span className="prefix">$</span>
                  <input type="text" value={r.amount} placeholder="0"
                    onChange={e => setArr("budgetMisc",i,"amount",e.target.value.replace(/[^0-9.]/g,""))} />
                </div>
              </div>
              <button className="remove-btn" onClick={() => removeRow("budgetMisc",i)}>x</button>
            </div>
          ))}
          <button className="add-btn"
            onClick={() => addRow("budgetMisc",{description:"",amount:""})}>
            + Add Misc Income
          </button>
          <div className="budget-subtotal">
            <span>Misc Income Subtotal</span>
            <strong>{fmt(budgetMiscTotal)}</strong>
          </div>
        </div>
        <div className="budget-grand income-grand">
          <span>TOTAL INCOME</span><span>{fmt(budgetTotalIncome)}</span>
        </div>
      </div>

      <div className="budget-section">
        <div className="budget-section-head expense-head">
          <span>EXPENSES</span>
          <span className="bsh-total">{fmt(budgetTotalExpenses)}</span>
        </div>
        <div className="budget-subsection">
          <div className="budget-sub-label">Operating Expenses</div>
          {data.budgetExpenses.map((r, i) => (
            <div key={i} className="bg-row" data-rowkey={`budgetExpenses-${i}`}>
              <span className="row-num">{i+1}</span>
              <div className="input-group" style={{flex:1}}>
                <input className="text-input" type="text" value={r.description}
                  placeholder="e.g., Seed, Fertilizer, Fuel, Labor"
                  onChange={e => setArr("budgetExpenses",i,"description",e.target.value)} />
              </div>
              <div className="input-group" style={{width:150,flexShrink:0}}>
                <div className="input-wrap">
                  <span className="prefix">$</span>
                  <input type="text" value={r.amount} placeholder="0"
                    onChange={e => setArr("budgetExpenses",i,"amount",e.target.value.replace(/[^0-9.]/g,""))} />
                </div>
              </div>
              <button className="remove-btn" onClick={() => removeRow("budgetExpenses",i)}>x</button>
            </div>
          ))}
          <button className="add-btn"
            onClick={() => addRow("budgetExpenses",{description:"",amount:""})}>
            + Add Expense
          </button>
          <div className="budget-subtotal">
            <span>Total Operating Expenses</span>
            <strong>{fmt(budgetOperatingExpenses)}</strong>
          </div>
        </div>
        <div className="budget-subsection">
          <div className="budget-sub-label">
            Debt Service
            <span style={{fontSize:".65rem",color:"#aaa",fontWeight:400,marginLeft:8}}>
              auto-filled from balance sheet
            </span>
          </div>
          {debtServiceTerms.length === 0 && debtServiceRE.length === 0 && (
            <div className="debt-empty">No debt entered on Balance Sheet tab yet.</div>
          )}
          {debtServiceTerms.length > 0 && (
            <div>
              <div className="debt-category-label">Intermediate / Term Debt</div>
              {debtServiceTerms.map((r, i) => (
                <div key={i} className="debt-row">
                  <span className="debt-creditor">{r.creditor}</span>
                  <span className="debt-detail">{r.security ? "(" + r.security + ")" : ""}</span>
                  <span className="debt-amount">{fmt(r.annualPmt)}</span>
                </div>
              ))}
            </div>
          )}
          {debtServiceRE.length > 0 && (
            <div>
              <div className="debt-category-label">Real Estate Mortgages</div>
              {debtServiceRE.map((r, i) => (
                <div key={i} className="debt-row">
                  <span className="debt-creditor">{r.creditor}</span>
                  <span className="debt-detail"></span>
                  <span className="debt-amount">{fmt(r.annualPmt)}</span>
                </div>
              ))}
            </div>
          )}
          <div className="budget-subtotal">
            <span>Total Debt Service</span><strong>{fmt(budgetTotalDebtService)}</strong>
          </div>
        </div>
        <div className="budget-grand expense-grand">
          <span>TOTAL EXPENSES</span><span>{fmt(budgetTotalExpenses)}</span>
        </div>
        <div className={"budget-net " + (budgetNetIncome >= 0 ? "net-positive" : "net-negative")}>
          <div className="margin-detail">
            <div className="margin-label">
              {budgetNetIncome >= 0 ? "MARGIN (Net Income)" : "MARGIN (Net Loss)"}
            </div>
            <div className="margin-calc">
              {fmt(budgetTotalIncome)} income minus {fmt(budgetTotalExpenses)} expenses
            </div>
          </div>
          <span className="margin-value">{fmt(Math.abs(budgetNetIncome))}</span>
        </div>
      </div>
    </div>
  );
}

// ─── ComparisonView ───────────────────────────────────────────────────────────
function ComparisonView({
  compSheets, compLoading, compInsight, compInsightLoading,
  generateInsights, clientName, SECTION_BREAKS, SECTION_HEADERS, BOLD_ROWS
}) {
  if (compLoading) return <div className="comp-loading">Loading saved sheets...</div>;
  if (compSheets.length === 0) return (
    <div className="comp-empty">
      <p>No saved balance sheets found for <strong>{clientName}</strong>.</p>
      <p>Complete and save multiple years to enable comparison.</p>
    </div>
  );
  if (compSheets.length === 1) return (
    <div className="comp-empty">
      <p>Only one sheet saved ({compSheets[0].date}). Save a second year to compare.</p>
    </div>
  );
  const labels = Object.keys(compSheets[0].totals);
  const years = compSheets.map(s => s.date);
  const colSpan = years.length + (years.length - 1) + (years.length > 2 ? 1 : 0) + 1;

  return (
    <div className="comp-wrap">
      <div className="comp-table-wrap">
        <table className="comp-table">
          <thead>
            <tr>
              <th className="comp-th comp-label-th">Category</th>
              {years.map((y,i) => <th key={i} className="comp-th comp-year-th">{y}</th>)}
              {years.slice(1).map((y,i) => (
                <th key={i} className="comp-th comp-chg-th">
                  Change {years[i]} to {y}
                </th>
              ))}
              {years.length > 2 && <th className="comp-th comp-trend-th">Trend</th>}
            </tr>
          </thead>
          <tbody>
            {labels.map((label) => {
              const isBold = BOLD_ROWS.has(label);
              const isBreak = SECTION_BREAKS.has(label);
              const sectionHead = SECTION_HEADERS[label];
              const vals = compSheets.map(s => s.totals[label] || 0);
              const first = vals[0];
              const last = vals[vals.length - 1];
              const trendArrow = last > first ? "up" : last < first ? "down" : "flat";
              const trendSym = last > first ? "↑" : last < first ? "↓" : "→";
              const rowCls = "comp-row" + (isBold ? " comp-bold-row" : "") + (isBreak ? " comp-break-row" : "");
              return (
                <React.Fragment key={label}>
                  {sectionHead && (
                    <tr className="comp-section-head">
                      <td colSpan={colSpan}>{sectionHead}</td>
                    </tr>
                  )}
                  <tr className={rowCls}>
                    <td className="comp-label">{label}</td>
                    {vals.map((v,i) => {
                      const valCls = "comp-val" + (isBold ? " comp-bold-val" : "");
                      return (
                        <td key={i} className={valCls}>
                          {v === 0 && !isBold
                            ? <span className="comp-zero">—</span>
                            : <span className={v < 0 ? "comp-neg" : ""}>
                                {v < 0 ? "-$" + Math.abs(v).toLocaleString() : "$" + v.toLocaleString()}
                              </span>
                          }
                        </td>
                      );
                    })}
                    {vals.slice(1).map((v, i) => {
                      const prev = vals[i];
                      const diff = v - prev;
                      const pct = prev !== 0 ? (diff / Math.abs(prev) * 100) : null;
                      if (diff === 0 && prev === 0) {
                        return <td key={i} className="comp-chg"><span className="comp-zero">—</span></td>;
                      }
                      const chgCls = "comp-chg " + (diff > 0 ? "comp-up" : diff < 0 ? "comp-dn" : "comp-flat");
                      const diffStr = diff < 0
                        ? "-$" + Math.abs(diff).toLocaleString()
                        : "+$" + diff.toLocaleString();
                      return (
                        <td key={i} className={chgCls}>
                          <div className="chg-amt">{diffStr}</div>
                          {pct !== null && (
                            <div className="chg-pct">{pct >= 0 ? "+" : ""}{pct.toFixed(1)}%</div>
                          )}
                        </td>
                      );
                    })}
                    {years.length > 2 && (
                      <td className={"comp-trend trend-" + trendArrow}>{trendSym}</td>
                    )}
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="insight-panel">
        <div className="insight-header">
          <div>
            <div className="insight-title">AI Financial Insights</div>
            <div className="insight-sub">
              Claude analyzes year-over-year changes and explains what they mean
            </div>
          </div>
          <button className="btn-insight" onClick={generateInsights}
            disabled={compInsightLoading}>
            {compInsightLoading ? "Analyzing..." : compInsight ? "Re-analyze" : "Generate Insights"}
          </button>
        </div>
        {compInsightLoading && (
          <div className="insight-loading">
            <div className="insight-spinner"></div>
            <span>Analyzing {years.length} years of data...</span>
          </div>
        )}
        {compInsight && !compInsightLoading && (
          <div className="insight-body">
            {compInsight.split("\n").map((line, i) => {
              const t = line.trim();
              if (!t) return <div key={i} className="insight-gap" />;
              if (t.startsWith("##") || (t.startsWith("**") && t.endsWith("**"))) {
                return <div key={i} className="insight-heading">
                  {t.replace(/\*\*/g,"").replace(/##/g,"").trim()}
                </div>;
              }
              if (t.startsWith("- ") || t.startsWith("• ")) {
                return <div key={i} className="insight-bullet">{t.slice(2)}</div>;
              }
              return <div key={i} className="insight-line">{line}</div>;
            })}
          </div>
        )}
        {!compInsight && !compInsightLoading && (
          <div className="insight-prompt">
            Click Generate Insights for an AI-powered analysis of the financial changes.
          </div>
        )}
      </div>
    </div>
  );
}


// ── Supabase storage layer ─────────────────────────────────────────────────────
const SUPABASE_URL = (window.SUPABASE_URL || '').replace(/\/+$/, '');
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || '';

function isConfigured() {
  return SUPABASE_URL
    && SUPABASE_URL !== 'https://YOUR_PROJECT_ID.supabase.co'
    && SUPABASE_ANON_KEY
    && SUPABASE_ANON_KEY !== 'YOUR_ANON_KEY_HERE';
}

function supaHeaders() {
  return {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
    'Prefer': 'return=representation'
  };
}

function parseKey(key) {
  const parts = key.replace('fbmt_bs:', '').split(':');
  return { clientName: parts[0].replace(/_/g, ' '), asOfDate: parts[1] || '' };
}
function makeKey(clientName, asOfDate) {
  return 'fbmt_bs:' + clientName.replace(/\s+/g, '_') + ':' + asOfDate;
}

const storage = {
  async list(prefix) {
    if (!isConfigured()) return { keys: [] };
    const clientPart = prefix.replace('fbmt_bs:', '').replace(/:$/, '').replace(/_/g, ' ');
    let url = SUPABASE_URL + '/rest/v1/balance_sheets?select=client_name,as_of_date&order=as_of_date.desc';
    if (clientPart) url += '&client_name=eq.' + encodeURIComponent(clientPart);
    const resp = await fetch(url, { headers: supaHeaders() });
    if (!resp.ok) {
      const err = await resp.text();
      console.error('Supabase list error:', resp.status, err);
      return { keys: [] };
    }
    const rows = await resp.json();
    return { keys: rows.map(r => makeKey(r.client_name, r.as_of_date)) };
  },
  async get(key) {
    if (!isConfigured()) return null;
    const { clientName, asOfDate } = parseKey(key);
    const url = SUPABASE_URL + '/rest/v1/balance_sheets?client_name=eq.'
      + encodeURIComponent(clientName) + '&as_of_date=eq.' + asOfDate + '&limit=1';
    const resp = await fetch(url, { headers: supaHeaders() });
    if (!resp.ok) return null;
    const rows = await resp.json();
    if (!rows.length) return null;
    return { key, value: JSON.stringify(rows[0].data) };
  },
  async set(key, value) {
    if (!isConfigured()) {
      throw new Error('Supabase not configured — edit public/config.js with your Project URL and anon key');
    }
    const { clientName, asOfDate } = parseKey(key);
    const parsed = JSON.parse(value);
    const body = { client_name: clientName, as_of_date: asOfDate, data: parsed, saved_at: new Date().toISOString() };

    // Check if record already exists
    const checkUrl = SUPABASE_URL + '/rest/v1/balance_sheets?client_name=eq.'
      + encodeURIComponent(clientName) + '&as_of_date=eq.' + asOfDate + '&limit=1';
    const checkResp = await fetch(checkUrl, { headers: supaHeaders() });
    const existing = checkResp.ok ? await checkResp.json() : [];

    let resp;
    if (existing.length > 0) {
      // Record exists — update with PATCH
      resp = await fetch(checkUrl, {
        method: 'PATCH',
        headers: supaHeaders(),
        body: JSON.stringify({ data: parsed, saved_at: new Date().toISOString() })
      });
    } else {
      // New record — insert with POST
      resp = await fetch(SUPABASE_URL + '/rest/v1/balance_sheets', {
        method: 'POST',
        headers: supaHeaders(),
        body: JSON.stringify(body)
      });
    }
    if (!resp.ok) {
      const err = await resp.text();
      throw new Error('Database error (' + resp.status + '): ' + err);
    }
    return { key, value };
  },
  async delete(key) {
    if (!isConfigured()) return null;
    const { clientName, asOfDate } = parseKey(key);
    const url = SUPABASE_URL + '/rest/v1/balance_sheets?client_name=eq.'
      + encodeURIComponent(clientName) + '&as_of_date=eq.' + asOfDate;
    const resp = await fetch(url, { method: 'DELETE', headers: supaHeaders() });
    return resp.ok ? { key, deleted: true } : null;
  }
};

// ─── Main BalanceSheet Component ──────────────────────────────────────────────
export default function BalanceSheet() {
  const [step, setStep] = useState(0);
  const [screen, setScreen] = useState("home");
  const [activeTab, setActiveTab] = useState("balance");
  const [compSheets, setCompSheets] = useState([]);
  const [compLoading, setCompLoading] = useState(false);
  const [compInsight, setCompInsight] = useState("");
  const [compInsightLoading, setCompInsightLoading] = useState(false);
  const [savedSheets, setSavedSheets] = useState([]);
  const [saveStatus, setSaveStatus] = useState(null);
  const [data, setData] = useState(emptyData());

  useEffect(() => {
    const fl = document.createElement("link");
    fl.id = "fbmt-fonts"; fl.rel = "stylesheet";
    fl.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght"
      + "@600;700&family=Source+Sans+3:wght@300;400;500;600&display=swap";
    if (!document.getElementById("fbmt-fonts")) document.head.appendChild(fl);
    const el = document.createElement("style");
    el.id = "fbmt-styles"; el.textContent = FBMT_CSS;
    if (!document.getElementById("fbmt-styles")) document.head.appendChild(el);
  }, []);

  const set = (k, v) => setData(d => ({ ...d, [k]: v }));
  const setArr = (k, idx, field, v) => setData(d => {
    const arr = [...d[k]]; arr[idx] = { ...arr[idx], [field]: v }; return { ...d, [k]: arr };
  });
  const addRow = (k, tpl) => {
    setData(d => {
      const newArr = [...d[k], { ...tpl }];
      // Schedule focus on first text field of the new row after render
      setTimeout(() => {
        const newIdx = newArr.length - 1;
        const selector = `[data-rowkey="${k}-${newIdx}"] input, [data-rowkey="${k}-${newIdx}"] select`;
        const el = document.querySelector(selector);
        if (el) el.focus();
      }, 30);
      return { ...d, [k]: newArr };
    });
  };
  const removeRow = (k, idx) => setData(d => ({ ...d, [k]: d[k].filter((_,i) => i !== idx) }));

  // ── Storage ────────────────────────────────────────────────────────────────
  const loadSavedList = async () => {
    try {
      const result = await storage.list(STORAGE_PREFIX);
      if (result && result.keys) {
        const sheets = [];
        for (const key of result.keys) {
          try {
            const item = await storage.get(key);
            if (item) {
              const p = JSON.parse(item.value);
              sheets.push({ key, clientName: p.clientName, asOfDate: p.asOfDate, savedAt: p._savedAt });
            }
          } catch {}
        }
        sheets.sort((a, b) => (b.savedAt || "").localeCompare(a.savedAt || ""));
        setSavedSheets(sheets);
      }
    } catch {}
  };
  useEffect(() => { loadSavedList(); }, []);

  const [confirmSave, setConfirmSave] = useState(null); // null | { key, label }

  const saveSheet = async () => {
    if (!data.clientName) return;
    const key = STORAGE_PREFIX + data.clientName.replace(/\s+/g,"_") + ":" + data.asOfDate;
    // Check if a record already exists for this client + date
    try {
      const existing = await storage.get(key);
      if (existing) {
        // Ask user if they want to overwrite
        setConfirmSave({ key, label: data.clientName + " — " + data.asOfDate });
        return;
      }
    } catch {}
    // No existing record — save directly
    await doSave(key);
  };

  const doSave = async (key) => {
    setSaveStatus("saving");
    setConfirmSave(null);
    try {
      await storage.set(key, JSON.stringify({ ...data, _savedAt: new Date().toISOString() }));
      setSaveStatus("saved");
      await loadSavedList();
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      setSaveStatus(err.message || "error");
      setTimeout(() => setSaveStatus(null), 8000);
    }
  };
  const loadSheet = async (key) => {
    try {
      const item = await storage.get(key);
      if (item) {
        const p = JSON.parse(item.value); delete p._savedAt;
        setData({ ...emptyData(), ...p }); setStep(0); setScreen("wizard");
      }
    } catch {}
  };
  const startNew = () => { setData(emptyData()); setStep(0); setScreen("wizard"); };
  const deleteSheet = async (key, e) => {
    e.stopPropagation();
    try { await storage.delete(key); await loadSavedList(); } catch {}
  };

  // ── Calculations ───────────────────────────────────────────────────────────
  const n = numVal;
  const cashTotal = n(data.cashGlacier) + data.cashOther.reduce((s,r)=>s+n(r.amount),0);
  const recTotal = data.receivables.reduce((s,r)=>s+n(r.amount),0);
  const fedPay = n(data.federalPayments);
  const lsMktTotal = data.livestockMarket.reduce((s,r)=>s+n(r.value),0);
  const farmProdTotal = data.farmProducts.reduce((s,r)=>s+n(r.quantity)*n(r.pricePerUnit)*(n(r.share||"100")/100),0);
  const cropInv = data.cropInvestment.reduce((s,r)=>s+n(r.acres)*n(r.valuePerAcre),0);
  const suppliesTotal = data.supplies.reduce((s,r)=>s+n(r.value),0);
  const otherCurTotal = data.otherCurrent.reduce((s,r)=>s+n(r.amount),0);
  const totalCurrentAssets = cashTotal+recTotal+fedPay+lsMktTotal+farmProdTotal+cropInv+suppliesTotal+otherCurTotal;
  const breedingTotal = data.breedingStock.reduce((s,r)=>s+n(r.value),0);
  const reTotal = data.realEstate.reduce((s,r)=>s+n(r.acres)*n(r.valuePerAcre),0);
  const reConTotal = data.reContracts.reduce((s,r)=>s+n(r.amount),0);
  const vehiclesVal = data.vehicles.reduce((s,r)=>s+n(r.value),0);
  const machVal = data.machinery.reduce((s,r)=>s+n(r.value),0);
  const otherAssetsTotal = data.otherAssets.reduce((s,r)=>s+n(r.amount),0);
  const totalLTAssets = breedingTotal+reTotal+reConTotal+vehiclesVal+machVal+otherAssetsTotal;
  const totalAssets = totalCurrentAssets + totalLTAssets;
  const opNotesTotal = data.operatingNotes.reduce((s,r)=>s+n(r.balance),0);
  const acctsDueTotal = data.accountsDue.reduce((s,r)=>s+n(r.amount),0);
  const intermedTotal = data.intermediatDebt.reduce((s,r)=>s+n(r.principal),0);
  const reCurrentTotal = data.reCurrent.reduce((s,r)=>s+n(r.annualPmt),0);
  const taxesDueVal = n(data.taxesDue);
  const otherCLTotal = data.otherCurrentLiab.reduce((s,r)=>s+n(r.amount),0);
  const totalCurrentLiab = opNotesTotal+acctsDueTotal+intermedTotal+reCurrentTotal+taxesDueVal+otherCLTotal;
  const reMortTotal = data.reMortgages.reduce((s,r)=>s+n(r.principal),0);
  const otherLiabTotal = data.otherLiabilities.reduce((s,r)=>s+n(r.balance),0);
  const totalLiabilities = totalCurrentLiab + reMortTotal + otherLiabTotal;
  const netWorth = totalAssets - totalLiabilities;
  const workingCapital = totalCurrentAssets - totalCurrentLiab;

  // Budget calcs
  const budgetCropTotal = data.budgetCrops.reduce((s,r)=>s+n(r.acres)*n(r.yieldPerAcre)*n(r.price)*(n(r.share||"100")/100),0);
  const budgetLivestockTotal = data.budgetLivestock.reduce((s,r)=>s+n(r.head)*n(r.lbs)*n(r.price),0);
  const budgetMiscTotal = data.budgetMisc.reduce((s,r)=>s+n(r.amount),0);
  const budgetTotalIncome = budgetCropTotal + budgetLivestockTotal + budgetMiscTotal;
  const budgetOperatingExpenses = data.budgetExpenses.reduce((s,r)=>s+n(r.amount),0);
  const debtServiceTerms = data.intermediatDebt.filter(r=>r.creditor && n(r.annualPmt)>0);
  const debtServiceRE = data.reCurrent.filter(r=>r.creditor && n(r.annualPmt)>0);
  const budgetTermDebtTotal = debtServiceTerms.reduce((s,r)=>s+n(r.annualPmt),0);
  const budgetREDebtTotal = debtServiceRE.reduce((s,r)=>s+n(r.annualPmt),0);
  const budgetTotalDebtService = budgetTermDebtTotal + budgetREDebtTotal;
  const budgetTotalExpenses = budgetOperatingExpenses + budgetTotalDebtService;
  const budgetNetIncome = budgetTotalIncome - budgetTotalExpenses;

  // Comparison helpers
  const SECTION_BREAKS = new Set(["Total Current Assets","TOTAL ASSETS","Total Current Liab","TOTAL LIABILITIES","NET WORTH"]);
  const SECTION_HEADERS = {
    "Cash & Bank": "CURRENT ASSETS",
    "Breeding Stock": "LONG-TERM ASSETS",
    "Operating Notes": "CURRENT LIABILITIES",
    "RE Mortgages (LT)": "LONG-TERM LIABILITIES",
    "WORKING CAPITAL": "SUMMARY"
  };
  const BOLD_ROWS = new Set(["Total Current Assets","Total LT Assets","TOTAL ASSETS","Total Current Liab","TOTAL LIABILITIES","WORKING CAPITAL","NET WORTH"]);

  function sheetTotals(d) {
    if (!d) return {};
    const m = numVal;
    const cash = m(d.cashGlacier) + (d.cashOther||[]).reduce((s,r)=>s+m(r.amount),0);
    const rec = (d.receivables||[]).reduce((s,r)=>s+m(r.amount),0);
    const fp = (d.farmProducts||[]).reduce((s,r)=>s+m(r.quantity)*m(r.pricePerUnit)*(m(r.share||"100")/100),0);
    const ci = (d.cropInvestment||[]).reduce((s,r)=>s+m(r.acres)*m(r.valuePerAcre),0);
    const ls = (d.livestockMarket||[]).reduce((s,r)=>s+m(r.value),0);
    const sup = (d.supplies||[]).reduce((s,r)=>s+m(r.value),0);
    const oc = (d.otherCurrent||[]).reduce((s,r)=>s+m(r.amount),0);
    const tc = cash+rec+m(d.federalPayments)+ls+fp+ci+sup+oc;
    const bs = (d.breedingStock||[]).reduce((s,r)=>s+m(r.value),0);
    const re = (d.realEstate||[]).reduce((s,r)=>s+m(r.acres)*m(r.valuePerAcre),0);
    const veh = (d.vehicles||[]).reduce((s,r)=>s+m(r.value),0);
    const mach = (d.machinery||[]).reduce((s,r)=>s+m(r.value),0);
    const oa = (d.otherAssets||[]).reduce((s,r)=>s+m(r.amount),0);
    const tlt = bs+re+(d.reContracts||[]).reduce((s,r)=>s+m(r.amount),0)+veh+mach+oa;
    const ta = tc+tlt;
    const on = (d.operatingNotes||[]).reduce((s,r)=>s+m(r.balance),0);
    const ad = (d.accountsDue||[]).reduce((s,r)=>s+m(r.amount),0);
    const id = (d.intermediatDebt||[]).reduce((s,r)=>s+m(r.principal),0);
    const rc = (d.reCurrent||[]).reduce((s,r)=>s+m(r.annualPmt),0);
    const ocl = (d.otherCurrentLiab||[]).reduce((s,r)=>s+m(r.amount),0);
    const tcl = on+ad+id+rc+m(d.taxesDue)+ocl;
    const rm = (d.reMortgages||[]).reduce((s,r)=>s+m(r.principal),0);
    const ol = (d.otherLiabilities||[]).reduce((s,r)=>s+m(r.balance),0);
    const tl = tcl+rm+ol;
    return {
      "Cash & Bank":cash, "Receivables":rec, "Federal Payments":m(d.federalPayments),
      "Market Livestock":ls, "Farm Products":fp, "Crop Investment":ci,
      "Supplies":sup, "Other Current":oc, "Total Current Assets":tc,
      "Breeding Stock":bs, "Real Estate":re,
      "RE Contracts Rec.":(d.reContracts||[]).reduce((s,r)=>s+m(r.amount),0),
      "Titled Vehicles":veh, "Machinery & Equip.":mach, "Other Assets":oa,
      "Total LT Assets":tlt, "TOTAL ASSETS":ta,
      "Operating Notes":on, "Accounts Due":ad, "Intermediate Debt":id,
      "RE Mortgage (current)":rc, "Income Taxes Due":m(d.taxesDue),
      "Other Current Liab":ocl, "Total Current Liab":tcl,
      "RE Mortgages (LT)":rm, "Other Liabilities":ol,
      "TOTAL LIABILITIES":tl, "WORKING CAPITAL":tc-tcl, "NET WORTH":ta-tl
    };
  }

  const loadComparisonSheets = async () => {
    if (!data.clientName) return;
    setCompLoading(true); setCompInsight("");
    try {
      const prefix = STORAGE_PREFIX + data.clientName.replace(/\s+/g,"_") + ":";
      const result = await storage.list(prefix);
      if (result && result.keys && result.keys.length > 0) {
        const sheets = [];
        for (const key of result.keys) {
          try {
            const item = await storage.get(key);
            if (item) {
              const p = JSON.parse(item.value);
              sheets.push({ date: p.asOfDate, totals: sheetTotals(p) });
            }
          } catch {}
        }
        sheets.sort((a,b) => a.date.localeCompare(b.date));
        setCompSheets(sheets);
      } else { setCompSheets([]); }
    } catch {}
    setCompLoading(false);
  };

  const generateInsights = async () => {
    if (compSheets.length < 2) return;
    setCompInsightLoading(true); setCompInsight("");
    const years = compSheets.map(s => s.date).join(", ");
    const rows = Object.keys(compSheets[0].totals).map(label => {
      const vals = compSheets.map(s => s.totals[label] || 0);
      return vals.slice(1).map((v,i) => {
        const prev = vals[i];
        const diff = v - prev;
        const pct = prev !== 0 ? ((diff/Math.abs(prev))*100).toFixed(1) : "N/A";
        const prevStr = prev >= 0 ? "$"+prev.toLocaleString() : "-$"+Math.abs(prev).toLocaleString();
        return label + ": " + prevStr + " to $" + v.toLocaleString() + " (" + (diff>=0?"+":"") + diff.toLocaleString() + ", " + pct + "%)";
      }).join("; ");
    }).join("\n");
    try {
      // Call our Netlify proxy function (avoids CORS + keeps API key private)
      const apiEndpoint = '/.netlify/functions/analyze';

      const requestBody = {
        model: "claude-sonnet-4-5",
        max_tokens: 1000,
        system: "You are an agricultural loan officer analyst at First Bank of Montana. "
          + "Analyze year-over-year balance sheet changes and provide clear practical insights. "
          + "Focus on significant changes, trends, working capital, debt load, and net worth. "
          + "Write in plain language. Use simple headers. Max 5 key observations.",
        messages: [{
          role: "user",
          content: "Client: " + data.clientName + "\nYears: " + years
            + "\n\nChanges:\n" + rows
            + "\n\nProvide insights on the most significant changes and financial health."
        }]
      };

      const resp = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });
      if (!resp.ok) {
        const errText = await resp.text();
        setCompInsight("Error from server (" + resp.status + "): " + errText);
        setCompInsightLoading(false);
        return;
      }
      const json = await resp.json();
      const text = json.content?.filter(b=>b.type==="text").map(b=>b.text).join("")
        || json.error
        || "Unable to generate insights.";
      setCompInsight(text);
    } catch (err) {
      setCompInsight("Connection error: " + err.message + ". Check that ANTHROPIC_API_KEY is set in Netlify environment variables.");
    }
    setCompInsightLoading(false);
  };

  const handlePrint = () => {
    const m = numVal;
    const pFmt = v => v && m(v) ? "$"+Number(m(v)).toLocaleString("en-US",{maximumFractionDigits:0}) : "";
    const blank = (arr, min) => { const r=[...arr]; while(r.length<min) r.push({}); return r; };
    const W = window.open("","_blank","width=850,height=1100");
    if (!W) return;
    const html = `<!DOCTYPE html><html><head><title>Balance Sheet - ${data.clientName}</title>
<style>
body{font-family:Arial,sans-serif;font-size:7.5pt;color:#000;margin:.45in .4in;}
h1{font-size:13pt;font-weight:700;text-decoration:underline;text-align:center;margin-bottom:4pt;}
h2{font-size:11pt;font-weight:700;text-decoration:underline;text-align:center;margin-bottom:8pt;}
.logo-box{border:2pt solid #6B0E1E;padding:4pt 7pt;display:inline-block;text-align:center;font-weight:900;color:#6B0E1E;}
.hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6pt;}
.name-row{border-bottom:1pt solid #000;padding-bottom:3pt;margin-bottom:5pt;font-weight:700;}
.body{display:flex;gap:8pt;}
.col{flex:1;}
.col-head{background:#000;color:#fff;font-weight:700;font-size:8pt;text-align:center;padding:2pt 4pt;display:flex;justify-content:space-between;}
.sec{font-style:italic;font-size:7pt;margin:3pt 0 1pt;color:#333;}
.row{display:flex;justify-content:space-between;min-height:12pt;border-bottom:.5pt dotted #ccc;padding:.5pt 2pt;}
.trow{display:flex;min-height:11pt;border-bottom:.5pt dotted #ccc;font-size:7pt;padding:.5pt 0;}
.c1{flex:1.4;} .c2{flex:1;} .c3{flex:.8;text-align:right;} .c4{flex:.8;text-align:right;} .c5{flex:.9;text-align:right;font-weight:600;}
.th{font-weight:700;font-size:6pt;text-transform:uppercase;border-bottom:1pt solid #000;margin-bottom:1pt;}
.subtot{display:flex;justify-content:space-between;border-top:1pt solid #000;padding-top:2pt;margin:2pt 0;font-weight:700;font-size:8pt;}
.tot{display:flex;justify-content:space-between;background:#000;color:#fff;padding:2pt 4pt;font-weight:700;font-size:8.5pt;margin:3pt 0;}
.net{display:flex;justify-content:space-between;border:1.5pt solid #000;padding:2pt 4pt;font-weight:700;font-size:8.5pt;margin:2pt 0;}
.sig{margin-top:10pt;border-top:1pt solid #000;padding-top:6pt;font-size:7pt;}
.sig-row{display:flex;gap:20pt;margin-top:8pt;}
.sig-line{flex:1;border-top:1pt solid #000;padding-top:2pt;}
.page2{page-break-before:always;padding-top:.2in;}
.sched-title{font-size:10pt;font-weight:700;text-transform:uppercase;letter-spacing:.05em;border-bottom:2pt solid #000;padding-bottom:3pt;margin-bottom:6pt;}
.sched-table{width:100%;border-collapse:collapse;font-size:7.5pt;margin-bottom:16pt;}
.sched-table th{background:#000;color:#fff;padding:3pt 5pt;text-align:left;font-size:7pt;font-weight:700;}
.sched-table th.r{text-align:right;}
.sched-table td{padding:3pt 5pt;border-bottom:.5pt dotted #ccc;vertical-align:top;}
.sched-table td.r{text-align:right;font-weight:600;}
.sched-table tr:nth-child(even){background:#f8f8f8;}
.sched-foot{display:flex;justify-content:flex-end;margin-top:4pt;}
.sched-total{background:#000;color:#fff;padding:2pt 8pt;font-weight:700;font-size:8pt;}
.sched-hdr{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4pt;}
.sched-client{font-size:8pt;color:#555;}
</style></head><body>
<div class="hdr">
  <div class="logo-box">FIRST<br/>BANK<br/>of Montana<br/><small>www.1stbmt.com</small></div>
  <div><h1>Balance Sheet prepared for:</h1><h2>First Bank of Montana</h2></div>
  <div style="text-align:right"><strong>As of:</strong> ${data.asOfDate}</div>
</div>
<div class="name-row">Name: ${data.clientName}</div>
<div class="body">
<div class="col">
<div class="col-head"><span>ASSETS</span><span>AMOUNT</span></div>
<div class="row"><span>Cash on Hand and in Bank:</span><span>${pFmt(cashTotal)||"$0"}</span></div>
<div class="sec">Current Receivables:</div>
${blank(data.receivables.filter(r=>r.description||r.amount),2).map(r=>`<div class="row"><span>${r.description||""}</span><span>${pFmt(r.amount)}</span></div>`).join("")}
<div class="row"><span>Federal Payments:</span><span>${pFmt(data.federalPayments)}</span></div>
<div class="sec">Farm Products:</div>
<div class="trow th"><span class="c1">Qty/Unit</span><span class="c2">Kind</span><span class="c3">Price/Unit</span><span class="c5">Total Value</span></div>
${blank(data.farmProducts.filter(r=>r.kind),3).map(r=>{const sh=numVal(r.share||"100");const val=numVal(r.quantity)*numVal(r.pricePerUnit)*(sh/100);return`<div class="trow"><span class="c1">${r.quantity?r.quantity+" "+r.unit:""}</span><span class="c2">${r.kind||""}${sh<100?" ("+sh+"% share)":""}</span><span class="c3">${r.pricePerUnit?"$"+r.pricePerUnit+"/"+r.unit:""}</span><span class="c5">${pFmt(val)}</span></div>`;}).join("")}
<div class="sec">Growing Crops:</div>
${blank(data.cropInvestment.filter(r=>r.cropType),2).map(r=>`<div class="trow"><span class="c1">${r.cropType||""}</span><span class="c2">${r.acres?" acres: "+r.acres:""}</span><span class="c5">${pFmt(numVal(r.acres)*numVal(r.valuePerAcre))}</span></div>`).join("")}
<div class="subtot"><span>TOTAL CURRENT ASSETS:</span><span>${pFmt(totalCurrentAssets)||"$0"}</span></div>
<div class="sec">Breeding Stock:</div>
${blank(data.breedingStock.filter(r=>r.kind),3).map(r=>`<div class="trow"><span class="c1">${r.number||""}</span><span class="c2">${r.kind||""}</span><span class="c5">${pFmt(r.value)}</span></div>`).join("")}
<div class="sec">Real Estate:</div>
<div class="trow th"><span class="c1">Acres</span><span class="c2">Type</span><span class="c3">$/Acre</span><span class="c5">Total Value</span></div>
${blank(data.realEstate.filter(r=>r.reType||r.acres),3).map(r=>`<div class="trow"><span class="c1">${r.acres?r.acres+" ac":""}</span><span class="c2">${r.reType||""}</span><span class="c3">${r.valuePerAcre?"$"+r.valuePerAcre+"/ac":""}</span><span class="c5">${pFmt(numVal(r.acres)*numVal(r.valuePerAcre))}</span></div>`).join("")}
<div class="row"><span>Titled Vehicles: (see schedule pg. 2)</span><span>${pFmt(vehiclesVal)}</span></div>
<div class="row"><span>Machinery and Equipment: (see schedule pg. 2)</span><span>${pFmt(machVal)}</span></div>
<div class="tot"><span>TOTAL ASSETS</span><span>${pFmt(totalAssets)||"$0"}</span></div>
</div>
<div class="col">
<div class="col-head"><span>LIABILITIES</span><span>PMT / BALANCE</span></div>
<div class="sec">Operating Notes:</div>
<div class="trow th"><span class="c1">Creditor</span><span class="c3">Due</span><span class="c4">Pmt</span><span class="c5">Balance</span></div>
${blank(data.operatingNotes.filter(r=>r.creditor),4).map(r=>`<div class="trow"><span class="c1">${r.creditor||""}</span><span class="c3">${r.dueDate||""}</span><span class="c4">${pFmt(r.pmt)}</span><span class="c5">${pFmt(r.balance)}</span></div>`).join("")}
<div class="sec">Accounts Due:</div>
${blank(data.accountsDue.filter(r=>r.creditor),2).map(r=>`<div class="row"><span>${r.creditor||""}</span><span>${pFmt(r.amount)}</span></div>`).join("")}
<div class="sec">Intermediate Term Debt:</div>
<div class="trow th"><span class="c1">Creditor</span><span class="c2">Security</span><span class="c4">Ann.Pmt</span><span class="c5">Principal</span></div>
${blank(data.intermediatDebt.filter(r=>r.creditor),4).map(r=>`<div class="trow"><span class="c1">${r.creditor||""}</span><span class="c2">${r.security||""}</span><span class="c3">${r.rate?r.rate+"%":""}</span><span class="c4">${pFmt(r.annualPmt)}</span><span class="c5">${pFmt(r.principal)}</span></div>`).join("")}
<div class="sec">Current RE Mortgage Portion:</div>
${blank(data.reCurrent.filter(r=>r.creditor),2).map(r=>`<div class="row"><span>${r.creditor||""}</span><span>${pFmt(r.annualPmt)}</span></div>`).join("")}
<div class="row"><span>Income Taxes Due:</span><span>${pFmt(data.taxesDue)}</span></div>
<div class="subtot"><span>TOTAL CURRENT LIABILITIES:</span><span>${pFmt(totalCurrentLiab)||"$0"}</span></div>
<div class="sec">RE Mortgages (long-term):</div>
${blank(data.reMortgages.filter(r=>r.lienHolder),3).map(r=>`<div class="trow"><span class="c1">${r.lienHolder||""}</span><span class="c2">${r.terms||""}</span><span class="c3">${r.rate?r.rate+"%":""}</span><span class="c5">${pFmt(r.principal)}</span></div>`).join("")}
<div class="tot"><span>TOTAL LIABILITIES</span><span>${pFmt(totalLiabilities)||"$0"}</span></div>
<div class="net"><span>WORKING CAPITAL</span><span>${pFmt(workingCapital)||"$0"}</span></div>
<div class="net"><span>NET WORTH</span><span>${pFmt(netWorth)||"$0"}</span></div>
</div>
</div>
<div class="sig">
<p>For the purpose of obtaining credit from time to time with the Bank, the following statement and information are furnished as complete, true, and accurate statement of the financial condition of the undersigned on the below date. All amounts are rounded to the nearest $100.00</p>
<div class="sig-row">
  <div class="sig-line">Signature: _______________________________________________</div>
  <div class="sig-line">Signature: _______________________________________________</div>
</div>
<div class="sig-row" style="margin-top:10pt">
  <div class="sig-line">Date: ____________________________________________________</div>
  <div class="sig-line">Date: ____________________________________________________</div>
</div>
</div>

<!-- ═══ PAGE 2 — SCHEDULES ═══════════════════════════════════════════════ -->
<div class="page2">
<div class="hdr">
  <div class="logo-box">FIRST<br/>BANK<br/>of Montana<br/><small>www.1stbmt.com</small></div>
  <div style="flex:1;padding-left:16pt">
    <div style="font-size:11pt;font-weight:700;text-decoration:underline;">Balance Sheet Supplement — Schedules</div>
    <div style="font-size:8pt;margin-top:3pt;">Name: ${data.clientName} &nbsp;&nbsp; As of: ${data.asOfDate}</div>
  </div>
</div>

<div class="sched-title">Titled Vehicles Schedule</div>
<table class="sched-table">
  <thead><tr>
    <th style="width:8%">Year</th>
    <th style="width:32%">Make and Model</th>
    <th style="width:25%">VIN</th>
    <th style="width:15%">Condition</th>
    <th class="r" style="width:20%">Value</th>
  </tr></thead>
  <tbody>
    ${(data.vehicles.length ? data.vehicles : [{year:"",make:"",vin:"",condition:"",value:""}]).map(r=>`<tr><td>${r.year||""}</td><td>${r.make||""}</td><td style="font-size:6.5pt">${r.vin||""}</td><td>${r.condition||""}</td><td class="r">${pFmt(r.value)}</td></tr>`).join("")}
  </tbody>
</table>
<div class="sched-foot"><div class="sched-total">TOTAL TITLED VEHICLES: ${pFmt(vehiclesVal)||"$0"}</div></div>

<div class="sched-title" style="margin-top:18pt">Farm Machinery and Equipment Schedule</div>
<table class="sched-table">
  <thead><tr>
    <th style="width:7%">Year</th>
    <th style="width:30%">Make and Model</th>
    <th style="width:12%">Size</th>
    <th style="width:18%">Serial Number</th>
    <th style="width:13%">Condition</th>
    <th class="r" style="width:20%">Value</th>
  </tr></thead>
  <tbody>
    ${(data.machinery.length ? data.machinery : [{year:"",make:"",size:"",serial:"",condition:"",value:""}]).map(r=>`<tr><td>${r.year||""}</td><td>${r.make||""}</td><td>${r.size||""}</td><td style="font-size:6.5pt">${r.serial||""}</td><td>${r.condition||""}</td><td class="r">${pFmt(r.value)}</td></tr>`).join("")}
  </tbody>
</table>
<div class="sched-foot"><div class="sched-total">TOTAL MACHINERY AND EQUIPMENT: ${pFmt(machVal)||"$0"}</div></div>
</div>

</body></html>`;
    W.document.write(html);
    W.document.close();
    W.focus();
    setTimeout(() => W.print(), 400);
  };

  const currentStepId = STEPS[step];
  const progressPct = Math.round((step / (STEPS.length - 1)) * 100);
  const next = () => setStep(s => Math.min(s+1, STEPS.length-1));
  const prev = () => setStep(s => Math.max(s-1, 0));

  // ── Step Renderer ──────────────────────────────────────────────────────────
  function renderStep() {
    const CONDITIONS = ["— Select —","Cropland","Irrigated Cropland","Pasture / Rangeland","CRP","Timber","Home / Farmstead","Commercial","Vacant Lot","Other"];
    switch (currentStepId) {
      case "intro": return (
        <div className="step-content">
          <SecHdr icon="🏦" title="Client Balance Sheet" subtitle="First Bank of Montana — Agricultural Loan Package" />
          <p className="intro-text">Walk through the balance sheet section by section. Start with the client name and date.</p>
          <TxtInp label="Client Name" value={data.clientName} onChange={v=>set("clientName",v)} placeholder="Full name or entity name" />
          <div className="input-group">
            <label>As of Date</label>
            <input type="date" className="text-input" value={data.asOfDate} onChange={e=>set("asOfDate",e.target.value)} />
          </div>
        </div>
      );
      case "cash_glacier": return (
        <div className="step-content">
          <SecHdr icon="💰" title="Cash — Glacier Bank" subtitle="How much does the client have on deposit at Glacier Bank / First Bank of Montana?" />
          <Inp label="Glacier Bank balance" prefix="$" value={data.cashGlacier} onChange={v=>set("cashGlacier",v)} />
          <div className="subtotal-row"><span>Glacier Bank Total</span><strong>{fmt(data.cashGlacier)}</strong></div>
        </div>
      );
      case "cash_other": return (
        <div className="step-content">
          <SecHdr icon="🏧" title="Cash — Other Institutions" subtitle="Accounts at other banks, credit unions, or financial institutions" />
          {data.cashOther.map((r,i) => (
            <div key={i} className="row-entry" data-rowkey={`cashOther-${i}`}>
              <span className="row-num">{i+1}</span>
              <TxtInp label="Institution" value={r.institution} onChange={v=>setArr("cashOther",i,"institution",v)} placeholder="Bank name" />
              <Inp label="Balance" prefix="$" value={r.amount} onChange={v=>setArr("cashOther",i,"amount",v)} />
              <button className="remove-btn" onClick={()=>removeRow("cashOther",i)}>x</button>
            </div>
          ))}
          <button className="add-btn" onClick={()=>addRow("cashOther",{institution:"",amount:""})}>+ Add Institution</button>
          <div className="subtotal-row total">
            <span>Total Cash on Hand and in Bank</span>
            <strong>{fmt(cashTotal)}</strong>
          </div>
        </div>
      );
      case "receivables": return (
        <div className="step-content">
          <SecHdr icon="📋" title="Current Receivables" subtitle="Money owed to the client, collectible within 1 year" />
          {data.receivables.map((r,i) => (
            <div key={i} className="row-entry" data-rowkey={`receivables-${i}`}>
              <span className="row-num">{i+1}</span>
              <TxtInp label="Description" value={r.description} onChange={v=>setArr("receivables",i,"description",v)} placeholder="Who owes / for what" />
              <Inp label="Amount" prefix="$" value={r.amount} onChange={v=>setArr("receivables",i,"amount",v)} />
              <button className="remove-btn" onClick={()=>removeRow("receivables",i)}>x</button>
            </div>
          ))}
          <button className="add-btn" onClick={()=>addRow("receivables",{description:"",amount:""})}>+ Add Receivable</button>
          {recTotal > 0 && <TxtInp label="If secured, list type of security" value={data.receivablesSecured} onChange={v=>set("receivablesSecured",v)} placeholder="e.g., crops, equipment" />}
          <div className="subtotal-row"><span>Total Receivables</span><strong>{fmt(recTotal)}</strong></div>
        </div>
      );
      case "federal_payments": return (
        <div className="step-content">
          <SecHdr icon="🏛" title="Federal Payments Due" subtitle="FSA, ARC/PLC, CRP, CFAP, or other government payments expected" />
          <Inp label="Federal payments due and receivable" prefix="$" value={data.federalPayments} onChange={v=>set("federalPayments",v)} />
        </div>
      );
      case "livestock_market": return (
        <div className="step-content">
          <SecHdr icon="🐄" title="Market Livestock" subtitle="Livestock intended for sale — not breeding stock" />
          {data.livestockMarket.map((r,i) => (
            <div key={i} className="row-entry" data-rowkey={`livestockMarket-${i}`}>
              <span className="row-num">{i+1}</span>
              <TxtInp label="Number" value={r.number} onChange={v=>setArr("livestockMarket",i,"number",v)} placeholder="# head" />
              <TxtInp label="Kind and Weight" value={r.kind} onChange={v=>setArr("livestockMarket",i,"kind",v)} placeholder="e.g., 450 lb steers" />
              <Inp label="Value" prefix="$" value={r.value} onChange={v=>setArr("livestockMarket",i,"value",v)} />
              <button className="remove-btn" onClick={()=>removeRow("livestockMarket",i)}>x</button>
            </div>
          ))}
          <button className="add-btn" onClick={()=>addRow("livestockMarket",{number:"",kind:"",value:""})}>+ Add Livestock</button>
          <div className="subtotal-row"><span>Total Market Livestock</span><strong>{fmt(lsMktTotal)}</strong></div>
        </div>
      );
      case "farm_products": return (
        <div className="step-content">
          <SecHdr icon="🌾" title="Farm Products on Hand" subtitle="Grain, hay, silage in the bin, stack, or elevator. Qty x Price = Value." />
          <div className="fp-header-row">
            <span style={{width:20}}></span>
            <span className="fp-col-label" style={{width:90}}>Quantity</span>
            <span className="fp-col-label" style={{width:72}}>Unit</span>
            <span className="fp-col-label" style={{flex:1}}>Kind</span>
            <span className="fp-col-label" style={{width:105}}>Price/Unit</span>
            <span className="fp-col-label" style={{width:75}}>Share %</span>
            <span className="fp-col-label" style={{width:115}}>Your Value</span>
            <span style={{width:32}}></span>
          </div>
          {data.farmProducts.map((r,i) => {
            const share = numVal(r.share || "100");
            const rv = numVal(r.quantity) * numVal(r.pricePerUnit) * (share / 100);
            return (
              <div key={i} className="fp-row" data-rowkey={`farmProducts-${i}`}>
                <span className="row-num">{i+1}</span>
                <div className="input-group" style={{width:90,flexShrink:0}}>
                  <div className="input-wrap">
                    <input type="text" value={r.quantity} placeholder="0"
                      onChange={e=>setArr("farmProducts",i,"quantity",e.target.value.replace(/[^0-9.]/g,""))} />
                  </div>
                </div>
                <div className="input-group" style={{width:72,flexShrink:0}}>
                  <select className="unit-select" value={r.unit} onChange={e=>setArr("farmProducts",i,"unit",e.target.value)}>
                    <option>bu</option><option>ton</option><option>lbs</option>
                    <option>cwt</option><option>head</option><option>bale</option>
                  </select>
                </div>
                <div className="input-group" style={{flex:1}}>
                  <input className="text-input" type="text" value={r.kind}
                    placeholder="e.g., wheat, barley, hay"
                    onChange={e=>setArr("farmProducts",i,"kind",e.target.value)} />
                </div>
                <div className="input-group" style={{width:105,flexShrink:0}}>
                  <div className="input-wrap">
                    <span className="prefix">$</span>
                    <input type="text" value={r.pricePerUnit} placeholder="0.00"
                      onChange={e=>setArr("farmProducts",i,"pricePerUnit",e.target.value.replace(/[^0-9.]/g,""))} />
                  </div>
                </div>
                <div className="input-group" style={{width:75,flexShrink:0}}>
                  <div className="input-wrap">
                    <input type="text" value={r.share ?? "100"} placeholder="100"
                      onChange={e=>setArr("farmProducts",i,"share",e.target.value.replace(/[^0-9.]/g,""))} />
                    <span className="prefix" style={{borderLeft:"1.5px solid #ddd",borderRight:"none"}}>%</span>
                  </div>
                </div>
                <CalcRow value={rv} style={{width:115}} />
                <button className="remove-btn" onClick={()=>removeRow("farmProducts",i)}>x</button>
              </div>
            );
          })}
          <button className="add-btn" onClick={()=>addRow("farmProducts",{quantity:"",kind:"",pricePerUnit:"",unit:"bu",share:"100"})}>+ Add Farm Product</button>
          <div className="subtotal-row total"><span>Total Farm Products</span><strong>{fmt(farmProdTotal)}</strong></div>
        </div>
      );
      case "crop_investment": return (
        <div className="step-content">
          <SecHdr icon="🌱" title="Cash Investment — Growing Crops" subtitle="Input costs on crops not yet harvested. Acres x Value/Acre = Total." />
          <div className="fp-header-row">
            <span style={{width:20}}></span>
            <span className="fp-col-label" style={{flex:1}}>Crop Type</span>
            <span className="fp-col-label" style={{width:90}}>Acres</span>
            <span className="fp-col-label" style={{width:120}}>Value/Acre</span>
            <span className="fp-col-label" style={{width:115}}>Total</span>
            <span style={{width:32}}></span>
          </div>
          {data.cropInvestment.map((r,i) => {
            const rv = numVal(r.acres) * numVal(r.valuePerAcre);
            return (
              <div key={i} className="fp-row" data-rowkey={`cropInvestment-${i}`}>
                <span className="row-num">{i+1}</span>
                <div className="input-group" style={{flex:1}}>
                  <input className="text-input" type="text" value={r.cropType}
                    placeholder="e.g., winter wheat, corn"
                    onChange={e=>setArr("cropInvestment",i,"cropType",e.target.value)} />
                </div>
                <div className="input-group" style={{width:90,flexShrink:0}}>
                  <div className="input-wrap">
                    <input type="text" value={r.acres} placeholder="0"
                      onChange={e=>setArr("cropInvestment",i,"acres",e.target.value.replace(/[^0-9.]/g,""))} />
                  </div>
                </div>
                <div className="input-group" style={{width:120,flexShrink:0}}>
                  <div className="input-wrap">
                    <span className="prefix">$</span>
                    <input type="text" value={r.valuePerAcre} placeholder="0.00"
                      onChange={e=>setArr("cropInvestment",i,"valuePerAcre",e.target.value.replace(/[^0-9.]/g,""))} />
                  </div>
                </div>
                <CalcRow value={rv} style={{width:115}} />
                <button className="remove-btn" onClick={()=>removeRow("cropInvestment",i)}>x</button>
              </div>
            );
          })}
          <button className="add-btn" onClick={()=>addRow("cropInvestment",{cropType:"",acres:"",valuePerAcre:""})}>+ Add Crop</button>
          <div className="subtotal-row total"><span>Total Crop Investment</span><strong>{fmt(cropInv)}</strong></div>
        </div>
      );
      case "supplies": return (
        <div className="step-content">
          <SecHdr icon="🛢" title="Supplies on Hand" subtitle="Fuel, chemicals, seed, parts, or other supplies with value" />
          {data.supplies.map((r,i) => (
            <div key={i} className="row-entry" data-rowkey={`supplies-${i}`}>
              <span className="row-num">{i+1}</span>
              <TxtInp label="Description" value={r.description} onChange={v=>setArr("supplies",i,"description",v)} placeholder="e.g., diesel fuel, seed" />
              <Inp label="Value" prefix="$" value={r.value} onChange={v=>setArr("supplies",i,"value",v)} />
              <button className="remove-btn" onClick={()=>removeRow("supplies",i)}>x</button>
            </div>
          ))}
          <button className="add-btn" onClick={()=>addRow("supplies",{description:"",value:""})}>+ Add Supply</button>
          <div className="subtotal-row"><span>Total Supplies</span><strong>{fmt(suppliesTotal)}</strong></div>
        </div>
      );
      case "other_current": return (
        <div className="step-content">
          <SecHdr icon="📦" title="Other Current Assets" subtitle="Anything else collectible within 12 months" />
          {data.otherCurrent.map((r,i) => (
            <div key={i} className="row-entry" data-rowkey={`otherCurrent-${i}`}>
              <span className="row-num">{i+1}</span>
              <TxtInp label="Description" value={r.description} onChange={v=>setArr("otherCurrent",i,"description",v)} />
              <Inp label="Amount" prefix="$" value={r.amount} onChange={v=>setArr("otherCurrent",i,"amount",v)} />
              <button className="remove-btn" onClick={()=>removeRow("otherCurrent",i)}>x</button>
            </div>
          ))}
          <button className="add-btn" onClick={()=>addRow("otherCurrent",{description:"",amount:""})}>+ Add Item</button>
          <div className="subtotal-row total">
            <span>Total Current Assets</span><strong className="green">{fmt(totalCurrentAssets)}</strong>
          </div>
        </div>
      );
      case "breeding_stock": return (
        <div className="step-content">
          <SecHdr icon="🐂" title="Breeding Stock" subtitle="Cattle, horses, hogs, sheep kept for breeding" />
          <p className="phase-badge">Intermediate and Long-Term Assets</p>
          {data.breedingStock.map((r,i) => (
            <div key={i} className="row-entry" data-rowkey={`breedingStock-${i}`}>
              <span className="row-num">{i+1}</span>
              <TxtInp label="Number" value={r.number} onChange={v=>setArr("breedingStock",i,"number",v)} placeholder="# head" />
              <TxtInp label="Kind" value={r.kind} onChange={v=>setArr("breedingStock",i,"kind",v)} placeholder="e.g., Angus cows" />
              <Inp label="Value" prefix="$" value={r.value} onChange={v=>setArr("breedingStock",i,"value",v)} />
              <button className="remove-btn" onClick={()=>removeRow("breedingStock",i)}>x</button>
            </div>
          ))}
          <button className="add-btn" onClick={()=>addRow("breedingStock",{number:"",kind:"",value:""})}>+ Add Breeding Stock</button>
          <div className="subtotal-row"><span>Total Breeding Stock</span><strong>{fmt(breedingTotal)}</strong></div>
        </div>
      );
      case "real_estate": return (
        <div className="step-content">
          <SecHdr icon="🏔" title="Real Estate" subtitle="Farmland, pasture, home — list each tract. Acres x Value/Acre = Total." />
          <div className="fp-header-row">
            <span style={{width:20}}></span>
            <span className="fp-col-label" style={{width:75}}>Acres</span>
            <span className="fp-col-label" style={{width:130}}>Type of RE</span>
            <span className="fp-col-label" style={{flex:1}}>Description</span>
            <span className="fp-col-label" style={{width:115}}>Value/Acre</span>
            <span className="fp-col-label" style={{width:115}}>Total</span>
            <span style={{width:32}}></span>
          </div>
          {data.realEstate.map((r,i) => {
            const rv = numVal(r.acres) * numVal(r.valuePerAcre);
            return (
              <div key={i} className="fp-row" data-rowkey={`realEstate-${i}`}>
                <span className="row-num">{i+1}</span>
                <div className="input-group" style={{width:75,flexShrink:0}}>
                  <div className="input-wrap">
                    <input type="text" value={r.acres} placeholder="0"
                      onChange={e=>setArr("realEstate",i,"acres",e.target.value.replace(/[^0-9.]/g,""))} />
                  </div>
                </div>
                <div className="input-group" style={{width:130,flexShrink:0}}>
                  <select className="unit-select" value={r.reType} onChange={e=>setArr("realEstate",i,"reType",e.target.value)}>
                    {CONDITIONS.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="input-group" style={{flex:1}}>
                  <input className="text-input" type="text" value={r.description}
                    placeholder="e.g., NW Sec 12, Cascade Co."
                    onChange={e=>setArr("realEstate",i,"description",e.target.value)} />
                </div>
                <div className="input-group" style={{width:115,flexShrink:0}}>
                  <div className="input-wrap">
                    <span className="prefix">$</span>
                    <input type="text" value={r.valuePerAcre} placeholder="0"
                      onChange={e=>setArr("realEstate",i,"valuePerAcre",e.target.value.replace(/[^0-9.]/g,""))} />
                  </div>
                </div>
                <CalcRow value={rv} style={{width:115}} />
                <button className="remove-btn" onClick={()=>removeRow("realEstate",i)}>x</button>
              </div>
            );
          })}
          <button className="add-btn" onClick={()=>addRow("realEstate",{acres:"",reType:"",description:"",valuePerAcre:""})}>+ Add RE Tract</button>
          <div className="subtotal-row total"><span>Total Real Estate</span><strong>{fmt(reTotal)}</strong></div>
        </div>
      );
      case "re_contracts": return (
        <div className="step-content">
          <SecHdr icon="📄" title="Real Estate Sale Contracts Receivable" subtitle="Land contracts where the client is the seller" />
          {data.reContracts.map((r,i) => (
            <div key={i} className="row-entry" data-rowkey={`reContracts-${i}`}>
              <span className="row-num">{i+1}</span>
              <TxtInp label="Description / Buyer" value={r.description} onChange={v=>setArr("reContracts",i,"description",v)} />
              <Inp label="Balance Owed" prefix="$" value={r.amount} onChange={v=>setArr("reContracts",i,"amount",v)} />
              <button className="remove-btn" onClick={()=>removeRow("reContracts",i)}>x</button>
            </div>
          ))}
          <button className="add-btn" onClick={()=>addRow("reContracts",{description:"",amount:""})}>+ Add Contract</button>
          <div className="subtotal-row"><span>Total RE Contracts</span><strong>{fmt(reConTotal)}</strong></div>
        </div>
      );
      case "vehicles": return (
        <div className="step-content">
          <SecHdr icon="🚗" title="Titled Vehicles Schedule" subtitle="Trucks, pickups, cars, ATVs — anything licensed and titled" />
          <div className="mach-table">
            <div className="mach-header">
              <span style={{width:62}}>Year</span>
              <span style={{flex:1}}>Make and Model</span>
              <span style={{width:130}}>VIN</span>
              <span style={{width:95}}>Condition</span>
              <span style={{width:110}}>Value</span>
              <span style={{width:32}}></span>
            </div>
            {data.vehicles.map((r,i) => (
              <div key={i} className="mach-row" data-rowkey={`vehicles-${i}`}>
                <div className="mach-col" style={{width:62}}>
                  <input className="text-input" type="text" value={r.year} placeholder="2020" maxLength={4}
                    onChange={e=>setArr("vehicles",i,"year",e.target.value.replace(/[^0-9]/g,""))} />
                </div>
                <div className="mach-col" style={{flex:1}}>
                  <input className="text-input" type="text" value={r.make} placeholder="e.g., Ford F-350"
                    onChange={e=>setArr("vehicles",i,"make",e.target.value)} />
                </div>
                <div className="mach-col" style={{width:130}}>
                  <input className="text-input" type="text" value={r.vin} placeholder="VIN"
                    onChange={e=>setArr("vehicles",i,"vin",e.target.value)} />
                </div>
                <div className="mach-col" style={{width:95}}>
                  <select className="unit-select" value={r.condition}
                    onChange={e=>setArr("vehicles",i,"condition",e.target.value)}>
                    <option value="">—</option>
                    <option>Excellent</option><option>Good</option>
                    <option>Fair</option><option>Poor</option>
                  </select>
                </div>
                <div className="mach-col" style={{width:110}}>
                  <div className="input-wrap">
                    <span className="prefix">$</span>
                    <input type="text" value={r.value} placeholder="0"
                      onChange={e=>setArr("vehicles",i,"value",e.target.value.replace(/[^0-9.]/g,""))} />
                  </div>
                </div>
                <button className="remove-btn" onClick={()=>removeRow("vehicles",i)}>x</button>
              </div>
            ))}
          </div>
          <button className="add-btn" onClick={()=>addRow("vehicles",{year:"",make:"",vin:"",condition:"",value:""})}>+ Add Vehicle</button>
          <div className="subtotal-row total"><span>Total Titled Vehicles</span><strong>{fmt(vehiclesVal)}</strong></div>
        </div>
      );
      case "machinery": return (
        <div className="step-content">
          <SecHdr icon="⚙" title="Machinery and Equipment Schedule" subtitle="List each piece — total carries to balance sheet automatically" />
          <div className="mach-table">
            <div className="mach-header">
              <span style={{width:62}}>Year</span>
              <span style={{flex:1}}>Make and Model</span>
              <span style={{width:90}}>Size</span>
              <span style={{width:110}}>Serial #</span>
              <span style={{width:95}}>Condition</span>
              <span style={{width:110}}>Value</span>
              <span style={{width:32}}></span>
            </div>
            {data.machinery.map((r,i) => (
              <div key={i} className="mach-row" data-rowkey={`machinery-${i}`}>
                <div className="mach-col" style={{width:62}}>
                  <input className="text-input" type="text" value={r.year} placeholder="2018" maxLength={4}
                    onChange={e=>setArr("machinery",i,"year",e.target.value.replace(/[^0-9]/g,""))} />
                </div>
                <div className="mach-col" style={{flex:1}}>
                  <input className="text-input" type="text" value={r.make} placeholder="e.g., John Deere 8320"
                    onChange={e=>setArr("machinery",i,"make",e.target.value)} />
                </div>
                <div className="mach-col" style={{width:90}}>
                  <input className="text-input" type="text" value={r.size} placeholder="e.g., 320hp"
                    onChange={e=>setArr("machinery",i,"size",e.target.value)} />
                </div>
                <div className="mach-col" style={{width:110}}>
                  <input className="text-input" type="text" value={r.serial} placeholder="Serial #"
                    onChange={e=>setArr("machinery",i,"serial",e.target.value)} />
                </div>
                <div className="mach-col" style={{width:95}}>
                  <select className="unit-select" value={r.condition}
                    onChange={e=>setArr("machinery",i,"condition",e.target.value)}>
                    <option value="">—</option>
                    <option>Excellent</option><option>Good</option>
                    <option>Fair</option><option>Poor</option>
                  </select>
                </div>
                <div className="mach-col" style={{width:110}}>
                  <div className="input-wrap">
                    <span className="prefix">$</span>
                    <input type="text" value={r.value} placeholder="0"
                      onChange={e=>setArr("machinery",i,"value",e.target.value.replace(/[^0-9.]/g,""))} />
                  </div>
                </div>
                <button className="remove-btn" onClick={()=>removeRow("machinery",i)}>x</button>
              </div>
            ))}
          </div>
          <button className="add-btn" onClick={()=>addRow("machinery",{year:"",make:"",size:"",serial:"",condition:"",value:""})}>+ Add Equipment</button>
          <div className="subtotal-row total"><span>Total Machinery and Equipment</span><strong>{fmt(machVal)}</strong></div>
        </div>
      );
      case "other_assets": return (
        <div className="step-content">
          <SecHdr icon="💼" title="Other Assets" subtitle="Investments, retirement accounts, life insurance cash value, notes receivable" />
          {data.otherAssets.map((r,i) => (
            <div key={i} className="row-entry" data-rowkey={`otherAssets-${i}`}>
              <span className="row-num">{i+1}</span>
              <TxtInp label="Description" value={r.description} onChange={v=>setArr("otherAssets",i,"description",v)} placeholder="e.g., IRA, stock, bonds" />
              <Inp label="Value" prefix="$" value={r.amount} onChange={v=>setArr("otherAssets",i,"amount",v)} />
              <button className="remove-btn" onClick={()=>removeRow("otherAssets",i)}>x</button>
            </div>
          ))}
          <button className="add-btn" onClick={()=>addRow("otherAssets",{description:"",amount:""})}>+ Add Asset</button>
          <div className="subtotal-row total">
            <span>Total Assets</span><strong className="green">{fmt(totalAssets)}</strong>
          </div>
        </div>
      );
      case "liab_intro": return (
        <div className="step-content">
          <SecHdr icon="📉" title="Now — Liabilities" subtitle="Assets are done. Now capture what the client owes." color="#4a0810" />
          <div style={{background:"#f8f6f2",borderRadius:8,padding:16,display:"flex",flexDirection:"column",gap:8}}>
            <div style={{display:"flex",justifyContent:"space-between"}}><span>Total Assets</span><strong>{fmt(totalAssets)}</strong></div>
            <div style={{display:"flex",justifyContent:"space-between"}}><span>Current Assets</span><strong>{fmt(totalCurrentAssets)}</strong></div>
            <div style={{display:"flex",justifyContent:"space-between"}}><span>Long-Term Assets</span><strong>{fmt(totalLTAssets)}</strong></div>
          </div>
        </div>
      );
      case "operating_notes": return (
        <div className="step-content">
          <SecHdr icon="🏦" title="Operating and Unsecured Notes" subtitle="Operating lines of credit, seasonal loans, and unsecured debts" color="#4a0810" />
          {data.operatingNotes.map((r,i) => (
            <div key={i} className="row-entry" data-rowkey={`operatingNotes-${i}`}>
              <span className="row-num">{i+1}</span>
              <TxtInp label="Creditor" value={r.creditor} onChange={v=>setArr("operatingNotes",i,"creditor",v)} placeholder="Lender name" />
              <TxtInp label="Due Date" value={r.dueDate} onChange={v=>setArr("operatingNotes",i,"dueDate",v)} placeholder="mm/dd/yy" />
              <Inp label="Payment" prefix="$" value={r.pmt} onChange={v=>setArr("operatingNotes",i,"pmt",v)} />
              <Inp label="Balance" prefix="$" value={r.balance} onChange={v=>setArr("operatingNotes",i,"balance",v)} />
              <TxtInp label="Security" value={r.security} onChange={v=>setArr("operatingNotes",i,"security",v)} placeholder="Collateral type" />
              <button className="remove-btn" onClick={()=>removeRow("operatingNotes",i)}>x</button>
            </div>
          ))}
          <button className="add-btn" onClick={()=>addRow("operatingNotes",{creditor:"",dueDate:"",pmt:"",balance:"",security:""})}>+ Add Note</button>
          <div className="subtotal-row"><span>Total Operating Notes</span><strong className="red">{fmt(opNotesTotal)}</strong></div>
        </div>
      );
      case "accounts_due": return (
        <div className="step-content">
          <SecHdr icon="🧾" title="Accounts Due" subtitle="Trade accounts, supplier balances, amounts owed to vendors" color="#4a0810" />
          {data.accountsDue.map((r,i) => (
            <div key={i} className="row-entry" data-rowkey={`accountsDue-${i}`}>
              <span className="row-num">{i+1}</span>
              <TxtInp label="Creditor / Vendor" value={r.creditor} onChange={v=>setArr("accountsDue",i,"creditor",v)} placeholder="Who is owed" />
              <Inp label="Amount" prefix="$" value={r.amount} onChange={v=>setArr("accountsDue",i,"amount",v)} />
              <button className="remove-btn" onClick={()=>removeRow("accountsDue",i)}>x</button>
            </div>
          ))}
          <button className="add-btn" onClick={()=>addRow("accountsDue",{creditor:"",amount:""})}>+ Add Account</button>
          <div className="subtotal-row"><span>Total Accounts Due</span><strong className="red">{fmt(acctsDueTotal)}</strong></div>
        </div>
      );
      case "intermediate_debt": return (
        <div className="step-content">
          <SecHdr icon="📅" title="Intermediate Term and Installment Debt" subtitle="Equipment loans, livestock loans, term notes" color="#4a0810" />
          {data.intermediatDebt.map((r,i) => (
            <div key={i} className="row-entry" data-rowkey={`intermediatDebt-${i}`}>
              <span className="row-num">{i+1}</span>
              <TxtInp label="Creditor" value={r.creditor} onChange={v=>setArr("intermediatDebt",i,"creditor",v)} placeholder="Lender" />
              <TxtInp label="Security" value={r.security} onChange={v=>setArr("intermediatDebt",i,"security",v)} placeholder="Collateral" />
              <TxtInp label="Due Date" value={r.dueDate} onChange={v=>setArr("intermediatDebt",i,"dueDate",v)} placeholder="mm/dd/yy" />
              <Inp label="Annual Pmt" prefix="$" value={r.annualPmt} onChange={v=>setArr("intermediatDebt",i,"annualPmt",v)} />
              <Inp label="Principal" prefix="$" value={r.principal} onChange={v=>setArr("intermediatDebt",i,"principal",v)} />
              <Inp label="Rate" prefix="%" value={r.rate} onChange={v=>setArr("intermediatDebt",i,"rate",v)} />
              <button className="remove-btn" onClick={()=>removeRow("intermediatDebt",i)}>x</button>
            </div>
          ))}
          <button className="add-btn" onClick={()=>addRow("intermediatDebt",{creditor:"",security:"",dueDate:"",annualPmt:"",principal:"",rate:""})}>+ Add Loan</button>
          <div className="subtotal-row"><span>Total Intermediate Debt</span><strong className="red">{fmt(intermedTotal)}</strong></div>
        </div>
      );
      case "re_current": return (
        <div className="step-content">
          <SecHdr icon="🏠" title="Current Portion — Real Estate Mortgages" subtitle="Mortgage payments due within the next 12 months" color="#4a0810" />
          {data.reCurrent.map((r,i) => (
            <div key={i} className="row-entry" data-rowkey={`reCurrent-${i}`}>
              <span className="row-num">{i+1}</span>
              <TxtInp label="Creditor" value={r.creditor} onChange={v=>setArr("reCurrent",i,"creditor",v)} placeholder="Mortgage holder" />
              <Inp label="Annual Payment" prefix="$" value={r.annualPmt} onChange={v=>setArr("reCurrent",i,"annualPmt",v)} />
              <Inp label="Rate" prefix="%" value={r.rate} onChange={v=>setArr("reCurrent",i,"rate",v)} />
              <button className="remove-btn" onClick={()=>removeRow("reCurrent",i)}>x</button>
            </div>
          ))}
          <button className="add-btn" onClick={()=>addRow("reCurrent",{creditor:"",annualPmt:"",rate:""})}>+ Add Mortgage</button>
          <div className="subtotal-row"><span>Total Current RE Portion</span><strong className="red">{fmt(reCurrentTotal)}</strong></div>
        </div>
      );
      case "taxes_due": return (
        <div className="step-content">
          <SecHdr icon="📑" title="State and Federal Income Taxes Due" subtitle="Any unpaid income tax liability" color="#4a0810" />
          <Inp label="Income taxes due" prefix="$" value={data.taxesDue} onChange={v=>set("taxesDue",v)} />
          <div className="subtotal-row total">
            <span>Total Current Liabilities</span><strong className="red">{fmt(totalCurrentLiab)}</strong>
          </div>
        </div>
      );
      case "other_current_liab": return (
        <div className="step-content">
          <SecHdr icon="📋" title="Other Current Liabilities" subtitle="Any other obligations due within 12 months" color="#4a0810" />
          {data.otherCurrentLiab.map((r,i) => (
            <div key={i} className="row-entry" data-rowkey={`otherCurrentLiab-${i}`}>
              <span className="row-num">{i+1}</span>
              <TxtInp label="Description" value={r.description} onChange={v=>setArr("otherCurrentLiab",i,"description",v)} />
              <Inp label="Amount" prefix="$" value={r.amount} onChange={v=>setArr("otherCurrentLiab",i,"amount",v)} />
              <button className="remove-btn" onClick={()=>removeRow("otherCurrentLiab",i)}>x</button>
            </div>
          ))}
          <button className="add-btn" onClick={()=>addRow("otherCurrentLiab",{description:"",amount:""})}>+ Add Liability</button>
        </div>
      );
      case "re_mortgages": return (
        <div className="step-content">
          <SecHdr icon="📜" title="Real Estate Mortgages and Contracts" subtitle="Long-term mortgage balances — principal due beyond 12 months" color="#4a0810" />
          {data.reMortgages.map((r,i) => (
            <div key={i} className="row-entry" data-rowkey={`reMortgages-${i}`}>
              <span className="row-num">{i+1}</span>
              <TxtInp label="Lien Holder" value={r.lienHolder} onChange={v=>setArr("reMortgages",i,"lienHolder",v)} placeholder="Bank / lender" />
              <TxtInp label="Terms" value={r.terms} onChange={v=>setArr("reMortgages",i,"terms",v)} placeholder="e.g., 20yr" />
              <Inp label="Rate" prefix="%" value={r.rate} onChange={v=>setArr("reMortgages",i,"rate",v)} />
              <Inp label="Principal (beyond 12 mo)" prefix="$" value={r.principal} onChange={v=>setArr("reMortgages",i,"principal",v)} />
              <button className="remove-btn" onClick={()=>removeRow("reMortgages",i)}>x</button>
            </div>
          ))}
          <button className="add-btn" onClick={()=>addRow("reMortgages",{lienHolder:"",terms:"",principal:"",rate:""})}>+ Add Mortgage</button>
          <div className="subtotal-row"><span>Total RE Mortgages (LT)</span><strong className="red">{fmt(reMortTotal)}</strong></div>
        </div>
      );
      case "other_liabilities": return (
        <div className="step-content">
          <SecHdr icon="🔖" title="Other Liabilities" subtitle="Student loans, personal loans, judgments, etc." color="#4a0810" />
          {data.otherLiabilities.map((r,i) => (
            <div key={i} className="row-entry" data-rowkey={`otherLiabilities-${i}`}>
              <span className="row-num">{i+1}</span>
              <TxtInp label="Description" value={r.description} onChange={v=>setArr("otherLiabilities",i,"description",v)} />
              <Inp label="Balance" prefix="$" value={r.balance} onChange={v=>setArr("otherLiabilities",i,"balance",v)} />
              <button className="remove-btn" onClick={()=>removeRow("otherLiabilities",i)}>x</button>
            </div>
          ))}
          <button className="add-btn" onClick={()=>addRow("otherLiabilities",{description:"",balance:""})}>+ Add Liability</button>
          <div className="subtotal-row total">
            <span>Total Liabilities</span><strong className="red">{fmt(totalLiabilities)}</strong>
          </div>
        </div>
      );
      case "summary": return (
        <div className="step-content">
          <SecHdr icon="📊" title="Balance Sheet Complete" subtitle={data.clientName + " — as of " + data.asOfDate} />
          <div className="summary-grid">
            <div>
              <h3 className="col-head assets-head">ASSETS</h3>
              <div className="summary-section">
                <div className="ss-label">Current Assets</div>
                <div className="ss-row"><span>Cash on Hand and in Bank</span><span>{fmt(cashTotal)}</span></div>
                {recTotal > 0 && <div className="ss-row"><span>Receivables</span><span>{fmt(recTotal)}</span></div>}
                {fedPay > 0 && <div className="ss-row"><span>Federal Payments</span><span>{fmt(fedPay)}</span></div>}
                {lsMktTotal > 0 && <div className="ss-row"><span>Market Livestock</span><span>{fmt(lsMktTotal)}</span></div>}
                {farmProdTotal > 0 && <div className="ss-row"><span>Farm Products</span><span>{fmt(farmProdTotal)}</span></div>}
                {cropInv > 0 && <div className="ss-row"><span>Crop Investment</span><span>{fmt(cropInv)}</span></div>}
                {suppliesTotal > 0 && <div className="ss-row"><span>Supplies</span><span>{fmt(suppliesTotal)}</span></div>}
                <div className="ss-subtotal"><span>Total Current Assets</span><span>{fmt(totalCurrentAssets)}</span></div>
              </div>
              <div className="summary-section">
                <div className="ss-label">Long-Term Assets</div>
                {breedingTotal > 0 && <div className="ss-row"><span>Breeding Stock</span><span>{fmt(breedingTotal)}</span></div>}
                {reTotal > 0 && <div className="ss-row"><span>Real Estate</span><span>{fmt(reTotal)}</span></div>}
                {vehiclesVal > 0 && <div className="ss-row"><span>Titled Vehicles</span><span>{fmt(vehiclesVal)}</span></div>}
                {machVal > 0 && <div className="ss-row"><span>Machinery and Equipment</span><span>{fmt(machVal)}</span></div>}
                <div className="ss-subtotal"><span>Total Long-Term Assets</span><span>{fmt(totalLTAssets)}</span></div>
              </div>
              <div className="ss-total green-total"><span>TOTAL ASSETS</span><span>{fmt(totalAssets)}</span></div>
            </div>
            <div>
              <h3 className="col-head liab-head">LIABILITIES</h3>
              <div className="summary-section">
                <div className="ss-label">Current Liabilities</div>
                {opNotesTotal > 0 && <div className="ss-row"><span>Operating Notes</span><span>{fmt(opNotesTotal)}</span></div>}
                {acctsDueTotal > 0 && <div className="ss-row"><span>Accounts Due</span><span>{fmt(acctsDueTotal)}</span></div>}
                {intermedTotal > 0 && <div className="ss-row"><span>Intermediate Debt</span><span>{fmt(intermedTotal)}</span></div>}
                {reCurrentTotal > 0 && <div className="ss-row"><span>RE Mortgage Current</span><span>{fmt(reCurrentTotal)}</span></div>}
                {taxesDueVal > 0 && <div className="ss-row"><span>Income Taxes Due</span><span>{fmt(taxesDueVal)}</span></div>}
                <div className="ss-subtotal"><span>Total Current Liabilities</span><span>{fmt(totalCurrentLiab)}</span></div>
              </div>
              <div className="summary-section">
                <div className="ss-label">Long-Term Liabilities</div>
                {reMortTotal > 0 && <div className="ss-row"><span>RE Mortgages (LT)</span><span>{fmt(reMortTotal)}</span></div>}
                {otherLiabTotal > 0 && <div className="ss-row"><span>Other Liabilities</span><span>{fmt(otherLiabTotal)}</span></div>}
                <div className="ss-subtotal"><span>Total Long-Term</span><span>{fmt(reMortTotal+otherLiabTotal)}</span></div>
              </div>
              <div className="ss-total red-total"><span>TOTAL LIABILITIES</span><span>{fmt(totalLiabilities)}</span></div>
              <div className="net-section">
                <div className="net-row"><span>Working Capital</span><span className={workingCapital >= 0 ? "green" : "red"}>{fmt(workingCapital)}</span></div>
                <div className="net-row nw"><span>NET WORTH</span><span className={netWorth >= 0 ? "green" : "red"}>{fmt(netWorth)}</span></div>
                <div className="net-row"><span>Debt-to-Asset Ratio</span><span>{totalAssets > 0 ? ((totalLiabilities/totalAssets)*100).toFixed(1)+"%" : "—"}</span></div>
              </div>
            </div>
          </div>
          <div className="print-note">Review all figures with your client, then click Print Balance Sheet.</div>
          <div className="save-bar">
            <div className="save-date-wrap">
              <label>Save as of date:</label>
              <input type="date" className="text-input" style={{maxWidth:160}} value={data.asOfDate}
                onChange={e=>set("asOfDate",e.target.value)} />
            </div>
            <button className="btn btn-save" onClick={saveSheet}
              disabled={!data.clientName || saveStatus === "saving"}>
              {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved!" : saveStatus && saveStatus !== "error" ? "Error: " + saveStatus.slice(0,60) : "Save Balance Sheet"}
            </button>
            <button className="btn btn-secondary" onClick={()=>setScreen("home")}>All Clients</button>
          </div>
        </div>
      );
      default: return null;
    }
  }

  // ── Home Screen ────────────────────────────────────────────────────────────
  if (screen === "home") {
    return (
      <div className="app">
        <div className="home-top">
          <div>
            <div className="home-top-title">First Bank of Montana</div>
            <div className="home-top-sub">Agricultural Balance Sheet System</div>
          </div>
        </div>
        <div className="home-body">
          <button className="home-new-btn" onClick={startNew}>+ New Balance Sheet</button>
          <div className="home-section-label">
            {savedSheets.length > 0 ? "Saved Balance Sheets (" + savedSheets.length + ")" : "Saved Balance Sheets"}
          </div>
          {savedSheets.length === 0
            ? <div className="home-empty">No saved balance sheets yet. Complete a sheet and save it to store it here.</div>
            : savedSheets.map(s => (
                <div key={s.key} className="sheet-card" onClick={()=>loadSheet(s.key)}>
                  <div className="sheet-icon">📋</div>
                  <div className="sheet-info">
                    <div className="sheet-name">{s.clientName}</div>
                    <div className="sheet-meta">
                      <span className="sheet-date">As of {s.asOfDate}</span>
                      {s.savedAt && <span> · Saved {new Date(s.savedAt).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <button className="sheet-load-btn"
                    onClick={e=>{e.stopPropagation();loadSheet(s.key);}}>
                    Open and Edit
                  </button>
                  <button className="sheet-delete" onClick={e=>deleteSheet(s.key,e)}>Delete</button>
                </div>
              ))
          }
        </div>
      </div>
    );
  }

  // ── Wizard / Budget / Compare ──────────────────────────────────────────────
  return (
    <div className="app">

      {/* ── Overwrite Confirmation Modal ── */}
      {confirmSave && (
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,.5)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{background:"white",borderRadius:12,padding:32,maxWidth:420,width:"90%",boxShadow:"0 8px 40px rgba(0,0,0,.2)"}}>
            <div style={{fontSize:"1.1rem",fontWeight:700,color:"#1a1a1a",marginBottom:12}}>
              Update Existing Balance Sheet?
            </div>
            <div style={{fontSize:".9rem",color:"#555",marginBottom:24,lineHeight:1.6}}>
              A balance sheet for <strong>{confirmSave.label}</strong> is already saved.
              Do you want to overwrite it with the current data?
            </div>
            <div style={{display:"flex",gap:12,justifyContent:"flex-end"}}>
              <button className="btn btn-secondary"
                onClick={() => setConfirmSave(null)}>
                Cancel
              </button>
              <button className="btn btn-save"
                onClick={() => doSave(confirmSave.key)}>
                Yes, Update It
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="top-bar">
        <button onClick={()=>setScreen("home")} style={{background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.3)",color:"white",borderRadius:6,padding:"5px 12px",cursor:"pointer",fontSize:".8rem",fontFamily:"inherit",marginRight:8}}>
          Clients
        </button>
        <span className="bank-name">First Bank of Montana</span>
        <span className="divider">|</span>
        <span className="tool-name">Agricultural Financial Tools</span>
        {data.clientName && (
          <span style={{marginLeft:"auto",opacity:.8,fontSize:".85rem"}}>
            {data.clientName}
          </span>
        )}
      </div>

      <div className="tab-bar">
        <button className={"tab-btn" + (activeTab === "balance" ? " tab-active" : "")}
          onClick={()=>setActiveTab("balance")}>
          Balance Sheet
        </button>
        <button className={"tab-btn" + (activeTab === "budget" ? " tab-active" : "")}
          onClick={()=>setActiveTab("budget")}>
          Budget / Cash Flow
        </button>
        <button className={"tab-btn" + (activeTab === "compare" ? " tab-active" : "")}
          onClick={()=>{setActiveTab("compare");loadComparisonSheets();}}>
          Year Comparison
        </button>
      </div>

      {activeTab === "balance" && (
        <div>
          <div className="progress-bar-wrap">
            <div className="progress-label">Step {step+1} of {STEPS.length}</div>
            <div className="progress-track">
              <div className="progress-fill" style={{width:progressPct+"%"}} />
            </div>
          </div>
          <div className="main">
            <div className="sidebar">
              <div className="sidebar-section">
                <div className="sidebar-section-label">Setup</div>
                {["intro"].map(s => {
                  const idx = STEPS.indexOf(s);
                  const cls = "sidebar-item" + (currentStepId === s ? " active" : idx < step ? " done" : "");
                  return <div key={s} className={cls} onClick={()=>setStep(idx)}>{STEP_LABELS[s]}</div>;
                })}
              </div>
              <div className="sidebar-section">
                <div className="sidebar-section-label">Assets</div>
                {ASSET_STEPS.map(s => {
                  const idx = STEPS.indexOf(s);
                  const cls = "sidebar-item" + (currentStepId === s ? " active" : idx < step ? " done" : "");
                  return <div key={s} className={cls} onClick={()=>setStep(idx)}>{STEP_LABELS[s]}</div>;
                })}
              </div>
              <div className="sidebar-section">
                <div className="sidebar-section-label">Liabilities</div>
                {["liab_intro",...LIAB_STEPS].map(s => {
                  const idx = STEPS.indexOf(s);
                  const cls = "sidebar-item" + (currentStepId === s ? " active" : idx < step ? " done" : "");
                  return <div key={s} className={cls} onClick={()=>setStep(idx)}>{STEP_LABELS[s]}</div>;
                })}
              </div>
              <div className="sidebar-section">
                <div className="sidebar-section-label">Finish</div>
                {["summary"].map(s => {
                  const idx = STEPS.indexOf(s);
                  const cls = "sidebar-item" + (currentStepId === s ? " active" : idx < step ? " done" : "");
                  return <div key={s} className={cls} onClick={()=>setStep(idx)}>{STEP_LABELS[s]}</div>;
                })}
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <div className="card-nav">
                  <button className="btn btn-secondary" onClick={prev} disabled={step === 0}>Back</button>
                  <span className="step-info">{step+1} / {STEPS.length}</span>
                  {step < STEPS.length - 1
                    ? <button className="btn btn-primary" onClick={next}>Next</button>
                    : <button className="btn btn-success" onClick={handlePrint}>Print Balance Sheet</button>
                  }
                </div>
                <div className="card-content">{renderStep()}</div>
              </div>
            </div>
            <div className="right-panel">
              <RunningTotal assets={totalAssets} liabilities={totalLiabilities} />
            </div>
          </div>
        </div>
      )}

      {activeTab === "budget" && (
        <div className="budget-page">
          <div className="budget-top-bar">
            <div className="budget-client">{data.clientName || "Client Budget"} — {data.asOfDate}</div>
            <div className="budget-top-totals">
              <div className="btt-item"><span>Income</span><strong style={{color:"#1a5c25"}}>{fmt(budgetTotalIncome)}</strong></div>
              <div className="btt-item"><span>Expenses</span><strong style={{color:"#c44"}}>{fmt(budgetTotalExpenses)}</strong></div>
              <div className="btt-item btt-net"><span>Net</span>
                <strong style={{color:budgetNetIncome>=0?"#1a5c25":"#c44"}}>{fmt(budgetNetIncome)}</strong>
              </div>
            </div>
            <button className="btn btn-save" onClick={saveSheet}
              disabled={!data.clientName || saveStatus === "saving"}>
              {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved!" : saveStatus && saveStatus !== "error" ? "Error: " + saveStatus.slice(0,60) : "Save"}
            </button>
          </div>
          <div className="budget-body">
            <BudgetView
              data={data}
              budgetCropTotal={budgetCropTotal}
              budgetLivestockTotal={budgetLivestockTotal}
              budgetMiscTotal={budgetMiscTotal}
              budgetTotalIncome={budgetTotalIncome}
              budgetOperatingExpenses={budgetOperatingExpenses}
              debtServiceTerms={debtServiceTerms}
              debtServiceRE={debtServiceRE}
              budgetTotalDebtService={budgetTotalDebtService}
              budgetTotalExpenses={budgetTotalExpenses}
              budgetNetIncome={budgetNetIncome}
              setArr={setArr}
              removeRow={removeRow}
              addRow={addRow}
            />
          </div>
        </div>
      )}

      {activeTab === "compare" && (
        <div className="comp-page">
          <div className="comp-page-header">
            <div>
              <div className="comp-page-title">{data.clientName} — Year-over-Year Comparison</div>
              <div className="comp-page-sub">{compSheets.length} balance sheet{compSheets.length !== 1 ? "s" : ""} on file</div>
            </div>
            <button className="btn btn-secondary" onClick={loadComparisonSheets} style={{fontSize:".82rem"}}>Refresh</button>
          </div>
          <div className="comp-scroll">
            <ComparisonView
              compSheets={compSheets}
              compLoading={compLoading}
              compInsight={compInsight}
              compInsightLoading={compInsightLoading}
              generateInsights={generateInsights}
              clientName={data.clientName}
              SECTION_BREAKS={SECTION_BREAKS}
              SECTION_HEADERS={SECTION_HEADERS}
              BOLD_ROWS={BOLD_ROWS}
            />
          </div>
        </div>
      )}
    </div>
  );
}
