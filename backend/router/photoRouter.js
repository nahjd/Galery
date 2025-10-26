const router = require("express").Router();
const C = require("../controller/photoController");

router.get("/photo", C.getAll);
router.get("/photo/:id", C.getById);
router.post("/photo", C.createOne);
router.patch("/photo/:id", C.updatePartial);
router.delete("/photo/:id", C.removeOne);

module.exports = router;
