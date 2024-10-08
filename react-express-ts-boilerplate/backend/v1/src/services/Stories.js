import Story from "../models/Stories.js";

const insert = async (StoryData) => {
  // ...saving...
  const story = new Story(StoryData);
  return story.save();
};

const list = () => {
  // ...listing...
  return Story.find({});
};

const findAll = async (payload) => {
  try {
    const [totalRecords, data] = await Promise.all([
      Story.countDocuments({ author: payload.userId }), // Get the total number of records
      Story.find({ author: payload.userId })
        .sort({ createdAt: -1 }) // Sort by newest to oldest
        .skip(payload.skip)
        .limit(payload.limit), // Apply pagination
    ]);

    return { total: totalRecords, data };
  } catch (error) {
    throw new Error(`Data retrieval failed: ${error.message}`);
  }
};

const findOne = (where) => {
  // ...listing...
  return Story.findOne(where);
};

const modify = (where, updateData) => {
  return Story.findOneAndUpdate(where, updateData, { new: true });
};

const remove = (id) => {
  return Story.findByIdAndDelete(id);
};

export { insert, list, findOne, modify, remove, findAll };
