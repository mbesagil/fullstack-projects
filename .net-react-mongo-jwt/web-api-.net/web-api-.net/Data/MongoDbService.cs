using MongoDB.Driver;

namespace web_api_.net.Data
{
    public class MongoDbService 
    {

        private readonly IConfiguration _configuration;
        private readonly IMongoDatabase _database;  

        public MongoDbService(IConfiguration configuration)
        {
            _configuration = configuration;

            var connectionString = _configuration.GetConnectionString("DbConnection");
            var mongoUrl = MongoUrl.Create(connectionString);
            var mongoClient = new MongoClient(mongoUrl);

            var databaseName = mongoUrl.DatabaseName ?? "myTestDb";
            _database = mongoClient.GetDatabase(databaseName);
     
        }

        public IMongoDatabase? Database => _database;
    
    
    }
}
