const {MongoClient} = require('mongodb');
async function main(){

    const uri = "mongodb+srv://prashantp:Prashantp00@cluster1.9j13wo6.mongodb.net/?retryWrites=true&w=majority";

    const client = new MongoClient(uri);
    try {
        await client.connect();

//*        await createMultipleListings(client, [{
 //           name: "Lovely Loft",
 //           summary: "A charming loft in Paris",
 //           bedrooms: 1,
 //           bathrooms: 1
 //      },
//        {
//            name: "MNR",
     //       summary: "A Wonder Hotel in Pipariya",
    //        bedrooms: 50,
    //        bathrooms: 50
   //     },
   //     {
   //         name: "Getanjali",
  //          summary: "A Great Family Hotel",
 //           bedrooms: 20,
//            bathrooms: 20
//        }]);

 //       await findOneListingByName(client, "MNR");

 //       await findListingsWithMinimumBedroomsBathrooms(client, {
 //           maximumNumberOfBedrooms: 6,
 //           maximumNumberOfBathrooms: 7,
 //           maximumNumberOfResults: 5 
 //       });
        //await updateListingByName(client, "Getanjali", {bedrooms: 22, beds: 44});

        await upsertListingByName(client, "Cozy cortage",{name: "Cozy cortage",bedrooms: 2, bathrooms: 2});
        
    } catch (e) {

        console.error(e);
        
    }finally {
        await client.close();
    }    
}

main().catch(console.error);

async function upsertListingByName(client, nameOfListing, updatedListing){
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateOne({ name: nameOfListing},
         {$set: updatedListing},{upsert: true});

         console.log(`${result.matchedCount} document(s) matched the query criteria`);

         if(result.upsertCount > 0){
            console.log(`One document was inserted with the id ${result.upsertedId}`);
         }else{
            console.log(`${result.modifiedCount} document(s) was/were updated`);
         }
}

async function  updateListingByName(client, nameOfListing, updatedListing){
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateOne({ name: nameOfListing}, {$set: updatedListing});

    console.log(`${result.matchedCount} document(s) matched the query criteria`);
    console.log(`${result.modifiedCount} documents was/were updated`);
}

async function findListingsWithMinimumBedroomsBathrooms(client, {
    minimumNumberOfBedrooms = 0,
    minimumNumberOfBathrooms = 0,
    maximumNumberOfResults = Number.MAX_SAFE_INTEGER
} = {}){
    const cursor = client.db("sample_airbnb").collection("listingsAndReviews").find({
        bedrooms: {$gte: minimumNumberOfBedrooms},
        bathrooms: {$gte: minimumNumberOfBathrooms}
    }).sort({last_review: -1}).limit(maximumNumberOfResults);

    const results = await cursor.toArray();


    if (results.length > 0){
        console.log(`Found listings(s) with atleast ${minimumNumberOfBedrooms}
        bedrooms and ${minimumNumberOfBathrooms} bathrooms:`);
        results.forEach((result, i ) => {
            date = new Date(result.last_review).toDateString();
            console.log();
            console.log(`${i + 1}. name: ${result.name}`);
            console.log(`   _id: ${result._id}`);
            console.log(`   bedrooms: ${result.bedrooms}`);
            console.log(`   bathrooms: ${result.bathrooms}`);
            console.log(`   most recent review date: ${new Date(result.last_review).toDateString()}`);
        });
    }else{
        console.log(`No  listings foubnd with atleast ${minimumNumberOfBedrooms}
        bedrooms and ${minimumNumberOfBathrooms} bathrooms`)
    }
}

async function findOneListingByName(client, nameOfListing){
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({name: nameOfListing});

    if(result){
        console.log(`Found a listing in the collection with the name '${nameOfListing}'`);
        console.log(result);
    }else{
        console.log(`No listing found with the name '${nameOfListing}'`);
    }
}

async function createMultipleListings(client, newListings){
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertMany(newListings);

    console.log(`${result.insertedCount} new listing created with the following id:(s): `);
    console.log(result.insertedIds);
}

async function createListing(client, newListing){
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing);

    console.log(`new listing created with the following id: ${result.insertedId} `);

}

async function listDatabases(client){
    const databasesList = await client.db().admin().listDatabases();

    console.log("Databases: ");
    databasesList.databases.forEach(db => {
        console.log(` - ${db.name}`);
    })
}