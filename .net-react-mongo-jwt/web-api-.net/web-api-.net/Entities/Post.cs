using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace web_api_.net.Entities
{
    public class Post
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("content")]
        public string? Content { get; set; }

        [BsonElement("tag")]
        public string? Tag { get; set; }

        [BsonElement("userId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? UserId { get; set; }
    }
}