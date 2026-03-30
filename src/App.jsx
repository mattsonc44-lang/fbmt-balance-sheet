import React, { useState, useEffect } from "react";

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
  "dGg6MTEwMHB4O21hcmdpbjowIGF1dG87d2lkdGg6MTAwJTtwYWRkaW5nOjI0cHggMTZweDt9Ci5zaWRlYmFye3dpZHRoOjE5MHB4",
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
  "eDoxO3BhZGRpbmc6MjhweCAzMnB4O292ZXJmbG93LXk6YXV0bzt9Ci5jYXJkLW5hdntkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6",
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
  "emU6Ljc4cmVtO3RleHQtdHJhbnNmb3JtOnVwcGVyY2FzZTtsZXR0ZXItc3BhY2luZzouMDhlbTtjb2xvcjojNTU1O2ZvbnQtd2Vp",
  "Z2h0OjYwMDt9Ci5oaW50e2ZvbnQtc2l6ZTouNzVyZW07Y29sb3I6Izg4ODt9Ci5pbnB1dC13cmFwe2Rpc3BsYXk6ZmxleDthbGln",
  "bi1pdGVtczpjZW50ZXI7Ym9yZGVyOjEuNXB4IHNvbGlkICNkZGQ7Ym9yZGVyLXJhZGl1czo3cHg7b3ZlcmZsb3c6aGlkZGVuO2Jh",
  "Y2tncm91bmQ6I2ZhZmFmYTt9Ci5pbnB1dC13cmFwOmZvY3VzLXdpdGhpbntib3JkZXItY29sb3I6IzZCMEUxRTtiYWNrZ3JvdW5k",
  "OndoaXRlO30KLnByZWZpeHtwYWRkaW5nOjlweCAxMHB4O2JhY2tncm91bmQ6I2Y5ZjVmNTtib3JkZXItcmlnaHQ6MS41cHggc29s",
  "aWQgI2RkZDtmb250LXNpemU6LjlyZW07Y29sb3I6IzY2Njtmb250LXdlaWdodDo2MDA7fQouaW5wdXQtd3JhcCBpbnB1dHtmbGV4",
  "OjE7Ym9yZGVyOm5vbmU7YmFja2dyb3VuZDp0cmFuc3BhcmVudDtwYWRkaW5nOjlweCAxMnB4O2ZvbnQtc2l6ZTouOTVyZW07Zm9u",
  "dC1mYW1pbHk6J1NvdXJjZSBTYW5zIDMnLHNhbnMtc2VyaWY7Y29sb3I6IzFhMWExYTtvdXRsaW5lOm5vbmU7fQppbnB1dC50ZXh0",
  "LWlucHV0e2JvcmRlcjoxLjVweCBzb2xpZCAjZGRkO2JvcmRlci1yYWRpdXM6N3B4O3BhZGRpbmc6OXB4IDEycHg7Zm9udC1zaXpl",
  "Oi45NXJlbTtmb250LWZhbWlseTonU291cmNlIFNhbnMgMycsc2Fucy1zZXJpZjtjb2xvcjojMWExYTFhO291dGxpbmU6bm9uZTt3",
  "aWR0aDoxMDAlO2JhY2tncm91bmQ6I2ZhZmFmYTt9CmlucHV0LnRleHQtaW5wdXQ6Zm9jdXN7Ym9yZGVyLWNvbG9yOiM2QjBFMUU7",
  "YmFja2dyb3VuZDp3aGl0ZTt9Ci5yb3ctZW50cnl7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmZsZXgtZW5kO2dhcDoxMHB4O3Bh",
  "ZGRpbmc6MTJweDtiYWNrZ3JvdW5kOiNmOGY2ZjI7Ym9yZGVyLXJhZGl1czo4cHg7Ym9yZGVyOjFweCBzb2xpZCAjZThlNGRjO30K",
  "LnJvdy1udW17d2lkdGg6MjBweDt0ZXh0LWFsaWduOmNlbnRlcjtmb250LXNpemU6Ljc1cmVtO2NvbG9yOiM5OTk7Zm9udC13ZWln",
  "aHQ6NzAwO3BhZGRpbmctYm90dG9tOjEwcHg7ZmxleC1zaHJpbms6MDt9Ci5yb3ctZW50cnkgPiAuaW5wdXQtZ3JvdXB7ZmxleDox",
  "O21pbi13aWR0aDo4MHB4O30KLnJlbW92ZS1idG57YmFja2dyb3VuZDpub25lO2JvcmRlcjoxcHggc29saWQgI2RkZDtib3JkZXIt",
  "cmFkaXVzOjVweDtwYWRkaW5nOjVweCA4cHg7Y3Vyc29yOnBvaW50ZXI7Y29sb3I6I2M0NDtmb250LXNpemU6Ljc1cmVtO2ZsZXgt",
  "c2hyaW5rOjA7bWFyZ2luLWJvdHRvbToxcHg7fQoucmVtb3ZlLWJ0bjpob3ZlcntiYWNrZ3JvdW5kOiNmZWU7Ym9yZGVyLWNvbG9y",
  "OiNjNDQ7fQouYWRkLWJ0bnthbGlnbi1zZWxmOmZsZXgtc3RhcnQ7YmFja2dyb3VuZDpub25lO2JvcmRlcjoxLjVweCBkYXNoZWQg",
  "IzZCMEUxRTtib3JkZXItcmFkaXVzOjdweDtwYWRkaW5nOjhweCAxNnB4O2NvbG9yOiM2QjBFMUU7Zm9udC1zaXplOi44NXJlbTtm",
  "b250LWZhbWlseTonU291cmNlIFNhbnMgMycsc2Fucy1zZXJpZjtjdXJzb3I6cG9pbnRlcjtmb250LXdlaWdodDo2MDA7dHJhbnNp",
  "dGlvbjphbGwgLjE1czt9Ci5hZGQtYnRuOmhvdmVye2JhY2tncm91bmQ6IzZCMEUxRTtjb2xvcjp3aGl0ZTt9Ci5zdWJ0b3RhbC1y",
  "b3d7ZGlzcGxheTpmbGV4O2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOmNlbnRlcjtwYWRkaW5nOjhw",
  "eCAxMnB4O2JhY2tncm91bmQ6I2Y5ZjVmNTtib3JkZXItcmFkaXVzOjZweDtmb250LXNpemU6LjlyZW07Y29sb3I6IzQ0NDtib3Jk",
  "ZXItbGVmdDozcHggc29saWQgI2NjYzt9Ci5zdWJ0b3RhbC1yb3cudG90YWx7YmFja2dyb3VuZDojZjVlOGVhO2JvcmRlci1sZWZ0",
  "LWNvbG9yOiM2QjBFMUU7Zm9udC13ZWlnaHQ6NzAwO2ZvbnQtc2l6ZTouOTVyZW07fQouc3VidG90YWwtcm93IHN0cm9uZ3tmb250",
  "LXdlaWdodDo3MDA7fQouZmllbGQtbm90ZXtmb250LXNpemU6LjgycmVtO2NvbG9yOiM3Nzc7Zm9udC1zdHlsZTppdGFsaWM7YmFj",
  "a2dyb3VuZDojZjhmNmYyO3BhZGRpbmc6OHB4IDEycHg7Ym9yZGVyLXJhZGl1czo2cHg7fQoucGhhc2UtYmFkZ2V7Zm9udC1zaXpl",
  "Oi43OHJlbTtiYWNrZ3JvdW5kOiM2QjBFMUU7Y29sb3I6d2hpdGU7cGFkZGluZzo0cHggMTJweDtib3JkZXItcmFkaXVzOjIwcHg7",
  "ZGlzcGxheTppbmxpbmUtYmxvY2s7Zm9udC13ZWlnaHQ6NjAwO2xldHRlci1zcGFjaW5nOi4wNGVtO30KLmludHJvLXRleHR7Zm9u",
  "dC1zaXplOi45NXJlbTtjb2xvcjojNTU1O2xpbmUtaGVpZ2h0OjEuNjt9Ci5mcC1oZWFkZXItcm93e2Rpc3BsYXk6ZmxleDthbGln",
  "bi1pdGVtczpjZW50ZXI7Z2FwOjhweDtwYWRkaW5nOjAgNHB4O30KLmZwLWNvbC1sYWJlbHtmb250LXNpemU6LjY4cmVtO3RleHQt",
  "dHJhbnNmb3JtOnVwcGVyY2FzZTtsZXR0ZXItc3BhY2luZzouMDhlbTtjb2xvcjojODg4O2ZvbnQtd2VpZ2h0OjcwMDt9Ci5mcC1y",
  "b3d7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6OHB4O3BhZGRpbmc6MTBweCAxMnB4O2JhY2tncm91bmQ6I2Y4",
  "ZjZmMjtib3JkZXItcmFkaXVzOjhweDtib3JkZXI6MXB4IHNvbGlkICNlOGU0ZGM7fQoudW5pdC1zZWxlY3R7d2lkdGg6MTAwJTti",
  "b3JkZXI6MS41cHggc29saWQgI2RkZDtib3JkZXItcmFkaXVzOjdweDtwYWRkaW5nOjlweCA2cHg7Zm9udC1zaXplOi44OHJlbTtm",
  "b250LWZhbWlseTonU291cmNlIFNhbnMgMycsc2Fucy1zZXJpZjtiYWNrZ3JvdW5kOiNmYWZhZmE7Y29sb3I6IzFhMWExYTtvdXRs",
  "aW5lOm5vbmU7Y3Vyc29yOnBvaW50ZXI7fQoudW5pdC1zZWxlY3Q6Zm9jdXN7Ym9yZGVyLWNvbG9yOiM2QjBFMUU7YmFja2dyb3Vu",
  "ZDp3aGl0ZTt9Ci5mcC1jYWxjLXRvdGFse2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjRweDtiYWNrZ3JvdW5k",
  "OiNmNWU4ZWE7Ym9yZGVyLXJhZGl1czo2cHg7cGFkZGluZzo4cHggMTBweDt9Ci5mcC1lcXVhbHN7Y29sb3I6Izg4ODtmb250LXNp",
  "emU6Ljg1cmVtO30KLmZwLXJlc3VsdHtmb250LXdlaWdodDo3MDA7Zm9udC1zaXplOi44OHJlbTtjb2xvcjojNkIwRTFFO30KLm1h",
  "Y2gtdGFibGV7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6NHB4O30KLm1hY2gtaGVhZGVye2Rpc3BsYXk6",
  "ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7Z2FwOjZweDtwYWRkaW5nOjRweCA2cHg7fQoubWFjaC1oZWFkZXIgc3Bhbntmb250LXNp",
  "emU6LjY4cmVtO3RleHQtdHJhbnNmb3JtOnVwcGVyY2FzZTtsZXR0ZXItc3BhY2luZzouMDhlbTtjb2xvcjojODg4O2ZvbnQtd2Vp",
  "Z2h0OjcwMDt9Ci5tYWNoLXJvd3tkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7cGFkZGluZzo4cHggMTBw",
  "eDtiYWNrZ3JvdW5kOiNmOGY2ZjI7Ym9yZGVyLXJhZGl1czo3cHg7Ym9yZGVyOjFweCBzb2xpZCAjZThlNGRjO30KLm1hY2gtY29s",
  "e2Rpc3BsYXk6ZmxleDt9Ci5tYWNoLWNvbCAudGV4dC1pbnB1dHt3aWR0aDoxMDAlO30KLm1hY2gtY29sIC5pbnB1dC13cmFwe3dp",
  "ZHRoOjEwMCU7fQouc3VtbWFyeS1ncmlke2Rpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6MWZyIDFmcjtnYXA6MjBw",
  "eDttYXJnaW4tdG9wOjhweDt9Ci5jb2wtaGVhZHtmb250LWZhbWlseTonUGxheWZhaXIgRGlzcGxheScsc2VyaWY7Zm9udC1zaXpl",
  "OjFyZW07Zm9udC13ZWlnaHQ6NzAwO2xldHRlci1zcGFjaW5nOi4wNWVtO3RleHQtdHJhbnNmb3JtOnVwcGVyY2FzZTtwYWRkaW5n",
  "OjhweCAxMnB4O21hcmdpbi1ib3R0b206MTBweDtib3JkZXItcmFkaXVzOjZweDt9Ci5hc3NldHMtaGVhZHtiYWNrZ3JvdW5kOiNm",
  "NWU4ZWE7Y29sb3I6IzZCMEUxRTt9Ci5saWFiLWhlYWR7YmFja2dyb3VuZDojZmNlOGU4O2NvbG9yOiM0YTA4MTA7fQouc3VtbWFy",
  "eS1zZWN0aW9ue21hcmdpbi1ib3R0b206MTJweDt9Ci5zcy1sYWJlbHtmb250LXNpemU6LjcycmVtO3RleHQtdHJhbnNmb3JtOnVw",
  "cGVyY2FzZTtsZXR0ZXItc3BhY2luZzouMWVtO2NvbG9yOiM5OTk7Zm9udC13ZWlnaHQ6NzAwO21hcmdpbi1ib3R0b206NnB4O3Bh",
  "ZGRpbmc6MCA0cHg7fQouc3Mtcm93e2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2Vlbjtmb250LXNpemU6",
  "LjgycmVtO2NvbG9yOiM0NDQ7cGFkZGluZzozcHggNnB4O2JvcmRlci1ib3R0b206MXB4IHNvbGlkICNmMGVjZTQ7fQouc3Mtcm93",
  "LnN1Yntjb2xvcjojODg4O2ZvbnQtc2l6ZTouNzhyZW07cGFkZGluZy1sZWZ0OjE2cHg7fQouc3Mtc3VidG90YWx7ZGlzcGxheTpm",
  "bGV4O2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2ZvbnQtc2l6ZTouODVyZW07Zm9udC13ZWlnaHQ6NzAwO2NvbG9yOiMz",
  "MzM7cGFkZGluZzo1cHggNnB4O2JhY2tncm91bmQ6I2Y1ZjNlZjtib3JkZXItcmFkaXVzOjRweDttYXJnaW4tdG9wOjRweDt9Ci5z",
  "cy10b3RhbHtkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47Zm9udC1zaXplOjFyZW07Zm9udC13ZWln",
  "aHQ6NzAwO3BhZGRpbmc6MTBweCA4cHg7Ym9yZGVyLXJhZGl1czo2cHg7bWFyZ2luLXRvcDo4cHg7fQouZ3JlZW4tdG90YWx7YmFj",
  "a2dyb3VuZDojZjVlOGVhO2NvbG9yOiM2QjBFMUU7fQoucmVkLXRvdGFse2JhY2tncm91bmQ6I2ZjZThlODtjb2xvcjojNGEwODEw",
  "O30KLm5ldC1zZWN0aW9ue21hcmdpbi10b3A6MTZweDtib3JkZXItdG9wOjJweCBzb2xpZCAjZWVlO3BhZGRpbmctdG9wOjEycHg7",
  "ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6OHB4O30KLm5ldC1yb3d7ZGlzcGxheTpmbGV4O2p1c3RpZnkt",
  "Y29udGVudDpzcGFjZS1iZXR3ZWVuO2FsaWduLWl0ZW1zOmNlbnRlcjtwYWRkaW5nOjRweCA2cHg7fQoubmV0LXJvdy5ud3tmb250",
  "LXNpemU6MS4xcmVtO2ZvbnQtd2VpZ2h0OjcwMDtjb2xvcjojMWExYTFhO30KLm5ldC1yb3cgLmdyZWVue2NvbG9yOiM2QjBFMUU7",
  "fQoubmV0LXJvdyAucmVke2NvbG9yOiNjNDQ7fQouc2F2ZS1iYXJ7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6",
  "MTJweDttYXJnaW4tdG9wOjE0cHg7cGFkZGluZzoxNHB4IDE2cHg7YmFja2dyb3VuZDojZjVlOGVhO2JvcmRlci1yYWRpdXM6MTBw",
  "eDtib3JkZXI6MXB4IHNvbGlkICNlMGMwYzU7ZmxleC13cmFwOndyYXA7fQouc2F2ZS1kYXRlLXdyYXB7ZGlzcGxheTpmbGV4O2Fs",
  "aWduLWl0ZW1zOmNlbnRlcjtnYXA6OHB4O2ZsZXg6MTt9Ci5zYXZlLWRhdGUtd3JhcCBsYWJlbHtmb250LXNpemU6Ljc4cmVtO2Zv",
  "bnQtd2VpZ2h0OjcwMDt0ZXh0LXRyYW5zZm9ybTp1cHBlcmNhc2U7bGV0dGVyLXNwYWNpbmc6LjA3ZW07Y29sb3I6IzZCMEUxRTt3",
  "aGl0ZS1zcGFjZTpub3dyYXA7fQouYnRue3BhZGRpbmc6MTBweCAyNHB4O2JvcmRlci1yYWRpdXM6OHB4O2ZvbnQtZmFtaWx5OidT",
  "b3VyY2UgU2FucyAzJyxzYW5zLXNlcmlmO2ZvbnQtc2l6ZTouOXJlbTtmb250LXdlaWdodDo2MDA7Y3Vyc29yOnBvaW50ZXI7dHJh",
  "bnNpdGlvbjphbGwgLjE1cztib3JkZXI6bm9uZTt9Ci5idG4tcHJpbWFyeXtiYWNrZ3JvdW5kOiM2QjBFMUU7Y29sb3I6d2hpdGU7",
  "fQouYnRuLXByaW1hcnk6aG92ZXJ7YmFja2dyb3VuZDojNWEwYzE4O30KLmJ0bi1zZWNvbmRhcnl7YmFja2dyb3VuZDojZjlmNWY1",
  "O2NvbG9yOiM1NTU7Ym9yZGVyOjFweCBzb2xpZCAjZGRkO30KLmJ0bi1zZWNvbmRhcnk6aG92ZXJ7YmFja2dyb3VuZDojZjBlY2U0",
  "O30KLmJ0bi1zdWNjZXNze2JhY2tncm91bmQ6IzJkN2EzYTtjb2xvcjp3aGl0ZTt9Ci5idG4tc3VjY2Vzczpob3ZlcntiYWNrZ3Jv",
  "dW5kOiMyNTYwMzA7fQouYnRuLXNhdmV7YmFja2dyb3VuZDojNkIwRTFFO2NvbG9yOndoaXRlO2JvcmRlcjpub25lO30KLmJ0bi1z",
  "YXZlOmhvdmVye2JhY2tncm91bmQ6IzVhMGMxODt9Ci5idG4tc2F2ZTpkaXNhYmxlZHtvcGFjaXR5Oi42O2N1cnNvcjpkZWZhdWx0",
  "O30KLnN0ZXAtaW5mb3tmb250LXNpemU6Ljc4cmVtO2NvbG9yOiM5OTk7fQoucHJpbnQtbm90ZXtmb250LXNpemU6LjgycmVtO2Nv",
  "bG9yOiM3Nzc7YmFja2dyb3VuZDojZjhmNmYyO3BhZGRpbmc6MTJweCAxNnB4O2JvcmRlci1yYWRpdXM6OHB4O21hcmdpbi10b3A6",
  "OHB4O2JvcmRlci1sZWZ0OjNweCBzb2xpZCAjY2NjO30KLmhvbWUtdG9we2JhY2tncm91bmQ6IzZCMEUxRTtjb2xvcjp3aGl0ZTtw",
  "YWRkaW5nOjIwcHggMzJweDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3",
  "ZWVuO30KLmhvbWUtdG9wLXRpdGxle2ZvbnQtZmFtaWx5OidQbGF5ZmFpciBEaXNwbGF5JyxzZXJpZjtmb250LXNpemU6MS4zcmVt",
  "O2xldHRlci1zcGFjaW5nOi4wNGVtO30KLmhvbWUtdG9wLXN1Yntmb250LXNpemU6LjhyZW07b3BhY2l0eTouNzttYXJnaW4tdG9w",
  "OjJweDt0ZXh0LXRyYW5zZm9ybTp1cHBlcmNhc2U7bGV0dGVyLXNwYWNpbmc6LjFlbTt9Ci5ob21lLWJvZHl7bWF4LXdpZHRoOjgw",
  "MHB4O21hcmdpbjowIGF1dG87cGFkZGluZzo0MHB4IDI0cHg7d2lkdGg6MTAwJTt9Ci5ob21lLW5ldy1idG57YmFja2dyb3VuZDoj",
  "NkIwRTFFO2NvbG9yOndoaXRlO2JvcmRlcjpub25lO2JvcmRlci1yYWRpdXM6MTBweDtwYWRkaW5nOjE2cHggMzJweDtmb250LXNp",
  "emU6MXJlbTtmb250LWZhbWlseTonU291cmNlIFNhbnMgMycsc2Fucy1zZXJpZjtmb250LXdlaWdodDo3MDA7Y3Vyc29yOnBvaW50",
  "ZXI7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6MTBweDttYXJnaW4tYm90dG9tOjM2cHg7dHJhbnNpdGlvbjpi",
  "YWNrZ3JvdW5kIC4xNXM7fQouaG9tZS1uZXctYnRuOmhvdmVye2JhY2tncm91bmQ6IzVhMGMxODt9Ci5ob21lLXNlY3Rpb24tbGFi",
  "ZWx7Zm9udC1zaXplOi43MnJlbTt0ZXh0LXRyYW5zZm9ybTp1cHBlcmNhc2U7bGV0dGVyLXNwYWNpbmc6LjEyZW07Y29sb3I6Izg4",
  "ODtmb250LXdlaWdodDo3MDA7bWFyZ2luLWJvdHRvbToxMnB4O30KLmhvbWUtZW1wdHl7YmFja2dyb3VuZDp3aGl0ZTtib3JkZXIt",
  "cmFkaXVzOjEycHg7cGFkZGluZzozMnB4O3RleHQtYWxpZ246Y2VudGVyO2NvbG9yOiNhYWE7Zm9udC1zaXplOi45NXJlbTtib3Jk",
  "ZXI6MnB4IGRhc2hlZCAjZTBkOGQ4O30KLnNoZWV0LWNhcmR7YmFja2dyb3VuZDp3aGl0ZTtib3JkZXItcmFkaXVzOjEwcHg7Ym9y",
  "ZGVyOjFweCBzb2xpZCAjZThlMGUwO3BhZGRpbmc6MThweCAyMHB4O21hcmdpbi1ib3R0b206MTBweDtjdXJzb3I6cG9pbnRlcjtk",
  "aXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDoxNnB4O3RyYW5zaXRpb246YWxsIC4xNXM7Ym94LXNoYWRvdzowIDFw",
  "eCA0cHggcmdiYSgwLDAsMCwuMDUpO30KLnNoZWV0LWNhcmQ6aG92ZXJ7Ym9yZGVyLWNvbG9yOiM2QjBFMUU7Ym94LXNoYWRvdzow",
  "IDJweCAxMnB4IHJnYmEoMTA3LDE0LDMwLC4xMik7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTFweCk7fQouc2hlZXQtaWNvbntmb250",
  "LXNpemU6MS44cmVtO2ZsZXgtc2hyaW5rOjA7fQouc2hlZXQtaW5mb3tmbGV4OjE7fQouc2hlZXQtbmFtZXtmb250LXNpemU6MXJl",
  "bTtmb250LXdlaWdodDo3MDA7Y29sb3I6IzFhMWExYTttYXJnaW4tYm90dG9tOjNweDt9Ci5zaGVldC1tZXRhe2ZvbnQtc2l6ZTou",
  "OHJlbTtjb2xvcjojODg4O30KLnNoZWV0LWRhdGV7Zm9udC1zaXplOi44MnJlbTtmb250LXdlaWdodDo2MDA7Y29sb3I6IzZCMEUx",
  "RTt9Ci5zaGVldC1kZWxldGV7YmFja2dyb3VuZDpub25lO2JvcmRlcjoxcHggc29saWQgI2RkZDtib3JkZXItcmFkaXVzOjZweDtw",
  "YWRkaW5nOjZweCAxMHB4O2N1cnNvcjpwb2ludGVyO2NvbG9yOiNjNDQ7Zm9udC1zaXplOi43NXJlbTtmbGV4LXNocmluazowO3Ry",
  "YW5zaXRpb246YWxsIC4xNXM7fQouc2hlZXQtZGVsZXRlOmhvdmVye2JhY2tncm91bmQ6I2ZlZTtib3JkZXItY29sb3I6I2M0NDt9",
  "Ci5zaGVldC1sb2FkLWJ0bntiYWNrZ3JvdW5kOiM2QjBFMUU7Y29sb3I6d2hpdGU7Ym9yZGVyOm5vbmU7Ym9yZGVyLXJhZGl1czo2",
  "cHg7cGFkZGluZzo3cHggMTZweDtmb250LXNpemU6LjgycmVtO2ZvbnQtZmFtaWx5OidTb3VyY2UgU2FucyAzJyxzYW5zLXNlcmlm",
  "O2ZvbnQtd2VpZ2h0OjYwMDtjdXJzb3I6cG9pbnRlcjtmbGV4LXNocmluazowO3RyYW5zaXRpb246YmFja2dyb3VuZCAuMTVzO30K",
  "LnNoZWV0LWxvYWQtYnRuOmhvdmVye2JhY2tncm91bmQ6IzVhMGMxODt9Ci5idWRnZXQtcGFnZXtkaXNwbGF5OmZsZXg7ZmxleC1k",
  "aXJlY3Rpb246Y29sdW1uO2ZsZXg6MTtvdmVyZmxvdzpoaWRkZW47fQouYnVkZ2V0LXRvcC1iYXJ7YmFja2dyb3VuZDp3aGl0ZTti",
  "b3JkZXItYm90dG9tOjFweCBzb2xpZCAjZThlMGUwO3BhZGRpbmc6MTJweCAyNHB4O2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpj",
  "ZW50ZXI7Z2FwOjIwcHg7ZmxleC13cmFwOndyYXA7fQouYnVkZ2V0LWNsaWVudHtmb250LWZhbWlseTonUGxheWZhaXIgRGlzcGxh",
  "eScsc2VyaWY7Zm9udC1zaXplOjFyZW07Zm9udC13ZWlnaHQ6NjAwO2NvbG9yOiMxYTFhMWE7fQouYnVkZ2V0LXRvcC10b3RhbHN7",
  "ZGlzcGxheTpmbGV4O2dhcDoyMHB4O30KLmJ0dC1pdGVte2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47YWxpZ24t",
  "aXRlbXM6Y2VudGVyO30KLmJ0dC1pdGVtIHNwYW57Zm9udC1zaXplOi42OHJlbTt0ZXh0LXRyYW5zZm9ybTp1cHBlcmNhc2U7bGV0",
  "dGVyLXNwYWNpbmc6LjA4ZW07Y29sb3I6Izg4ODt9Ci5idHQtaXRlbSBzdHJvbmd7Zm9udC1zaXplOjFyZW07Zm9udC13ZWlnaHQ6",
  "NzAwO30KLmJ0dC1uZXR7Ym9yZGVyLWxlZnQ6MXB4IHNvbGlkICNlZWU7cGFkZGluZy1sZWZ0OjIwcHg7fQouYnVkZ2V0LWJvZHl7",
  "ZmxleDoxO292ZXJmbG93LXk6YXV0bztwYWRkaW5nOjIwcHggMjRweDt9Ci5idWRnZXQtd3JhcHtkaXNwbGF5OmdyaWQ7Z3JpZC10",
  "ZW1wbGF0ZS1jb2x1bW5zOjFmciAxZnI7Z2FwOjIwcHg7fQouYnVkZ2V0LXNlY3Rpb257YmFja2dyb3VuZDp3aGl0ZTtib3JkZXIt",
  "cmFkaXVzOjEycHg7Ym94LXNoYWRvdzowIDJweCAxMnB4IHJnYmEoMCwwLDAsLjA3KTtvdmVyZmxvdzpoaWRkZW47ZGlzcGxheTpm",
  "bGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjt9Ci5idWRnZXQtc2VjdGlvbi1oZWFke2Rpc3BsYXk6ZmxleDtqdXN0aWZ5LWNvbnRl",
  "bnQ6c3BhY2UtYmV0d2VlbjthbGlnbi1pdGVtczpjZW50ZXI7cGFkZGluZzoxNHB4IDE4cHg7Zm9udC1mYW1pbHk6J1BsYXlmYWly",
  "IERpc3BsYXknLHNlcmlmO2ZvbnQtc2l6ZToxcmVtO2ZvbnQtd2VpZ2h0OjcwMDtsZXR0ZXItc3BhY2luZzouMDRlbTt9Ci5pbmNv",
  "bWUtaGVhZHtiYWNrZ3JvdW5kOiNlOGY1ZWE7Y29sb3I6IzFhNWMyNTtib3JkZXItYm90dG9tOjJweCBzb2xpZCAjYjhkZmMwO30K",
  "LmV4cGVuc2UtaGVhZHtiYWNrZ3JvdW5kOiNmY2U4ZTg7Y29sb3I6IzdhMWExYTtib3JkZXItYm90dG9tOjJweCBzb2xpZCAjZjBj",
  "MGMwO30KLmJzaC10b3RhbHtmb250LXNpemU6MS4xcmVtO30KLmJ1ZGdldC1zdWJzZWN0aW9ue3BhZGRpbmc6MTRweCAxNnB4O2Jv",
  "cmRlci1ib3R0b206MXB4IHNvbGlkICNmMGVjZTg7fQouYnVkZ2V0LXN1Yi1sYWJlbHtmb250LXNpemU6LjdyZW07dGV4dC10cmFu",
  "c2Zvcm06dXBwZXJjYXNlO2xldHRlci1zcGFjaW5nOi4xZW07Y29sb3I6Izg4ODtmb250LXdlaWdodDo3MDA7bWFyZ2luLWJvdHRv",
  "bToxMHB4O30KLmJnLWhlYWRlci1yb3d7ZGlzcGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtnYXA6NnB4O3BhZGRpbmc6MCA0",
  "cHg7bWFyZ2luLWJvdHRvbTo0cHg7fQouYmctY29sLWxhYmVse2ZvbnQtc2l6ZTouNjVyZW07dGV4dC10cmFuc2Zvcm06dXBwZXJj",
  "YXNlO2xldHRlci1zcGFjaW5nOi4wOGVtO2NvbG9yOiNhYWE7Zm9udC13ZWlnaHQ6NzAwO30KLmJnLXJvd3tkaXNwbGF5OmZsZXg7",
  "YWxpZ24taXRlbXM6Y2VudGVyO2dhcDo2cHg7cGFkZGluZzo3cHggOHB4O2JhY2tncm91bmQ6I2Y4ZjZmMjtib3JkZXItcmFkaXVz",
  "OjdweDtib3JkZXI6MXB4IHNvbGlkICNlZGU4ZTI7bWFyZ2luLWJvdHRvbTo1cHg7fQouYnVkZ2V0LXN1YnRvdGFse2Rpc3BsYXk6",
  "ZmxleDtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjtwYWRkaW5nOjhweCAxMHB4O2JhY2tncm91bmQ6I2Y1ZjNlZjtib3Jk",
  "ZXItcmFkaXVzOjZweDtmb250LXNpemU6Ljg1cmVtO2ZvbnQtd2VpZ2h0OjYwMDtjb2xvcjojNDQ0O21hcmdpbi10b3A6OHB4O30K",
  "LmJ1ZGdldC1ncmFuZHtkaXNwbGF5OmZsZXg7anVzdGlmeS1jb250ZW50OnNwYWNlLWJldHdlZW47YWxpZ24taXRlbXM6Y2VudGVy",
  "O3BhZGRpbmc6MTRweCAxOHB4O2ZvbnQtd2VpZ2h0OjcwMDtmb250LXNpemU6MXJlbTtsZXR0ZXItc3BhY2luZzouMDNlbTt9Ci5p",
  "bmNvbWUtZ3JhbmR7YmFja2dyb3VuZDojMWE1YzI1O2NvbG9yOndoaXRlO30KLmV4cGVuc2UtZ3JhbmR7YmFja2dyb3VuZDojN2Ex",
  "YTFhO2NvbG9yOndoaXRlO30KLmJ1ZGdldC1uZXR7ZGlzcGxheTpmbGV4O2p1c3RpZnktY29udGVudDpzcGFjZS1iZXR3ZWVuO2Fs",
  "aWduLWl0ZW1zOmNlbnRlcjtwYWRkaW5nOjE0cHggMThweDtmb250LXdlaWdodDo3MDA7Zm9udC1zaXplOjEuMDVyZW07Ym9yZGVy",
  "LXRvcDoycHggc29saWQgI2VlZTt9Ci5uZXQtcG9zaXRpdmV7YmFja2dyb3VuZDojZThmNWVhO2NvbG9yOiMxYTVjMjU7fQoubmV0",
  "LW5lZ2F0aXZle2JhY2tncm91bmQ6I2ZjZThlODtjb2xvcjojN2ExYTFhO30KLm1hcmdpbi1kZXRhaWx7ZGlzcGxheTpmbGV4O2Zs",
  "ZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6M3B4O30KLm1hcmdpbi1sYWJlbHtmb250LXNpemU6Ljk1cmVtO2ZvbnQtd2VpZ2h0Ojcw",
  "MDt9Ci5tYXJnaW4tY2FsY3tmb250LXNpemU6LjcycmVtO2ZvbnQtd2VpZ2h0OjQwMDtvcGFjaXR5Oi43O30KLm1hcmdpbi12YWx1",
  "ZXtmb250LXNpemU6MS4ycmVtO2ZvbnQtd2VpZ2h0OjgwMDt9Ci5kZWJ0LWVtcHR5e2ZvbnQtc2l6ZTouOHJlbTtjb2xvcjojYWFh",
  "O2ZvbnQtc3R5bGU6aXRhbGljO3BhZGRpbmc6OHB4IDRweDt9Ci5kZWJ0LWNhdGVnb3J5LWxhYmVse2ZvbnQtc2l6ZTouNjhyZW07",
  "dGV4dC10cmFuc2Zvcm06dXBwZXJjYXNlO2xldHRlci1zcGFjaW5nOi4wOGVtO2NvbG9yOiM5OTk7Zm9udC13ZWlnaHQ6NzAwO21h",
  "cmdpbjo4cHggMCA0cHg7cGFkZGluZzowIDRweDt9Ci5kZWJ0LXJvd3tkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dh",
  "cDo4cHg7cGFkZGluZzo1cHggOHB4O2JhY2tncm91bmQ6I2YwZWNlODtib3JkZXItcmFkaXVzOjZweDttYXJnaW4tYm90dG9tOjNw",
  "eDtib3JkZXItbGVmdDozcHggc29saWQgIzZCMEUxRTt9Ci5kZWJ0LWNyZWRpdG9ye2ZsZXg6MTtmb250LXNpemU6Ljg1cmVtO2Zv",
  "bnQtd2VpZ2h0OjYwMDtjb2xvcjojMmEyYTJhO30KLmRlYnQtZGV0YWlse2ZvbnQtc2l6ZTouNzVyZW07Y29sb3I6Izg4ODt9Ci5k",
  "ZWJ0LWFtb3VudHtmb250LXNpemU6Ljg4cmVtO2ZvbnQtd2VpZ2h0OjcwMDtjb2xvcjojNkIwRTFFO21pbi13aWR0aDo4MHB4O3Rl",
  "eHQtYWxpZ246cmlnaHQ7fQouY29tcC1wYWdle2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47ZmxleDoxO292ZXJm",
  "bG93OmhpZGRlbjt9Ci5jb21wLXBhZ2UtaGVhZGVye2JhY2tncm91bmQ6d2hpdGU7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgI2U4",
  "ZTBlMDtwYWRkaW5nOjE0cHggMjRweDtkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVudDpzcGFj",
  "ZS1iZXR3ZWVuO30KLmNvbXAtcGFnZS10aXRsZXtmb250LWZhbWlseTonUGxheWZhaXIgRGlzcGxheScsc2VyaWY7Zm9udC1zaXpl",
  "OjEuMDVyZW07Zm9udC13ZWlnaHQ6NzAwO2NvbG9yOiMxYTFhMWE7fQouY29tcC1wYWdlLXN1Yntmb250LXNpemU6Ljc4cmVtO2Nv",
  "bG9yOiM4ODg7bWFyZ2luLXRvcDoycHg7fQouY29tcC1zY3JvbGx7ZmxleDoxO292ZXJmbG93LXk6YXV0bztvdmVyZmxvdy14OmF1",
  "dG87cGFkZGluZzoyMHB4IDI0cHg7fQouY29tcC13cmFwe2Rpc3BsYXk6ZmxleDtmbGV4LWRpcmVjdGlvbjpjb2x1bW47Z2FwOjI0",
  "cHg7fQouY29tcC1sb2FkaW5ne3BhZGRpbmc6NDBweDt0ZXh0LWFsaWduOmNlbnRlcjtjb2xvcjojODg4O2ZvbnQtc2l6ZTouOTVy",
  "ZW07fQouY29tcC1lbXB0eXtiYWNrZ3JvdW5kOndoaXRlO2JvcmRlci1yYWRpdXM6MTBweDtwYWRkaW5nOjMycHg7dGV4dC1hbGln",
  "bjpjZW50ZXI7Y29sb3I6Izg4ODtib3JkZXI6MnB4IGRhc2hlZCAjZTBkOGQ4O30KLmNvbXAtZW1wdHkgcHttYXJnaW4tYm90dG9t",
  "OjhweDtmb250LXNpemU6LjlyZW07bGluZS1oZWlnaHQ6MS42O30KLmNvbXAtdGFibGUtd3JhcHtvdmVyZmxvdy14OmF1dG87Ym9y",
  "ZGVyLXJhZGl1czoxMHB4O2JveC1zaGFkb3c6MCAycHggMTJweCByZ2JhKDAsMCwwLC4wNyk7fQouY29tcC10YWJsZXt3aWR0aDox",
  "MDAlO2JvcmRlci1jb2xsYXBzZTpjb2xsYXBzZTtiYWNrZ3JvdW5kOndoaXRlO2ZvbnQtc2l6ZTouODJyZW07fQouY29tcC10aHti",
  "YWNrZ3JvdW5kOiM2QjBFMUU7Y29sb3I6d2hpdGU7cGFkZGluZzoxMHB4IDE0cHg7Zm9udC1zaXplOi43NXJlbTt0ZXh0LXRyYW5z",
  "Zm9ybTp1cHBlcmNhc2U7bGV0dGVyLXNwYWNpbmc6LjA3ZW07Zm9udC13ZWlnaHQ6NzAwO3doaXRlLXNwYWNlOm5vd3JhcDt9Ci5j",
  "b21wLWxhYmVsLXRoe3RleHQtYWxpZ246bGVmdDttaW4td2lkdGg6MTgwcHg7fQouY29tcC15ZWFyLXRoe3RleHQtYWxpZ246cmln",
  "aHQ7bWluLXdpZHRoOjExMHB4O30KLmNvbXAtY2hnLXRoe3RleHQtYWxpZ246cmlnaHQ7bWluLXdpZHRoOjEyMHB4O2ZvbnQtc2l6",
  "ZTouNjhyZW07bGluZS1oZWlnaHQ6MS4zO30KLmNvbXAtdHJlbmQtdGh7dGV4dC1hbGlnbjpjZW50ZXI7bWluLXdpZHRoOjYwcHg7",
  "fQouY29tcC1zZWN0aW9uLWhlYWQgdGR7YmFja2dyb3VuZDojZjVlOGVhO2NvbG9yOiM2QjBFMUU7Zm9udC1zaXplOi42OHJlbTt0",
  "ZXh0LXRyYW5zZm9ybTp1cHBlcmNhc2U7bGV0dGVyLXNwYWNpbmc6LjFlbTtmb250LXdlaWdodDo4MDA7cGFkZGluZzo1cHggMTRw",
  "eDtib3JkZXItdG9wOjJweCBzb2xpZCAjZTBjMGM1O30KLmNvbXAtcm93e2JvcmRlci1ib3R0b206MXB4IHNvbGlkICNmNWYwZjA7",
  "fQouY29tcC1yb3c6aG92ZXJ7YmFja2dyb3VuZDojZmRmOWY5O30KLmNvbXAtYm9sZC1yb3d7YmFja2dyb3VuZDojZjVlOGVhIWlt",
  "cG9ydGFudDt9Ci5jb21wLWJvbGQtcm93OmhvdmVye2JhY2tncm91bmQ6I2YwZTBlMyFpbXBvcnRhbnQ7fQouY29tcC1icmVhay1y",
  "b3cgdGR7Ym9yZGVyLWJvdHRvbToycHggc29saWQgI2QwYTBhODt9Ci5jb21wLWxhYmVse3BhZGRpbmc6N3B4IDE0cHg7Y29sb3I6",
  "IzMzMztmb250LXNpemU6LjgycmVtO3doaXRlLXNwYWNlOm5vd3JhcDt9Ci5jb21wLWJvbGQtcm93IC5jb21wLWxhYmVse2ZvbnQt",
  "d2VpZ2h0OjcwMDtjb2xvcjojNkIwRTFFO2ZvbnQtc2l6ZTouODVyZW07fQouY29tcC12YWx7cGFkZGluZzo3cHggMTRweDt0ZXh0",
  "LWFsaWduOnJpZ2h0O2ZvbnQtZmFtaWx5Om1vbm9zcGFjZTtmb250LXNpemU6LjgycmVtO2NvbG9yOiMxYTFhMWE7d2hpdGUtc3Bh",
  "Y2U6bm93cmFwO30KLmNvbXAtYm9sZC12YWx7Zm9udC13ZWlnaHQ6NzAwO2ZvbnQtc2l6ZTouODhyZW07fQouY29tcC16ZXJve2Nv",
  "bG9yOiNjY2M7fQouY29tcC1uZWd7Y29sb3I6I2M0NDt9Ci5jb21wLWNoZ3twYWRkaW5nOjdweCAxNHB4O3RleHQtYWxpZ246cmln",
  "aHQ7d2hpdGUtc3BhY2U6bm93cmFwO30KLmNoZy1hbXR7Zm9udC1mYW1pbHk6bW9ub3NwYWNlO2ZvbnQtc2l6ZTouODJyZW07Zm9u",
  "dC13ZWlnaHQ6NzAwO30KLmNoZy1wY3R7Zm9udC1zaXplOi42OHJlbTtvcGFjaXR5Oi43NTttYXJnaW4tdG9wOjFweDt9Ci5jb21w",
  "LXVwIC5jaGctYW10e2NvbG9yOiMxYTVjMjU7fQouY29tcC1kbiAuY2hnLWFtdHtjb2xvcjojYzQ0O30KLmNvbXAtZmxhdCAuY2hn",
  "LWFtdHtjb2xvcjojODg4O30KLmNvbXAtdHJlbmR7dGV4dC1hbGlnbjpjZW50ZXI7Zm9udC1zaXplOjEuMXJlbTtmb250LXdlaWdo",
  "dDo3MDA7cGFkZGluZzo3cHggMTBweDt9Ci50cmVuZC11cHtjb2xvcjojMWE1YzI1O30KLnRyZW5kLWRue2NvbG9yOiNjNDQ7fQou",
  "dHJlbmQtZmxhdHtjb2xvcjojODg4O30KLmluc2lnaHQtcGFuZWx7YmFja2dyb3VuZDp3aGl0ZTtib3JkZXItcmFkaXVzOjEycHg7",
  "Ym94LXNoYWRvdzowIDJweCAxMnB4IHJnYmEoMCwwLDAsLjA3KTtvdmVyZmxvdzpoaWRkZW47fQouaW5zaWdodC1oZWFkZXJ7ZGlz",
  "cGxheTpmbGV4O2FsaWduLWl0ZW1zOmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6c3BhY2UtYmV0d2VlbjtwYWRkaW5nOjE2cHggMjBw",
  "eDtib3JkZXItYm90dG9tOjFweCBzb2xpZCAjZjBlOGU4O2JhY2tncm91bmQ6I2ZkZjhmODt9Ci5pbnNpZ2h0LXRpdGxle2ZvbnQt",
  "ZmFtaWx5OidQbGF5ZmFpciBEaXNwbGF5JyxzZXJpZjtmb250LXNpemU6MXJlbTtmb250LXdlaWdodDo3MDA7Y29sb3I6IzFhMWEx",
  "YTt9Ci5pbnNpZ2h0LXN1Yntmb250LXNpemU6Ljc1cmVtO2NvbG9yOiM4ODg7bWFyZ2luLXRvcDoycHg7fQouYnRuLWluc2lnaHR7",
  "YmFja2dyb3VuZDojNkIwRTFFO2NvbG9yOndoaXRlO2JvcmRlcjpub25lO3BhZGRpbmc6MTBweCAyMHB4O2JvcmRlci1yYWRpdXM6",
  "OHB4O2ZvbnQtZmFtaWx5OidTb3VyY2UgU2FucyAzJyxzYW5zLXNlcmlmO2ZvbnQtc2l6ZTouODVyZW07Zm9udC13ZWlnaHQ6NzAw",
  "O2N1cnNvcjpwb2ludGVyO3RyYW5zaXRpb246YmFja2dyb3VuZCAuMTVzO30KLmJ0bi1pbnNpZ2h0OmhvdmVye2JhY2tncm91bmQ6",
  "IzVhMGMxODt9Ci5idG4taW5zaWdodDpkaXNhYmxlZHtvcGFjaXR5Oi42O2N1cnNvcjpkZWZhdWx0O30KLmluc2lnaHQtbG9hZGlu",
  "Z3tkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDoxMnB4O3BhZGRpbmc6MjRweCAyMHB4O2NvbG9yOiM4ODg7Zm9u",
  "dC1zaXplOi45cmVtO30KLmluc2lnaHQtc3Bpbm5lcnt3aWR0aDoyMHB4O2hlaWdodDoyMHB4O2JvcmRlcjoycHggc29saWQgI2Yw",
  "ZThlODtib3JkZXItdG9wLWNvbG9yOiM2QjBFMUU7Ym9yZGVyLXJhZGl1czo1MCU7YW5pbWF0aW9uOnNwaW4gLjhzIGxpbmVhciBp",
  "bmZpbml0ZTtmbGV4LXNocmluazowO30KQGtleWZyYW1lcyBzcGlue3Rve3RyYW5zZm9ybTpyb3RhdGUoMzYwZGVnKTt9fQouaW5z",
  "aWdodC1wcm9tcHR7cGFkZGluZzoyNHB4IDIwcHg7Y29sb3I6I2FhYTtmb250LXNpemU6Ljg4cmVtO2ZvbnQtc3R5bGU6aXRhbGlj",
  "O30KLmluc2lnaHQtYm9keXtwYWRkaW5nOjIwcHg7ZGlzcGxheTpmbGV4O2ZsZXgtZGlyZWN0aW9uOmNvbHVtbjtnYXA6NnB4O30K",
  "Lmluc2lnaHQtaGVhZGluZ3tmb250LWZhbWlseTonUGxheWZhaXIgRGlzcGxheScsc2VyaWY7Zm9udC1zaXplOi45NXJlbTtmb250",
  "LXdlaWdodDo3MDA7Y29sb3I6IzZCMEUxRTttYXJnaW4tdG9wOjEwcHg7cGFkZGluZy1ib3R0b206NHB4O2JvcmRlci1ib3R0b206",
  "MXB4IHNvbGlkICNmMGU4ZTg7fQouaW5zaWdodC1saW5le2ZvbnQtc2l6ZTouODhyZW07Y29sb3I6IzMzMztsaW5lLWhlaWdodDox",
  "LjY7fQouaW5zaWdodC1idWxsZXR7Zm9udC1zaXplOi44OHJlbTtjb2xvcjojMzMzO2xpbmUtaGVpZ2h0OjEuNjtwYWRkaW5nLWxl",
  "ZnQ6MTZweDtwb3NpdGlvbjpyZWxhdGl2ZTt9Ci5pbnNpZ2h0LWJ1bGxldDo6YmVmb3Jle2NvbnRlbnQ6ImJ1bGxldCI7cG9zaXRp",
  "b246YWJzb2x1dGU7bGVmdDo0cHg7Y29sb3I6IzZCMEUxRTtmb250LXNpemU6LjZyZW07fQouaW5zaWdodC1nYXB7aGVpZ2h0OjZw",
  "eDt9Cg==",
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
    farmProducts:[{quantity:"",kind:"",pricePerUnit:"",unit:"bu"}],
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
    budgetCrops:[{acres:"",crop:"",yieldPerAcre:"",unit:"bu",price:""}],
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
            <span className="bg-col-label" style={{width:115}}>Value</span>
            <span style={{width:32}}></span>
          </div>
          {data.budgetCrops.map((r, i) => {
            const rv = numVal(r.acres) * numVal(r.yieldPerAcre) * numVal(r.price);
            return (
              <div key={i} className="bg-row">
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
                <CalcRow value={rv} style={{width:115}} />
                <button className="remove-btn" onClick={() => removeRow("budgetCrops",i)}>x</button>
              </div>
            );
          })}
          <button className="add-btn"
            onClick={() => addRow("budgetCrops",{acres:"",crop:"",yieldPerAcre:"",unit:"bu",price:""})}>
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
              <div key={i} className="bg-row">
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
            <div key={i} className="bg-row">
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
            <div key={i} className="bg-row">
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
  const addRow = (k, tpl) => setData(d => ({ ...d, [k]: [...d[k], { ...tpl }] }));
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
  const farmProdTotal = data.farmProducts.reduce((s,r)=>s+n(r.quantity)*n(r.pricePerUnit),0);
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
  const budgetCropTotal = data.budgetCrops.reduce((s,r)=>s+n(r.acres)*n(r.yieldPerAcre)*n(r.price),0);
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
    const fp = (d.farmProducts||[]).reduce((s,r)=>s+m(r.quantity)*m(r.pricePerUnit),0);
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
${blank(data.farmProducts.filter(r=>r.kind),3).map(r=>`<div class="trow"><span class="c1">${r.quantity?r.quantity+" "+r.unit:""}</span><span class="c2">${r.kind||""}</span><span class="c3">${r.pricePerUnit?"$"+r.pricePerUnit+"/"+r.unit:""}</span><span class="c5">${pFmt(numVal(r.quantity)*numVal(r.pricePerUnit))}</span></div>`).join("")}
<div class="sec">Growing Crops:</div>
${blank(data.cropInvestment.filter(r=>r.cropType),2).map(r=>`<div class="trow"><span class="c1">${r.cropType||""}</span><span class="c2">${r.acres?" acres: "+r.acres:""}</span><span class="c5">${pFmt(numVal(r.acres)*numVal(r.valuePerAcre))}</span></div>`).join("")}
<div class="subtot"><span>TOTAL CURRENT ASSETS:</span><span>${pFmt(totalCurrentAssets)||"$0"}</span></div>
<div class="sec">Breeding Stock:</div>
${blank(data.breedingStock.filter(r=>r.kind),3).map(r=>`<div class="trow"><span class="c1">${r.number||""}</span><span class="c2">${r.kind||""}</span><span class="c5">${pFmt(r.value)}</span></div>`).join("")}
<div class="sec">Real Estate:</div>
<div class="trow th"><span class="c1">Acres</span><span class="c2">Type</span><span class="c3">$/Acre</span><span class="c5">Total Value</span></div>
${blank(data.realEstate.filter(r=>r.reType||r.acres),3).map(r=>`<div class="trow"><span class="c1">${r.acres?r.acres+" ac":""}</span><span class="c2">${r.reType||""}</span><span class="c3">${r.valuePerAcre?"$"+r.valuePerAcre+"/ac":""}</span><span class="c5">${pFmt(numVal(r.acres)*numVal(r.valuePerAcre))}</span></div>`).join("")}
<div class="sec">Titled Vehicles:</div>
${blank(data.vehicles.filter(r=>r.make),2).map(r=>`<div class="trow"><span class="c1">${[r.year,r.make].filter(Boolean).join(" ")}</span><span class="c2">${r.vin||""}</span><span class="c5">${pFmt(r.value)}</span></div>`).join("")}
<div class="sec">Machinery:</div>
${blank(data.machinery.filter(r=>r.make),3).map(r=>`<div class="trow"><span class="c1">${[r.year,r.make].filter(Boolean).join(" ")}</span><span class="c2">${r.serial||""}</span><span class="c5">${pFmt(r.value)}</span></div>`).join("")}
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
            <div key={i} className="row-entry">
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
            <div key={i} className="row-entry">
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
            <div key={i} className="row-entry">
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
            <span className="fp-col-label" style={{width:115}}>Total</span>
            <span style={{width:32}}></span>
          </div>
          {data.farmProducts.map((r,i) => {
            const rv = numVal(r.quantity) * numVal(r.pricePerUnit);
            return (
              <div key={i} className="fp-row">
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
                <CalcRow value={rv} style={{width:115}} />
                <button className="remove-btn" onClick={()=>removeRow("farmProducts",i)}>x</button>
              </div>
            );
          })}
          <button className="add-btn" onClick={()=>addRow("farmProducts",{quantity:"",kind:"",pricePerUnit:"",unit:"bu"})}>+ Add Farm Product</button>
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
              <div key={i} className="fp-row">
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
            <div key={i} className="row-entry">
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
            <div key={i} className="row-entry">
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
            <div key={i} className="row-entry">
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
              <div key={i} className="fp-row">
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
            <div key={i} className="row-entry">
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
              <div key={i} className="mach-row">
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
              <div key={i} className="mach-row">
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
            <div key={i} className="row-entry">
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
            <div key={i} className="row-entry">
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
            <div key={i} className="row-entry">
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
            <div key={i} className="row-entry">
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
            <div key={i} className="row-entry">
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
            <div key={i} className="row-entry">
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
            <div key={i} className="row-entry">
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
            <div key={i} className="row-entry">
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
