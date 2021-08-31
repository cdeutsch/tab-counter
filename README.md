# Tab Counter for macOS

Counts the number of open browser tabs for each supported browser and logs the data in [Axiom](https://www.axiom.co) every X minutes.

![image](https://user-images.githubusercontent.com/404765/131569077-dee902c7-3668-49df-82c1-246227567890.png)

## Install

```
npm install
```

## Configure

Copy `.env-sample` to `.env` and set the following values:

- `AXIOM_INGEST_TOKEN`: The Axiom Ingest Token that has access to the Axiom Dataset you're using.
- `AXIOM_DATASET`: The Axiom Dataset to use.
- `WHO`: Your name or machine name.

## Run

```
npm run tab-count -S
```

## Options

### `--schedule` or `-S`

Run on a schedule every 5 minutes (default interval)

```
npm run tab-count -S
```

### `--interval` or `-i`

Set the run interval in minutes

```
npm run tab-count -S -i 15
```

## Supported Browsers

- Brave Browser
- Safari
- Google Chrome
- Google Chrome Canary
- Microsoft Edge
- Microsoft Edge Beta
- Microsoft Edge Dev

## View Data in Axiom

![image](https://user-images.githubusercontent.com/404765/131571967-ae361667-74ec-4e1f-8c91-d6f80cd6d683.png)

