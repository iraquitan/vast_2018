# -*- coding: utf-8 -*-
import pandas as pd
import dateutil


def clean_datetime(dt):
    return dateutil.parser.parse("%H:%s")


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
