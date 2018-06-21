# -*- coding: utf-8 -*-
import re
import numpy as np
import pandas as pd
import dateutil


def clean_datetime(dates, times):
    # return dateutil.parser.parse("%m/%d/%Y %H:%M")
    default_time = "12:00"
    default_date = "01/01/2018"

    times_dict = {
        "dawn": "05:55",
        "early morning": "07:30",
        "night": "20:00",
        "morning": "09:00",
        "am": "09:00",
        "pm": "16:00",
        "nan": default_time,
        "849": "08:49",
        "10 pm to 12 am": "23:00",
        "??": default_time,
        "xx:xx": default_time
    }

    datetimes = []
    for d, t in zip(dates, times):
        t = str(t).lower()
        tnums = re.findall("\d+", t)
        dnums = re.findall("\d+", d)
        if t in times_dict.keys():
            t = times_dict[t]
        elif len(tnums) == 2:
            t = ":".join(tnums)
        elif len(tnums) == 1:
            if len(tnums[0]) > 2:
                t = f"{tnums[0][0:2]}:{tnums[0][2:]}"
            else:
                t= f"{tnums[0]}:00"
        if d == "4/3/2012":
            d = "2012-03-04"
        elif d == "0000-00-00":
            d = default_date
        elif len(dnums) == 3:
            if dnums[1] == "00":
                dnums[1] = "01"
                # d = f"{dnums[0]}-01-{dnums[2]}"
            if dnums[2] == "00":
                dnums[2] = "01"
                # d = f"{dnums[0]}-{dnums[1]}-01"
            d = "-".join(dnums)
        try:
            datetimes.append(dateutil.parser.parse(d + " " + t))
        except ValueError as e:
            print(f"{d} {t}")
            datetimes.append(dateutil.parser.parse(default_date + " " + default_time))
    return datetimes


def clean_csv(csv_path):
    df = pd.read_csv(
        csv_path,
        parse_dates=[["Date", "Time"]],
        infer_datetime_format=True,
        na_values=["?", "?:?", "??:??", "xx:xx", "no score"],
        date_parser=clean_datetime,
        converters={
            "Vocalization_type": lambda x: x.strip() if x != "?" else np.nan,
            "X": lambda x: int(re.findall("\d+", x)[0]),
                    "Y": lambda x: int(re.findall("\d+", x)[0])}
    )
    for c in df.select_dtypes(include=["object"]).columns:
        df[c] = df[c].str.lower()
    df = df.rename(columns=lambda c: c.lower().replace(" ", "_"))
    return df.to_json(orient="records", date_format="iso")
