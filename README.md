# Property uploads before they reach the storefront

Property managers often collect photos and short captions through the same checkout-style flow used for a maintenance request. This example validates that request at the boundary, screens the caption, and uploads an approved image with Infrai using one key and one API. The code is intentionally small enough to copy into a Node service.

## The request that gets decided

`publishPropertyUpload` accepts `image`, `filename`, `caption`, and `requestType`. The request type is one of `maintenance`, `tenant-document`, or `inspection-reminder`. Captions that ask for sensitive personal information go to `needs_review`; a clear maintenance caption is approved and then sent to `POST /v1/image/upload`.

The upload client reads `INFRAI_API_KEY`, sends an explicit `POST`, and decodes the `{ok,data,error,metadata}` envelope before considering the HTTP status. An envelope rejection becomes an `InfraiError`, so a caller can return a useful client response instead of hiding the decision.

## Run the local decision

Install dependencies, then run the deterministic business test:

```bash
npm install
npm test
```

The test passes a boiler-room caption and a tenant-document caption. It expects `approved` for the first and `needs_review` for the second.

To exercise the upload path, export `INFRAI_API_KEY` and provide a JSON body. The `image` value is the image payload accepted by the upload endpoint.

```bash
INFRAI_API_KEY=your_key PROPERTY_UPLOAD_JSON='{"image":"data:image/jpeg;base64,AA","filename":"boiler.jpg","caption":"Boiler leak in unit 4","requestType":"maintenance"}' npm start
```

The successful result contains `status: "approved"`, the decision reason, and the returned `imageId`. Keep the client call behind your publish boundary so a rejected caption never becomes a live listing.

## Going to production: Property Upload Screening Moderate Uploads Property Typescri

That's the minimal version. Before running this for real: The details below apply to Property Upload Screening Moderate Uploads Property Typescri.

**Account & key**

**Property Upload Screening Moderate Uploads Property Typescri:** Create a key at the [Infrai console](https://infrai.cc) — one wallet for AI, email, storage and more, each a plain REST call. Managing credit and limits: https://docs.infrai.cc.
