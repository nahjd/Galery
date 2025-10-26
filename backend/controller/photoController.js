const mongoose = require("mongoose");
const Photo = require("../models/photoModels");

// GET /api/photo
async function getAll(req, res, next) {
  try {
    const photos = await Photo.find().sort({ createdAt: -1 }).lean();
    res.json(photos);
  } catch (e) { next(e); }
}

// GET /api/photo/:id
async function getById(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });
    const photo = await Photo.findById(id).lean();
    if (!photo) return res.status(404).json({ message: "Not found" });
    res.json(photo);
  } catch (e) { next(e); }
}

// POST /api/photo
async function createOne(req, res, next) {
  try {
    const { title, url, tags } = req.body;
    if (!url) return res.status(400).json({ message: "url is required" });
    const doc = await Photo.create({ title: title || "", url, tags: tags || [] });
    console.log("📸 Created:", doc._id);
    res.status(201).json({ message: "Created", id: doc._id });
  } catch (e) { next(e); }
}

// PATCH /api/photo/:id
async function updatePartial(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });
    const updated = await Photo.findByIdAndUpdate(id, req.body, { new: true }).lean();
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (e) { next(e); }
}

// DELETE /api/photo/:id
async function removeOne(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });
    const deleted = await Photo.findByIdAndDelete(id).lean();
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (e) { next(e); }
}

module.exports = { getAll, getById, createOne, updatePartial, removeOne };
