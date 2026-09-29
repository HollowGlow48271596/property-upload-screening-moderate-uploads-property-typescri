import assert from "node:assert/strict";
import { screenCaption } from "./property_upload_service.ts";

const approved = screenCaption({ image: "data:image/jpeg;base64,AA", filename: "boiler.jpg", caption: "Boiler leak in unit 4", requestType: "maintenance" });
assert.deepEqual(approved, { status: "approved", reason: "Caption matches the property workflow" });

const review = screenCaption({ image: "data:image/jpeg;base64,AA", filename: "form.jpg", caption: "Please add the tenant bank account", requestType: "tenant-document" });
assert.equal(review.status, "needs_review");
console.log("property caption decisions pass");
