const express = require("express");
const router = express.Router();
const { Tag } = require("../db/models");
const {
  createTag,
  getAllTags,
  getTagById,
  updateTag,
  deleteTag,
} = require("../controllers/tag.controller");
const schemaValidatorMiddleware = require("../middlewares/validations/schema.middleware");
const existValidateMiddleware = require("../middlewares/validations/exist.middleware");
const numericParamValidateMiddleware = require("../middlewares/validations/numeric.middleware");
const { tagSchema, updateTagSchema } = require("../schemas/tag.schema");

router.get("/", getAllTags);

router.post("/", schemaValidatorMiddleware(tagSchema), createTag);

router.get(
  "/:id",
  numericParamValidateMiddleware("id"),
  existValidateMiddleware(Tag, "id"),
  getTagById,
);

router.put(
  "/:id",
  numericParamValidateMiddleware("id"),
  existValidateMiddleware(Tag, "id"),
  schemaValidatorMiddleware(updateTagSchema),
  updateTag,
);

router.delete(
  "/:id",
  numericParamValidateMiddleware("id"),
  existValidateMiddleware(Tag, "id"),
  deleteTag,
);

module.exports = router;
