import numpy as np
import pandas as pd
from pathlib import Path
from pyAudioAnalysis import audioTrainTest as aT


if __name__ == '__main__':
    root_dir = Path("/Users/pma007/Downloads/2018 Mini-Challenge 1")
    dir_train = root_dir / "ALL BIRDS"
    dir_test = root_dir / "Test Birds from Kasios"

    ROSE_CRESTED_IX = 16
    ROSE_CRESTED_CL = "Rose-Crested-Blue-Pipit"
    ROSE_CRESTED_TSH = 0.1

    species = [str(d) for d in dir_train.iterdir() if d.is_dir()]

    aT.featureAndTrain(
        species,
        # [
        #     "Bent-Beak-Riffraff",
        #     "Blue-collared-Zipper",
        #     "Bombadil",
        #     "Broad-winged-Jojo",
        #     "Canadian-Cootamum",
        #     "Carries-Champagne-Pipit",
        #     "Darkwing-Sparrow",
        #     "Eastern-Corn-Skeet",
        #     "Green-Tipped-Scarlet-Pipit",
        #     "Lesser-Birchbeere",
        #     "Orange-Pine-Plover",
        #     "Ordinary-Snape",
        #     "Pinkfinch",
        #     "Purple-Tooting-Tout",
        #     "Qax",
        #     "Queenscoat",
        #     "Rose-Crested-Blue-Pipit",
        #     "Scrawny-Jay",
        #     "Vermillion-Trillian",
        # ],
        1.0,
        1.0,
        aT.shortTermWindow,
        aT.shortTermStep,
        "svm",
        "svmSMtemp",
        False,
    )

    csv = ",".join([str(i) for i in range(1, len(species)+1)])
    csv_file = root_dir / "kasios-test-classification.csv"

    updt_tk_file = root_dir / "test-birds-location-proba.csv"
    tk_df = pd.read_csv(root_dir / "Test Birds Location.csv")
    tk_df['clf_proba'] = np.zeros(tk_df.shape[0])

    rose_crested_n = 0

    for f in dir_test.glob("*.mp3"):
        (pred_ix, predict_proba, classes) = aT.fileClassification(str(f), "svmSMtemp", "svm")
        sort_ixs = np.argsort(predict_proba)[::-1]
        out = ["{0} ({1:.2%})".format(classes[i], predict_proba[i]) for i in sort_ixs]
        # print(out)
        csv += "\n"
        csv += ",".join(out)
        tk_df.loc[tk_df["ID"] == int(f.stem), ["clf_proba"]] = predict_proba[np.array(classes) == ROSE_CRESTED_CL][0]
        # print("{0} ({1})".format(classes[int(pred_ix)], predict_proba[int(pred_ix)]))
        if predict_proba[ROSE_CRESTED_IX] >= ROSE_CRESTED_TSH:
            rose_crested_n += 1
    print("Number of Rose Crested Blue Pipit proba >= {0}: {1}".format(ROSE_CRESTED_TSH, rose_crested_n))

    # tk_df.rename(columns=lambda )
    tk_df = tk_df.rename(columns=lambda c: c.lower().strip())
    tk_df.to_csv(str(updt_tk_file), index=False)

    with csv_file.open('w') as f:
        f.write(csv)
