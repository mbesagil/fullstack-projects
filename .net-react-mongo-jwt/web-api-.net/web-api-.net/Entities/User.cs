using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace web_api_.net.Entities
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("email")]
        public string? Email { get; set; }

        [BsonElement("password")]
        public string? Password { get; set; }
    }
}
