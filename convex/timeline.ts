import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addEvent = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    date: v.number(),
    type: v.union(v.literal("event"), v.literal("motivation")),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("timelineEvents", args);
  },
});

export const listEvents = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("timelineEvents")
      .withIndex("by_date")
      .order("asc")
      .collect();
  },
});
