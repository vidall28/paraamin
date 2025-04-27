import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { internal } from "./_generated/api";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const savePhoto = mutation({
  args: {
    storageId: v.id("_storage"),
    caption: v.string(),
    date: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("photos", {
      storageId: args.storageId,
      caption: args.caption,
      date: args.date,
      url: await ctx.storage.getUrl(args.storageId) ?? "",
    });
  },
});

export const listPhotos = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("photos")
      .withIndex("by_date")
      .order("desc")
      .collect();
  },
});
