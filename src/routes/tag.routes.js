const express = require("express");
const router = express.Router();
const { Tag, Post } = require("../db/models");
const {
  createTag,
  getAllTags,
  getTagById,
  updateTag,
  assignTagToPost,
  deleteTag,
} = require("../controllers/tag.controller");
const schemaValidatorMiddleware = require("../middlewares/validations/schema.middleware");
const querySchemaValidatorMiddleware =
  require("../middlewares/validations/schema.middleware").querySchemaValidatorMiddleware;
const existValidateMiddleware = require("../middlewares/validations/exist.middleware");
const numericParamValidateMiddleware = require("../middlewares/validations/numeric.middleware");
const {
  tagSchema,
  updateTagSchema,
  getAllTagsQuerySchema,
  assignTagSchema,
} = require("../schemas/tag.schema");

router.get(
  "/",
  querySchemaValidatorMiddleware(getAllTagsQuerySchema),
  existValidateMiddleware(Post, "post_id", { optional: true }),
  getAllTags,
);

router.post(
  "/",
  schemaValidatorMiddleware(tagSchema),
  existValidateMiddleware(Post, "post_id", { optional: true }),
  createTag,
);

router.get(
  "/:id",
  numericParamValidateMiddleware("id"),
  existValidateMiddleware(Tag, "id"),
  getTagById,
);

router.patch(
  "/:id",
  numericParamValidateMiddleware("id"),
  existValidateMiddleware(Tag, "id"),
  schemaValidatorMiddleware(updateTagSchema),
  updateTag,
);

router.post(
  "/:id",
  numericParamValidateMiddleware("id"),
  existValidateMiddleware(Tag, "id"),
  schemaValidatorMiddleware(assignTagSchema),
  existValidateMiddleware(Post, "post_id"),
  assignTagToPost,
);

router.delete(
  "/:id",
  numericParamValidateMiddleware("id"),
  existValidateMiddleware(Tag, "id"),
  deleteTag,
);

module.exports = router;
