# -*- coding: utf-8 -*-
import numpy as np
import pandas as pd
import dateutil


def clean_datetime(dates, times):
    # return dateutil.parser.parse("%m/%d/%Y %H:%M")
    times_dict = {
        "dawn": "05:55",
        "early morning": "07:30",
        "night": "20:00",
        "morning": "09:00",
        "am": "09:00"
    }
    default_time = "00:00"
    default_date = "01/01/2018"
    if isinstance(dates, np.ndarray) and isinstance(times, np.ndarray):
        datetimes = []
        for d, t in zip(dates, times):
            t = str(t).lower()
            if t in times_dict.keys():
                t = times_dict[t]
            try:
                datetimes.append(dateutil.parser.parse(d + " " + t))
            except ValueError as e:
                print(f"{d} {t}")
                datetimes.append(dateutil.parser.parse(default_date + " " + default_time))
        return datetimes
    else:
        times = str(times).lower()
        try:
            ret = dateutil.parser.parse(dates + " " + times)
        except (ValueError, TypeError) as e:
            print(f"{dates} {times}")
            ret = dateutil.parser.parse(default_date + " " + default_time)
        return ret


def clean_csv(csv_path):
    df = pd.read_csv(
        csv_path,
        parse_dates=[["Date", "Time"]],
        infer_datetime_format=True,
        na_values=["?", "?:?", "??:??", "no score"],
        date_parser=clean_datetime
    )
    for c in df.select_dtypes(include=["object"]).columns:
        df[c] = df[c].str.lower()
    df = df.rename(columns=lambda c: c.lower().replace(" ", "_"))
    return df.to_json(orient="records")
