// pages/api/updateAlgolia.js
import algoliasearch from 'algoliasearch';

// Initialize the Algolia client
const client = algoliasearch('T19D32MYUL', '5f5ca9e0f562329fb2cc6a00c3712141');
const index = client.initIndex('Directus');


export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  
    const { trigger, records } = req.body;
  
    try {
      if (!Array.isArray(records)) {
        throw new Error('Records should be an array');
      }
  
      switch (trigger) {
        case 'create':
          await index.saveObjects(records);
          break;
        case 'update':
          await index.partialUpdateObjects(records);
          break;
        case 'delete':
          const objectIDs = records.map(record => record.id);
          await index.deleteObjects(objectIDs);
          break;
        default:
          throw new Error('Unsupported trigger');
      }
  
      res.status(200).json({ message: 'Success' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating Algolia', error: error.message });
    }
  }