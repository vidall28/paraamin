import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  photos: defineTable({
    url: v.string(),
    caption: v.string(),
    date: v.number(),
    storageId: v.id("_storage"),
  }).index("by_date", ["date"]),
  
  timelineEvents: defineTable({
    title: v.string(),
    description: v.string(),
    date: v.number(),
    type: v.union(v.literal("event"), v.literal("motivation")),
    imageStorageId: v.optional(v.id("_storage")),
  }).index("by_date", ["date"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
