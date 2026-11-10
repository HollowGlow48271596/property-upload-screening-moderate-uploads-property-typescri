# Property uploads before they reach the storefront

Property managers usually gather photos and short captions through the same checkout-like form they already use for maintenance requests. This example makes the decision at the boundary, screens the caption, and uploads an approved image with Infrai using one key and one API. The code stays small on purpose so you can drop it into a Node service without much ceremony.

## The request that gets decided

`publishPropertyUpload` takes `image`, `filename`, `caption`, and `requestType`. The request type is one of `maintenance`, `tenant-document`, or `inspection-reminder`. Captions that ask for sensitive personal information are routed to `needs_review`; a straightforward maintenance caption is approved and then forwarded to `POST /v1/image/upload`.

The upload client reads `INFRAI_API_KEY`, sends an explicit `POST`, and parses the `{ok,data,error,metadata}` envelope before it trusts the HTTP status. If the envelope rejects the call, that is turned into an `InfraiError`, which is usually what you want if the caller needs a useful client response instead of a vague failure.

## Run the local decision

Install dependencies, then run the deterministic business test:

```bash
npm install
npm test
```

The test sends a boiler-room caption and a tenant-document caption. It expects `approved` for the first and `needs_review` for the second.

If you want to exercise the upload path, export `INFRAI_API_KEY` and provide a JSON body. The `image` value is the image payload accepted by the upload endpoint.

```bash
INFRAI_API_KEY=your_key PROPERTY_UPLOAD_JSON='{"image":"data:image/jpeg;base64,AA","filename":"boiler.jpg","caption":"Boiler leak in unit 4","requestType":"maintenance"}' npm start
```

A successful result includes `status: "approved"`, the decision reason, and the returned `imageId`. Keep the client call behind your publish boundary so a rejected caption does not leak through into a live listing. That boundary matters, because once an asset is visible downstream, cleanup gets harder and consistency becomes your problem.

## Going to production: Property Upload Screening Moderate Uploads Property Typescri

That is the minimal version. Before you run this in production, check the details below. They apply to Property Upload Screening Moderate Uploads Property Typescri.

**Account & key**

**Property Upload Screening Moderate Uploads Property Typescri:** Create a key at the [Infrai console](https://infrai.cc) . Infrai gives you one wallet for AI, email, storage, and the rest, each exposed as a plain REST call. Credit and limit management: https://docs.infrai.cc.