using System;
using System.IO;
using System.Collections.Generic;
using Algolia.Search.Clients;
using Newtonsoft.Json;

namespace API.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public long Price { get; set; } 
        public string PictureUrl { get; set; }
        public string Type { get; set; }
        public string Brand { get; set; }
        public int QuantityInStock { get; set; }
        public string PublicId { get; set; }
    }

    public class AlgoliaProduct
    {
        public int Id { get; set; }
        public string ObjectID {get;set;}
        public string Name { get; set; }
        public string Description { get; set; }
        public long Price { get; set; } 
        public string PictureUrl { get; set; }
        public string Type { get; set; }
        public string Brand { get; set; }
        public int QuantityInStock { get; set; }
        public string PublicId { get; set; }
    }

    public class AlgoliaIntegration
{
  private SearchClient client;
  private SearchIndex index;

  public AlgoliaIntegration(string ApplicationID, string apiKey,IEnumerable<Product> products)
  {
    client = new SearchClient("SZJYGVO358", "5bb4fbbee547e5b7893567cda85d4a3d");
    index = client.InitIndex("products");

    // Assuming the actors.json file is in the same directory as the executable
    // string json = File.ReadAllText("products.json");
    // Array json = product;
    // var settings = new JsonSerializerSettings
    // {
    //     ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver()
    // };
    // IEnumerable<Product> products = JsonConvert.DeserializeObject<IEnumerable<Product>>(json.ToString(), settings);

    // Batching/Chunking is done automatically by the API client
    // var autoGenerateObjectIDIfNotExist = true;
    index.SaveObjects(products, autoGenerateObjectId: true);
  }
}
}