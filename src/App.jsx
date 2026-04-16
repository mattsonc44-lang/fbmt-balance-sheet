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
  "emU6LjZyZW07fQouaW5zaWdodC1nYXB7aGVpZ2h0OjZweDt9CgouY2xpZW50LWZvbGRlcntiYWNrZ3JvdW5kOndoaXRlO2JvcmRl",
  "ci1yYWRpdXM6MTBweDtib3JkZXI6MXB4IHNvbGlkICNlOGUwZTA7bWFyZ2luLWJvdHRvbToxMHB4O292ZXJmbG93OmhpZGRlbjti",
  "b3gtc2hhZG93OjAgMXB4IDRweCByZ2JhKDAsMCwwLC4wNSk7fQouY2xpZW50LWZvbGRlci1oZWFkZXJ7ZGlzcGxheTpmbGV4O2Fs",
  "aWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjtwYWRkaW5nOjE2cHggMjBweDtjdXJzb3I6cG9p",
  "bnRlcjt0cmFuc2l0aW9uOmJhY2tncm91bmQgLjE1cztnYXA6MTJweDt9Ci5jbGllbnQtZm9sZGVyLWhlYWRlcjpob3ZlcntiYWNr",
  "Z3JvdW5kOiNmZGY5Zjk7fQouY2xpZW50LWZvbGRlci1sZWZ0e2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjE0",
  "cHg7ZmxleDoxO30KLmZvbGRlci1pY29ue2ZvbnQtc2l6ZToxLjZyZW07ZmxleC1zaHJpbms6MDt9Ci5jbGllbnQtZm9sZGVyLW5h",
  "bWV7Zm9udC1zaXplOjFyZW07Zm9udC13ZWlnaHQ6NzAwO2NvbG9yOiMxYTFhMWE7fQouY2xpZW50LWZvbGRlci1tZXRhe2ZvbnQt",
  "c2l6ZTouNzhyZW07Y29sb3I6Izg4ODttYXJnaW4tdG9wOjJweDt9Ci5jbGllbnQtZm9sZGVyLXJpZ2h0e2Rpc3BsYXk6ZmxleDth",
  "bGlnbi1pdGVtczpjZW50ZXI7Z2FwOjEwcHg7ZmxleC1zaHJpbms6MDt9Ci5mb2xkZXItY2hldnJvbntmb250LXNpemU6LjdyZW07",
  "Y29sb3I6I2FhYTttYXJnaW4tbGVmdDo0cHg7fQouY2xpZW50LWZvbGRlci1zaGVldHN7YmFja2dyb3VuZDojZjlmNWY1O2JvcmRl",
  "ci10b3A6MXB4IHNvbGlkICNlOGUwZTA7cGFkZGluZzo4cHggMTJweDtkaXNwbGF5OmZsZXg7ZmxleC1kaXJlY3Rpb246Y29sdW1u",
  "O2dhcDo2cHg7fQouc2hlZXQtY2FyZC1uZXN0ZWR7YmFja2dyb3VuZDp3aGl0ZTtib3JkZXItcmFkaXVzOjhweDttYXJnaW46MDti",
  "b3gtc2hhZG93Om5vbmU7cGFkZGluZzoxMnB4IDE2cHg7fQouc2hlZXQtY2FyZC1uZXN0ZWQ6aG92ZXJ7dHJhbnNmb3JtOm5vbmU7",
  "Ym94LXNoYWRvdzowIDFweCA2cHggcmdiYSgxMDcsMTQsMzAsLjEpO30K",
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
    federalPayments:[{program:"",amount:""}],
    livestockMarket:[{number:"",kind:"",value:""}],
    farmProducts:[{quantity:"",kind:"",pricePerUnit:"",unit:"bu",share:"100",contracted:false}],
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
    budgetCrops:[{acres:"",crop:"",yieldPerAcre:"",unit:"bu",price:"",share:"100",contracted:false}],
    budgetLivestock:[{head:"",type:"",lbs:"",price:""}],
    budgetMisc:[{description:"Government Payments (FSA/ARC/PLC)",amount:""}],
    budgetExpenses:[{description:"",amount:""}],
    // Ag Inspection fields
    inspDate: new Date().toISOString().split('T')[0],
    inspInspector: "",
    inspLoans: ["","",""],
    inspCrops: [],
    inspLivestock: [],
    inspShareId: "",
    inspInventory: [],
    inspPastureCond:"", inspPastureCmt:"",
    inspWaterCond:"", inspWaterCmt:"",
    inspEquipCond:"", inspEquipCmt:"",
    inspEnvCmt:"", inspAddlCmt:"",
    inspPhotos: [],
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
  debtServiceTermsPersonal, debtServiceTermsCorp,
  debtServiceREPersonal, debtServiceRECorp,
  budgetTotalDebtService, budgetPersonalDebtTotal, budgetCorpDebtTotal,
  corpPersonalDebt, corpPersonalDebtTotal,
  budgetTotalExpenses, budgetNetIncome,
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
            <span className="bg-col-label" style={{width:85,textAlign:"center"}}>Contracted</span>
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
                <div style={{width:85,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                  <input type="checkbox" id={"bc-con-"+i} checked={!!r.contracted}
                    onChange={e => setArr("budgetCrops",i,"contracted",e.target.checked)}
                    style={{width:16,height:16,accentColor:"#6B0E1E",cursor:"pointer"}} />
                  <label htmlFor={"bc-con-"+i} style={{fontSize:".75rem",color:"#555",cursor:"pointer"}}>
                    {r.contracted ? "Yes" : ""}
                  </label>
                </div>
                <CalcRow value={rv} style={{width:115}} />
                <button className="remove-btn" onClick={() => removeRow("budgetCrops",i)}>x</button>
              </div>
            );
          })}
          <button className="add-btn"
            onClick={() => addRow("budgetCrops",{acres:"",crop:"",yieldPerAcre:"",unit:"bu",price:"",share:"100",contracted:false})}>
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
          <span className="bsh-total">{fmt(budgetTotalExpenses + (corpPersonalDebtTotal||0))}</span>
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
          {debtServiceTermsPersonal.length > 0 && (
            <div>
              <div className="debt-category-label">Intermediate / Term Debt — Personal</div>
              {debtServiceTermsPersonal.map((r, i) => (
                <div key={i} className="debt-row">
                  <span className="debt-creditor">{r.creditor}</span>
                  <span className="debt-detail">{r.security ? "(" + r.security + ")" : ""}</span>
                  <span className="debt-amount">{fmt(r.annualPmt)}</span>
                </div>
              ))}
            </div>
          )}
          {debtServiceTermsCorp.length > 0 && (
            <div>
              <div className="debt-category-label" style={{color:"#2d5a8e"}}>
                Intermediate / Term Debt — Corp Paid
              </div>
              {debtServiceTermsCorp.map((r, i) => (
                <div key={i} className="debt-row" style={{borderLeftColor:"#2d5a8e"}}>
                  <span className="debt-creditor">{r.creditor}</span>
                  <span className="debt-detail" style={{color:"#2d5a8e",fontSize:".7rem"}}>corp pays</span>
                  <span className="debt-amount" style={{color:"#2d5a8e"}}>{fmt(r.annualPmt)}</span>
                </div>
              ))}
            </div>
          )}
          {debtServiceREPersonal.length > 0 && (
            <div>
              <div className="debt-category-label">Real Estate Mortgages — Personal</div>
              {debtServiceREPersonal.map((r, i) => (
                <div key={i} className="debt-row">
                  <span className="debt-creditor">{r.creditor}</span>
                  <span className="debt-detail"></span>
                  <span className="debt-amount">{fmt(r.annualPmt)}</span>
                </div>
              ))}
            </div>
          )}
          {debtServiceRECorp.length > 0 && (
            <div>
              <div className="debt-category-label" style={{color:"#2d5a8e"}}>
                Real Estate Mortgages — Corp Paid
              </div>
              {debtServiceRECorp.map((r, i) => (
                <div key={i} className="debt-row" style={{borderLeftColor:"#2d5a8e"}}>
                  <span className="debt-creditor">{r.creditor}</span>
                  <span className="debt-detail" style={{color:"#2d5a8e",fontSize:".7rem"}}>corp pays</span>
                  <span className="debt-amount" style={{color:"#2d5a8e"}}>{fmt(r.annualPmt)}</span>
                </div>
              ))}
            </div>
          )}
          {budgetCorpDebtTotal > 0 && (
            <div style={{display:"flex",justifyContent:"space-between",padding:"5px 8px",fontSize:".8rem",color:"#2d5a8e",background:"#f0f6ff",borderRadius:5,marginTop:4}}>
              <span>Corp Paid Subtotal</span><strong>{fmt(budgetCorpDebtTotal)}</strong>
            </div>
          )}
          {corpPersonalDebt && corpPersonalDebt.length > 0 && (
            <div style={{marginTop:8}}>
              <div className="debt-category-label" style={{color:"#7a4f00",background:"#fff8e8",padding:"3px 6px",borderRadius:4}}>
                Personal Debt Paid by This Entity
              </div>
              {corpPersonalDebt.filter(r=>r.annualPmt && numVal(r.annualPmt)>0).map((r, i) => (
                <div key={i} className="debt-row" style={{borderLeftColor:"#c08020"}}>
                  <span className="debt-creditor">{r.creditor}</span>
                  <span className="debt-detail" style={{color:"#7a4f00",fontSize:".7rem"}}>
                    {r.owner}{r.security ? " · " + r.security : ""}
                  </span>
                  <span className="debt-amount" style={{color:"#7a4f00"}}>{fmt(r.annualPmt)}</span>
                </div>
              ))}
              <div style={{display:"flex",justifyContent:"space-between",padding:"5px 8px",fontSize:".8rem",color:"#7a4f00",background:"#fff8e8",borderRadius:5,marginTop:4}}>
                <span>Personal Debt Subtotal</span>
                <strong>{fmt(corpPersonalDebt.filter(r=>r.annualPmt&&numVal(r.annualPmt)>0).reduce((s,r)=>s+numVal(r.annualPmt),0))}</strong>
              </div>
            </div>
          )}
          <div className="budget-subtotal">
            <span>Total Debt Service{budgetCorpDebtTotal > 0 ? " (personal + corp)" : ""}</span>
            <strong>{fmt(budgetTotalDebtService)}</strong>
          </div>
        </div>
        <div className="budget-grand expense-grand">
          <span>TOTAL EXPENSES</span>
          <span>{fmt(budgetTotalExpenses + (corpPersonalDebtTotal||0))}</span>
        </div>
        <div className={"budget-net " + ((budgetTotalIncome - budgetTotalExpenses - (corpPersonalDebtTotal||0)) >= 0 ? "net-positive" : "net-negative")}>
          <div className="margin-detail">
            <div className="margin-label">
              {(budgetTotalIncome - budgetTotalExpenses - (corpPersonalDebtTotal||0)) >= 0 ? "MARGIN (Net Income)" : "MARGIN (Net Loss)"}
            </div>
            <div className="margin-calc">
              {fmt(budgetTotalIncome)} income minus {fmt(budgetTotalExpenses + (corpPersonalDebtTotal||0))} expenses
            </div>
          </div>
          <span className="margin-value">{fmt(Math.abs(budgetTotalIncome - budgetTotalExpenses - (corpPersonalDebtTotal||0)))}</span>
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


// ── Ag Inspection Tab ─────────────────────────────────────────────────────────
const INSP_CONDITIONS = ["Excellent","Good","Fair","Poor"];
const INSP_WATER_COND  = ["Excess","Adequate","Limited"];
const inspUid = () => Math.random().toString(36).slice(2,9);
const INSP_SH   = '#1B4332';
const INSP_TH   = '#2D6A4F';
const INSP_GOLD = '#C8860A';

const inspCondStyle = c => ({
  Excellent:{color:'#15803d',bg:'#dcfce7',border:'#86efac'},
  Good:     {color:'#1d4ed8',bg:'#dbeafe',border:'#93c5fd'},
  Fair:     {color:'#92400e',bg:'#fef3c7',border:'#fcd34d'},
  Poor:     {color:'#991b1b',bg:'#fee2e2',border:'#fca5a5'},
  Excess:   {color:'#1d4ed8',bg:'#dbeafe',border:'#93c5fd'},
  Adequate: {color:'#15803d',bg:'#dcfce7',border:'#86efac'},
  Limited:  {color:'#991b1b',bg:'#fee2e2',border:'#fca5a5'},
}[c] || {color:'#6b7280',bg:'#f3f4f6',border:'#d1d5db'});

const inspFmt$ = v => { const n=parseFloat(v)||0; return n===0?'—':`$${n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}`; };

function InspCondPills({ value, onChange, options=INSP_CONDITIONS }) {
  return (
    <div style={{display:'flex',gap:3,flexWrap:'wrap'}}>
      {options.map(o => {
        const cs = inspCondStyle(o); const active = value===o;
        return (
          <button key={o} type="button" onClick={()=>onChange(active?'':o)} style={{
            padding:'2px 9px',borderRadius:999,fontSize:11,fontWeight:700,cursor:'pointer',
            transition:'all .15s',border:`1.5px solid ${active?cs.border:'#e5e7eb'}`,
            background:active?cs.bg:'white',color:active?cs.color:'#9ca3af',lineHeight:1.6,
          }}>{o}</button>
        );
      })}
    </div>
  );
}

const INSP_LBL = {fontSize:12,fontWeight:600,color:'#374151',marginBottom:4,display:'block',letterSpacing:.3};
const INSP_TH_S = {background:INSP_TH,color:'white',padding:'6px 8px',fontSize:11,fontWeight:700,textAlign:'center',whiteSpace:'nowrap',letterSpacing:.3};
const INSP_TD_S = {padding:'4px 6px',borderBottom:'1px solid #f0fdf4',verticalAlign:'middle'};

function InspCard({ title, children }) {
  return (
    <div style={{marginBottom:20,borderRadius:6,overflow:'hidden',boxShadow:'0 1px 4px rgba(0,0,0,0.1)',border:'1px solid #d1fae5'}}>
      <div style={{background:INSP_SH,padding:'9px 16px'}}>
        <span style={{color:'white',fontFamily:'inherit',fontWeight:700,fontSize:15,letterSpacing:.5}}>{title}</span>
      </div>
      <div style={{background:'white',padding:16}}>{children}</div>
    </div>
  );
}

function InspAddBtn({ label, onClick }) {
  return (
    <button type="button" onClick={onClick} style={{
      marginTop:10,background:'#f0fdf4',color:INSP_TH,border:`1.5px dashed ${INSP_TH}`,
      borderRadius:4,padding:'5px 14px',cursor:'pointer',fontSize:13,fontWeight:600,
    }}>{label}</button>
  );
}

const inspInp = (val, onChange, ph='', type='text', extra={}) => (
  <input type={type} value={val} placeholder={ph} onChange={e=>onChange(e.target.value)} style={{
    border:'1px solid #d1d5db',borderRadius:4,padding:'4px 7px',fontSize:13,width:'100%',
    fontFamily:'inherit',outline:'none',boxSizing:'border-box',background:'white',...extra,
  }}/>
);

const inspTa = (val, onChange, ph, rows=3) => (
  <textarea value={val} onChange={e=>onChange(e.target.value)} placeholder={ph} rows={rows} style={{
    border:'1px solid #d1d5db',borderRadius:4,padding:'6px 8px',fontSize:13,width:'100%',
    fontFamily:'inherit',outline:'none',resize:'vertical',boxSizing:'border-box',
  }}/>
);

// Deviation helpers
const devPct = (actual, budgeted) => {
  if (!actual && actual !== 0) return null; // no actual value entered yet
  const a = parseFloat(actual)||0, b = parseFloat(budgeted)||0;
  if (!b) return null;
  return ((a - b) / b) * 100;
};
const devStyle = pct => {
  if (pct === null) return {};
  const abs = Math.abs(pct);
  if (abs >= 20) return {background:'#fef2f2',borderLeft:'4px solid #dc2626'};
  if (abs >= 10) return {background:'#fffbeb',borderLeft:'4px solid #f59e0b'};
  return {background:'#f0fdf4',borderLeft:'4px solid #22c55e'};
};
const devBadge = pct => {
  if (pct === null || Math.abs(pct) < 0.5) return null;
  const abs = Math.abs(pct); const pos = pct > 0;
  const color = abs >= 20 ? '#dc2626' : abs >= 10 ? '#d97706' : '#16a34a';
  return (
    <span style={{fontSize:10,fontWeight:700,color,background:color+'18',padding:'1px 6px',borderRadius:999,whiteSpace:'nowrap'}}>
      {pos?'+':''}{pct.toFixed(1)}%
    </span>
  );
};

function InspectionView({ data, setData }) {
  const fileRef  = React.useRef(null);
  const cameraRef = React.useRef(null);
  const printRef = React.useRef(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [submitErr, setSubmitErr] = React.useState('');

  // Derived from budget — sync when budget changes
  React.useEffect(() => {
    if (!data.inspCrops || data.inspCrops.length === 0) {
      const fromBudget = (data.budgetCrops||[])
        .filter(r => r.crop || r.acres)
        .map(r => ({
          id: inspUid(),
          budgetedCrop: r.crop||'',
          budgetedAcres: r.acres||'',
          budgetedYield: r.yieldPerAcre||'',
          budgetedUnit: r.unit||'bu',
          budgetedPrice: r.price||'',
          location:'', condition:'',
          actualAcres:'', actualYield:'', valuePerUnit:'',
          deviationReason:'', substituted:false, substituteCrop:'',
        }));
      const rows = fromBudget.length > 0 ? fromBudget : [{
        id:inspUid(), budgetedCrop:'', budgetedAcres:'', budgetedYield:'',
        budgetedUnit:'bu', budgetedPrice:'', location:'', condition:'',
        actualAcres:'', actualYield:'', valuePerUnit:'',
        deviationReason:'', substituted:false, substituteCrop:'',
      }];
      setData(d=>({...d, inspCrops: rows}));
    }
    if (!data.inspLivestock || data.inspLivestock.length === 0) {
      const fromBudget = (data.budgetLivestock||[])
        .filter(r => r.type || r.head)
        .map(r => ({
          id: inspUid(),
          budgetedType: r.type||'', budgetedHead: r.head||'',
          budgetedLbs: r.lbs||'', budgetedPrice: r.price||'',
          location:'', condition:'', actualHead:'', estWeight:'', valuePerUnit:'',
          deviationReason:'',
        }));
      const rows = fromBudget.length > 0 ? fromBudget : [{
        id:inspUid(), budgetedType:'', budgetedHead:'', budgetedLbs:'', budgetedPrice:'',
        location:'', condition:'', actualHead:'', estWeight:'', valuePerUnit:'', deviationReason:'',
      }];
      setData(d=>({...d, inspLivestock: rows}));
    }
    if (!data.inspInventory || data.inspInventory.length === 0) {
      setData(d=>({...d, inspInventory: [{id:inspUid(),description:'',location:'',condition:'',quantity:'',unitType:'bu',valuePerUnit:''}]}));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (field, val) => setData(d=>({...d, [field]:val}));
  const [showShareModal, setShowShareModal] = React.useState(false);
  const [shareLink, setShareLink] = React.useState('');
  const [sharePin, setSharePin] = React.useState('');
  const [shareStatus, setShareStatus] = React.useState(''); // 'generating'|'ready'|'error'
  const [checkingResponse, setCheckingResponse] = React.useState(false);
  const [customerResponse, setCustomerResponse] = React.useState(null);
  const setLoan = (i,v) => setData(d=>({...d, inspLoans: d.inspLoans.map((x,j)=>j===i?v:x)}));
  const updCrop = (id,f,v) => setData(d=>({...d, inspCrops: d.inspCrops.map(r=>r.id===id?{...r,[f]:v}:r)}));
  const updLS   = (id,f,v) => setData(d=>({...d, inspLivestock: d.inspLivestock.map(r=>r.id===id?{...r,[f]:v}:r)}));
  const updInv  = (id,f,v) => setData(d=>({...d, inspInventory: d.inspInventory.map(r=>r.id===id?{...r,[f]:v}:r)}));

  const generateShare = async () => {
    setShareStatus('generating');
    setShowShareModal(true);
    try {
      // Generate random share ID and PIN
      const shareId = Math.random().toString(36).slice(2,10).toUpperCase();
      const pin = String(Math.floor(100000 + Math.random() * 900000));
      const payload = {
        share_id: shareId,
        pin,
        client_name: data.clientName,
        as_of_date: data.asOfDate || data.inspDate || new Date().toISOString().slice(0,10),
        insp_data: {
          inspCrops: data.inspCrops || [],
          inspLivestock: data.inspLivestock || [],
          clientName: data.clientName,
          inspDate: data.inspDate,
        },
        response: null,
      };
      const resp = await fetch(SUPABASE_URL + '/rest/v1/inspection_shares', {
        method: 'POST',
        headers: { ...supaHeaders(), 'Prefer': 'return=representation' },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) throw new Error(await resp.text());
      const origin = window.location.origin;
      setShareLink(origin + '/inspect?id=' + shareId);
      setSharePin(pin);
      setShareStatus('ready');
      // Save shareId to balance sheet data so we can check later
      setData(d => ({...d, inspShareId: shareId}));
      // Auto-save so inspShareId persists across page reloads
      const saveKey = STORAGE_PREFIX + data.clientName.replace(/\s+/g,"_") + ":" + (data.asOfDate||new Date().toISOString().slice(0,10));
      const savePayload = {...data, inspShareId: shareId, _savedAt: new Date().toISOString()};
      storage.set(saveKey, JSON.stringify(savePayload)).catch(()=>{});
    } catch(e) {
      setShareStatus('error:' + e.message);
    }
  };

  const checkCustomerResponse = async () => {
    setCheckingResponse(true);
    try {
      const sid = data.inspShareId || (shareLink ? shareLink.split('id=')[1] : null);
      if (!sid) {
        alert('No share link found. Use "Share with Customer" first.');
        setCheckingResponse(false);
        return;
      }
      const resp = await fetch(
        SUPABASE_URL + '/rest/v1/inspection_shares?share_id=eq.' + sid + '&select=response,responded_at',
        { headers: supaHeaders() }
      );
      const rows = await resp.json();
      if (rows[0]?.response) {
        const cr = rows[0].response;
        setCustomerResponse(cr);
        setData(d => ({
          ...d,
          inspCrops: (d.inspCrops||[]).map((r,i) => {
            const c = cr.crops?.[i] || {};
            return {
              ...r,
              actualAcres: c.actualAcres || r.actualAcres,
              condition: c.condition || r.condition,
              actualYield: c.actualYield || r.actualYield,
              location: c.location || r.location,
              deviationReason: c.deviationReason || r.deviationReason,
            };
          }),
          inspLivestock: (d.inspLivestock||[]).map((r,i) => {
            const l = cr.livestock?.[i] || {};
            return {
              ...r,
              actualHead: l.actualHead || r.actualHead,
              condition: l.condition || r.condition,
              estWeight: l.estWeight || r.estWeight,
              deviationReason: l.deviationReason || r.deviationReason,
            };
          }),
        }));
        alert('✅ Customer response loaded! Their answers have been filled in.');
      } else {
        alert('No response yet — the customer has not submitted the form.');
      }
    } catch(e) {
      alert('Error: ' + e.message);
    }
    setCheckingResponse(false);
  };

  const addCrop = () => setData(d=>({...d, inspCrops:[...d.inspCrops,{id:inspUid(),budgetedCrop:'',budgetedAcres:'',budgetedYield:'',budgetedUnit:'bu',budgetedPrice:'',location:'',condition:'',actualAcres:'',actualYield:'',valuePerUnit:'',deviationReason:'',substituted:false,substituteCrop:''}]}));
  const remCrop = id => setData(d=>({...d, inspCrops: d.inspCrops.filter(r=>r.id!==id)}));
  const addLS   = () => setData(d=>({...d, inspLivestock:[...d.inspLivestock,{id:inspUid(),budgetedType:'',budgetedHead:'',budgetedLbs:'',budgetedPrice:'',location:'',condition:'',actualHead:'',estWeight:'',valuePerUnit:'',deviationReason:''}]}));
  const remLS   = id => setData(d=>({...d, inspLivestock: d.inspLivestock.filter(r=>r.id!==id)}));
  const addInv  = () => setData(d=>({...d, inspInventory:[...d.inspInventory,{id:inspUid(),description:'',location:'',condition:'',quantity:'',unitType:'bu',valuePerUnit:''}]}));
  const remInv  = id => setData(d=>({...d, inspInventory: d.inspInventory.filter(r=>r.id!==id)}));

  const handleFiles = e => {
    Array.from(e.target.files).forEach(f => {
      const r = new FileReader();
      r.onload = ev => setData(d=>({...d, inspPhotos:[...(d.inspPhotos||[]),{id:inspUid(),src:ev.target.result,label:'',ts:new Date().toLocaleString()}]}));
      r.readAsDataURL(f);
    });
    e.target.value='';
  };

  const cropRowTot = r => (parseFloat(r.actualAcres||0))*(parseFloat(r.actualYield||r.budgetedYield||0))*(parseFloat(r.valuePerUnit||r.budgetedPrice||0));
  const lsRowTot   = r => (parseFloat(r.actualHead||r.budgetedHead||0))*(parseFloat(r.valuePerUnit||r.budgetedPrice||0));
  const invRowTot  = r => (parseFloat(r.quantity||0))*(parseFloat(r.valuePerUnit||0));
  const cropTot = (data.inspCrops||[]).reduce((s,r)=>s+cropRowTot(r),0);
  const lsTot   = (data.inspLivestock||[]).reduce((s,r)=>s+lsRowTot(r),0);
  const invTot  = (data.inspInventory||[]).reduce((s,r)=>s+invRowTot(r),0);
  const grand   = cropTot + lsTot + invTot;

  const handlePDF = () => {
    if (window.html2pdf) {
      window.html2pdf().set({
        margin:[10,10,10,10],
        filename:`ag-inspection-${(data.clientName||'report').replace(/\s+/g,'-')}-${data.inspDate||''}.pdf`,
        image:{type:'jpeg',quality:0.92},
        html2canvas:{scale:2,useCORS:true,logging:false},
        jsPDF:{unit:'mm',format:'letter',orientation:'portrait'},
      }).from(printRef.current).save();
    } else { window.print(); }
  };

  const EMAIL_CONFIG = {
    serviceId:  'YOUR_SERVICE_ID',
    templateId: 'YOUR_TEMPLATE_ID',
    publicKey:  'YOUR_PUBLIC_KEY',
    toEmail:    'YOUR_EMAIL@example.com',
  };

  const handleSubmit = async () => {
    if (!data.clientName) { setSubmitErr('Please enter a client name on the Balance Sheet tab first.'); return; }
    setSubmitErr(''); setSubmitting(true);
    try {
      if (EMAIL_CONFIG.serviceId === 'YOUR_SERVICE_ID') {
        setSubmitErr('Email not configured — downloading PDF locally instead.');
        handlePDF(); return;
      }
      const deviations = (data.inspCrops||[]).filter(r => {
        const p = devPct(r.actualAcres, r.budgetedAcres);
        return r.actualAcres && p !== null && Math.abs(p) >= 10;
      }).map(r => `${r.budgetedCrop}: budgeted ${r.budgetedAcres}ac -> actual ${r.actualAcres}ac (${devPct(r.actualAcres,r.budgetedAcres).toFixed(1)}%) -- ${r.deviationReason||'no reason given'}`).join('\n');

      const body = `AG INSPECTION REPORT\nCustomer: ${data.clientName}\nInspector: ${data.inspInspector||''}\nDate: ${data.inspDate||''}\n\nCROP DEVIATIONS FROM BUDGET:\n${deviations||'None'}\n\nGRAND TOTAL: ${inspFmt$(grand)}\n\nPasture: ${data.inspPastureCond||'—'} ${data.inspPastureCmt||''}\nWater: ${data.inspWaterCond||'—'} ${data.inspWaterCmt||''}\nEquipment: ${data.inspEquipCond||'—'} ${data.inspEquipCmt||''}\nEnvironmental: ${data.inspEnvCmt||''}\nAdditional: ${data.inspAddlCmt||''}`;

      await window.emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateId, {
        to_email: EMAIL_CONFIG.toEmail, customer: data.clientName,
        inspector: data.inspInspector, date: data.inspDate,
        grand_total: inspFmt$(grand), body, deviations: deviations||'None',
      }, EMAIL_CONFIG.publicKey);
      setSubmitted(true);
    } catch(err) {
      setSubmitErr('Submit failed: ' + (err.text||err.message||String(err)));
    } finally { setSubmitting(false); }
  };

  const crops = data.inspCrops || [];
  const lsRows = data.inspLivestock || [];
  const invRows = data.inspInventory || [];
  const photos = data.inspPhotos || [];
  const loans = data.inspLoans || ['','',''];

  if (submitted) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:48}}>
      <div style={{background:'white',borderRadius:12,padding:40,textAlign:'center',maxWidth:420,boxShadow:'0 4px 20px rgba(0,0,0,0.1)'}}>
        <div style={{fontSize:52,marginBottom:12}}>✅</div>
        <div style={{fontWeight:800,fontSize:22,color:INSP_SH,marginBottom:8}}>Report Submitted!</div>
        <p style={{color:'#6b7280',fontSize:14,lineHeight:1.6,marginBottom:20}}>Inspection report for <strong>{data.clientName}</strong> sent successfully.</p>
        <button onClick={()=>setSubmitted(false)} style={{background:INSP_SH,color:'white',border:'none',borderRadius:6,padding:'9px 22px',fontWeight:700,cursor:'pointer'}}>New Inspection</button>
      </div>
    </div>
  );

  return (
    <div style={{maxWidth:1100,margin:'0 auto',padding:'20px 16px'}}>
      {/* EmailJS + html2pdf CDN (loaded once) */}
      {!window.emailjs && <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"/>}
      {!window.html2pdf && <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"/>}

      {/* Toolbar */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,gap:10,flexWrap:'wrap'}}>
        <div>
          <div style={{fontWeight:800,fontSize:18,color:INSP_SH,fontFamily:"'Playfair Display',serif"}}>Ag Inspection Report</div>
          <div style={{fontSize:12,color:'#6b7280'}}>Pre-loaded from Budget tab · Fill in actuals below</div>
        </div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          <button onClick={generateShare}
            style={{background:'#2d5a8e',color:'white',border:'none',borderRadius:5,
              padding:'7px 14px',fontWeight:700,fontSize:12,cursor:'pointer'}}>
            🔗 Share with Customer
          </button>
          {(data.inspShareId || shareLink) && (
            <button onClick={checkCustomerResponse} disabled={checkingResponse}
              style={{background:checkingResponse?'#e5e7eb':'#e8f5ea',color:checkingResponse?'#9ca3af':'#15803d',
                border:'1.5px solid '+(checkingResponse?'#d1d5db':'#22c55e'),borderRadius:5,
                padding:'7px 14px',fontWeight:700,fontSize:12,cursor:checkingResponse?'wait':'pointer'}}>
              {checkingResponse ? '⏳ Checking...' : '📬 Check Response'}
            </button>
          )}
          <button onClick={handlePDF} style={{background:'#f0fdf4',color:INSP_TH,border:`1.5px solid ${INSP_TH}`,borderRadius:5,padding:'7px 14px',fontWeight:600,fontSize:12,cursor:'pointer'}}>🖨 Save PDF</button>
          <button onClick={handleSubmit} disabled={submitting} style={{background:INSP_GOLD,color:'white',border:'none',borderRadius:5,padding:'8px 18px',fontWeight:700,fontSize:13,cursor:submitting?'wait':'pointer',opacity:submitting?.7:1}}>
            {submitting?'⏳ Sending…':'📤 Submit Report'}
          </button>
        </div>
      </div>

      {/* ── Share Modal ── */}
      {showShareModal && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,.55)',
          zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center',padding:16}}>
          <div style={{background:'white',borderRadius:14,padding:28,maxWidth:480,width:'100%',
            boxShadow:'0 10px 50px rgba(0,0,0,.25)'}}>
            <div style={{fontWeight:700,fontSize:'1.05rem',marginBottom:6,color:'#1a1a1a'}}>
              Share Inspection with Customer
            </div>
            {shareStatus === 'generating' && (
              <div style={{color:'#6b7280',padding:'20px 0',textAlign:'center'}}>Generating secure link...</div>
            )}
            {shareStatus === 'ready' && (
              <div>
                <div style={{fontSize:'.85rem',color:'#555',marginBottom:16}}>
                  Send your customer the link and PIN below. They fill in actual acres, conditions and yields, then submit. You can load their response back here anytime.
                </div>
                <div style={{background:'#f0f6ff',border:'1px solid #c0d8f0',borderRadius:8,padding:14,marginBottom:12}}>
                  <div style={{fontSize:'.72rem',fontWeight:700,color:'#2d5a8e',marginBottom:4,textTransform:'uppercase',letterSpacing:'.05em'}}>Share Link</div>
                  <div style={{fontSize:'.82rem',wordBreak:'break-all',color:'#1a1a1a',fontFamily:'monospace',marginBottom:8}}>{shareLink}</div>
                  <button onClick={()=>navigator.clipboard.writeText(shareLink).then(()=>alert('Copied!'))}
                    style={{background:'#2d5a8e',color:'white',border:'none',borderRadius:5,padding:'4px 10px',fontSize:'.75rem',cursor:'pointer',fontWeight:600}}>
                    Copy Link
                  </button>
                </div>
                <div style={{background:'#f5e8ea',border:'1px solid #e0b0b8',borderRadius:8,padding:14,marginBottom:14}}>
                  <div style={{fontSize:'.72rem',fontWeight:700,color:'#6B0E1E',marginBottom:4,textTransform:'uppercase',letterSpacing:'.05em'}}>Customer PIN</div>
                  <div style={{fontSize:'2rem',fontWeight:900,letterSpacing:'.25em',color:'#6B0E1E',fontFamily:'monospace'}}>{sharePin}</div>
                  <div style={{fontSize:'.72rem',color:'#888',marginTop:4}}>Customer must enter this to open the form</div>
                </div>
                <button onClick={()=>{
                    const subject = encodeURIComponent('Inspection Form - ' + data.clientName);
                    const body = encodeURIComponent('Please fill out your inspection form:\n\nLink: ' + shareLink + '\nPIN: ' + sharePin + '\n\nEnter the PIN, fill in your actual acres/conditions/yields, and submit.\n\nThank you,\nFirst Bank of Montana');
                    window.location.href = 'mailto:?subject=' + subject + '&body=' + body;
                  }}
                  style={{width:'100%',background:'#6B0E1E',color:'white',border:'none',borderRadius:7,
                    padding:'10px 0',fontWeight:700,fontSize:'.9rem',cursor:'pointer',marginBottom:8}}>
                  📧 Open in Email (Outlook / Mail)
                </button>
                <button onClick={checkCustomerResponse} disabled={checkingResponse}
                  style={{width:'100%',background:'none',border:'1.5px solid #22c55e',borderRadius:7,
                    padding:'8px 0',fontWeight:700,fontSize:'.88rem',cursor:'pointer',color:'#15803d',marginBottom:8}}>
                  {checkingResponse ? 'Checking...' : '🔄 Check for Customer Response'}
                </button>
                {customerResponse && (
                  <div style={{background:'#e8f5ea',border:'1px solid #22c55e',borderRadius:7,
                    padding:10,fontSize:'.85rem',color:'#15803d',fontWeight:700,marginBottom:8}}>
                    ✅ Customer has responded — answers loaded into the form.
                  </div>
                )}
              </div>
            )}
            {shareStatus.startsWith('error') && (
              <div style={{color:'#c44',fontSize:'.85rem',padding:'12px 0'}}>
                Error: {shareStatus.slice(6)}<br/>
                Check that the inspection_shares table exists in Supabase (run inspection-share-schema.sql).
              </div>
            )}
            <button onClick={()=>setShowShareModal(false)}
              style={{background:'none',border:'1px solid #ddd',borderRadius:6,padding:'7px 20px',
                cursor:'pointer',fontFamily:'inherit',fontSize:'.85rem',marginTop:4}}>
              Close
            </button>
          </div>
        </div>
      )}

      {submitErr && <div style={{background:'#fef3c7',border:'1px solid #fcd34d',borderRadius:6,padding:'10px 14px',marginBottom:16,fontSize:13,color:'#92400e'}}>⚠️ {submitErr}</div>}

      {/* Legend */}
      <div style={{display:'flex',gap:12,marginBottom:16,flexWrap:'wrap'}}>
        {[['#22c55e','On Budget (< 10% deviation)'],['#f59e0b','Minor Deviation (10–20%)'],['#dc2626','Major Deviation (> 20%)']].map(([c,l])=>(
          <div key={l} style={{display:'flex',alignItems:'center',gap:5,fontSize:12,color:'#6b7280'}}>
            <div style={{width:12,height:12,borderRadius:2,background:c+'30',border:`2px solid ${c}`}}/>
            {l}
          </div>
        ))}
      </div>

      <div ref={printRef}>
        {/* Header info */}
        <div style={{background:'white',borderRadius:6,padding:20,marginBottom:20,boxShadow:'0 1px 4px rgba(0,0,0,0.08)',border:'1px solid #d1fae5'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px 24px'}}>
            <div><label style={INSP_LBL}>CUSTOMER NAME</label>
              <div style={{padding:'6px 8px',background:'#f0fdf4',borderRadius:4,fontSize:13,fontWeight:600,color:INSP_SH}}>{data.clientName||'—'}</div>
            </div>
            <div><label style={INSP_LBL}>DATE OF INSPECTION</label>
              {inspInp(data.inspDate||'', v=>set('inspDate',v), '', 'date')}
            </div>
            <div><label style={INSP_LBL}>INSPECTOR NAME</label>
              {inspInp(data.inspInspector||'', v=>set('inspInspector',v), 'Enter inspector name')}
            </div>
            <div>
              <label style={INSP_LBL}>LOAN NUMBER(S)</label>
              <div style={{display:'flex',flexDirection:'column',gap:5}}>
                {loans.map((l,i)=><div key={i}>{inspInp(l, v=>setLoan(i,v), `Loan ${i+1}`)}</div>)}
              </div>
            </div>
          </div>
        </div>

        {/* ── Crops ── */}
        <InspCard title="🌱  CROP CONDITION — Budget vs. Actual">
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:12.5}}>
              <thead>
                <tr>
                  <th style={{...INSP_TH_S,textAlign:'left',minWidth:100}}>Crop</th>
                  <th style={{...INSP_TH_S,minWidth:80,background:'#374151'}}>Budget Ac</th>
                  <th style={{...INSP_TH_S,minWidth:80}}>Actual Ac</th>
                  <th style={{...INSP_TH_S,minWidth:70}}>Deviation</th>
                  <th style={{...INSP_TH_S,textAlign:'left',minWidth:90}}>Location</th>
                  <th style={{...INSP_TH_S,minWidth:190}}>Condition</th>
                  <th style={{...INSP_TH_S,minWidth:100}}>Yield / Acre</th>
                  <th style={{...INSP_TH_S,minWidth:80}}>Value / Unit</th>
                  <th style={{...INSP_TH_S,minWidth:85}}>Total Value</th>
                  <th style={{...INSP_TH_S,width:28}}></th>
                </tr>
              </thead>
              <tbody>
                {crops.map((r,i)=>{
                  const pct = devPct(r.actualAcres, r.budgetedAcres);
                  const showDev = pct !== null && Math.abs(pct) >= 10;
                  const rowBg = i%2===0?'white':'#f9fafb';
                  const ds = r.actualAcres ? devStyle(pct) : {};
                  return (
                    <React.Fragment key={r.id}>
                      <tr style={{background:ds.background||rowBg,...(ds.borderLeft?{borderLeft:ds.borderLeft}:{})}}>
                        {/* Crop name — editable if blank, shows budget value */}
                        <td style={INSP_TD_S}>
                          {r.budgetedCrop
                            ? <div>
                                <div style={{fontWeight:600,fontSize:13,color:'#1a1a1a'}}>{r.budgetedCrop}</div>
                                {r.substituted && (
                                  <div style={{marginTop:4}}>
                                    <div style={{fontSize:10,color:'#d97706',fontWeight:700,marginBottom:2}}>SUBSTITUTED →</div>
                                    {inspInp(r.substituteCrop, v=>updCrop(r.id,'substituteCrop',v), 'Actual crop planted…', 'text', {fontSize:12})}
                                  </div>
                                )}
                                <button type="button" onClick={()=>updCrop(r.id,'substituted',!r.substituted)}
                                  style={{marginTop:3,fontSize:10,background:'none',border:'none',color:r.substituted?'#dc2626':'#9ca3af',cursor:'pointer',padding:0,fontWeight:600}}>
                                  {r.substituted?'✕ Remove sub':'↺ Different crop?'}
                                </button>
                              </div>
                            : inspInp(r.budgetedCrop||r.substituteCrop, v=>updCrop(r.id,'budgetedCrop',v), 'Crop name…')
                          }
                        </td>
                        {/* Budget acres — locked from budget */}
                        <td style={{...INSP_TD_S,textAlign:'center',background:'#f8f6f2'}}>
                          <div style={{fontSize:13,fontWeight:600,color:'#6b7280'}}>{r.budgetedAcres||'—'}</div>
                          <div style={{fontSize:10,color:'#9ca3af'}}>budgeted</div>
                        </td>
                        {/* Actual acres — type to enter */}
                        <td style={INSP_TD_S}>
                          <input
                            type="text"
                            value={r.actualAcres}
                            placeholder={r.budgetedAcres||'0'}
                            onChange={e=>updCrop(r.id,'actualAcres',e.target.value.replace(/[^0-9.]/g,''))}
                            style={{border:'1.5px solid #6B0E1E',borderRadius:4,padding:'5px 8px',fontSize:13,width:'100%',fontFamily:'inherit',outline:'none',boxSizing:'border-box',background:'#fdf9f9',fontWeight:600,textAlign:'center'}}
                          />
                        </td>
                        {/* Deviation badge */}
                        <td style={{...INSP_TD_S,textAlign:'center'}}>
                          {r.actualAcres && r.budgetedAcres ? (
                            <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                              {devBadge(pct)}
                              <div style={{fontSize:10,color:'#6b7280'}}>
                                {(parseFloat(r.actualAcres||0)-parseFloat(r.budgetedAcres||0)>0?'+':'')}
                                {(parseFloat(r.actualAcres||0)-parseFloat(r.budgetedAcres||0)).toFixed(0)} ac
                              </div>
                            </div>
                          ) : <span style={{color:'#d1d5db',fontSize:11}}>—</span>}
                        </td>
                        <td style={INSP_TD_S}>{inspInp(r.location, v=>updCrop(r.id,'location',v), 'Field/Sec')}</td>
                        <td style={INSP_TD_S}><InspCondPills value={r.condition} onChange={v=>updCrop(r.id,'condition',v)}/></td>
                        <td style={INSP_TD_S}>
                          <div style={{display:'flex',gap:3}}>
                            {inspInp(r.actualYield||r.budgetedYield, v=>updCrop(r.id,'actualYield',v), r.budgetedYield||'0', 'number', {flex:1})}
                            <div style={{fontSize:11,color:'#6b7280',alignSelf:'center',whiteSpace:'nowrap'}}>{r.budgetedUnit||'bu'}</div>
                          </div>
                          {r.budgetedYield&&<div style={{fontSize:10,color:'#9ca3af'}}>budget: {r.budgetedYield} {r.budgetedUnit}</div>}
                        </td>
                        <td style={INSP_TD_S}>{inspInp(r.valuePerUnit||r.budgetedPrice, v=>updCrop(r.id,'valuePerUnit',v), r.budgetedPrice||'$0', 'number')}</td>
                        <td style={{...INSP_TD_S,textAlign:'right',fontWeight:700,color:'#15803d',whiteSpace:'nowrap'}}>
                          {cropRowTot(r)>0?inspFmt$(cropRowTot(r)):'—'}
                        </td>
                        <td style={INSP_TD_S}>
                          <button type="button" onClick={()=>remCrop(r.id)} style={{background:'#fee2e2',color:'#b91c1c',border:'none',borderRadius:4,padding:'2px 7px',cursor:'pointer',fontSize:14}}>×</button>
                        </td>
                      </tr>
                      {/* Deviation reason row - only required at >= 20% */}
                      {r.actualAcres && pct !== null && Math.abs(pct) >= 20 && (
                        <tr style={{background:'#fef2f2'}}>
                          <td colSpan={10} style={{padding:'6px 10px 8px 32px',borderBottom:'1px solid #f0f0f0'}}>
                            <div style={{display:'flex',alignItems:'center',gap:8}}>
                              <span style={{fontSize:11,fontWeight:700,color:'#dc2626',whiteSpace:'nowrap'}}>
                                ⛔ Deviation reason (required):
                              </span>
                              {inspInp(r.deviationReason, v=>updCrop(r.id,'deviationReason',v),
                                'Required — explain major deviation from budget…',
                                'text', {border:'1px solid #fca5a5',background:'white'})}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{background:'#ecfdf5'}}>
                  <td colSpan={8} style={{...INSP_TD_S,textAlign:'right',fontWeight:700,color:INSP_SH,fontSize:13}}>CROP TOTAL</td>
                  <td style={{...INSP_TD_S,textAlign:'right',fontWeight:700,color:'#15803d',fontSize:14}}>{inspFmt$(cropTot)}</td>
                  <td/>
                </tr>
              </tfoot>
            </table>
          </div>
          <InspAddBtn label="+ Add Crop Row" onClick={addCrop}/>
          <div style={{marginTop:12}}><label style={INSP_LBL}>Comments</label>
            {inspTa(data.inspCropCmt||'', v=>set('inspCropCmt',v), 'Crop condition observations…')}
          </div>
        </InspCard>

        {/* ── Livestock ── */}
        <InspCard title="🐄  LIVESTOCK CONDITION — Budget vs. Actual">
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:12.5}}>
              <thead>
                <tr>
                  <th style={{...INSP_TH_S,textAlign:'left',minWidth:120}}>Type</th>
                  <th style={{...INSP_TH_S,minWidth:80,background:'#374151'}}>Budget Hd</th>
                  <th style={{...INSP_TH_S,minWidth:80}}>Actual Hd</th>
                  <th style={{...INSP_TH_S,minWidth:70}}>Deviation</th>
                  <th style={{...INSP_TH_S,textAlign:'left',minWidth:90}}>Location</th>
                  <th style={{...INSP_TH_S,minWidth:190}}>Condition</th>
                  <th style={{...INSP_TH_S,minWidth:90}}>Est. Wt (lbs)</th>
                  <th style={{...INSP_TH_S,minWidth:80}}>Value / Hd</th>
                  <th style={{...INSP_TH_S,minWidth:85}}>Total Value</th>
                  <th style={{...INSP_TH_S,width:28}}></th>
                </tr>
              </thead>
              <tbody>
                {lsRows.map((r,i)=>{
                  const pct = devPct(r.actualHead, r.budgetedHead);
                  const showDev = pct !== null && Math.abs(pct) >= 10;
                  const ds = r.actualHead ? devStyle(pct) : {};
                  return (
                    <React.Fragment key={r.id}>
                      <tr style={{background:ds.background||(i%2===0?'white':'#f9fafb'),...(ds.borderLeft?{borderLeft:ds.borderLeft}:{})}}>
                        <td style={INSP_TD_S}>
                          {r.budgetedType
                            ? <div style={{fontWeight:600,fontSize:13}}>{r.budgetedType}</div>
                            : inspInp(r.budgetedType, v=>updLS(r.id,'budgetedType',v), 'Cattle, Hogs…')
                          }
                        </td>
                        <td style={{...INSP_TD_S,textAlign:'center',background:'#f8f6f2'}}>
                          <div style={{fontSize:13,fontWeight:600,color:'#6b7280'}}>{r.budgetedHead||'—'}</div>
                          <div style={{fontSize:10,color:'#9ca3af'}}>budgeted</div>
                        </td>
                        <td style={INSP_TD_S}>{inspInp(r.actualHead, v=>updLS(r.id,'actualHead',v), r.budgetedHead||'0','number')}</td>
                        <td style={{...INSP_TD_S,textAlign:'center'}}>
                          {r.actualHead && r.budgetedHead ? (
                            <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                              {devBadge(pct)}
                              <div style={{fontSize:10,color:'#6b7280'}}>{(parseFloat(r.actualHead||0)-parseFloat(r.budgetedHead||0)>0?'+':'')}{(parseFloat(r.actualHead||0)-parseFloat(r.budgetedHead||0)).toFixed(0)} hd</div>
                            </div>
                          ) : <span style={{color:'#d1d5db',fontSize:11}}>—</span>}
                        </td>
                        <td style={INSP_TD_S}>{inspInp(r.location, v=>updLS(r.id,'location',v), 'Pasture/Lot')}</td>
                        <td style={INSP_TD_S}><InspCondPills value={r.condition} onChange={v=>updLS(r.id,'condition',v)}/></td>
                        <td style={INSP_TD_S}>{inspInp(r.estWeight, v=>updLS(r.id,'estWeight',v), r.budgetedLbs||'0','number')}</td>
                        <td style={INSP_TD_S}>{inspInp(r.valuePerUnit, v=>updLS(r.id,'valuePerUnit',v), r.budgetedPrice||'$0','number')}</td>
                        <td style={{...INSP_TD_S,textAlign:'right',fontWeight:700,color:'#15803d'}}>{lsRowTot(r)>0?inspFmt$(lsRowTot(r)):'—'}</td>
                        <td style={INSP_TD_S}><button type="button" onClick={()=>remLS(r.id)} style={{background:'#fee2e2',color:'#b91c1c',border:'none',borderRadius:4,padding:'2px 7px',cursor:'pointer',fontSize:14}}>×</button></td>
                      </tr>
                      {r.actualHead && pct !== null && Math.abs(pct) >= 20 && (
                        <tr style={{background:'#fef2f2'}}>
                          <td colSpan={10} style={{padding:'6px 10px 8px 32px'}}>
                            <div style={{display:'flex',alignItems:'center',gap:8}}>
                              <span style={{fontSize:11,fontWeight:700,color:'#dc2626',whiteSpace:'nowrap'}}>⛔ Deviation reason (required):</span>
                              {inspInp(r.deviationReason, v=>updLS(r.id,'deviationReason',v), 'Required — explain major deviation from budget…', 'text', {border:'1px solid #fca5a5',background:'white'})}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{background:'#ecfdf5'}}>
                  <td colSpan={8} style={{...INSP_TD_S,textAlign:'right',fontWeight:700,color:INSP_SH,fontSize:13}}>LIVESTOCK TOTAL</td>
                  <td style={{...INSP_TD_S,textAlign:'right',fontWeight:700,color:'#15803d',fontSize:14}}>{inspFmt$(lsTot)}</td>
                  <td/>
                </tr>
              </tfoot>
            </table>
          </div>
          <InspAddBtn label="+ Add Livestock Row" onClick={addLS}/>
          <div style={{marginTop:12}}><label style={INSP_LBL}>Comments</label>
            {inspTa(data.inspLsCmt||'', v=>set('inspLsCmt',v), 'Livestock condition observations…')}
          </div>
        </InspCard>

        {/* ── Inventory ── */}
        <InspCard title="🏚  INVENTORY  (Stored Crop / Feed)">
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:12.5}}>
              <thead>
                <tr>
                  <th style={{...INSP_TH_S,textAlign:'left',minWidth:130}}>Description</th>
                  <th style={{...INSP_TH_S,textAlign:'left',minWidth:100}}>Location</th>
                  <th style={{...INSP_TH_S,minWidth:190}}>Condition</th>
                  <th style={{...INSP_TH_S,minWidth:80}}>Quantity</th>
                  <th style={{...INSP_TH_S,minWidth:65}}>Unit</th>
                  <th style={{...INSP_TH_S,minWidth:80}}>Value / Unit</th>
                  <th style={{...INSP_TH_S,minWidth:85}}>Total Value</th>
                  <th style={{...INSP_TH_S,width:28}}></th>
                </tr>
              </thead>
              <tbody>
                {invRows.map((r,i)=>(
                  <tr key={r.id} style={{background:i%2===0?'white':'#f0fdf4'}}>
                    <td style={INSP_TD_S}>{inspInp(r.description,v=>updInv(r.id,'description',v),'Corn, Soybeans…')}</td>
                    <td style={INSP_TD_S}>{inspInp(r.location,v=>updInv(r.id,'location',v),'Bin/Facility')}</td>
                    <td style={INSP_TD_S}><InspCondPills value={r.condition} onChange={v=>updInv(r.id,'condition',v)}/></td>
                    <td style={INSP_TD_S}>{inspInp(r.quantity,v=>updInv(r.id,'quantity',v),'0','number')}</td>
                    <td style={INSP_TD_S}>
                      <select value={r.unitType||'bu'} onChange={e=>updInv(r.id,'unitType',e.target.value)} style={{border:'1px solid #d1d5db',borderRadius:4,padding:'4px 5px',fontSize:12,width:'100%',background:'white',outline:'none'}}>
                        {['bu','ton','bale','cwt','lb','gal','head','ea'].map(u=><option key={u}>{u}</option>)}
                      </select>
                    </td>
                    <td style={INSP_TD_S}>{inspInp(r.valuePerUnit,v=>updInv(r.id,'valuePerUnit',v),'$0','number')}</td>
                    <td style={{...INSP_TD_S,textAlign:'right',fontWeight:700,color:'#15803d'}}>{invRowTot(r)>0?inspFmt$(invRowTot(r)):'—'}</td>
                    <td style={INSP_TD_S}><button type="button" onClick={()=>remInv(r.id)} style={{background:'#fee2e2',color:'#b91c1c',border:'none',borderRadius:4,padding:'2px 7px',cursor:'pointer',fontSize:14}}>×</button></td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{background:'#ecfdf5'}}>
                  <td colSpan={6} style={{...INSP_TD_S,textAlign:'right',fontWeight:700,color:INSP_SH,fontSize:13}}>INVENTORY TOTAL</td>
                  <td style={{...INSP_TD_S,textAlign:'right',fontWeight:700,color:'#15803d',fontSize:14}}>{inspFmt$(invTot)}</td>
                  <td/>
                </tr>
              </tfoot>
            </table>
          </div>
          <InspAddBtn label="+ Add Inventory Row" onClick={addInv}/>
          <div style={{marginTop:12}}><label style={INSP_LBL}>Comments</label>
            {inspTa(data.inspInvCmt||'', v=>set('inspInvCmt',v), 'Inventory observations…')}
          </div>
        </InspCard>

        {/* ── Simple condition sections ── */}
        {[
          ['🟤  PASTURE CONDITIONS','inspPastureCond','inspPastureCmt','Pasture conditions…',INSP_CONDITIONS],
          ['💧  WATER / IRRIGATION SOURCE','inspWaterCond','inspWaterCmt','Water source / irrigation notes…',INSP_WATER_COND],
          ['🚜  EQUIPMENT','inspEquipCond','inspEquipCmt','Equipment condition notes…',INSP_CONDITIONS],
        ].map(([title,condKey,cmtKey,ph,opts])=>(
          <InspCard key={condKey} title={title}>
            <div style={{display:'grid',gridTemplateColumns:'auto 1fr',gap:'0 24px',alignItems:'start'}}>
              <div style={{minWidth:260}}>
                <label style={INSP_LBL}>Overall Condition</label>
                <InspCondPills value={data[condKey]||''} onChange={v=>set(condKey,v)} options={opts}/>
              </div>
              <div><label style={INSP_LBL}>Comments</label>{inspTa(data[cmtKey]||'',v=>set(cmtKey,v),ph,2)}</div>
            </div>
          </InspCard>
        ))}

        <InspCard title="🌿  ENVIRONMENTAL OBSERVATIONS">
          {inspTa(data.inspEnvCmt||'',v=>set('inspEnvCmt',v),'Soil erosion, drainage, weed pressure…',4)}
        </InspCard>

        <InspCard title="📋  ADDITIONAL OBSERVATIONS / OVERALL OPERATION">
          {inspTa(data.inspAddlCmt||'',v=>set('inspAddlCmt',v),'Overall operation comments…',4)}
        </InspCard>

        {/* ── Financial Summary ── */}
        <div style={{background:INSP_SH,borderRadius:6,padding:'14px 20px',marginBottom:20}}>
          <div style={{fontSize:11,color:'rgba(255,255,255,0.55)',letterSpacing:2,marginBottom:10,textTransform:'uppercase',fontWeight:700}}>Financial Summary</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
            {[['Crop Value',cropTot],['Livestock Value',lsTot],['Inventory Value',invTot],['GRAND TOTAL',grand]].map(([label,val])=>{
              const isG = label==='GRAND TOTAL';
              return (
                <div key={label} style={{background:isG?'rgba(200,134,10,0.2)':'rgba(255,255,255,0.07)',borderRadius:5,padding:'10px 12px',textAlign:'center',border:`1px solid ${isG?INSP_GOLD:'rgba(255,255,255,0.1)'}`}}>
                  <div style={{fontSize:10,color:'rgba(255,255,255,0.55)',letterSpacing:.5,marginBottom:4,textTransform:'uppercase'}}>{label}</div>
                  <div style={{fontSize:isG?20:16,fontWeight:700,color:isG?INSP_GOLD:'white'}}>{inspFmt$(val)}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Deviation Summary ── */}
        {crops.some(r=>{ const p=devPct(r.actualAcres,r.budgetedAcres); return r.actualAcres&&p!==null&&Math.abs(p)>=10; }) && (
          <div style={{background:'#fffbeb',border:'2px solid #f59e0b',borderRadius:6,padding:16,marginBottom:20}}>
            <div style={{fontWeight:700,fontSize:14,color:'#92400e',marginBottom:10}}>⚠️ Budget Deviation Summary</div>
            {crops.filter(r=>{ const p=devPct(r.actualAcres,r.budgetedAcres); return r.actualAcres&&p!==null&&Math.abs(p)>=10; }).map(r=>{
              const p = devPct(r.actualAcres, r.budgetedAcres);
              const ac = parseFloat(r.actualAcres||0)-parseFloat(r.budgetedAcres||0);
              return (
                <div key={r.id} style={{display:'flex',gap:12,alignItems:'flex-start',padding:'6px 0',borderBottom:'1px solid #fcd34d'}}>
                  <div style={{fontSize:13,fontWeight:700,minWidth:80,color:Math.abs(p)>=20?'#dc2626':'#d97706'}}>{r.budgetedCrop||'—'}</div>
                  <div style={{fontSize:12,color:'#92400e'}}>
                    Budget: <strong>{r.budgetedAcres} ac</strong> → Actual: <strong>{r.actualAcres} ac</strong>
                    <span style={{marginLeft:6,fontWeight:700}}>{ac>0?'+':''}{ac.toFixed(0)} ac ({p.toFixed(1)}%)</span>
                    {r.substituted && r.substituteCrop && <span style={{marginLeft:6,background:'#fef3c7',padding:'1px 5px',borderRadius:3}}>Substituted: {r.substituteCrop}</span>}
                  </div>
                  {r.deviationReason && <div style={{fontSize:11,color:'#78350f',fontStyle:'italic',flex:1}}>"{r.deviationReason}"</div>}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Photos ── */}
        <div style={{borderRadius:6,overflow:'hidden',boxShadow:'0 1px 4px rgba(0,0,0,0.1)',border:'1px solid #d1fae5',marginBottom:20}}>
          <div style={{background:INSP_SH,padding:'9px 16px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{color:'white',fontWeight:700,fontSize:15}}>📸  INSPECTION PHOTOS</span>
            <div style={{display:'flex',gap:8}}>
              <button type="button" onClick={()=>cameraRef.current?.click()} style={{background:'rgba(255,255,255,0.14)',color:'white',border:'1px solid rgba(255,255,255,0.35)',borderRadius:4,padding:'4px 12px',cursor:'pointer',fontSize:12,fontWeight:600}}>📷 Camera</button>
              <button type="button" onClick={()=>fileRef.current?.click()} style={{background:'rgba(255,255,255,0.14)',color:'white',border:'1px solid rgba(255,255,255,0.35)',borderRadius:4,padding:'4px 12px',cursor:'pointer',fontSize:12,fontWeight:600}}>📁 Upload</button>
              <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleFiles} style={{display:'none'}}/>
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFiles} style={{display:'none'}}/>
            </div>
          </div>
          <div style={{background:'white',padding:16}}>
            {photos.length===0 ? (
              <div style={{textAlign:'center',padding:24,color:'#9ca3af',fontSize:14}}>No photos yet — use Camera or Upload above</div>
            ) : (
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:12}}>
                {photos.map(ph=>(
                  <div key={ph.id} style={{border:'1px solid #e5e7eb',borderRadius:6,overflow:'hidden',position:'relative'}}>
                    <img src={ph.src} alt={ph.label||'Photo'} style={{width:'100%',height:140,objectFit:'cover',display:'block'}}/>
                    <div style={{padding:'6px 8px'}}>
                      <input value={ph.label} onChange={e=>setData(d=>({...d,inspPhotos:d.inspPhotos.map(x=>x.id===ph.id?{...x,label:e.target.value}:x)}))}
                        placeholder="Add caption…" style={{border:'1px solid #e5e7eb',borderRadius:4,padding:'3px 6px',fontSize:11,width:'100%',boxSizing:'border-box',outline:'none',fontFamily:'inherit'}}/>
                      <div style={{fontSize:10,color:'#9ca3af',marginTop:2}}>{ph.ts}</div>
                    </div>
                    <button type="button" onClick={()=>setData(d=>({...d,inspPhotos:d.inspPhotos.filter(x=>x.id!==ph.id)}))}
                      style={{position:'absolute',top:5,right:5,background:'rgba(185,28,28,0.8)',color:'white',border:'none',borderRadius:999,width:22,height:22,cursor:'pointer',fontSize:14,lineHeight:'22px',textAlign:'center'}}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Signature */}
        <div style={{background:'white',borderRadius:6,padding:20,marginBottom:20,border:'1px solid #d1fae5'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:28}}>
            <div>
              <label style={INSP_LBL}>INSPECTOR SIGNATURE</label>
              <div style={{borderBottom:'2px solid #374151',height:44,marginTop:8}}/>
              <div style={{fontSize:11,color:'#9ca3af',marginTop:4}}>Signature</div>
            </div>
            <div>
              <label style={INSP_LBL}>DATE</label>
              <div style={{borderBottom:'2px solid #374151',height:44,marginTop:8,display:'flex',alignItems:'flex-end',paddingBottom:6,fontSize:14,color:'#374151'}}>
                {data.inspDate ? new Date(data.inspDate+'T12:00:00').toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}) : ''}
              </div>
              <div style={{fontSize:11,color:'#9ca3af',marginTop:4}}>Date of Inspection</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom submit */}
      <div style={{textAlign:'center',padding:'20px 0 32px'}}>
        <button onClick={handleSubmit} disabled={submitting} style={{background:INSP_SH,color:'white',border:'none',borderRadius:6,padding:'13px 40px',fontWeight:700,fontSize:16,cursor:submitting?'wait':'pointer',opacity:submitting?.7:1,boxShadow:'0 3px 12px rgba(27,67,50,0.3)'}}>
          {submitting?'⏳ Generating & Sending…':'📤 Submit Inspection Report'}
        </button>
        <div style={{fontSize:11,color:'#9ca3af',marginTop:8}}>Generates a PDF and emails it</div>
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
  const [openFolders, setOpenFolders] = useState({});
  const [showSaveFolderPicker, setShowSaveFolderPicker] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(null); // key of sheet being moved
  const [showCreateFolder, setShowCreateFolder] = useState(null); // path where new folder is being created
  const [newFolderName, setNewFolderName] = useState("");
  const [pendingSaveKey, setPendingSaveKey] = useState(null);
  const [selectedFolderPath, setSelectedFolderPath] = useState([]);
  const [userFolders, setUserFolders] = useState([]); // standalone folders (path arrays)
  const [editingFolder, setEditingFolder] = useState(null); // { path, newName }
  const [linkedEntityNWMap, setLinkedEntityNWMap] = useState({}); // { clientName: netWorth }
  const [availableEntities, setAvailableEntities] = useState([]);
  const [corpPersonalDebt, setCorpPersonalDebt] = useState([]);
  const [hasCustomerResponse, setHasCustomerResponse] = useState(false);
  const [pendingResponses, setPendingResponses] = useState({}); // { clientName: shareRecord }
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


  const toggleFolder = (name) => {
    setOpenFolders(f => ({ ...f, [name]: !f[name] }));
  };

  const createFolder = (path) => {
    const newFolders = [...userFolders];
    const pathStr = JSON.stringify(path);
    if (!newFolders.some(f => JSON.stringify(f) === pathStr)) {
      newFolders.push(path);
      setUserFolders(newFolders);
      try { localStorage.setItem("fbmt_userFolders", JSON.stringify(newFolders)); } catch {}
    }
  };
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
              sheets.push({ key, clientName: p.clientName, asOfDate: p.asOfDate, savedAt: p._savedAt, folderPath: p.folderPath || [], inspShareId: p.inspShareId || '', hasResponse: false });
            }
          } catch {}
        }
        sheets.sort((a, b) => (b.savedAt || "").localeCompare(a.savedAt || ""));
        setSavedSheets(sheets);
      }
    } catch {}
  };
  useEffect(() => {
    loadSavedList();
    checkAllPendingResponses();
    // Load any user-created folders
    try {
      const stored = localStorage.getItem("fbmt_userFolders");
      if (stored) setUserFolders(JSON.parse(stored));
    } catch {}
  }, []);

  // Load available entities for the link picker
  useEffect(() => {
    if (savedSheets.length > 0) {
      const linked = data.linkedEntities || [];
      const names = [...new Set(savedSheets.map(s => s.clientName))]
        .filter(n => n !== data.clientName && !linked.includes(n))
        .sort();
      setAvailableEntities(names);
    }
  }, [savedSheets, data.clientName, JSON.stringify(data.linkedEntities)]);

  // Auto-reload corp personal debt when client name changes
  useEffect(() => {
    if (data.clientName) loadCorpPersonalDebt();
  }, [data.clientName]);

  const [confirmSave, setConfirmSave] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const [importData, setImportData] = useState(null);
  const [importError, setImportError] = useState("");
  const [importDate, setImportDate] = useState(new Date().toISOString().slice(0,10));
  const [importDragging, setImportDragging] = useState(false);

  const saveSheet = async () => {
    if (!data.clientName) return;
    const key = STORAGE_PREFIX + data.clientName.replace(/\s+/g,"_") + ":" + data.asOfDate;
    // Check if already exists
    try {
      const existing = await storage.get(key);
      if (existing) {
        const p = JSON.parse(existing.value);
        // If it has a folder already, just confirm overwrite without folder picker
        if (p.folderPath && p.folderPath.length > 0) {
          setConfirmSave({ key, label: data.clientName + " — " + data.asOfDate });
          return;
        }
      }
    } catch {}
    // Show folder picker
    setPendingSaveKey(key);
    setSelectedFolderPath(data.folderPath && data.folderPath.length > 0 ? [...data.folderPath] : []);
    setShowSaveFolderPicker(true);
  };

  const doSave = async (key, folderPathOverride) => {
    setSaveStatus("saving");
    setConfirmSave(null);
    try {
      const fp = folderPathOverride !== undefined ? folderPathOverride : (data.folderPath || []);
      const savePayload = { ...data, folderPath: fp, _savedAt: new Date().toISOString() };
      await storage.set(key, JSON.stringify(savePayload));
      set("folderPath", fp);
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

  // ── Import helpers ─────────────────────────────────────────────────────────
  async function downloadTemplate() {
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js");
    const XLSX = window.XLSX;
    const rows = [
      ["SECTION","FIELD1","FIELD2","FIELD3","FIELD4","FIELD5","FIELD6","NOTES"],
      ["CLIENT","clientName","asOfDate","","","","","e.g. John Smith, 2024-12-31"],
      ["CASH_GLACIER","amount","","","","","","Glacier Bank / FBMT balance"],
      ["CASH_OTHER","institution","amount","","","","","Other bank accounts - one row per bank"],
      ["RECEIVABLES","description","amount","","","","","Current receivables due within 1 year"],
      ["FEDERAL_PAYMENTS","amount","","","","","","FSA/ARC/PLC/CRP payments"],
      ["LIVESTOCK_MARKET","number","kind","value","","","","Market livestock - one row per group"],
      ["FARM_PRODUCTS","quantity","unit","kind","pricePerUnit","share","contracted","Grain/hay on hand - one row per commodity"],
      ["CROP_INVESTMENT","cropType","acres","valuePerAcre","","","","Growing crops - input costs"],
      ["SUPPLIES","description","value","","","","","Fuel, chemicals, seed, parts"],
      ["OTHER_CURRENT","description","amount","","","","","Other current assets"],
      ["BREEDING_STOCK","number","kind","value","","","","Breeding cattle/horses"],
      ["REAL_ESTATE","acres","reType","description","valuePerAcre","","","One row per tract"],
      ["RE_CONTRACTS","description","amount","","","","","RE sale contracts receivable"],
      ["VEHICLES","year","make","vin","condition","value","","Titled vehicles - one row each"],
      ["MACHINERY","year","make","size","serial","condition","value","Equipment - one row each"],
      ["OTHER_ASSETS","description","amount","","","","","Investments, retirement, etc."],
      ["OPERATING_NOTES","creditor","dueDate","pmt","balance","security","","Operating lines of credit"],
      ["ACCOUNTS_DUE","creditor","amount","","","","","Trade accounts owed"],
      ["INTERMEDIATE_DEBT","creditor","security","dueDate","annualPmt","principal","rate","Equipment loans, term notes"],
      ["RE_CURRENT","creditor","annualPmt","rate","","","","Current RE mortgage payments"],
      ["TAXES_DUE","amount","","","","","","State/federal income taxes due"],
      ["OTHER_CURRENT_LIAB","description","amount","","","","","Other current liabilities"],
      ["RE_MORTGAGES","lienHolder","terms","rate","principal","","","Long-term RE mortgages"],
      ["OTHER_LIABILITIES","description","balance","","","","","Other long-term liabilities"],
      ["","","","","","","","--- EXAMPLE DATA BELOW ---"],
      ["CLIENT","Smith Farms","2024-12-31","","","","",""],
      ["CASH_GLACIER","125000","","","","","",""],
      ["CASH_OTHER","FCS of Great Falls","45000","","","","",""],
      ["FARM_PRODUCTS","50000","bu","winter wheat","5.50","100","true",""],
      ["FARM_PRODUCTS","15000","bu","barley","4.20","50","false","50% crop share"],
      ["REAL_ESTATE","640","Cropland","NW Sec 12 Cascade Co","2800","","",""],
      ["MACHINERY","2019","John Deere 8320","320hp","RW8320P123456","Good","185000",""],
      ["INTERMEDIATE_DEBT","FBMT","2019 JD 8320","2025-01-15","18500","92000","5.25",""],
    ];
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws["!cols"] = [12,18,14,14,12,10,12,35].map(w=>({wch:w}));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Balance Sheet Import");
    XLSX.writeFile(wb, "FBMT_Balance_Sheet_Import_Template.xlsx");
  }

  async function loadScript(src) {
    if (window.__loadedScripts && window.__loadedScripts[src]) return;
    return new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = src; s.onload = () => {
        if (!window.__loadedScripts) window.__loadedScripts = {};
        window.__loadedScripts[src] = true;
        res();
      };
      s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  async function parseImportFile(file) {
    setImportError("");
    setImportData(null);
    const ext = file.name.split(".").pop().toLowerCase();

    function processRows(rows) {
      try {
        // Helper: safe cell value as string
        const cell = (row, col) => {
          if (!row || row[col] === undefined || row[col] === null) return "";
          const v = row[col];
          // Skip formula strings
          if (typeof v === "string" && v.startsWith("=")) return "";
          if (v instanceof Date) return v.toISOString().slice(0,10);
          return String(v).trim();
        };
        const num = (row, col) => {
          const v = cell(row, col);
          return v ? v.replace(/[^0-9.]/g, "") : "";
        };

        // Detect format: FBMT native Excel OR generic section-based CSV/Excel
        const r0 = rows[0] || [];
        const r1 = rows[1] || [];
        const r6 = rows[6] || [];
        const isFBMT = (cell(r1,2) || "").includes("Balance Sheet") ||
                       (cell(r6,0) === "Name:" || cell(r6,5) === "As of Date:");

        if (isFBMT) {
          // ── FBMT Native Excel Format ──────────────────────────────────────
          const R = (i) => rows[i] || []; // 0-indexed

          // Client info (row 7 = index 6)
          const clientName = cell(R(6), 1);
          const rawDate = R(6)[6];
          const asOfDate = rawDate instanceof Date
            ? rawDate.toISOString().slice(0,10)
            : rawDate ? String(rawDate).slice(0,10) : importDate;

          // Cash on Hand (row 10 = index 9, col D = index 3)
          const cashGlacier = num(R(9), 3);

          // Current Receivables (rows 12-14 = index 11-13, col A=desc, D=value)
          const receivables = [];
          for (let i = 11; i <= 13; i++) {
            const desc = cell(R(i), 0);
            const val = num(R(i), 3);
            if (desc && !desc.includes("If Above") && !desc.includes("Federal")) {
              receivables.push({description: desc, amount: val});
            }
          }

          // Federal Payments (row 16 = index 15, col D)
          const fedAmt = num(R(15), 3) || num(R(16), 3);
          const federalPayments = fedAmt ? [{program:"Government Payments",amount:fedAmt}] : [{program:"",amount:""}];

          // Market Livestock (rows 19-21 = index 18-20, A=num, B=kind, C=value/head)
          const livestockMarket = [];
          for (let i = 18; i <= 21; i++) {
            const n = cell(R(i), 0);
            const k = cell(R(i), 1);
            const v = num(R(i), 2);
            if (k && !k.includes("Kind") && !k.includes("Number")) {
              const total = n && v ? String(parseFloat(n) * parseFloat(v)) : v;
              livestockMarket.push({number: n, kind: k, value: total});
            }
          }

          // Farm Products (rows 24-33 = index 23-32, A=qty, B=kind, C=price/unit)
          const farmProducts = [];
          for (let i = 23; i <= 32; i++) {
            const qty = cell(R(i), 0);
            const kind = cell(R(i), 1);
            const price = cell(R(i), 2);
            if (kind && !kind.includes("Kind") && !kind.includes("Quantity")) {
              farmProducts.push({quantity: qty||"", unit:"bu", kind: kind, pricePerUnit: price||"", share:"100", contracted:false});
            }
          }

          // Cash Investment / Crops (rows 35 = index 34, A=acres, B=kind, C=value/acre)
          const cropInvestment = [];
          for (let i = 34; i <= 35; i++) {
            const acres = cell(R(i), 0);
            const kind = cell(R(i), 1);
            const vpa = cell(R(i), 2);
            if (kind && acres) {
              cropInvestment.push({cropType: kind, acres: acres, valuePerAcre: vpa||""});
            }
          }

          // Supplies (row 37 = index 36, B=desc, D=value)
          const supplies = [];
          for (let i = 36; i <= 37; i++) {
            const desc = cell(R(i), 1);
            const val = num(R(i), 3);
            if (desc && !desc.includes("Supplies")) {
              supplies.push({description: desc, value: val});
            }
          }

          // Other Current Assets / Hay etc (rows 39-41 = index 38-40)
          const otherCurrent = [];
          for (let i = 38; i <= 41; i++) {
            const qty = cell(R(i), 0);
            const kind = cell(R(i), 1);
            const price = cell(R(i), 2);
            if (kind && !kind.includes("Other Current") && !kind.includes("Creditor")) {
              const val = qty && price ? String(parseFloat(qty||0) * parseFloat(price||0)) : num(R(i),3);
              otherCurrent.push({description: (qty ? qty + " " : "") + kind, amount: val});
            }
          }

          // Breeding Stock (rows 46-52 = index 45-51, A=num, B=kind, C=value/head)
          const breedingStock = [];
          for (let i = 45; i <= 52; i++) {
            const n = cell(R(i), 0);
            const k = cell(R(i), 1);
            const v = cell(R(i), 2);
            if (k && !k.includes("Kind") && !k.includes("Number")) {
              const total = n && v ? String(parseFloat(n||0) * parseFloat(v||0)) : "";
              breedingStock.push({number: n, kind: k, value: total});
            }
          }

          // Real Estate (from supplement rows 81-86 = index 80-85, A=desc, C=acres, J=value)
          const realEstate = [];
          for (let i = 80; i <= 86; i++) {
            const desc = cell(R(i), 0);
            const acres = cell(R(i), 2);
            const val = num(R(i), 9);
            if (desc && !desc.includes("Description") && !desc.includes("TOTAL")) {
              const vpa = acres && val && parseFloat(acres) > 0
                ? String((parseFloat(val) / parseFloat(acres)).toFixed(0)) : "";
              realEstate.push({acres: acres, reType:"Cropland", description: desc, valuePerAcre: vpa});
            }
          }

          // Other Assets (rows 63-66 = index 62-65, B=desc, D=value)
          const otherAssets = [];
          for (let i = 62; i <= 66; i++) {
            const desc = cell(R(i), 1);
            const val = num(R(i), 3);
            if (desc) otherAssets.push({description: desc, amount: val});
          }

          // Operating Notes / Liabilities (rows 12-14 = index 11-13, F=creditor, J=balance)
          const operatingNotes = [];
          for (let i = 11; i <= 14; i++) {
            const cred = cell(R(i), 5);
            const bal = num(R(i), 9);
            if (cred && !cred.includes("Operating") && !cred.includes("Unsecured")) {
              operatingNotes.push({creditor: cred, dueDate:"", pmt:"", balance: bal, security:""});
            }
          }

          // Intermediate Term Debt (rows 21 = index 20, F=creditor, G=security, H=due, I=pmt, J=principal)
          const intermediatDebt = [];
          for (let i = 20; i <= 25; i++) {
            const cred = cell(R(i), 5);
            const sec2 = cell(R(i), 6);
            const due = cell(R(i), 7);
            const pmt = num(R(i), 8);
            const prin = num(R(i), 9);
            if (cred && !cred.includes("Creditor") && !cred.includes("Intermediate")) {
              intermediatDebt.push({creditor:cred, security:sec2, dueDate:due, annualPmt:pmt, principal:prin, rate:""});
            }
          }

          // Current RE Mortgage (rows 40-42 = index 39-41, F=creditor, J=annual pmt)
          const reCurrent = [];
          for (let i = 39; i <= 42; i++) {
            const cred = cell(R(i), 5);
            const pmt = num(R(i), 9);
            if (cred && !cred.includes("Creditor") && !cred.includes("Current Portion") && !cred.includes("Independence - accrued")) {
              reCurrent.push({creditor: cred, annualPmt: pmt, rate:""});
            }
          }

          // Taxes Due (row 43 = index 42)
          const taxesDue = "";

          // RE Mortgages LT (rows 52-54 = index 51-53, F=lienholder, G=terms, J=principal)
          const reMortgages = [];
          for (let i = 51; i <= 56; i++) {
            const lh = cell(R(i), 5);
            const terms = cell(R(i), 6);
            const prin = num(R(i), 9);
            if (lh && !lh.includes("Lien") && !lh.includes("Real Estate") && lh.trim()) {
              reMortgages.push({lienHolder: lh, terms: terms, principal: prin, rate:""});
            }
          }

          // Other Liabilities (rows 56-58 = index 55-57, F=desc, J=balance)
          const otherLiabilities = [];
          for (let i = 55; i <= 58; i++) {
            const desc = cell(R(i), 5);
            const bal = num(R(i), 9);
            if (desc && !desc.includes("Other Liabilities")) {
              otherLiabilities.push({description: desc, balance: bal});
            }
          }

          // Vehicles (from supplement rows 112-121 = index 111-120)
          const vehicles = [];
          for (let i = 111; i <= 121; i++) {
            const yr = cell(R(i), 1);
            const make = cell(R(i), 2);
            const model = cell(R(i), 5);
            const item = cell(R(i), 6);
            const cond = cell(R(i), 8);
            const val = num(R(i), 9);
            const fullMake = [make, model || item].filter(Boolean).join(" ");
            if (fullMake && val) {
              vehicles.push({year: yr, make: fullMake, vin:"", condition: cond, value: val});
            }
          }

          // Machinery (from supplement rows 126-141 = index 125-140)
          const machinery = [];
          for (let i = 125; i <= 141; i++) {
            const yr = cell(R(i), 1);
            const make = cell(R(i), 2);
            const size = cell(R(i), 3);
            const model = cell(R(i), 5);
            const item = cell(R(i), 6);
            const serial = cell(R(i), 7);
            const cond = cell(R(i), 8);
            const val = num(R(i), 9);
            const fullMake = [make, model || item].filter(Boolean).join(" ");
            if (fullMake && val) {
              machinery.push({year: yr, make: fullMake, size: size||"", serial: serial||"", condition: cond||"", value: val});
            }
          }

          const fill = (arr, key) => arr.length ? arr : emptyData()[key];
          const result = {
            ...emptyData(),
            clientName, asOfDate, cashGlacier, federalPayments, taxesDue,
            receivables: fill(receivables,"receivables"),
            livestockMarket: fill(livestockMarket,"livestockMarket"),
            farmProducts: fill(farmProducts,"farmProducts"),
            cropInvestment: fill(cropInvestment,"cropInvestment"),
            supplies: fill(supplies,"supplies"),
            otherCurrent: fill(otherCurrent,"otherCurrent"),
            breedingStock: fill(breedingStock,"breedingStock"),
            realEstate: fill(realEstate,"realEstate"),
            otherAssets: fill(otherAssets,"otherAssets"),
            operatingNotes: fill(operatingNotes,"operatingNotes"),
            intermediatDebt: fill(intermediatDebt,"intermediatDebt"),
            reCurrent: fill(reCurrent,"reCurrent"),
            reMortgages: fill(reMortgages,"reMortgages"),
            otherLiabilities: fill(otherLiabilities,"otherLiabilities"),
            vehicles: fill(vehicles,"vehicles"),
            machinery: fill(machinery,"machinery"),
          };
          setImportData(result);

        } else {
          // ── Generic Section-Based Format (original template) ──────────────
          const arrays = {
            cashOther:[], receivables:[], livestockMarket:[], farmProducts:[],
            federalPayments:[],
            cropInvestment:[], supplies:[], otherCurrent:[], breedingStock:[],
            realEstate:[], reContracts:[], vehicles:[], machinery:[], otherAssets:[],
            operatingNotes:[], accountsDue:[], intermediatDebt:[], reCurrent:[],
            otherCurrentLiab:[], reMortgages:[], otherLiabilities:[]
          };
          let taxesDue = "", cashGlacier = "", clientName = "", asOfDate = importDate;
          if (!arrays.federalPayments) arrays.federalPayments = [];

          for (const row of rows) {
            if (!row || !row[0]) continue;
            const sec = String(row[0]).trim().toUpperCase();
            const f = (i) => (row[i] !== undefined && row[i] !== null) ? String(row[i]).trim() : "";
            if (sec === "CLIENT") { if (f(1)) clientName=f(1); if (f(2)) asOfDate=f(2); }
            else if (sec === "CASH_GLACIER") { cashGlacier = f(1); }
            else if (sec === "CASH_OTHER" && (f(1)||f(2))) arrays.cashOther.push({institution:f(1),amount:f(2)});
            else if (sec === "RECEIVABLES" && (f(1)||f(2))) arrays.receivables.push({description:f(1),amount:f(2)});
            else if (sec === "FEDERAL_PAYMENTS") {
              if (f(1)||f(2)) arrays.federalPayments.push({program:f(1)||"Government Payment",amount:f(2)||f(1)});
            }
            else if (sec === "LIVESTOCK_MARKET" && (f(1)||f(2)||f(3))) arrays.livestockMarket.push({number:f(1),kind:f(2),value:f(3)});
            else if (sec === "FARM_PRODUCTS" && (f(1)||f(3))) arrays.farmProducts.push({quantity:f(1),unit:f(2)||"bu",kind:f(3),pricePerUnit:f(4),share:f(5)||"100",contracted:f(6).toLowerCase()==="true"||f(6)==="1"||f(6).toLowerCase()==="yes"});
            else if (sec === "CROP_INVESTMENT" && (f(1)||f(2))) arrays.cropInvestment.push({cropType:f(1),acres:f(2),valuePerAcre:f(3)});
            else if (sec === "SUPPLIES" && (f(1)||f(2))) arrays.supplies.push({description:f(1),value:f(2)});
            else if (sec === "OTHER_CURRENT" && (f(1)||f(2))) arrays.otherCurrent.push({description:f(1),amount:f(2)});
            else if (sec === "BREEDING_STOCK" && (f(1)||f(2)||f(3))) arrays.breedingStock.push({number:f(1),kind:f(2),value:f(3)});
            else if (sec === "REAL_ESTATE" && (f(1)||f(2))) arrays.realEstate.push({acres:f(1),reType:f(2),description:f(3),valuePerAcre:f(4)});
            else if (sec === "RE_CONTRACTS" && (f(1)||f(2))) arrays.reContracts.push({description:f(1),amount:f(2)});
            else if (sec === "VEHICLES" && (f(1)||f(2))) arrays.vehicles.push({year:f(1),make:f(2),vin:f(3),condition:f(4),value:f(5)});
            else if (sec === "MACHINERY" && (f(1)||f(2))) arrays.machinery.push({year:f(1),make:f(2),size:f(3),serial:f(4),condition:f(5),value:f(6)});
            else if (sec === "OTHER_ASSETS" && (f(1)||f(2))) arrays.otherAssets.push({description:f(1),amount:f(2)});
            else if (sec === "OPERATING_NOTES" && (f(1)||f(4))) arrays.operatingNotes.push({creditor:f(1),dueDate:f(2),pmt:f(3),balance:f(4),security:f(5)});
            else if (sec === "ACCOUNTS_DUE" && (f(1)||f(2))) arrays.accountsDue.push({creditor:f(1),amount:f(2)});
            else if (sec === "INTERMEDIATE_DEBT" && (f(1)||f(5))) arrays.intermediatDebt.push({creditor:f(1),security:f(2),dueDate:f(3),annualPmt:f(4),principal:f(5),rate:f(6)});
            else if (sec === "RE_CURRENT" && (f(1)||f(2))) arrays.reCurrent.push({creditor:f(1),annualPmt:f(2),rate:f(3)});
            else if (sec === "TAXES_DUE") { taxesDue = f(1); }
            else if (sec === "OTHER_CURRENT_LIAB" && (f(1)||f(2))) arrays.otherCurrentLiab.push({description:f(1),amount:f(2)});
            else if (sec === "RE_MORTGAGES" && (f(1)||f(4))) arrays.reMortgages.push({lienHolder:f(1),terms:f(2),rate:f(3),principal:f(4)});
            else if (sec === "OTHER_LIABILITIES" && (f(1)||f(2))) arrays.otherLiabilities.push({description:f(1),balance:f(2)});
          }
          Object.keys(arrays).forEach(k => { if (!arrays[k].length) arrays[k] = emptyData()[k]; });
          const fedArr = arrays.federalPayments.length > 0 ? arrays.federalPayments : [{program:"",amount:""}];
          setImportData({ ...emptyData(), clientName, asOfDate, cashGlacier, federalPayments:fedArr, taxesDue, ...arrays });
        }
      } catch(e) {
        setImportError("Parse error: " + e.message + " — check the file format and try again.");
      }
    }

    try {
      if (ext === "csv") {
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js");
        window.Papa.parse(file, {
          complete: (r) => processRows(r.data),
          error: (e) => setImportError("CSV parse error: " + e.message)
        });
      } else if (ext === "xlsx" || ext === "xls") {
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js");
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const wb = window.XLSX.read(e.target.result, {type:"array"});
            const ws = wb.Sheets[wb.SheetNames[0]];
            const rows = window.XLSX.utils.sheet_to_json(ws, {header:1, defval:""});
            processRows(rows);
          } catch(err) {
            setImportError("Excel parse error: " + err.message);
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        setImportError("Unsupported file type. Please use .csv, .xlsx, or .xls");
      }
    } catch(err) {
      setImportError("Failed to load parser: " + err.message);
    }
  }

  function handleImportFile(file) {
    if (!file) return;
    parseImportFile(file);
  }

  function applyImport() {
    if (!importData) return;
    const d = { ...importData, asOfDate: importDate };
    setData(d);
    setStep(0);
    setScreen("wizard");
    setShowImport(false);
    setImportData(null);
  }
  const deleteSheet = async (key, e) => {
    e.stopPropagation();
    try { await storage.delete(key); await loadSavedList(); } catch {}
  };

  // ── Calculations ───────────────────────────────────────────────────────────
  const n = numVal;
  const cashTotal = n(data.cashGlacier) + data.cashOther.reduce((s,r)=>s+n(r.amount),0);
  const recTotal = data.receivables.reduce((s,r)=>s+n(r.amount),0);
  const fedPay = Array.isArray(data.federalPayments)
    ? data.federalPayments.reduce((s,r)=>s+n(r.amount),0)
    : n(data.federalPayments);
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
  const linkedEntityVal = Object.values(linkedEntityNWMap).reduce((s,v)=>s+v,0);
  const totalAssets = totalCurrentAssets + totalLTAssets + linkedEntityVal;
  const opNotesTotal = data.operatingNotes.reduce((s,r)=>s+n(r.balance),0);
  const acctsDueTotal = data.accountsDue.reduce((s,r)=>s+n(r.amount),0);
  const intermedCurrentPortion = data.intermediatDebt.reduce((s,r)=>s+n(r.annualPmt),0);
  const intermedLTPortion = data.intermediatDebt.reduce((s,r)=>s+Math.max(0,n(r.principal)-n(r.annualPmt)),0);
  const intermedTotal = intermedCurrentPortion; // alias used in summary display
  const reCurrentTotal = data.reCurrent.reduce((s,r)=>s+n(r.annualPmt),0);
  const taxesDueVal = n(data.taxesDue);
  const otherCLTotal = data.otherCurrentLiab.reduce((s,r)=>s+n(r.amount),0);
  const totalCurrentLiab = opNotesTotal+acctsDueTotal+intermedCurrentPortion+reCurrentTotal+taxesDueVal+otherCLTotal;
  const reMortTotal = data.reMortgages.reduce((s,r)=>s+n(r.principal),0);
  const otherLiabTotal = data.otherLiabilities.reduce((s,r)=>s+n(r.balance),0);
  const totalLiabilities = totalCurrentLiab + intermedLTPortion + reMortTotal + otherLiabTotal;
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
  const debtServiceTermsPersonal = debtServiceTerms.filter(r=>!r.corpPaid);
  const debtServiceTermsCorp = debtServiceTerms.filter(r=>r.corpPaid);
  const debtServiceREPersonal = debtServiceRE.filter(r=>!r.corpPaid);
  const debtServiceRECorp = debtServiceRE.filter(r=>r.corpPaid);
  const budgetTermDebtTotal = debtServiceTermsPersonal.reduce((s,r)=>s+n(r.annualPmt),0);
  const budgetREDebtTotal = debtServiceREPersonal.reduce((s,r)=>s+n(r.annualPmt),0);
  const budgetTotalDebtService = budgetTermDebtTotal + budgetREDebtTotal;
  const budgetCorpDebtTotal = [...debtServiceTermsCorp,...debtServiceRECorp].reduce((s,r)=>s+n(r.annualPmt),0);
  const budgetPersonalDebtTotal = budgetTotalDebtService;
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
    const fedP = Array.isArray(d.federalPayments)
      ? (d.federalPayments||[]).reduce((s,r)=>s+m(r.amount),0)
      : m(d.federalPayments||"");
    const tc = cash+rec+fedP+ls+fp+ci+sup+oc;
    const bs = (d.breedingStock||[]).reduce((s,r)=>s+m(r.value),0);
    const re = (d.realEstate||[]).reduce((s,r)=>s+m(r.acres)*m(r.valuePerAcre),0);
    const veh = (d.vehicles||[]).reduce((s,r)=>s+m(r.value),0);
    const mach = (d.machinery||[]).reduce((s,r)=>s+m(r.value),0);
    const oa = (d.otherAssets||[]).reduce((s,r)=>s+m(r.amount),0);
    const tlt = bs+re+(d.reContracts||[]).reduce((s,r)=>s+m(r.amount),0)+veh+mach+oa;
    const ta = tc+tlt;
    const on = (d.operatingNotes||[]).reduce((s,r)=>s+m(r.balance),0);
    const ad = (d.accountsDue||[]).reduce((s,r)=>s+m(r.amount),0);
    const id = (d.intermediatDebt||[]).reduce((s,r)=>s+m(r.annualPmt),0);
    const idLT = (d.intermediatDebt||[]).reduce((s,r)=>s+Math.max(0,m(r.principal)-m(r.annualPmt)),0);
    const rc = (d.reCurrent||[]).reduce((s,r)=>s+m(r.annualPmt),0);
    const ocl = (d.otherCurrentLiab||[]).reduce((s,r)=>s+m(r.amount),0);
    const tcl = on+ad+id+rc+m(d.taxesDue)+ocl;
    const rm = (d.reMortgages||[]).reduce((s,r)=>s+m(r.principal),0);
    const ol = (d.otherLiabilities||[]).reduce((s,r)=>s+m(r.balance),0);
    const tl = tcl+idLT+rm+ol;
    return {
      "Cash & Bank":cash, "Receivables":rec, "Federal Payments":m(d.federalPayments),
      "Market Livestock":ls, "Farm Products":fp, "Crop Investment":ci,
      "Supplies":sup, "Other Current":oc, "Total Current Assets":tc,
      "Breeding Stock":bs, "Real Estate":re,
      "RE Contracts Rec.":(d.reContracts||[]).reduce((s,r)=>s+m(r.amount),0),
      "Titled Vehicles":veh, "Machinery & Equip.":mach, "Other Assets":oa,
      "Total LT Assets":tlt, "TOTAL ASSETS":ta,
      "Operating Notes":on, "Accounts Due":ad, "Intermediate Debt (current)":id,
      "RE Mortgage (current)":rc, "Income Taxes Due":m(d.taxesDue),
      "Other Current Liab":ocl, "Total Current Liab":tcl,
      "Intermediate Debt (LT)":idLT,
      "RE Mortgages (LT)":rm, "Other Liabilities":ol,
      "TOTAL LIABILITIES":tl, "WORKING CAPITAL":tc-tcl, "NET WORTH":ta-tl
    };
  }

  // Load linked entity net worths using sheetTotals (must be after sheetTotals is defined)
  useEffect(() => {
    async function fetchAllLinkedNW() {
      const entities = data.linkedEntities || [];
      if (!entities.length) { setLinkedEntityNWMap({}); return; }
      const newMap = {};
      for (const name of entities) {
        try {
          const prefix = STORAGE_PREFIX + name.replace(/\s+/g,"_") + ":";
          const result = await storage.list(prefix);
          if (result && result.keys && result.keys.length > 0) {
            const sorted = result.keys.sort((a,b) => b.localeCompare(a));
            const item = await storage.get(sorted[0]);
            if (item) {
              const p = JSON.parse(item.value);
              const totals = sheetTotals(p);
              newMap[name] = totals["NET WORTH"] || 0;
            }
          }
        } catch {}
      }
      setLinkedEntityNWMap(newMap);
    }
    fetchAllLinkedNW();
  }, [JSON.stringify(data.linkedEntities), savedSheets.length]);


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


  // ── Move sheet to a different folder ────────────────────────────────────────
  const moveSheet = async (key, newFolderPath) => {
    try {
      const item = await storage.get(key);
      if (!item) return;
      const p = JSON.parse(item.value);
      p.folderPath = newFolderPath;
      p._savedAt = new Date().toISOString();
      await storage.set(key, JSON.stringify(p));
      // If this is the currently open sheet, update data too
      if (data.clientName === p.clientName && data.asOfDate === p.asOfDate) {
        set("folderPath", newFolderPath);
      }
      await loadSavedList();
      setShowMoveModal(null);
    } catch {}
  };

  // ── Build folder tree from saved sheets ─────────────────────────────────────
  function buildFolderTree(sheets) {
    const tree = {};
    sheets.forEach(s => {
      const path = s.folderPath || [];
      let node = tree;
      // Build nested structure
      path.forEach(segment => {
        if (!node[segment]) node[segment] = { _children: {}, _sheets: [] };
        node = node[segment]._children;
      });
      // Find the leaf node for this path
      let leaf = tree;
      path.forEach(seg => { leaf = leaf[seg]._children; });
      // Add sheet to parent (one level up from _children)
      let parent = tree;
      for (let i = 0; i < path.length - 1; i++) parent = parent[path[i]]._children;
      if (path.length === 0) {
        if (!tree._unfiledSheets) tree._unfiledSheets = [];
        tree._unfiledSheets.push(s);
      } else {
        const lastSeg = path[path.length - 1];
        let parentNode = tree;
        for (let i = 0; i < path.length - 1; i++) parentNode = parentNode[path[i]]._children;
        if (!parentNode[lastSeg]) parentNode[lastSeg] = { _children: {}, _sheets: [] };
        parentNode[lastSeg]._sheets.push(s);
      }
    });
    return tree;
  }

  // ── Collect all folder paths in use ─────────────────────────────────────────
  function getAllFolderPaths(sheets) {
    const pathSet = new Set();
    pathSet.add("");
    sheets.forEach(s => {
      const path = s.folderPath || [];
      for (let i = 1; i <= path.length; i++) {
        pathSet.add(JSON.stringify(path.slice(0, i)));
      }
    });
    // Also include user-created standalone folders
    userFolders.forEach(path => {
      for (let i = 1; i <= path.length; i++) {
        pathSet.add(JSON.stringify(path.slice(0, i)));
      }
    });
    return [...pathSet].map(p => p ? JSON.parse(p) : []);
  }


  const renameFolder = async (oldPath, newName) => {
    if (!newName.trim() || newName.trim() === oldPath[oldPath.length-1]) {
      setEditingFolder(null);
      return;
    }
    const newPath = [...oldPath.slice(0, -1), newName.trim()];
    const oldKey = JSON.stringify(oldPath);
    const newKey = JSON.stringify(newPath);

    // Update userFolders - rename this folder and all children that start with oldPath
    const updatedFolders = userFolders.map(f => {
      const fKey = JSON.stringify(f.slice(0, oldPath.length));
      if (fKey === oldKey) return [...newPath, ...f.slice(oldPath.length)];
      return f;
    });
    setUserFolders(updatedFolders);
    try { localStorage.setItem("fbmt_userFolders", JSON.stringify(updatedFolders)); } catch {}

    // Update all saved sheets that have this folder in their path
    try {
      const result = await storage.list(STORAGE_PREFIX);
      if (result && result.keys) {
        for (const key of result.keys) {
          try {
            const item = await storage.get(key);
            if (!item) continue;
            const p = JSON.parse(item.value);
            const fp = p.folderPath || [];
            if (fp.length >= oldPath.length &&
                JSON.stringify(fp.slice(0, oldPath.length)) === oldKey) {
              p.folderPath = [...newPath, ...fp.slice(oldPath.length)];
              await storage.set(key, JSON.stringify(p));
            }
          } catch {}
        }
      }
    } catch {}

    // If currently open sheet is in this folder, update it
    if (data.folderPath && JSON.stringify(data.folderPath.slice(0, oldPath.length)) === oldKey) {
      set("folderPath", [...newPath, ...data.folderPath.slice(oldPath.length)]);
    }

    await loadSavedList();
    setEditingFolder(null);
  };


  // Check for pending customer inspection responses for all clients
  const checkAllPendingResponses = async () => {
    try {
      const resp = await fetch(
        SUPABASE_URL + '/rest/v1/inspection_shares?responded_at=not.is.null&select=client_name,share_id,responded_at,response',
        { headers: supaHeaders() }
      );
      if (!resp.ok) return;
      const rows = await resp.json();
      const map = {};
      rows.forEach(r => { map[r.client_name] = r; });
      setPendingResponses(map);
    } catch {}
  };


  // Auto-check for customer inspection response when sheet has a shareId
  useEffect(() => {
    async function checkForResponse() {
      if (!data.inspShareId) { setHasCustomerResponse(false); return; }
      try {
        const resp = await fetch(
          SUPABASE_URL + '/rest/v1/inspection_shares?share_id=eq.' + data.inspShareId + '&select=responded_at',
          { headers: supaHeaders() }
        );
        const rows = await resp.json();
        setHasCustomerResponse(!!(rows[0]?.responded_at));
      } catch { setHasCustomerResponse(false); }
    }
    checkForResponse();
  }, [data.inspShareId]);

  // ── Corp Personal Debt Loader ──────────────────────────────────────────────
  const loadCorpPersonalDebt = async () => {
    if (!data.clientName) return;
    try {
      const result = await storage.list(STORAGE_PREFIX);
      if (!result || !result.keys) return;
      const corpDebts = [];
      for (const key of result.keys) {
        try {
          const item = await storage.get(key);
          if (!item) continue;
          const p = JSON.parse(item.value);
          // Only sheets linked to this client
          const linkedArr = Array.isArray(p.linkedEntities) ? p.linkedEntities : (p.linkedEntity ? [p.linkedEntity] : []);
          if (!linkedArr.some(e => e.trim().toLowerCase() === data.clientName.trim().toLowerCase())) continue;
          const ownerName = p.clientName || "Unknown";
          // Corp-paid term debt
          (p.intermediatDebt || []).forEach(r => {
            if (r.corpPaid && r.creditor && numVal(r.annualPmt) > 0) {
              corpDebts.push({ creditor: r.creditor, security: r.security || "", annualPmt: r.annualPmt, owner: ownerName, type: "term" });
            }
          });
          // Corp-paid RE current portion
          (p.reCurrent || []).forEach(r => {
            if (r.corpPaid && r.creditor && numVal(r.annualPmt) > 0) {
              corpDebts.push({ creditor: r.creditor, security: "", annualPmt: r.annualPmt, owner: ownerName, type: "re" });
            }
          });
        } catch {}
      }
      setCorpPersonalDebt(corpDebts);
    } catch { setCorpPersonalDebt([]); }
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
${(Array.isArray(data.federalPayments)?data.federalPayments:[{program:"Federal Payments",amount:data.federalPayments}]).filter(r=>r.amount&&numVal(r.amount)>0).map(r=>`<div class="row"><span>${r.program||"Federal Payments"}</span><span>${pFmt(r.amount)}</span></div>`).join("")}
<div class="sec">Farm Products:</div>
<div class="trow th"><span class="c1">Qty/Unit</span><span class="c2">Kind</span><span class="c3">Price/Unit</span><span class="c5">Total Value</span></div>
${blank(data.farmProducts.filter(r=>r.kind),3).map(r=>{const sh=numVal(r.share||"100");const val=numVal(r.quantity)*numVal(r.pricePerUnit)*(sh/100);const tags=[];if(sh<100)tags.push(sh+"% share");if(r.contracted)tags.push("contracted");return`<div class="trow"><span class="c1">${r.quantity?r.quantity+" "+r.unit:""}</span><span class="c2">${r.kind||""}${tags.length?" ("+tags.join(", ")+")":""}</span><span class="c3">${r.pricePerUnit?"$"+r.pricePerUnit+"/"+r.unit:""}</span><span class="c5">${pFmt(val)}</span></div>`;}).join("")}
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

  const handlePrintBudget = () => {
    const corpPDTotal = corpPersonalDebt.filter(r=>r.annualPmt&&numVal(r.annualPmt)>0).reduce((s,r)=>s+numVal(r.annualPmt),0);
    const totalExp = budgetTotalExpenses + corpPDTotal;
    const netInc = budgetTotalIncome - totalExp;
    const W = window.open("","_blank","width=850,height=1100");
    if (!W) return;
    const cropRows = data.budgetCrops.filter(r=>r.crop||r.acres).map(r=>{
      const rv = numVal(r.acres)*numVal(r.yieldPerAcre)*numVal(r.price)*(numVal(r.share||"100")/100);
      return "<tr><td>"+r.crop+"</td><td class='r'>"+r.acres+"</td><td class='r'>"+r.yieldPerAcre+" "+r.unit+"</td><td class='r'>$"+numVal(r.price).toFixed(2)+"</td><td class='r'>"+r.share+"%"+(r.contracted?" C":"")+"</td><td class='r'>$"+Math.round(rv).toLocaleString()+"</td></tr>";
    }).join("");
    const lsRows = data.budgetLivestock.filter(r=>r.type||r.head).map(r=>{
      const rv = numVal(r.head)*numVal(r.lbs)*numVal(r.price);
      return "<tr><td>"+r.type+"</td><td class='r'>"+r.head+"</td><td class='r'>"+r.lbs+" lbs</td><td class='r'>$"+numVal(r.price).toFixed(2)+"/lb</td><td class='r'></td><td class='r'>$"+Math.round(rv).toLocaleString()+"</td></tr>";
    }).join("");
    const miscRows = data.budgetMisc.filter(r=>r.description||r.amount).map(r=>
      "<tr><td colspan='5'>"+r.description+"</td><td class='r'>$"+Math.round(numVal(r.amount)).toLocaleString()+"</td></tr>"
    ).join("");
    const expRows = data.budgetExpenses.filter(r=>r.description||r.amount).map(r=>
      "<tr><td colspan='5'>"+r.description+"</td><td class='r'>$"+Math.round(numVal(r.amount)).toLocaleString()+"</td></tr>"
    ).join("");
    const debtPersonalRows = [...debtServiceTermsPersonal,...debtServiceREPersonal].map(r=>
      "<tr><td colspan='5'>"+r.creditor+(r.security?" ("+r.security+")":"")+"</td><td class='r'>$"+Math.round(numVal(r.annualPmt)).toLocaleString()+"</td></tr>"
    ).join("");
    const debtCorpRows = [...debtServiceTermsCorp,...debtServiceRECorp].map(r=>
      "<tr><td colspan='5'>"+r.creditor+(r.security?" ("+r.security+")":"")+" <em style='color:#2d5a8e'>(corp pays)</em></td><td class='r' style='color:#2d5a8e'>$"+Math.round(numVal(r.annualPmt)).toLocaleString()+"</td></tr>"
    ).join("");
    const personalDebtRows = corpPersonalDebt.filter(r=>r.annualPmt&&numVal(r.annualPmt)>0).map(r=>
      "<tr><td colspan='5'>"+r.creditor+" <em style='color:#7a4f00'>("+r.owner+")</em></td><td class='r' style='color:#7a4f00'>$"+Math.round(numVal(r.annualPmt)).toLocaleString()+"</td></tr>"
    ).join("");
    const html = "<!DOCTYPE html><html><head><title>Budget - "+data.clientName+"</title><style>"
      +"body{font-family:Arial,sans-serif;font-size:8pt;margin:.45in .4in;color:#000;}"
      +"h1{font-size:13pt;font-weight:700;text-decoration:underline;text-align:center;margin-bottom:2pt;}"
      +"h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:6pt;}"
      +".hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8pt;}"
      +".logo{border:2pt solid #6B0E1E;padding:3pt 6pt;font-weight:900;color:#6B0E1E;font-size:8pt;text-align:center;}"
      +".name{border-bottom:1pt solid #000;padding-bottom:3pt;margin-bottom:6pt;font-weight:700;font-size:9pt;}"
      +".cols{display:flex;gap:10pt;}"
      +".col{flex:1;}"
      +".col-head{background:#000;color:#fff;font-weight:700;font-size:8pt;padding:2pt 5pt;margin-bottom:2pt;}"
      +".sec{font-style:italic;font-size:7pt;color:#555;margin:4pt 0 1pt;}"
      +"table{width:100%;border-collapse:collapse;font-size:7.5pt;margin-bottom:3pt;}"
      +"th{background:#333;color:#fff;padding:2pt 4pt;text-align:left;font-size:7pt;}"
      +"th.r{text-align:right;}td{padding:2pt 4pt;border-bottom:.5pt dotted #ddd;}"
      +"td.r{text-align:right;font-weight:600;}"
      +".subtot{display:flex;justify-content:space-between;border-top:1pt solid #000;padding-top:2pt;margin:2pt 0;font-weight:700;font-size:8pt;}"
      +".tot{display:flex;justify-content:space-between;background:#000;color:#fff;padding:2pt 5pt;font-weight:700;font-size:9pt;margin:3pt 0;}"
      +".net{display:flex;justify-content:space-between;padding:4pt 5pt;font-weight:700;font-size:10pt;margin-top:6pt;border:2pt solid #000;}"
      +"</style></head><body>"
      +"<div class='hdr'><div class='logo'>FIRST<br/>BANK<br/>of Montana</div>"
      +"<div><h1>Annual Agri-Business Budget</h1><h2>First Bank of Montana</h2></div>"
      +"<div style='text-align:right;font-size:8pt'><strong>Date:</strong> "+data.asOfDate+"</div></div>"
      +"<div class='name'>Name: "+data.clientName+"</div>"
      +"<div class='cols'>"
      // INCOME column
      +"<div class='col'>"
      +"<div class='col-head'>INCOME</div>"
      +(cropRows?"<div class='sec'>Crop Income</div><table><tr><th>Crop</th><th class='r'>Acres</th><th class='r'>Yield</th><th class='r'>Price</th><th class='r'>Share</th><th class='r'>Value</th></tr>"+cropRows+"</table><div class='subtot'><span>Crop Income</span><span>$"+Math.round(budgetCropTotal).toLocaleString()+"</span></div>":"")
      +(lsRows?"<div class='sec'>Livestock Income</div><table><tr><th>Type</th><th class='r'>Head</th><th class='r'>Wt</th><th class='r'>Price</th><th class='r'></th><th class='r'>Value</th></tr>"+lsRows+"</table><div class='subtot'><span>Livestock Income</span><span>$"+Math.round(budgetLivestockTotal).toLocaleString()+"</span></div>":"")
      +(miscRows?"<div class='sec'>Miscellaneous Income</div><table>"+miscRows+"</table><div class='subtot'><span>Misc Income</span><span>$"+Math.round(budgetMiscTotal).toLocaleString()+"</span></div>":"")
      +"<div class='tot'><span>TOTAL INCOME</span><span>$"+Math.round(budgetTotalIncome).toLocaleString()+"</span></div>"
      +"</div>"
      // EXPENSES column
      +"<div class='col'>"
      +"<div class='col-head'>EXPENSES</div>"
      +(expRows?"<div class='sec'>Operating Expenses</div><table>"+expRows+"</table><div class='subtot'><span>Total Operating</span><span>$"+Math.round(budgetOperatingExpenses).toLocaleString()+"</span></div>":"")
      +(debtPersonalRows?"<div class='sec'>Debt Service — Personal</div><table>"+debtPersonalRows+"</table>":"")
      +(debtCorpRows?"<div class='sec'>Debt Service — Corp Paid</div><table>"+debtCorpRows+"</table>":"")
      +((debtPersonalRows||debtCorpRows)?"<div class='subtot'><span>Total Own Debt Service</span><span>$"+Math.round(budgetTotalDebtService+budgetCorpDebtTotal).toLocaleString()+"</span></div>":"")
      +(personalDebtRows?"<div class='sec' style='color:#7a4f00'>Personal Debt Paid by This Entity</div><table>"+personalDebtRows+"</table><div class='subtot' style='color:#7a4f00'><span>Personal Debt Subtotal</span><span>$"+Math.round(corpPDTotal).toLocaleString()+"</span></div>":"")
      +"<div class='tot'><span>TOTAL EXPENSES</span><span>$"+Math.round(totalExp).toLocaleString()+"</span></div>"
      +"<div class='net' style='"+(netInc>=0?"background:#e8f5ea;":"background:#fce8e8;")+"'>"
      +"<span>"+(netInc>=0?"MARGIN (Net Income)":"MARGIN (Net Loss)")+"</span>"
      +"<span>$"+Math.round(Math.abs(netInc)).toLocaleString()+"</span></div>"
      +"</div>"
      +"</div>"
      +"</body></html>";
    W.document.write(html);
    W.document.close();
    W.focus();
    setTimeout(()=>W.print(), 400);
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
          {(Array.isArray(data.federalPayments) ? data.federalPayments : [{program:"",amount:""}]).map((r,i) => (
            <div key={i} className="row-entry" data-rowkey={"federalPayments-"+i}>
              <span className="row-num">{i+1}</span>
              <TxtInp label="Program" value={r.program}
                onChange={v=>setArr("federalPayments",i,"program",v)}
                placeholder="e.g., FSA ARC-CO, CRP, CFAP, PLC" />
              <Inp label="Amount" prefix="$" value={r.amount}
                onChange={v=>setArr("federalPayments",i,"amount",v)} />
              <button className="remove-btn"
                onClick={()=>removeRow("federalPayments",i)}>x</button>
            </div>
          ))}
          <button className="add-btn"
            onClick={()=>addRow("federalPayments",{program:"",amount:""})}>
            + Add Payment
          </button>
          <div className="subtotal-row total">
            <span>Total Federal Payments</span>
            <strong>{fmt(fedPay)}</strong>
          </div>
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
            <span className="fp-col-label" style={{width:85,textAlign:"center"}}>Contracted</span>
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
                <div style={{width:85,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                  <input type="checkbox" id={"fp-con-"+i} checked={!!r.contracted}
                    onChange={e=>setArr("farmProducts",i,"contracted",e.target.checked)}
                    style={{width:16,height:16,accentColor:"#6B0E1E",cursor:"pointer"}} />
                  <label htmlFor={"fp-con-"+i} style={{fontSize:".75rem",color:"#555",cursor:"pointer"}}>
                    {r.contracted ? "Yes" : ""}
                  </label>
                </div>
                <CalcRow value={rv} style={{width:115}} />
                <button className="remove-btn" onClick={()=>removeRow("farmProducts",i)}>x</button>
              </div>
            );
          })}
          <button className="add-btn" onClick={()=>addRow("farmProducts",{quantity:"",kind:"",pricePerUnit:"",unit:"bu",share:"100",contracted:false})}>+ Add Farm Product</button>
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
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,minWidth:70}}>
                <span style={{fontSize:".68rem",textTransform:"uppercase",letterSpacing:".07em",color:"#555",fontWeight:600}}>Corp Pays</span>
                <input type="checkbox" checked={!!r.corpPaid}
                  onChange={e=>setArr("intermediatDebt",i,"corpPaid",e.target.checked)}
                  style={{width:16,height:16,accentColor:"#6B0E1E",cursor:"pointer"}} />
              </div>
              <button className="remove-btn" onClick={()=>removeRow("intermediatDebt",i)}>x</button>
            </div>
          ))}
          <button className="add-btn" onClick={()=>addRow("intermediatDebt",{creditor:"",security:"",dueDate:"",annualPmt:"",principal:"",rate:"",corpPaid:false})}>+ Add Loan</button>
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
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,minWidth:70}}>
                <span style={{fontSize:".68rem",textTransform:"uppercase",letterSpacing:".07em",color:"#555",fontWeight:600}}>Corp Pays</span>
                <input type="checkbox" checked={!!r.corpPaid}
                  onChange={e=>setArr("reCurrent",i,"corpPaid",e.target.checked)}
                  style={{width:16,height:16,accentColor:"#6B0E1E",cursor:"pointer"}} />
              </div>
              <button className="remove-btn" onClick={()=>removeRow("reCurrent",i)}>x</button>
            </div>
          ))}
          <button className="add-btn" onClick={()=>addRow("reCurrent",{creditor:"",annualPmt:"",rate:"",corpPaid:false})}>+ Add Mortgage</button>
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
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,minWidth:70}}>
                <span style={{fontSize:".68rem",textTransform:"uppercase",letterSpacing:".07em",color:"#555",fontWeight:600}}>Corp Pays</span>
                <input type="checkbox" checked={!!r.corpPaid}
                  onChange={e=>setArr("reMortgages",i,"corpPaid",e.target.checked)}
                  style={{width:16,height:16,accentColor:"#6B0E1E",cursor:"pointer"}} />
              </div>
              <button className="remove-btn" onClick={()=>removeRow("reMortgages",i)}>x</button>
            </div>
          ))}
          <button className="add-btn" onClick={()=>addRow("reMortgages",{lienHolder:"",terms:"",principal:"",rate:"",corpPaid:false})}>+ Add Mortgage</button>
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
                {fedPay > 0 && (Array.isArray(data.federalPayments) && data.federalPayments.filter(r=>n(r.amount)>0).length > 1
  ? data.federalPayments.filter(r=>n(r.amount)>0).map((r,i) => (
      <div key={i} className="ss-row"><span>{r.program||"Federal Payment"}</span><span>{fmt(r.amount)}</span></div>
    ))
  : <div className="ss-row"><span>Federal Payments</span><span>{fmt(fedPay)}</span></div>
)}
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
                {Object.entries(linkedEntityNWMap).map(([name, nw]) => (
                  <div key={name} className="ss-row" style={{color:"#2d5a8e",fontStyle:"italic"}}>
                    <span>Investment in {name}</span>
                    <span>{fmt(nw)}</span>
                  </div>
                ))}
                <div className="ss-subtotal"><span>Total Long-Term Assets</span><span>{fmt(totalLTAssets + linkedEntityVal)}</span></div>
              </div>
              <div className="ss-total green-total"><span>TOTAL ASSETS</span><span>{fmt(totalAssets)}</span></div>
            </div>
            <div>
              <h3 className="col-head liab-head">LIABILITIES</h3>
              <div className="summary-section">
                <div className="ss-label">Current Liabilities</div>
                {opNotesTotal > 0 && <div className="ss-row"><span>Operating Notes</span><span>{fmt(opNotesTotal)}</span></div>}
                {acctsDueTotal > 0 && <div className="ss-row"><span>Accounts Due</span><span>{fmt(acctsDueTotal)}</span></div>}
                {intermedCurrentPortion > 0 && <div className="ss-row"><span>Intermediate Debt (current portion)</span><span>{fmt(intermedCurrentPortion)}</span></div>}
                {reCurrentTotal > 0 && <div className="ss-row"><span>RE Mortgage Current</span><span>{fmt(reCurrentTotal)}</span></div>}
                {taxesDueVal > 0 && <div className="ss-row"><span>Income Taxes Due</span><span>{fmt(taxesDueVal)}</span></div>}
                <div className="ss-subtotal"><span>Total Current Liabilities</span><span>{fmt(totalCurrentLiab)}</span></div>
              </div>
              <div className="summary-section">
                <div className="ss-label">Long-Term Liabilities</div>
                {intermedLTPortion > 0 && <div className="ss-row"><span>Intermediate Debt (LT portion)</span><span>{fmt(intermedLTPortion)}</span></div>}
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
          {/* ── Entity Link Section ── */}
          <div style={{background:"#f0f6ff",border:"1px solid #c0d8f0",borderRadius:10,padding:16,marginTop:8}}>
            <div style={{fontWeight:700,fontSize:".88rem",color:"#2d5a8e",marginBottom:10}}>
              Linked Business Entities
              <span style={{fontWeight:400,fontSize:".78rem",color:"#888",marginLeft:8}}>
                Their net worth appears as an investment asset on this statement
              </span>
            </div>

            {/* Currently linked entities */}
            {(data.linkedEntities||[]).length > 0 && (
              <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:12}}>
                {(data.linkedEntities||[]).map((name, i) => (
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10,background:"white",border:"1px solid #c0d8f0",borderRadius:8,padding:"8px 12px"}}>
                    <span style={{fontSize:"1rem"}}>🏢</span>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:".88rem",color:"#1a1a1a"}}>{name}</div>
                      {linkedEntityNWMap[name] !== undefined && (
                        <div style={{fontSize:".78rem",color:"#2d5a8e"}}>
                          Net Worth: {fmt(linkedEntityNWMap[name])}
                          {" — added as Investment in " + name}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={()=>set("linkedEntities",(data.linkedEntities||[]).filter((_,j)=>j!==i))}
                      style={{background:"none",border:"1px solid #f0c0c0",borderRadius:5,padding:"3px 8px",fontSize:".75rem",cursor:"pointer",color:"#c44",fontFamily:"inherit"}}>
                      Remove
                    </button>
                  </div>
                ))}
                <div style={{display:"flex",justifyContent:"flex-end",fontSize:".82rem",fontWeight:700,color:"#2d5a8e",padding:"4px 6px"}}>
                  Total Investment Value: {fmt(linkedEntityVal)}
                </div>
              </div>
            )}

            {/* Add entity dropdown */}
            {availableEntities.length > 0 ? (
              <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                <select
                  defaultValue=""
                  onChange={e=>{
                    const name = e.target.value;
                    if (!name) return;
                    if (!(data.linkedEntities||[]).includes(name)) {
                      set("linkedEntities",[...(data.linkedEntities||[]),name]);
                    }
                    e.target.value = "";
                  }}
                  style={{border:"1.5px solid #c0d8f0",borderRadius:7,padding:"7px 12px",fontSize:".88rem",fontFamily:"inherit",background:"white",color:"#1a1a1a",cursor:"pointer"}}>
                  <option value="">+ Add a linked entity...</option>
                  {availableEntities.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
                <span style={{fontSize:".75rem",color:"#aaa"}}>
                  Select from saved clients
                </span>
              </div>
            ) : (data.linkedEntities||[]).length === 0 ? (
              <div style={{fontSize:".78rem",color:"#888"}}>
                Save other balance sheets first, then link them here to include their net worth on this statement.
              </div>
            ) : (
              <div style={{fontSize:".78rem",color:"#aaa",fontStyle:"italic"}}>
                All available entities are already linked.
              </div>
            )}
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
          <div style={{display:"flex",gap:12,marginBottom:36,flexWrap:"wrap"}}>
            <button className="home-new-btn" style={{margin:0}} onClick={startNew}>
              + New Balance Sheet
            </button>
            <button className="home-new-btn" style={{margin:0,background:"#2d5a8e"}}
              onClick={()=>{setImportData(null);setImportError("");setShowImport(true);}}>
              Import from CSV / Excel
            </button>
          </div>

          {/* ── Import Modal ── */}
          {showImport && (
            <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,.55)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
              <div style={{background:"white",borderRadius:14,padding:32,maxWidth:600,width:"100%",maxHeight:"90vh",overflowY:"auto",boxShadow:"0 10px 50px rgba(0,0,0,.25)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                  <div style={{fontSize:"1.15rem",fontWeight:700,color:"#1a1a1a"}}>Import Balance Sheet Data</div>
                  <button onClick={()=>setShowImport(false)}
                    style={{background:"none",border:"none",fontSize:"1.4rem",cursor:"pointer",color:"#888",lineHeight:1}}>x</button>
                </div>

                <div style={{background:"#f0f6ff",border:"1px solid #c0d8f0",borderRadius:8,padding:14,marginBottom:20,fontSize:".85rem",color:"#2d5a8e"}}>
                  <strong>Supported formats:</strong>
                  <ul style={{margin:"6px 0 0 16px",lineHeight:1.8}}>
                    <li><strong>FBMT Excel format</strong> — the existing First Bank of Montana balance sheet Excel file (.xlsx). Just drag it in as-is.</li>
                    <li><strong>Import template</strong> — download the template below, fill it in, drag it back.</li>
                  </ul>
                </div>

                <button onClick={downloadTemplate}
                  style={{display:"flex",alignItems:"center",gap:8,background:"#2d5a8e",color:"white",border:"none",borderRadius:8,padding:"10px 20px",fontSize:".9rem",fontWeight:600,cursor:"pointer",marginBottom:20,fontFamily:"inherit"}}>
                  Download Import Template (.xlsx)
                </button>

                {/* Drag and Drop Zone */}
                <div
                  onDragOver={e=>{e.preventDefault();setImportDragging(true);}}
                  onDragLeave={()=>setImportDragging(false)}
                  onDrop={e=>{e.preventDefault();setImportDragging(false);const f=e.dataTransfer.files[0];if(f)handleImportFile(f);}}
                  style={{
                    border:"2.5px dashed " + (importDragging ? "#2d5a8e" : "#ccc"),
                    borderRadius:10,padding:"28px 20px",textAlign:"center",
                    background:importDragging ? "#f0f6ff" : "#fafafa",
                    transition:"all .15s",marginBottom:16
                  }}>
                  <div style={{fontSize:"2rem",marginBottom:8}}>📂</div>
                  <div style={{fontWeight:600,color:"#333",marginBottom:12}}>
                    {importDragging ? "Drop to import" : "Drag and drop your file here"}
                  </div>
                  <label style={{
                    display:"inline-block",background:"#2d5a8e",color:"white",
                    borderRadius:7,padding:"9px 20px",fontSize:".88rem",fontWeight:600,
                    cursor:"pointer",fontFamily:"inherit"
                  }}>
                    Browse for File
                    <input type="file" accept=".csv,.xlsx,.xls"
                      style={{display:"none"}}
                      onChange={e=>{if(e.target.files[0])handleImportFile(e.target.files[0]);}} />
                  </label>
                  <div style={{fontSize:".78rem",color:"#aaa",marginTop:10}}>CSV, XLSX, or XLS</div>
                </div>

                {importError && (
                  <div style={{background:"#fce8e8",border:"1px solid #f0c0c0",borderRadius:8,padding:12,fontSize:".85rem",color:"#7a1a1a",marginBottom:16}}>
                    {importError}
                  </div>
                )}

                {importData && (
                  <div>
                    <div style={{background:"#e8f5ea",border:"1px solid #b8dfc0",borderRadius:8,padding:14,marginBottom:16}}>
                      <div style={{fontWeight:700,color:"#1a5c25",marginBottom:8}}>File parsed successfully</div>
                      <div style={{fontSize:".85rem",color:"#2a4a2a",display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
                        <span>Client: <strong>{importData.clientName || "(none)"}</strong></span>
                        <span>Cash (Glacier): <strong>{importData.cashGlacier ? "$"+Number(importData.cashGlacier).toLocaleString() : "$0"}</strong></span>
                        <span>Farm Products: <strong>{importData.farmProducts.filter(r=>r.kind).length} items</strong></span>
                        <span>Real Estate: <strong>{importData.realEstate.filter(r=>r.acres).length} tracts</strong></span>
                        <span>Machinery: <strong>{importData.machinery.filter(r=>r.make).length} items</strong></span>
                        <span>Vehicles: <strong>{importData.vehicles.filter(r=>r.make).length} items</strong></span>
                        <span>Term Debt: <strong>{importData.intermediatDebt.filter(r=>r.creditor).length} loans</strong></span>
                        <span>RE Mortgages: <strong>{importData.reMortgages.filter(r=>r.lienHolder).length} mortgages</strong></span>
                      </div>
                    </div>

                    <div style={{marginBottom:20}}>
                      <label style={{fontSize:".8rem",fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",color:"#555",display:"block",marginBottom:6}}>
                        As of Date
                      </label>
                      <input type="date" value={importDate}
                        onChange={e=>setImportDate(e.target.value)}
                        style={{border:"1.5px solid #ddd",borderRadius:7,padding:"9px 12px",fontSize:"1rem",fontFamily:"inherit",outline:"none",width:200}} />
                      <div style={{fontSize:".75rem",color:"#888",marginTop:4}}>
                        Set the balance sheet date for this import
                      </div>
                    </div>

                    <div style={{display:"flex",gap:12}}>
                      <button className="btn btn-secondary" onClick={()=>setShowImport(false)}>Cancel</button>
                      <button className="btn btn-primary" onClick={applyImport}
                        style={{background:"#2d5a8e"}}>
                        Import and Open Balance Sheet
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="home-section-label" style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span>
              {savedSheets.length > 0
                ? "Clients (" + Object.keys(savedSheets.reduce((g,s)=>{g[s.clientName]=true;return g;},{})).length + ")"
                : "Clients"}
            </span>
            <button onClick={()=>{setShowCreateFolder([]);setNewFolderName("");}}
              style={{background:"none",border:"1.5px dashed #6B0E1E",borderRadius:6,padding:"3px 12px",color:"#6B0E1E",fontSize:".78rem",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
              + New Folder
            </button>
          </div>

          {/* ── Create Folder Modal ── */}
          {showCreateFolder !== null && (
            <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,.5)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{background:"white",borderRadius:12,padding:28,maxWidth:400,width:"90%",boxShadow:"0 8px 40px rgba(0,0,0,.2)"}}>
                <div style={{fontWeight:700,fontSize:"1rem",marginBottom:8}}>
                  {showCreateFolder.length === 0 ? "Create Top-Level Folder" : "Create Subfolder inside " + showCreateFolder[showCreateFolder.length-1]}
                </div>
                <div style={{fontSize:".82rem",color:"#888",marginBottom:14}}>
                  Folders organize your clients. Examples: "Chris Mattson", "Smith Farms", "XYZ Corp"
                </div>
                <input className="text-input" type="text" value={newFolderName}
                  placeholder="Folder name..." autoFocus
                  onChange={e=>setNewFolderName(e.target.value)}
                  onKeyDown={e=>{if(e.key==="Enter"&&newFolderName.trim()){setShowCreateFolder(null);setNewFolderName("");}}} />
                <div style={{display:"flex",gap:10,marginTop:16,justifyContent:"flex-end"}}>
                  <button className="btn btn-secondary" onClick={()=>{setShowCreateFolder(null);setNewFolderName("");}}>Cancel</button>
                  <button className="btn btn-primary"
                    disabled={!newFolderName.trim()}
                    onClick={()=>{
                      if(!newFolderName.trim()) return;
                      const newPath=[...showCreateFolder,newFolderName.trim()];
                      createFolder(newPath);
                      setShowCreateFolder(null);
                      setNewFolderName("");
                    }}>
                    Create Folder
                  </button>
                </div>
                <div style={{fontSize:".75rem",color:"#aaa",marginTop:10}}>
                  Tip: folders appear automatically when you save a sheet into them.
                </div>
              </div>
            </div>
          )}

          {/* ── Move Sheet Modal ── */}
          {showMoveModal && (
            <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,.5)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
              <div style={{background:"white",borderRadius:12,padding:28,maxWidth:480,width:"100%",maxHeight:"80vh",overflowY:"auto",boxShadow:"0 8px 40px rgba(0,0,0,.2)"}}>
                <div style={{fontWeight:700,fontSize:"1rem",marginBottom:16}}>Move Sheet to Folder</div>
                {(() => {
                  const movingSheet = savedSheets.find(s=>s.key===showMoveModal);
                  const allPaths = getAllFolderPaths(savedSheets);
                  return (
                    <div>
                      <div style={{fontSize:".85rem",color:"#555",marginBottom:14}}>
                        Moving: <strong>{movingSheet?.clientName}</strong> — {movingSheet?.asOfDate}
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}>
                        {/* Unfiled option */}
                        <div
                          onClick={()=>moveSheet(showMoveModal,[])}
                          style={{padding:"10px 14px",border:"1.5px solid #ddd",borderRadius:8,cursor:"pointer",display:"flex",alignItems:"center",gap:10,background:"#fafafa"}}
                          onMouseOver={e=>e.currentTarget.style.borderColor="#6B0E1E"}
                          onMouseOut={e=>e.currentTarget.style.borderColor="#ddd"}>
                          <span style={{fontSize:"1.2rem"}}>📋</span>
                          <span style={{fontSize:".9rem"}}>Unfiled (top level)</span>
                        </div>
                        {allPaths.filter(p=>p.length>0).map((path,i) => (
                          <div key={i}
                            onClick={()=>moveSheet(showMoveModal,path)}
                            style={{padding:"10px 14px",border:"1.5px solid #ddd",borderRadius:8,cursor:"pointer",display:"flex",alignItems:"center",gap:10,background:"#fafafa",paddingLeft:(path.length*16+14)+"px"}}
                            onMouseOver={e=>e.currentTarget.style.borderColor="#6B0E1E"}
                            onMouseOut={e=>e.currentTarget.style.borderColor="#ddd"}>
                            <span style={{fontSize:"1.1rem"}}>📁</span>
                            <span style={{fontSize:".9rem"}}>{path[path.length-1]}</span>
                            <span style={{fontSize:".75rem",color:"#aaa",marginLeft:"auto"}}>{path.join(" / ")}</span>
                          </div>
                        ))}
                        {/* Create new folder option */}
                        <div
                          onClick={()=>{setShowCreateFolder([]);setNewFolderName("");}}
                          style={{padding:"10px 14px",border:"1.5px dashed #6B0E1E",borderRadius:8,cursor:"pointer",display:"flex",alignItems:"center",gap:10,color:"#6B0E1E",background:"#fdf9f9"}}>
                          <span style={{fontSize:"1.1rem"}}>➕</span>
                          <span style={{fontSize:".9rem",fontWeight:600}}>Create new folder first...</span>
                        </div>
                      </div>
                      <button className="btn btn-secondary" onClick={()=>setShowMoveModal(null)}>Cancel</button>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {savedSheets.length === 0
            ? <div className="home-empty">No saved balance sheets yet. Complete a sheet and save it to store it here.</div>
            : (() => {
                // Build tree from folderPath on each sheet
                // Collect all unique folder paths
                const allPaths = getAllFolderPaths(savedSheets);
                // Build a recursive tree renderer
                function renderFolderLevel(pathPrefix, depth) {
                  const indent = depth * 20;
                  // Get child folder names at this level
                  const childFolders = allPaths
                    .filter(p => p.length === pathPrefix.length + 1 &&
                      p.slice(0, pathPrefix.length).join("|") === pathPrefix.join("|"))
                    .sort((a,b) => a[a.length-1].localeCompare(b[b.length-1]));
                  // Get sheets at this exact path
                  const sheetsHere = savedSheets
                    .filter(s => {
                      const fp = s.folderPath || [];
                      return fp.length === pathPrefix.length &&
                        fp.join("|") === pathPrefix.join("|");
                    })
                    .sort((a,b) => b.asOfDate.localeCompare(a.asOfDate));
                  const folderKey = pathPrefix.join("|") || "_root_";
                  const isOpen = pathPrefix.length === 0 ? true : !!openFolders[folderKey];
                  return (
                    <div key={folderKey} style={{marginLeft: depth > 0 ? indent + "px" : 0}}>
                      {/* Subfolder groups */}
                      {childFolders.map(path => {
                        const folderName = path[path.length-1];
                        const fKey = path.join("|");
                        const fOpen = !!openFolders[fKey];
                        const allSheetsInFolder = savedSheets.filter(s => {
                          const fp = s.folderPath || [];
                          return fp.length >= path.length && fp.slice(0,path.length).join("|") === path.join("|");
                        });
                        const latestInFolder = allSheetsInFolder.sort((a,b)=>b.asOfDate.localeCompare(a.asOfDate))[0];
                        return (
                          <div key={fKey} className="client-folder" style={{marginLeft: depth * 20 + "px", marginBottom:6}}>
                            <div className="client-folder-header" onClick={()=>toggleFolder(fKey)}>
                              <div className="client-folder-left" style={{flex:1,minWidth:0}}>
                                <span className="folder-icon">{fOpen ? "📂" : "📁"}</span>
                                {editingFolder && JSON.stringify(editingFolder.path)===JSON.stringify(path) ? (
                                  <div style={{display:"flex",alignItems:"center",gap:6,flex:1}} onClick={e=>e.stopPropagation()}>
                                    <input className="text-input"
                                      style={{flex:1,maxWidth:220,padding:"5px 10px",fontSize:".9rem"}}
                                      value={editingFolder.newName} autoFocus
                                      onChange={e=>setEditingFolder({...editingFolder,newName:e.target.value})}
                                      onKeyDown={e=>{
                                        if(e.key==="Enter") renameFolder(editingFolder.path, editingFolder.newName);
                                        if(e.key==="Escape") setEditingFolder(null);
                                      }} />
                                    <button className="btn btn-primary" style={{padding:"5px 12px",fontSize:".8rem"}}
                                      onClick={()=>renameFolder(editingFolder.path, editingFolder.newName)}>Save</button>
                                    <button className="btn btn-secondary" style={{padding:"5px 10px",fontSize:".8rem"}}
                                      onClick={()=>setEditingFolder(null)}>Cancel</button>
                                  </div>
                                ) : (
                                  <div>
                                    <div className="client-folder-name">{folderName}</div>
                                    <div className="client-folder-meta">
                                      {allSheetsInFolder.length} sheet{allSheetsInFolder.length!==1?"s":""}
                                      {latestInFolder && " · Latest: " + latestInFolder.asOfDate}
                                      {path.length > 1 && <span style={{color:"#aaa",marginLeft:6}}>{path.join(" / ")}</span>}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="client-folder-right">
                                {(!editingFolder || JSON.stringify(editingFolder.path)!==JSON.stringify(path)) && (
                                  <span>
                                    <button style={{background:"none",border:"1px solid #e0d0d0",borderRadius:5,padding:"3px 7px",fontSize:".75rem",cursor:"pointer",color:"#888",fontFamily:"inherit",marginRight:4}}
                                      title="Rename folder"
                                      onClick={e=>{e.stopPropagation();setEditingFolder({path,newName:folderName});}}>
                                      Rename
                                    </button>
                                    <button style={{background:"none",border:"1px solid #ddd",borderRadius:5,padding:"3px 8px",fontSize:".72rem",cursor:"pointer",color:"#6B0E1E",fontFamily:"inherit",fontWeight:600,marginRight:4}}
                                      onClick={e=>{e.stopPropagation();setShowCreateFolder(path);setNewFolderName("");}}>
                                      + Sub
                                    </button>
                                    {latestInFolder && (
                                      <button className="sheet-load-btn"
                                        onClick={e=>{e.stopPropagation();loadSheet(latestInFolder.key);}}>
                                        Open Latest
                                      </button>
                                    )}
                                  </span>
                                )}
                                <span className="folder-chevron">{fOpen ? "▲" : "▼"}</span>
                              </div>
                            </div>
                            {fOpen && renderFolderLevel(path, 1)}
                          </div>
                        );
                      })}
                      {/* Sheets at this level */}
                      {sheetsHere.length > 0 && (
                        <div className={depth > 0 ? "client-folder-sheets" : ""} style={{display:"flex",flexDirection:"column",gap:6}}>
                          {sheetsHere.map(s => (
                            <div key={s.key} className="sheet-card sheet-card-nested"
                              onClick={()=>loadSheet(s.key)}>
                              <div className="sheet-icon" style={{fontSize:"1.2rem"}}>📋</div>
                              <div className="sheet-info">
                                <div style={{fontSize:".9rem",fontWeight:700,color:"#1a1a1a"}}>{s.clientName}</div>
                                <div className="sheet-date">As of {s.asOfDate}</div>
                                {s.savedAt && <div className="sheet-meta">Saved {new Date(s.savedAt).toLocaleDateString()}</div>}
                                {s.inspShareId && s.hasResponse && (
                                  <div style={{fontSize:".72rem",fontWeight:700,color:"#15803d",marginTop:2}}>
                                    📬 Customer responded
                                  </div>
                                )}
                              </div>
                              <button className="sheet-load-btn"
                                onClick={e=>{e.stopPropagation();loadSheet(s.key);}}>
                                Open
                              </button>
                              <button style={{background:"none",border:"1px solid #ddd",borderRadius:5,padding:"4px 8px",fontSize:".75rem",cursor:"pointer",color:"#555",fontFamily:"inherit"}}
                                onClick={e=>{e.stopPropagation();setShowMoveModal(s.key);}}>
                                Move
                              </button>
                              <button className="sheet-delete" onClick={e=>deleteSheet(s.key,e)}>Delete</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return renderFolderLevel([], 0);
              })()
          }
        </div>
      </div>
    );
  }

  // ── Wizard / Budget / Compare ──────────────────────────────────────────────
  return (
    <div className="app">

      {/* ── Save Folder Picker Modal ── */}
      {showSaveFolderPicker && (
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,.55)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div style={{background:"white",borderRadius:14,padding:28,maxWidth:500,width:"100%",maxHeight:"85vh",overflowY:"auto",boxShadow:"0 10px 50px rgba(0,0,0,.25)"}}>
            <div style={{fontWeight:700,fontSize:"1.05rem",marginBottom:6}}>Save Balance Sheet</div>
            <div style={{fontSize:".85rem",color:"#666",marginBottom:18}}>
              Choose a folder for <strong>{data.clientName}</strong> — {data.asOfDate}
            </div>
            {/* New folder name input */}
            {showCreateFolder !== null && (
              <div style={{background:"#f0f6ff",border:"1px solid #c0d8f0",borderRadius:8,padding:14,marginBottom:14}}>
                <div style={{fontSize:".82rem",fontWeight:700,color:"#2d5a8e",marginBottom:8}}>
                  New folder {showCreateFolder.length>0 ? "inside "+showCreateFolder[showCreateFolder.length-1] : "(top level)"}:
                </div>
                <div style={{display:"flex",gap:8}}>
                  <input className="text-input" type="text" value={newFolderName} autoFocus
                    placeholder="Folder name..."
                    onChange={e=>setNewFolderName(e.target.value)}
                    onKeyDown={e=>{
                      if(e.key==="Enter"&&newFolderName.trim()){
                        const newPath=[...showCreateFolder,newFolderName.trim()];
                        createFolder(newPath);
                        setSelectedFolderPath(newPath);
                        setShowCreateFolder(null);
                        setNewFolderName("");
                      }
                    }} />
                  <button className="btn btn-primary" style={{flexShrink:0}}
                    disabled={!newFolderName.trim()}
                    onClick={()=>{
                      if(!newFolderName.trim()) return;
                      const newPath=[...showCreateFolder,newFolderName.trim()];
                      createFolder(newPath);
                      setSelectedFolderPath(newPath);
                      setShowCreateFolder(null);
                      setNewFolderName("");
                    }}>
                    Create
                  </button>
                  <button className="btn btn-secondary" style={{flexShrink:0}}
                    onClick={()=>{setShowCreateFolder(null);setNewFolderName("");}}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:16}}>
              {/* Unfiled */}
              <div
                onClick={()=>setSelectedFolderPath([])}
                style={{padding:"10px 14px",border:"1.5px solid "+(selectedFolderPath.length===0?"#6B0E1E":"#ddd"),borderRadius:8,cursor:"pointer",display:"flex",alignItems:"center",gap:10,background:selectedFolderPath.length===0?"#f5e8ea":"#fafafa"}}>
                <span style={{fontSize:"1.1rem"}}>📋</span>
                <span style={{fontSize:".9rem",fontWeight:selectedFolderPath.length===0?700:400}}>Unfiled</span>
                {selectedFolderPath.length===0 && <span style={{marginLeft:"auto",fontSize:".75rem",color:"#6B0E1E",fontWeight:700}}>Selected</span>}
              </div>
              {/* Existing folders */}
              {getAllFolderPaths(savedSheets).filter(p=>p.length>0).sort((a,b)=>a.join("/").localeCompare(b.join("/"))).map((path,i) => {
                const isSelected = JSON.stringify(selectedFolderPath)===JSON.stringify(path);
                return (
                  <div key={i}
                    onClick={()=>setSelectedFolderPath(path)}
                    style={{padding:"10px 14px",border:"1.5px solid "+(isSelected?"#6B0E1E":"#ddd"),borderRadius:8,cursor:"pointer",display:"flex",alignItems:"center",gap:10,paddingLeft:(path.length*16+14)+"px",background:isSelected?"#f5e8ea":"#fafafa"}}>
                    <span style={{fontSize:"1.1rem"}}>{isSelected?"📂":"📁"}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:".9rem",fontWeight:isSelected?700:400}}>{path[path.length-1]}</div>
                      {path.length>1&&<div style={{fontSize:".72rem",color:"#aaa"}}>{path.join(" / ")}</div>}
                    </div>
                    {isSelected && <span style={{fontSize:".75rem",color:"#6B0E1E",fontWeight:700}}>Selected</span>}
                    <button style={{background:"none",border:"1px solid #ddd",borderRadius:5,padding:"2px 7px",fontSize:".7rem",cursor:"pointer",color:"#6B0E1E",fontFamily:"inherit",flexShrink:0}}
                      onClick={e=>{e.stopPropagation();setShowCreateFolder(path);setNewFolderName("");}}>
                      + Sub
                    </button>
                  </div>
                );
              })}
              {/* Create new top-level folder */}
              <div
                onClick={()=>{setShowCreateFolder([]);setNewFolderName("");}}
                style={{padding:"10px 14px",border:"1.5px dashed #6B0E1E",borderRadius:8,cursor:"pointer",display:"flex",alignItems:"center",gap:10,color:"#6B0E1E",background:"#fdf9f9"}}>
                <span style={{fontSize:"1.1rem"}}>➕</span>
                <span style={{fontSize:".9rem",fontWeight:600}}>Create new folder...</span>
              </div>
            </div>
            {selectedFolderPath.length > 0 && (
              <div style={{fontSize:".82rem",color:"#6B0E1E",fontWeight:600,marginBottom:12,padding:"6px 10px",background:"#f5e8ea",borderRadius:6}}>
                Saving to: {selectedFolderPath.join(" / ")}
              </div>
            )}
            <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
              <button className="btn btn-secondary" onClick={()=>{setShowSaveFolderPicker(false);setPendingSaveKey(null);}}>Cancel</button>
              <button className="btn btn-save"
                onClick={()=>{
                  const fp = [...selectedFolderPath];
                  setShowSaveFolderPicker(false);
                  if(pendingSaveKey) doSave(pendingSaveKey, fp);
                }}>
                Save Here
              </button>
            </div>
          </div>
        </div>
      )}

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
          onClick={()=>{setActiveTab("budget");loadCorpPersonalDebt();}}>
          Budget / Cash Flow
        </button>
        <button className={"tab-btn" + (activeTab === "compare" ? " tab-active" : "")}
          onClick={()=>{setActiveTab("compare");loadComparisonSheets();}}>
          Year Comparison
        </button>
        <button className={"tab-btn" + (activeTab === "inspection" ? " tab-active" : "")}
          onClick={()=>setActiveTab("inspection")}>
          Ag Inspection{hasCustomerResponse ? " 📬" : ""}
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
              <div className="btt-item"><span>Expenses</span><strong style={{color:"#c44"}}>{fmt(budgetTotalExpenses + corpPersonalDebt.filter(r=>r.annualPmt&&numVal(r.annualPmt)>0).reduce((s,r)=>s+numVal(r.annualPmt),0))}</strong></div>
              <div className="btt-item btt-net"><span>Net</span>
                <strong style={{color:(budgetTotalIncome - budgetTotalExpenses - corpPersonalDebt.filter(r=>r.annualPmt&&numVal(r.annualPmt)>0).reduce((s,r)=>s+numVal(r.annualPmt),0))>=0?"#1a5c25":"#c44"}}>
                  {fmt(budgetTotalIncome - budgetTotalExpenses - corpPersonalDebt.filter(r=>r.annualPmt&&numVal(r.annualPmt)>0).reduce((s,r)=>s+numVal(r.annualPmt),0))}
                </strong>
              </div>
            </div>
            <button className="btn btn-save" onClick={saveSheet}
              disabled={!data.clientName || saveStatus === "saving"}>
              {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved!" : saveStatus && saveStatus !== "error" ? "Error: " + saveStatus.slice(0,60) : "Save"}
            </button>
            <button className="btn btn-secondary" onClick={handlePrintBudget}
              style={{fontSize:".85rem"}}>
              Print Budget
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
              debtServiceTermsPersonal={debtServiceTermsPersonal}
              debtServiceTermsCorp={debtServiceTermsCorp}
              debtServiceREPersonal={debtServiceREPersonal}
              debtServiceRECorp={debtServiceRECorp}
              budgetTotalDebtService={budgetTotalDebtService}
              budgetPersonalDebtTotal={budgetPersonalDebtTotal}
              budgetCorpDebtTotal={budgetCorpDebtTotal}
              corpPersonalDebt={corpPersonalDebt}
              corpPersonalDebtTotal={corpPersonalDebt.filter(r=>r.annualPmt&&numVal(r.annualPmt)>0).reduce((s,r)=>s+numVal(r.annualPmt),0)}
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

      {activeTab === "inspection" && (
        <div>
          {hasCustomerResponse && (
            <div style={{background:"#e8f5ea",border:"1px solid #22c55e",borderRadius:10,
              padding:"14px 18px",margin:"12px 12px 0",display:"flex",alignItems:"center",
              gap:12,flexWrap:"wrap"}}>
              <span style={{fontSize:"1.3rem"}}>📬</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:".9rem",color:"#15803d"}}>
                  Customer has submitted their inspection form!
                </div>
                <div style={{fontSize:".78rem",color:"#555"}}>
                  Click Load Response to pull their answers into the inspection form below.
                </div>
              </div>
              <button
                onClick={()=>{
                  const sid = data.inspShareId;
                  if (!sid) return;
                  fetch(SUPABASE_URL+'/rest/v1/inspection_shares?share_id=eq.'+sid+'&select=response',
                    {headers:supaHeaders()})
                    .then(r=>r.json())
                    .then(rows=>{
                      if (!rows[0]?.response) return;
                      const cr = rows[0].response;
                      setData(d=>({...d,
                        inspCrops:(d.inspCrops||[]).map((r,i)=>({
                          ...r,
                          actualAcres:cr.crops?.[i]?.actualAcres||r.actualAcres,
                          condition:cr.crops?.[i]?.condition||r.condition,
                          actualYield:cr.crops?.[i]?.actualYield||r.actualYield,
                          location:cr.crops?.[i]?.location||r.location,
                          deviationReason:cr.crops?.[i]?.deviationReason||r.deviationReason,
                        })),
                        inspLivestock:(d.inspLivestock||[]).map((r,i)=>({
                          ...r,
                          actualHead:cr.livestock?.[i]?.actualHead||r.actualHead,
                          condition:cr.livestock?.[i]?.condition||r.condition,
                          estWeight:cr.livestock?.[i]?.estWeight||r.estWeight,
                          deviationReason:cr.livestock?.[i]?.deviationReason||r.deviationReason,
                        })),
                      }));
                      setHasCustomerResponse(false);
                    });
                }}
                style={{background:"#15803d",color:"white",border:"none",borderRadius:7,
                  padding:"8px 16px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",
                  fontSize:".85rem",flexShrink:0}}>
                Load Response
              </button>
            </div>
          )}
          <InspectionView data={data} setData={setData} />
        </div>
      )}
    </div>
  );
}
