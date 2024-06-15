// pages/api/updateAlgolia.js
import algoliasearch from "algoliasearch";

// Initialize the Algolia client
const client = algoliasearch("T19D32MYUL", "5f5ca9e0f562329fb2cc6a00c3712141");
const index = client.initIndex("Directus_Events");

// API handler to update the Algolia client
export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      console.log(req.body, "show the body");
      if (req.body.event === "Blog.items.create") {
        await index.saveObjects([
          { objectID: `${req.body.key}`, ...req.body.payload },
        ]);
      } else if (req.body.event === "Blog.items.update") {
        console.log("show the updated data", req.body);
        await Promise.all(
          req.body.keys.map(
            async (key) =>
              await index.partialUpdateObjects([
                { objectID: `${key}`, ...req.body.payload },
              ])
          )
        );
      } else if (req.body.event === "Blog.items.delete") {
        console.log("show the deleted data", req.body);
        await index.deleteObjects(req.body.keys);
      }

      res.status(200).json({ message: "Success" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating Algolia", error: error.message });
    }
  } else return res.status(400).json({ message: "Method not allowed" });
}
